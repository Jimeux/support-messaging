package config

import (
	"fmt"
	"os"
)

type Config struct {
	Database Database
	Server   Server
}

func NewConfig() Config {
	return Config{
		Database: NewDatabase(),
		Server:   NewServer(),
	}
}

type Database struct {
	String string
}

func NewDatabase() Database {
	dbString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("SUPPORT_DB_USER"),
		os.Getenv("SUPPORT_DB_PASSWORD"),
		os.Getenv("SUPPORT_DB_HOST"),
		os.Getenv("SUPPORT_DB_PORT"),
		os.Getenv("SUPPORT_DB_NAME"),
	)
	return Database{String: dbString}
}

type Server struct {
	ClientDomain string
	Port         string
}

func NewServer() Server {
	return Server{
		ClientDomain: os.Getenv("SUPPORT_CLIENT_DOMAIN"),
		Port:         os.Getenv("SUPPORT_SERVER_PORT"),
	}
}
