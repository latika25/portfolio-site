package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"portfolio-backend/handlers"
	appmiddleware "portfolio-backend/middleware"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName:      "portfolio-backend",
		ReadTimeout:  10 * time.Second,
		ServerHeader: "",
		BodyLimit:    1 * 1024 * 1024,
	})

	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "${time} ${status} ${method} ${path} (${latency})\n",
	}))
	app.Use(appmiddleware.NewCORS())
	app.Use(appmiddleware.NewSecurityHeaders())

	app.Use(limiter.New(limiter.Config{
		Max:        120,
		Expiration: 1 * time.Minute,
	}))

	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	api.Get("/resume", handlers.GetResumeGraph)
	api.Get("/resume/:id", handlers.GetResumeNode)

	contactLimiter := limiter.New(limiter.Config{
		Max:        5,
		Expiration: 1 * time.Minute,
	})
	api.Post("/contact", contactLimiter, handlers.PostContact)

	api.Get("/contact", appmiddleware.RequireAdminToken(), handlers.GetSubmissions)

	api.Post("/analytics/view", handlers.PostView)
	api.Get("/analytics/summary", appmiddleware.RequireAdminToken(), handlers.GetAnalyticsSummary)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("portfolio-backend listening on :%s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatal(err)
	}
}
