package responses

import (
	"fmt"

	"github.com/Jimeux/support-system/support-service/src/domain/message"
	"github.com/Jimeux/support-system/support-service/src/domain/user"
)

type UserListItem struct {
	UserID      int64  `json:"user_id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Avatar      string `json:"avatar"`
	LastSent    int    `json:"last_sent"`
	UnreadCount int    `json:"unread_count"`
	Preview     string `json:"preview"`
}

type UserList struct {
	Items []UserListItem `json:"items"`
}

func NewUserList(users []user.User, msgs []message.Message, pMsgs message.PriorityMessages) (UserList, error) {
	items := make([]UserListItem, len(msgs))
	pMap := pMsgs.ToUserIDMap()

	for i, m := range msgs {
		p, ok := pMap[m.UserID]
		if !ok {
			// TODO 2021/01/11 @Jimeux
		}

		var u user.User
		for _, uu := range users {
			if uu.ID == m.UserID {
				u = uu
				break
			}
		}
		if u.ID == 0 {
			// TODO 2021/01/11 @Jimeux
		}

		items[i] = UserListItem{
			UserID:      u.ID,
			FirstName:   u.FirstName,
			LastName:    u.LastName,
			Avatar:      fmt.Sprintf("https://placekitten.com/2%d0/2%d0", u.ID, u.ID),
			LastSent:    p.LastSent,
			UnreadCount: p.UnreadCount,
			Preview:     m.Content,
		}
	}

	return UserList{Items: items}, nil
}
