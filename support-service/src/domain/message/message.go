package message

const (
	StatusUnassigned = 1
	StatusAssigned   = 2
	StatusResolved   = 3
)

const (
	ContentTypeText  = 1
	ContentTypeImage = 2
	ContentTypeRich  = 3
)

type Message struct {
	ID          int64 `gorm:"primaryKey;auto_increment"`
	UserID      int64
	StaffID     int64
	Status      int
	ContentType int
	Content     string
	SentAt      int64 `gorm:"autoCreateTime:milli"`
	FromUser    bool
	Unread      bool
	Updated     int `gorm:"autoUpdateTime"`
	Created     int `gorm:"autoCreateTime"`
	Deleted     *int
}

func NewStaffTextMessage(userID, staffID int64, content string) *Message {
	return &Message{
		UserID:      userID,
		StaffID:     staffID,
		Status:      StatusUnassigned,
		ContentType: ContentTypeText,
		Content:     content,
		FromUser:    false,
		Unread:      true,
	}
}
