package services

import (
	"context"

	"github.com/Jimeux/support-messaging/support-service/src/api/requests"
	"github.com/Jimeux/support-messaging/support-service/src/api/responses"
	"github.com/Jimeux/support-messaging/support-service/src/domain/message"
)

type MessageService struct {
	messageRepo *message.Repository
}

func NewMessageService(messageRepo *message.Repository) *MessageService {
	return &MessageService{messageRepo: messageRepo}
}

func (s *MessageService) CreateText(_ context.Context, r requests.MessageCreateText) (responses.Message, error) {
	m := message.NewStaffTextMessage(r.UserID, r.StaffID, r.Content)
	if err := s.messageRepo.Create(m); err != nil {
		return responses.Message{}, err
	}
	return responses.Message{
		ID:          m.ID,
		UserID:      m.UserID,
		StaffID:     m.StaffID,
		Status:      m.Status,
		ContentType: m.ContentType,
		Content:     m.Content,
		SentAt:      m.SentAt,
		FromUser:    m.FromUser,
	}, nil
}

func (s *MessageService) FindByUserID(_ context.Context, userID int64, offset, limit int) (responses.MessageList, error) {
	messages, err := s.messageRepo.FindByUserIDs(userID, offset, limit)
	if err != nil {
		return responses.MessageList{}, err
	}
	return responses.NewMessageList(messages), nil
}

func (s *MessageService) DeleteByID(_ context.Context, id int64) error {
	if err := s.messageRepo.DeleteByID(id); err != nil {
		return err
	}
	return nil
}
