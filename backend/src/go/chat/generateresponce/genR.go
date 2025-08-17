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
	reply := fmt.Sprintf(`DB: %+v.\n\nDOTAZ KLIENTA: %s.\n\nOdpovídej pouze česky, používej přirozenou češtinu jako rodilý mluvčí. Pokud nerozumíš, napiš to česky. Nikdy nemíchej jiné jazyky.\n\nPříklad odpovědi:\n- "Dobrý den, mohu vám pomoci s výběrem nemovitosti."\n- "Nemovitost číslo 10 je moderní byt v centru města."\n- "Pokud potřebujete další informace, neváhejte se zeptat."`, getDB.FormatDBForBot(), msg)
	return reply
}

// Returns a prompt for testing AI response without DB data
func testGenprompt(msg string) string {
	return fmt.Sprintf(`Klient se ptá: %s.\n\nOdpovídej pouze česky, stručně a jasně, jako profesionální realitní makléř. Pokud nerozumíš, napiš to česky. Nemíchej jiné jazyky.\n\nPříklad odpovědi:\n- "Dobrý den, rád vám pomohu s výběrem nemovitosti."\n- "Nemovitost číslo 10 je moderní byt v centru města s výbornou dostupností."\n- "Pokud potřebujete další informace, neváhejte se zeptat."`, msg)
}

func AIresponce(msg string) string {
	//body := map[string]string{"model": "llama3.2:latest", "prompt": genprompt(msg)} //llama
	body := map[string]string{"model": "jobautomation/openeurollm-czech:latest", "prompt": testGenprompt(msg)} //openeurollm

	// [Intro]
	// So if you're lonely, you know I'm here waiting for you
	// I'm just a cross-hair, I'm just a shot away from you
	// And if you leave here, you leave me broken, shattered I lie
	// I'm just a cross-hair, I'm just a shot, then we can die
	// Oh, oh, oh
	// I know I won't be leaving here with you

	// [Instrumental Break]

	// [Verse 1]
	// I say, don't you know?
	// You say you don't know
	// I say: take me out
	// I say you don't show
	// Don't move, time is slow
	// I say: take me out

	// [Verse 2]
	// Well, I say you don't know
	// You say you don't know
	// I say: take me out
	// If I move, this could die
	// If eyes move, this could die
	// I want you to take me out

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return "Omlouvám se, došlo k chybě při přípravě požadavku. Zkuste to prosím za chvíli. Pokud problém přetrvává, kontaktujte podporu."
	}

	client := &http.Client{Timeout: 100 * 1e9} // 10 seconds
	req, err := http.NewRequest("POST", "http://localhost:11434/api/generate", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "Omlouvám se, došlo k chybě při přípravě požadavku. Zkuste to prosím za chvíli."
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		return "Omlouvám se, momentálně mám problémy s připojením k AI serveru nebo server je pomalý. Zkuste to prosím za chvíli."
	}
	defer resp.Body.Close()
	var responce string = ""
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		var chunk struct {
			Response string `json:"response"`
		}
		err := json.Unmarshal(scanner.Bytes(), &chunk)
		if err != nil {
			fmt.Println("[AI RAW CHUNK]", string(scanner.Bytes()))
			fmt.Println("[AI JSON ERROR]", err)
			continue // skip this chunk, try next
		}
		responce += chunk.Response
	}
	if err := scanner.Err(); err != nil {
		fmt.Println("[AI SCANNER ERROR]", err)
		return "Omlouvám se, došlo k chybě při čtení odpovědi AI. Zkuste to prosím za chvíli."
	}
	if responce == "" {
		fmt.Println("[AI EMPTY RESPONSE] Raw body:")
		rawBody := new(bytes.Buffer)
		rawBody.ReadFrom(resp.Body)
		fmt.Println(rawBody.String())
		return "Omlouvám se, AI nevrátila žádnou odpověď. Zkuste to prosím za chvíli."
	}
	return responce
}

// func AIresponce(msg string) string {
// 	reply := fmt.Sprintf("DB: %+v. \n\nDOTAZ KLIENTA:  %s.", getDB.FormatDBForBot(), msg)
// 	return reply
// }
