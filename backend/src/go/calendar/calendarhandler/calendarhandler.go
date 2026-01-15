package calendarhandler

import (
	"net/http"
	"prop/calendar/calendarsend"
	"prop/calendar/calendarshow"
)

func CalnedarHandler(calendarID string) {

	http.HandleFunc("/api/calendar/send", calendarsend.HandleSend)
	http.HandleFunc("/api/calendar/show", calendarshow.HandleCalendarShow)

}
