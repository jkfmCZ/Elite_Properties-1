package generateresponce

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"prop/chat/getDB"
)

func genprompt(msg string) string {
	// reply := fmt.Sprintf("DB: %+v. USER-Prompt: %s .", getDB.PrintDB(), msg)
	reply := fmt.Sprintf("DB: %+v. \n\nDOTAZ KLIENTA:  %s.", getDB.FormatDBForBot(), msg)
	return reply
}

func AIresponce(msg string) string {
	body := map[string]string{"model": "propbot", "prompt": genprompt(msg)}
	jsonBody, _ := json.Marshal(body)

	resp, _ := http.Post("http://localhost:11434/api/generate", "application/json", bytes.NewBuffer(jsonBody))
	defer resp.Body.Close()
	var responce string = ""
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		var chunk struct {
			Response string `json:"response"`
		}
		json.Unmarshal(scanner.Bytes(), &chunk)
		responce += chunk.Response
	}
	return responce
}

// func AIresponce(msg string) string {
// 	reply := fmt.Sprintf("DB: %+v. \n\nDOTAZ KLIENTA:  %s.", getDB.FormatDBForBot(), msg)
// 	return reply
// }
