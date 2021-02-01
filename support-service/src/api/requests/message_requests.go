package requests

type MessageCreateText struct {
	UserID  int64  `json:"user_id"`
	StaffID int64  `json:"staff_id"`
	Content string `json:"content"`
}
