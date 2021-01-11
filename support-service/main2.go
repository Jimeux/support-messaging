package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func main() {
	if err := http.ListenAndServe(":80", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			log.Println("JSON encoding error")
		}
	})); err != nil {
		log.Fatal("Server failed")
	}
}

func Test(w http.ResponseWriter, r *http.Request) {
	res := struct {
		Msg string `json:"msg"`
	}{Msg: fmt.Sprintf("Welcome to the support-service 💀💀💀 (%s)", r.RequestURI)}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		log.Println("JSON encoding error")
	}
}

func envVar(key string) string {
	val := os.Getenv(key)
	if val == "" {
		_, _ = fmt.Fprintf(os.Stderr, "Environment variable %s must be set.\n", key)
		os.Exit(1)
	}
	return val
}
