package config

import (
	"fmt"
	"os"
	"strconv"
)

// Config holds all application configuration
type Config struct {
	DB      DBConfig
	Server  ServerConfig
	K8s     K8sConfig
	Jupyter JupyterConfig
	Logging LoggingConfig
}

// DBConfig holds database configuration
type DBConfig struct {
	Host     string
	Port     int
	Name     string
	User     string
	Password string
	SSLMode  string
}

// ConnectionString returns PostgreSQL connection string
func (c DBConfig) ConnectionString() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=%s",
		c.User, c.Password, c.Host, c.Port, c.Name, c.SSLMode)
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port string
	Host string
}

// Address returns server address (host:port)
func (c ServerConfig) Address() string {
	return fmt.Sprintf("%s:%s", c.Host, c.Port)
}

// K8sConfig holds Kubernetes configuration
type K8sConfig struct {
	InCluster      bool
	KubeconfigPath string
	Context        string
	KafkaNamespace string
	KafkaCluster   string
	KafkaBootstrap string
}

// JupyterConfig holds Jupyter server configuration
type JupyterConfig struct {
	URL    string
	APIURL string
	Token  string
}

// LoggingConfig holds logging configuration
type LoggingConfig struct {
	Level  string
	Format string
}

var globalConfig *Config

// Load loads configuration from environment variables
func Load() (*Config, error) {
	cfg := &Config{
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvAsInt("DB_PORT", 5432),
			Name:     getEnv("DB_NAME", "flow_db"),
			User:     getEnv("DB_USER", "flow_user"),
			Password: getEnv("DB_PASSWORD", ""),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT", "8080"),
			Host: getEnv("SERVER_HOST", "localhost"),
		},
		K8s: K8sConfig{
			InCluster:      getEnvAsBool("K8S_IN_CLUSTER", false),
			KubeconfigPath: getEnv("KUBECONFIG", ""),
			Context:        getEnv("K8S_CONTEXT", ""),
			KafkaNamespace: getEnv("KAFKA_NAMESPACE", "kafka"),
			KafkaCluster:   getEnv("KAFKA_CLUSTER", "kafka-cluster"),
			KafkaBootstrap: getEnv("KAFKA_BOOTSTRAP", ""),
		},
		Jupyter: JupyterConfig{
			URL:    getEnv("JUPYTER_URL", "http://jupyter-service:8888"),
			APIURL: getEnv("JUPYTER_API_URL", "http://jupyter-service:8888/api"),
			Token:  getEnv("JUPYTER_TOKEN", ""),
		},
		Logging: LoggingConfig{
			Level:  getEnv("LOG_LEVEL", "info"),
			Format: getEnv("LOG_FORMAT", "text"),
		},
	}
	globalConfig = cfg
	return cfg, nil
}

// Get returns the global configuration instance
func Get() *Config {
	if globalConfig == nil {
		Load()
	}
	return globalConfig
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolValue, err := strconv.ParseBool(value); err == nil {
			return boolValue
		}
	}
	return defaultValue
}
