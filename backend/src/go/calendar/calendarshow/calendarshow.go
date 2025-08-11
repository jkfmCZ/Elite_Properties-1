package calendarshow

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"prop/models"
	"time"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

func HandleCalendarShow(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	calendarID := os.Getenv("calendarID")
	events, err := getCalendarEvents(calendarID)
	if err != nil {
		http.Error(w, "Chyba při získávání událostí: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

func getCalendarEvents(calendarId string) ([]models.CalendarPost, error) {
	ctx := context.Background()

	serviceAccountFile := "calendar/credentials.json"

	data, err := os.ReadFile(serviceAccountFile)
	if err != nil {
		return nil, fmt.Errorf("chyba při čtení credentials: %w", err)
	}

	config, err := google.JWTConfigFromJSON(data, calendar.CalendarReadonlyScope)
	if err != nil {
		return nil, fmt.Errorf("chyba při načítání JWT configu: %w", err)
	}

	client := config.Client(ctx)

	srv, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return nil, fmt.Errorf("chyba při vytváření Calendar služby: %w", err)
	}

	loc, err := time.LoadLocation("Europe/Prague")
	if err != nil {
		return nil, fmt.Errorf("chyba při načítání časové zóny: %w", err)
	}

	now := time.Now().In(loc)
	startOfWeek := now.AddDate(0, 0, -int(now.Weekday())+1)
	endOfWeek := startOfWeek.AddDate(0, 0, 7)

	startStr := startOfWeek.Format(time.RFC3339)
	endStr := endOfWeek.Format(time.RFC3339)

	events, err := srv.Events.List(calendarId).
		TimeMin(startStr).
		TimeMax(endStr).
		SingleEvents(true).
		OrderBy("startTime").
		Do()

	if err != nil {
		return nil, fmt.Errorf("chyba při získávání událostí: %w", err)
	}

	if len(events.Items) == 0 {
		return nil, nil // žádné události
	}

	var calendarPosts []models.CalendarPost

	for _, item := range events.Items {
		// Rozparsovat start
		var startTime time.Time
		if item.Start.DateTime != "" {
			startTime, err = time.Parse(time.RFC3339, item.Start.DateTime)
			if err != nil {
				startTime = time.Time{} // fallback
			}
		} else if item.Start.Date != "" {
			startTime, err = time.Parse("2006-01-02", item.Start.Date)
			if err != nil {
				startTime = time.Time{}
			}
		}

		// Rozparsovat end
		var endTime time.Time
		if item.End.DateTime != "" {
			endTime, err = time.Parse(time.RFC3339, item.End.DateTime)
			if err != nil {
				endTime = time.Time{}
			}
		} else if item.End.Date != "" {
			endTime, err = time.Parse("2006-01-02", item.End.Date)
			if err != nil {
				endTime = time.Time{}
			}
		}

		calendarPosts = append(calendarPosts, models.CalendarPost{
			Cname:    item.Summary,
			Estart:   startTime,
			Eend:     endTime,
			Property: "", // případně něco jiného
		})
	}

	return calendarPosts, nil
}
