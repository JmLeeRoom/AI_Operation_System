package config

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
)

// ConnectDB establishes a connection to the PostgreSQL database
func ConnectDB(cfg DBConfig) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.ConnectionString())
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}
