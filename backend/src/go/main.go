package main

import (
	"log"
	"net/http"
	"os"
	calnedarhandler "prop/calendar/calendarhandler"
	"prop/chat/userinput"

	"github.com/joho/godotenv"
)

func main() {

	// load env
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Chyba při načítání .env souboru:", err)
	}

	calnedarhandler.CalnedarHandler(os.Getenv(("calendarID")))
	apiKey := os.Getenv("GO_PORT")

	// handle fce

	http.HandleFunc("/api/chat", userinput.HandleINP)
	http.ListenAndServe(":"+apiKey, nil)
}
