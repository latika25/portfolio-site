package handlers

import (
	"log"
	"net/mail"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"portfolio-backend/models"
)

var (
	submissions   []storedSubmission
	submissionsMu sync.Mutex
)

type storedSubmission struct {
	models.ContactRequest
	ReceivedAt time.Time `json:"receivedAt"`
}

func PostContact(c *fiber.Ctx) error {
	var req models.ContactRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ContactResponse{
			Success: false,
			Message: "Could not read the form data. Please try again.",
		})
	}

	if strings.TrimSpace(req.Company) != "" {
		return c.JSON(models.ContactResponse{Success: true, Message: "Thanks! I'll get back to you soon."})
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Message = strings.TrimSpace(req.Message)

	if req.Name == "" || req.Email == "" || req.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.ContactResponse{
			Success: false,
			Message: "Name, email, and message are all required.",
		})
	}
	if len(req.Message) > 5000 {
		return c.Status(fiber.StatusBadRequest).JSON(models.ContactResponse{
			Success: false,
			Message: "Message is too long (max 5000 characters).",
		})
	}
	if _, err := mail.ParseAddress(req.Email); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.ContactResponse{
			Success: false,
			Message: "That email address doesn't look valid.",
		})
	}

	submissionsMu.Lock()
	submissions = append(submissions, storedSubmission{ContactRequest: req, ReceivedAt: time.Now()})
	submissionsMu.Unlock()

	log.Printf("[contact] new message from %s <%s>: %s", req.Name, req.Email, req.Message)

	return c.JSON(models.ContactResponse{
		Success: true,
		Message: "Thanks! I'll get back to you soon.",
	})
}

func GetSubmissions(c *fiber.Ctx) error {
	submissionsMu.Lock()
	defer submissionsMu.Unlock()
	return c.JSON(submissions)
}
