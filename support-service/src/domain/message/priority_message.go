package message

type PriorityMessages []PriorityMessage

type PriorityMessage struct {
	UserID      int64
	MessageID   int64
	UnreadCount int
	LastSent    int
}

func (pp PriorityMessages) ToUserIDMap() map[int64]PriorityMessage {
	m := make(map[int64]PriorityMessage, len(pp))
	for _, p := range pp {
		m[p.UserID] = p
	}
	return m
}

func (pp PriorityMessages) UserIDs() []int64 {
	ids := make([]int64, len(pp))
	for i, p := range pp {
		ids[i] = p.UserID
	}
	return ids
}

func (pp PriorityMessages) MessageIDs() []int64 {
	ids := make([]int64, len(pp))
	for i, p := range pp {
		ids[i] = p.MessageID
	}
	return ids
}
