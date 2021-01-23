package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var (
	port = envVar("SERVER_PORT")
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", Test)

	server := &http.Server{
		Addr:              ":" + port,
		Handler:           mux,
		ReadHeaderTimeout: 20 * time.Second,
		ReadTimeout:       40 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	gracefulShutdown := make(chan struct{})
	go func() {
		shutdownSignal := make(chan os.Signal, 1)
		// Asynchronously listen for signals
		signal.Notify(shutdownSignal, syscall.SIGINT)  // ctrl+C
		signal.Notify(shutdownSignal, syscall.SIGTERM) // docker stop
		// Block while waiting for shutdownSignal to receive a signal
		a := <-shutdownSignal
		fmt.Print("Received: ")
		fmt.Println(a)

		// Initiate graceful shut down
		if err := server.Shutdown(context.Background()); err != nil {
			// Error from closing listeners, or context timeout:
			log.Printf("HTTP server Shutdown: %v", err)
		}
		close(gracefulShutdown)
	}()

	fmt.Println("Listening on " + server.Addr)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Printf("HTTP server ListenAndServe: %v", err)
	}

	<-gracefulShutdown
}

func Test(w http.ResponseWriter, r *http.Request) {
	res := struct {
		Msg string `json:"msg"`
	}{Msg: fmt.Sprintf("Welcome to the Built Minimally™ user-service 💀️🙋🏻💀️ (%s)", r.RequestURI)}

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
