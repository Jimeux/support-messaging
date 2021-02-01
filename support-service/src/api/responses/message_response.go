package responses

import (
	"github.com/Jimeux/support-messaging/support-service/src/domain/message"
)

type Message struct {
	ID          int64  `json:"id"`
	UserID      int64  `json:"user_id"`
	StaffID     int64  `json:"staff_id"`
	Status      int    `json:"status"`
	ContentType int    `json:"content_type"`
	Content     string `json:"content"`
	SentAt      int64  `json:"sent_at"`
	FromUser    bool   `json:"from_user"`
}

type MessageList struct {
	Messages []Message `json:"messages"`
}

func NewMessageList(msgs []message.Message) MessageList {
	resMsgs := make([]Message, len(msgs))
	for i, m := range msgs {
		resMsgs[i] = Message{
			ID:          m.ID,
			UserID:      m.UserID,
			StaffID:     m.StaffID,
			Status:      m.Status,
			ContentType: m.ContentType,
			Content:     m.Content,
			SentAt:      m.SentAt,
			FromUser:    m.FromUser,
		}
	}
	return MessageList{Messages: resMsgs}
}
