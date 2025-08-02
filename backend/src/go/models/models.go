package models

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
type PRP struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
	TypeR string `json:"typeR"`
}

type Message struct {
	SessionID string `json:"session_id"`
	UserInput string `json:"user_input"`
}

type Response struct {
	BotReply string `json:"bot_reply"`
}
