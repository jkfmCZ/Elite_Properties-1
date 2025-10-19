package propertyimages

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type PropertyImage struct {
	ID         int    `json:"id"`
	PropertyID int    `json:"property_id"`
	ImageURL   string `json:"image_url"`
	AltText    string `json:"alt_text"`
	IsMain     int    `json:"is_main"`
	SortOrder  int    `json:"sort_order"`
	CreatedAt  string `json:"created_at"`
}

type ImageRequest struct {
	Images []PropertyImageInput `json:"images"`
}

type PropertyImageInput struct {
	ImageURL  string `json:"image_url"`
	AltText   string `json:"alt_text"`
	IsMain    int    `json:"is_main"`
	SortOrder int    `json:"sort_order"`
}

func connectDB() *sql.DB {
	godotenv.Load("../../.env")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"))

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

// GET /api/properties/:uuid/images - Získání obrázků pro nemovitost
func GetPropertyImages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Extrakce UUID z URL
	urlParts := strings.Split(r.URL.Path, "/")
	if len(urlParts) < 4 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	uuid := urlParts[3] // /api/properties/{uuid}/images

	db := connectDB()
	defer db.Close()

	// Nejprve získáme property_id z uuid
	var propertyID int
	err := db.QueryRow("SELECT id FROM properties WHERE uuid = ?", uuid).Scan(&propertyID)
	if err != nil {
		http.Error(w, "Property not found", http.StatusNotFound)
		return
	}

	// Pak získáme všechny obrázky pro tuto nemovitost
	rows, err := db.Query(`
		SELECT id, property_id, image_url, alt_text, is_main, sort_order, created_at 
		FROM property_images 
		WHERE property_id = ? 
		ORDER BY sort_order ASC`, propertyID)

	if err != nil {
		http.Error(w, "Failed to fetch images", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var images []PropertyImage
	for rows.Next() {
		var img PropertyImage
		err := rows.Scan(&img.ID, &img.PropertyID, &img.ImageURL, &img.AltText, &img.IsMain, &img.SortOrder, &img.CreatedAt)
		if err != nil {
			continue
		}
		images = append(images, img)
	}

	response := map[string]interface{}{
		"success": true,
		"data":    images,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// POST /api/properties/:uuid/images - Uložení obrázků pro nemovitost
func SavePropertyImages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Extrakce UUID z URL
	urlParts := strings.Split(r.URL.Path, "/")
	if len(urlParts) < 4 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	uuid := urlParts[3]

	var req ImageRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	db := connectDB()
	defer db.Close()

	// Nejprve získáme property_id z uuid
	var propertyID int
	err = db.QueryRow("SELECT id FROM properties WHERE uuid = ?", uuid).Scan(&propertyID)
	if err != nil {
		http.Error(w, "Property not found", http.StatusNotFound)
		return
	}

	// Začneme transakci
	tx, err := db.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Nejprve smažeme všechny existující obrázky pro tuto nemovitost
	_, err = tx.Exec("DELETE FROM property_images WHERE property_id = ?", propertyID)
	if err != nil {
		http.Error(w, "Failed to delete existing images", http.StatusInternalServerError)
		return
	}

	// Pak vložíme nové obrázky
	for _, img := range req.Images {
		_, err = tx.Exec(`
			INSERT INTO property_images (property_id, image_url, alt_text, is_main, sort_order) 
			VALUES (?, ?, ?, ?, ?)`,
			propertyID, img.ImageURL, img.AltText, img.IsMain, img.SortOrder)
		if err != nil {
			http.Error(w, "Failed to insert image", http.StatusInternalServerError)
			return
		}
	}

	// Potvrdíme transakci
	err = tx.Commit()
	if err != nil {
		http.Error(w, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Images saved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// PUT /api/properties/:uuid/main-image - Aktualizace hlavního obrázku v properties tabulce
func UpdateMainImage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Methods", "PUT, OPTIONS")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Extrakce UUID z URL
	urlParts := strings.Split(r.URL.Path, "/")
	if len(urlParts) < 4 {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	uuid := urlParts[3]

	var req struct {
		MainImageURL string `json:"main_image_url"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	db := connectDB()
	defer db.Close()

	// Aktualizujeme main_image_url v properties tabulce
	_, err = db.Exec("UPDATE properties SET main_image_url = ? WHERE uuid = ?", req.MainImageURL, uuid)
	if err != nil {
		http.Error(w, "Failed to update main image", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Main image updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// POST /api/properties/upload-multiple - Upload více obrázků najednou
func UploadMultipleImages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Omezení velikosti (100 MB)
	r.ParseMultipartForm(100 << 20)

	var imageUrls []string

	// Projdeme všechny soubory s názvem "images"
	files := r.MultipartForm.File["images"]
	for i, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			continue
		}
		defer file.Close()

		// Vytvoření unikátního názvu
		fileName := fmt.Sprintf("%d-%d-%s", time.Now().UnixNano(), i, fileHeader.Filename)
		filePath := filepath.Join("uploads", "images", fileName)
		imagePath := "/" + strings.Replace(filePath, "\\", "/", -1)

		// Uložení souboru
		dst, err := os.Create(filePath)
		if err != nil {
			continue
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			continue
		}

		imageUrls = append(imageUrls, imagePath)
	}

	response := map[string]interface{}{
		"success":   true,
		"imageUrls": imageUrls,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Router function pro registraci všech endpointů
func RegisterPropertyImageHandlers() {
	http.HandleFunc("/api/properties/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// GET /api/properties/{uuid}/images
		if r.Method == "GET" && strings.Contains(path, "/images") && !strings.Contains(path, "upload") {
			GetPropertyImages(w, r)
			return
		}

		// POST /api/properties/{uuid}/images
		if r.Method == "POST" && strings.Contains(path, "/images") && !strings.Contains(path, "upload") {
			SavePropertyImages(w, r)
			return
		}

		// PUT /api/properties/{uuid}/main-image
		if r.Method == "PUT" && strings.Contains(path, "/main-image") {
			UpdateMainImage(w, r)
			return
		}

		http.NotFound(w, r)
	})

	// POST /api/properties/upload-multiple
	http.HandleFunc("/api/properties/upload-multiple", UploadMultipleImages)
}
