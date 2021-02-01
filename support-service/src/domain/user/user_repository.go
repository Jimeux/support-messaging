package user

import "gorm.io/gorm"

// TODO 2021/01/10 @Jimeux gorm scopes
//  https://tech.mfkessai.co.jp/2018/12/composable-repository/
type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindByID(id int64) (*User, error) {
	u := new(User)
	res := r.db.
		Where("id = ?", id).
		Find(u)

	if res.Error != nil {
		return nil, res.Error
	}
	return u, nil
}

func (r *Repository) FindByIDs(ids []int64) ([]User, error) {
	var users []User
	res := r.db.
		Where("id in ?", ids).
		Find(&users)

	if res.Error != nil {
		return nil, res.Error
	}
	return users, nil
}
