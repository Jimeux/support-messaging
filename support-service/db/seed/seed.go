package main

import (
	"github.com/brianvoe/gofakeit/v6"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/Jimeux/support-messaging/support-service/config"
	"github.com/Jimeux/support-messaging/support-service/src/domain/message"
	"github.com/Jimeux/support-messaging/support-service/src/domain/staff"
	"github.com/Jimeux/support-messaging/support-service/src/domain/user"
)

const (
	numberOfUsers    = 30
	numberOfStaff    = 10
	numberOfMessages = 40
)

func main() {
	conf := config.NewConfig()
	db, err := gorm.Open(mysql.Open(conf.Database.String), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		panic(err)
	}

	createUsers(db)
	createStaff(db)
	createMessages(db)
}

func createUsers(db *gorm.DB) {
	for i := 1; i <= numberOfUsers; i++ {
		u := user.User{
			ID:        int64(i),
			FirstName: gofakeit.FirstName(),
			LastName:  gofakeit.LastName(),
			Avatar:    gofakeit.ImageURL(150, 150),
		}
		if res := db.Create(&u); res.Error != nil {
			panic(res.Error)
		}
	}
}

func createStaff(db *gorm.DB) {
	for i := 1; i <= numberOfStaff; i++ {
		s := staff.Staff{
			ID:        int64(i),
			FirstName: gofakeit.FirstName(),
			LastName:  gofakeit.LastName(),
			Avatar:    gofakeit.ImageURL(150, 150),
		}
		if res := db.Create(&s); res.Error != nil {
			panic(res.Error)
		}
	}
}

func createMessages(db *gorm.DB) {
	for i := 1; i <= numberOfUsers; i++ {
		for j := 0; j < numberOfMessages; j++ {
			m := message.Message{
				UserID: int64(i),
				// StaffID:     0,
				Status:      3,
				ContentType: 1,
				Content:     gofakeit.Sentence(10),
				FromUser:    gofakeit.Bool(),
				Unread:      true,
			}
			if res := db.Create(&m); res.Error != nil {
				panic(res.Error)
			}
		}
	}
}
