package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

// RequireAdminToken protects internal/admin-only endpoints (like reading raw
// contact form submissions) behind a shared secret, so they aren't
// world-readable just because the rest of the API is public.
//
// Set ADMIN_TOKEN in environment, then call the protected endpoint
// with that value in a header:
//
//	curl -H "X-Admin-Token: <your-token>" https://your-backend.onrender.com/api/contact
//
// If ADMIN_TOKEN is unset, the route fails CLOSED (returns 503) rather than
// silently being left open — so you can't forget to set it and accidentally
// ship a public admin endpoint.
func RequireAdminToken() fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := os.Getenv("ADMIN_TOKEN")
		if token == "" {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{
				"error": "admin endpoint disabled: ADMIN_TOKEN is not set",
			})
		}
		if c.Get("X-Admin-Token") != token {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
		}
		return c.Next()
	}
}
