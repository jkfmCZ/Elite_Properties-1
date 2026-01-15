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

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	r.ParseMultipartForm(100 << 20)

	file, handler, err := r.FormFile("mainImage")
	imagePath := ""
	if err == nil {
		defer file.Close()

		fileName := fmt.Sprintf("%d-%s", time.Now().UnixNano(), handler.Filename)

		filePath := filepath.Join("uploads", "images", fileName)
		imagePath = "/" + strings.Replace(filePath, "\\", "/", -1)

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

	response := map[string]string{
		"imageUrl": imagePath,
		"tourUrl":  tourPath,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
