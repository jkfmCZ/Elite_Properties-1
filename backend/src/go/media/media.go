package media

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func UploadFileHandler(w http.ResponseWriter, r *http.Request) {
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
