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

var (
	port, _ = strconv.Atoi(envVar("SERVER_PORT"))
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", Test)

	log.Printf("Starting user-service on port %d...", port)
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      mux,
		ReadTimeout:  60 * time.Second,
		WriteTimeout: 60 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("Server startup failed")
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
