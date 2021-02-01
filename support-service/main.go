package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/Jimeux/support-messaging/support-service/config"
	"github.com/Jimeux/support-messaging/support-service/src/api/handlers"
	"github.com/Jimeux/support-messaging/support-service/src/app/services"
	"github.com/Jimeux/support-messaging/support-service/src/domain/message"
	"github.com/Jimeux/support-messaging/support-service/src/domain/user"
)

func main() {
	conf := config.NewConfig()
	router := router(conf)

	server := &http.Server{
		Addr:              ":" + conf.Server.Port,
		Handler:           router,
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
		<-shutdownSignal

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

func router(conf config.Config) chi.Router {
	db, err := gorm.Open(mysql.Open(conf.Database.String), &gorm.Config{
		SkipDefaultTransaction: true,
	})
	if err != nil {
		panic(err)
	}

	// DI
	messageRepo := message.NewRepository(db)
	userRepo := user.NewRepository(db)

	messageSvc := services.NewMessageService(messageRepo)
	userSvc := services.NewUserService(messageRepo, userRepo)

	messageHandler := handlers.NewMessageHandler(messageSvc)
	userHandler := handlers.NewUserHandler(userSvc)

	// Router
	r := chi.NewRouter()

	// Middleware
	r.Use(
		middleware.StripSlashes,
		middleware.Logger,
		middleware.Timeout(60*time.Second),
	)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{conf.Server.ClientDomain},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// Routes
	r.Get("/support", func(w http.ResponseWriter, r *http.Request) { // health check
		w.WriteHeader(http.StatusOK)
	})

	r.Route("/support/api/v1", func(r chi.Router) {
		r.Route("/users", func(r chi.Router) {
			r.Get("/", userHandler.List)
			r.Get("/{id}", userHandler.FindByID)
			r.Get("/{id}/messages", messageHandler.FindByUserID)
		})
		r.Route("/messages", func(r chi.Router) {
			r.Post("/", messageHandler.CreateMessage)
			r.Delete("/{id}", messageHandler.DeleteByID)
		})
	})
	return r
}
