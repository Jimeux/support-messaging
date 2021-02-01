package message

import (
	"gorm.io/gorm"
)

// TODO 2021/01/10 @Jimeux gorm scopes
//  https://tech.mfkessai.co.jp/2018/12/composable-repository/
type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(m *Message) error {
	if res := r.db.Create(&m); res.Error != nil {
		return res.Error
	}
	return nil
}

func (r *Repository) DeleteByID(id int64) error {
	if res := r.db.Delete(&Message{}, id); res.Error != nil {
		return res.Error
	}
	return nil
}

func (r *Repository) FindByUserIDs(userID int64, offset, limit int) ([]Message, error) {
	var messages []Message
	res := r.db.
		Where("deleted is null").
		Where("user_id = ?", userID).
		Order("sent_at desc").
		Offset(offset).
		Limit(limit).
		Find(&messages)

	if res.Error != nil {
		return nil, res.Error
	}
	return messages, nil
}

func (r *Repository) FindByIDs(ids []int64) ([]Message, error) {
	var messages []Message
	res := r.db.
		Where("deleted is null").
		Where("id in ?", ids).
		Order("sent_at").
		Find(&messages)

	if res.Error != nil {
		return nil, res.Error
	}
	return messages, nil
}

func (r *Repository) FindUserIDsByPriority() (PriorityMessages, error) {
	var e PriorityMessages
	res := r.db.
		Table("messages").
		Select(`user_id, min(id) as message_id, count(*) as unread_count, min(sent_at) as last_sent`).
		Where("deleted is null").
		Where("unread = true").
		Where("from_user = false").
		Or("status = ?", StatusAssigned).
		Group("user_id").
		Order("last_sent asc, unread_count desc").
		Scan(&e)

	if res.Error != nil {
		return nil, res.Error
	}
	return e, nil
}
