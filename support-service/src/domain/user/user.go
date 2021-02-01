package user

type User struct {
	ID        int64 `gorm:"primaryKey;auto_increment"`
	FirstName string
	LastName  string
	Avatar    string
	Updated   int `gorm:"autoUpdateTime"`
	Created   int `gorm:"autoCreateTime"`
}
