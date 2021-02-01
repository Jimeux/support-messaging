package staff

type Staff struct {
	ID        int64 `gorm:"primaryKey;auto_increment"`
	FirstName string
	LastName  string
	Avatar    string
	Updated   int `gorm:"autoUpdateTime"`
	Created   int `gorm:"autoCreateTime"`
}

func (Staff) TableName() string {
	return "staff"
}
