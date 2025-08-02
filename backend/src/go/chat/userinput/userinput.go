package userinput

import (
	"encoding/json"
	"net/http"
	"prop/chat/generateresponce"
	"prop/models"
)

func HandleINP(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	// Preflight request (OPTIONS)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var msg models.Message
	err := json.NewDecoder(r.Body).Decode(&msg)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// jednoduchá odpověď
	reply := generateresponce.AIresponce(msg.UserInput)

	json.NewEncoder(w).Encode(models.Response{BotReply: reply})

}
