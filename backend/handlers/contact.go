package handlers

import (
	"log"
	"net/mail"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"portfolio-backend/email"
	"portfolio-backend/models"
)

var (
	submissions   []storedSubmission
	submissionsMu sync.Mutex

	// Loaded once at startup from RESEND_API_KEY / CONTACT_TO_EMAIL /
	// CONTACT_FROM_EMAIL. If those aren't set, emailCfg.Disabled is true and
	// PostContact just logs a warning instead of failing.
	emailCfg = email.LoadConfig()
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

	if err := email.SendContactNotification(emailCfg, email.ContactNotification{
		Name:      req.Name,
		Email:     req.Email,
		Message:   req.Message,
		Referrer:  c.Get("Referer"),
		IP:        c.IP(),
		UserAgent: c.Get("User-Agent"),
		Timestamp: time.Now(),
	}); err != nil {
		log.Printf("[contact] email notification failed (message was still saved): %v", err)
	}

	return c.JSON(models.ContactResponse{
		Success: true,
		Message: "Thanks! I'll get back to you soon.",
	})
}

func GetSubmissions(c *fiber.Ctx) error {
	submissionsMu.Lock()
	defer submissionsMu.Unlock()

	result := submissions
	if result == nil {
		result = []storedSubmission{}
	}
	return c.JSON(result)
}
