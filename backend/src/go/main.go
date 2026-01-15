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
	"prop/media"
	"strings"
	"time"

	"github.com/joho/godotenv"
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

func main() {

	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Chyba při načítání .env souboru:", err)
	}

	apiKey := os.Getenv("GO_PORT")
	calendarID := os.Getenv("calendarID")

	os.MkdirAll(filepath.Join("uploads", "images"), os.ModePerm)
	os.MkdirAll(filepath.Join("uploads", "tours"), os.ModePerm)

	fs := http.FileServer(http.Dir("uploads"))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	calendarhandler.CalnedarHandler(calendarID)
	http.HandleFunc("/api/chat", userinput.HandleINP)

	http.HandleFunc("/api/upload", media.UploadFileHandler)

	http.HandleFunc("/api/health", health.HealthB)
	http.HandleFunc("/health", health.HealthB)

	http.ListenAndServe(":"+apiKey, nil)
}
