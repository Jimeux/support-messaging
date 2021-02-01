package responses

import (
	"fmt"

	"github.com/Jimeux/support-messaging/support-service/src/domain/user"
)

type User struct {
	ID        int64  `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Avatar    string `json:"avatar"`
}

func NewUser(u user.User) User {
	return User{
		ID:        u.ID,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Avatar:    fmt.Sprintf("https://placekitten.com/2%d0/2%d0", u.ID, u.ID),
	}
}
