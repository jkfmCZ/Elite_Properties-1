package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"prop/calendar/calendarhandler"
	"prop/chat/userinput"
	"prop/health"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Funkce pro zpracování nahrávání souborů
func uploadFileHandler(w http.ResponseWriter, r *http.Request) {
	// Povolíme CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Omezení velikosti nahrávaného souboru (např. 100 MB)
	r.ParseMultipartForm(100 << 20)

	// Zpracování obrázku
	file, handler, err := r.FormFile("mainImage")
	imagePath := ""
	if err == nil {
		defer file.Close()
		// Vytvoření unikátního jména souboru
		fileName := fmt.Sprintf("%d-%s", time.Now().UnixNano(), handler.Filename)
		// Cesta pro uložení
		filePath := filepath.Join("uploads", "images", fileName)
		imagePath = "/" + strings.Replace(filePath, "\\", "/", -1) // Uložíme cestu s lomítky

		// Uložení souboru
		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, file); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Zpracování 3D tour (podobně jako obrázek)
	tourFile, tourHandler, err := r.FormFile("tourFile")
	tourPath := ""
	if err == nil {
		defer tourFile.Close()
		fileName := fmt.Sprintf("%d-%s", time.Now().UnixNano(), tourHandler.Filename)
		filePath := filepath.Join("uploads", "tours", fileName)
		tourPath = "/" + strings.Replace(filePath, "\\", "/", -1)

		dst, err := os.Create(filePath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		if _, err := io.Copy(dst, tourFile); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Vytvoření odpovědi s URL cestami k souborům
	response := map[string]string{
		"imageUrl": imagePath,
		"tourUrl":  tourPath,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	// load env
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Chyba při načítání .env souboru:", err)
	}

	apiKey := os.Getenv("GO_PORT")
	calendarID := os.Getenv("calendarID")

	// Vytvoření složek pro nahrávané soubory, pokud neexistují
	os.MkdirAll(filepath.Join("uploads", "images"), os.ModePerm)
	os.MkdirAll(filepath.Join("uploads", "tours"), os.ModePerm)

	// Handler pro servírování statických souborů (obrázků, 3D tours)
	fs := http.FileServer(http.Dir("uploads"))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	// Register calendar handlers
	calendarhandler.CalnedarHandler(calendarID)
	// Register chat handler
	http.HandleFunc("/api/chat", userinput.HandleINP)

	// *** NOVÝ ENDPOINT PRO NAHRÁVÁNÍ SOUBORŮ ***
	http.HandleFunc("/api/upload", uploadFileHandler)

	// Health check endpoint with CORS
	http.HandleFunc("/api/health", health.HealthB)
	http.HandleFunc("/health", health.HealthB)

	// Start server only once

	http.ListenAndServe(":"+apiKey, nil)
}
