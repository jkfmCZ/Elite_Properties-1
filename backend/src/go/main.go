package main

import (
	"log"
	"net/http"
	"os"
	"prop/calendar/calendarhandler"
	"prop/chat/userinput"

	"github.com/joho/godotenv"
)

func main() {

	// load env
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Chyba při načítání .env souboru:", err)
	}

	apiKey := os.Getenv("GO_PORT")
	calendarID := os.Getenv("calendarID")
	// Register calendar handlers
	calendarhandler.CalnedarHandler(calendarID)
	// Register chat handler
	http.HandleFunc("/api/chat", userinput.HandleINP)
	// Health check endpoint with CORS
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","go_backend":"running"}`))
	})
	// Start server only once
	log.Printf("Server listening on port %s", apiKey)
	http.ListenAndServe(":"+apiKey, nil)
}
