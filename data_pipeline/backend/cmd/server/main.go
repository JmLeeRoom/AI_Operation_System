package main

import (
	"data-pipeline-backend/internal/config"
	"data-pipeline-backend/internal/router"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env.local"); err != nil {
		if err2 := godotenv.Load(".env"); err2 != nil {
			log.Println("No .env.local or .env file found, using environment variables")
		} else {
			log.Println("Loaded .env file")
		}
	} else {
		log.Println("Loaded .env.local file")
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	var db *sql.DB
	if cfg.DB.Host != "" {
		log.Printf("Connecting to database: %s@%s:%d/%s", cfg.DB.User, cfg.DB.Host, cfg.DB.Port, cfg.DB.Name)
		if cfg.DB.Password == "" {
			log.Println("WARNING: DB_PASSWORD is empty or not set!")
		} else {
			log.Printf("DB_PASSWORD is set (length: %d characters)", len(cfg.DB.Password))
		}
		
		db, err = config.ConnectDB(cfg.DB)
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}
		defer db.Close()
		log.Println("Database connected successfully")

		log.Println("Checking database migrations...")
		if err := config.RunMigrations(db, cfg.DB); err != nil {
			log.Fatalf("Failed to run migrations: %v", err)
		}

		log.Println("Validating database schema...")
		valid, missingTables, err := config.ValidateSchema(db)
		if err != nil {
			log.Printf("WARNING: Failed to validate schema: %v", err)
		} else if !valid {
			log.Printf("WARNING: Schema validation failed. Missing tables: %v", missingTables)
		} else {
			log.Println("Schema validation passed. All required tables exist.")
		}
	} else {
		log.Println("Database configuration not provided, running without database")
	}

	r := router.SetupRouter(db)

	addr := cfg.Server.Address()
	log.Printf("Server starting on %s", addr)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	server := &http.Server{
		Addr:    addr,
		Handler: r,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	log.Println("Server is ready. Press Ctrl+C to shutdown.")

	<-sigChan
	log.Println("Shutting down server...")
}
