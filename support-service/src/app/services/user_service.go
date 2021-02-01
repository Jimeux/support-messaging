package services

import (
	"context"
	"errors"

	"github.com/Jimeux/support-system/support-service/src/api/responses"

	"github.com/Jimeux/support-system/support-service/src/domain/message"
	"github.com/Jimeux/support-system/support-service/src/domain/user"
)

type UserService struct {
	messageRepo *message.Repository
	userRepo    *user.Repository
}

func NewUserService(messageRepo *message.Repository, userRepo *user.Repository) *UserService {
	return &UserService{messageRepo, userRepo}
}

func (s *UserService) FindByID(_ context.Context, id int64) (responses.User, error) {
	u, err := s.userRepo.FindByID(id)
	if err != nil {
		return responses.User{}, err
	}
	if u == nil {
		return responses.User{}, errors.New("not found")
	}
	return responses.NewUser(*u), nil
}

func (s *UserService) ListByMessageStatus(_ context.Context) (responses.UserList, error) {
	priority, err := s.messageRepo.FindUserIDsByPriority()
	if err != nil {
		return responses.UserList{}, err
	}
	messages, err := s.messageRepo.FindByIDs(priority.MessageIDs())
	if err != nil {
		return responses.UserList{}, err
	}
	users, err := s.userRepo.FindByIDs(priority.UserIDs())
	if err != nil {
		return responses.UserList{}, err
	}
	res, err := responses.NewUserList(users, messages, priority)
	if err != nil {
		return responses.UserList{}, err
	}
	return res, nil
}
