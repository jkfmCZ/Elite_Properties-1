package calendarsend

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"prop/models"
	"time"

	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

func HandleSend(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	// Preflight request (OPTIONS)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var msg models.CalendarPost
	err := json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	insertTask(msg.Cname, msg.Property, msg.Estart, msg.Eend)

}

func insertTask(sumary string, location string, eventStart time.Time, eventEnd time.Time) {
	calendarId := os.Getenv("calendarID")
	if calendarId == "" {
		log.Fatalf("Proměnná calendarID není nastavena v prostředí")
	}

	ctx := context.Background()
	serviceAccountFile := "calendar/credentials.json"

	srv, err := calendar.NewService(ctx, option.WithCredentialsFile(serviceAccountFile), option.WithScopes(calendar.CalendarScope))
	if err != nil {
		log.Fatalf("Chyba při vytváření Calendar služby: %v", err)
	}

	event := &calendar.Event{
		Summary:     sumary,
		Location:    location,
		Description: "",
		Start: &calendar.EventDateTime{
			DateTime: eventStart.Format(time.RFC3339),
			TimeZone: "Europe/Prague",
		},
		End: &calendar.EventDateTime{
			DateTime: eventEnd.Format(time.RFC3339),
			TimeZone: "Europe/Prague",
		},
	}

	// nebo konkrétní ID kalendáře
	event, err = srv.Events.Insert(calendarId, event).Do()
	if err != nil {
		log.Fatalf("Unable to create event: %v", err)
	}

	fmt.Printf("Událost vytvořena: %s\n", event.HtmlLink)
}
