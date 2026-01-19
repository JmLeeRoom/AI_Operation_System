package config

import (
	"database/sql"
	"embed"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

// RunMigrations executes all pending database migrations
func RunMigrations(db *sql.DB, dbConfig DBConfig) error {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create postgres driver: %w", err)
	}

	sourceDriver, err := iofs.New(migrationsFS, "migrations")
	if err != nil {
		return fmt.Errorf("failed to create source driver: %w", err)
	}

	m, err := migrate.NewWithInstance(
		"iofs",
		sourceDriver,
		"postgres",
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}

	version, dirty, err := m.Version()
	if err != nil && err != migrate.ErrNilVersion {
		return fmt.Errorf("failed to get current migration version: %w", err)
	}

	if dirty {
		log.Printf("WARNING: Database is in a dirty state (version: %d). Attempting to force version...", version)
		if err := m.Force(int(version)); err != nil {
			return fmt.Errorf("failed to force migration version: %w", err)
		}
		log.Println("Dirty state resolved, continuing with migration...")
	}

	log.Println("Running database migrations...")
	if err := m.Up(); err != nil {
		if err == migrate.ErrNoChange {
			log.Println("No pending migrations, database is up to date")
			return nil
		}
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	newVersion, _, err := m.Version()
	if err != nil {
		return fmt.Errorf("failed to get migration version after migration: %w", err)
	}

	log.Printf("Migrations completed successfully. Current version: %d", newVersion)
	return nil
}

// ValidateSchema checks if all required tables exist in the database
func ValidateSchema(db *sql.DB) (bool, []string, error) {
	expectedTables := []string{
		"flows",
		"objects",
	}

	query := `
		SELECT table_name 
		FROM information_schema.tables 
		WHERE table_schema = 'public' 
		AND table_type = 'BASE TABLE'
		ORDER BY table_name;
	`

	rows, err := db.Query(query)
	if err != nil {
		return false, nil, fmt.Errorf("failed to query tables: %w", err)
	}
	defer rows.Close()

	existingTables := make(map[string]bool)
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			return false, nil, fmt.Errorf("failed to scan table name: %w", err)
		}
		existingTables[tableName] = true
	}

	if err := rows.Err(); err != nil {
		return false, nil, fmt.Errorf("error iterating rows: %w", err)
	}

	var missingTables []string
	for _, table := range expectedTables {
		if !existingTables[table] {
			missingTables = append(missingTables, table)
		}
	}

	return len(missingTables) == 0, missingTables, nil
}
