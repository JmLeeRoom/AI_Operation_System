package middleware

import (
	"github.com/rs/cors"
	"net/http"
)

func CORSMiddleware() func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"Accept",
			"Origin",
		},
		AllowCredentials: false,
		ExposedHeaders:   []string{"Content-Length", "Content-Type"},
		MaxAge:           86400,
	})
	return c.Handler
}
