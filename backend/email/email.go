package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"time"
)

const resendAPIURL = "https://api.resend.com/emails"

type Config struct {
	APIKey   string
	ToEmail  string // CONTACT_TO_EMAIL — where notifications land
	From     string // CONTACT_FROM_EMAIL — the sender address Resend sends as
	Disabled bool   // true if APIKey or ToEmail is unset, so the app never panics on a misconfigured env
}

func LoadConfig() Config {
	apiKey := os.Getenv("RESEND_API_KEY")
	to := os.Getenv("CONTACT_TO_EMAIL")
	from := os.Getenv("CONTACT_FROM_EMAIL")
	if from == "" {
		// Resend's shared sandbox sender — works immediately with no domain
		// verification, but can only deliver to the email address signed
		// up to Resend with. Verify own domain in Resend's dashboard and
		// set CONTACT_FROM_EMAIL once we want to send from e.g.
		// "contact@yourdomain.com" instead.
		from = "onboarding@resend.dev"
	}

	return Config{
		APIKey:   apiKey,
		ToEmail:  to,
		From:     from,
		Disabled: apiKey == "" || to == "",
	}
}

type ContactNotification struct {
	Name      string
	Email     string
	Message   string
	Referrer  string
	IP        string
	UserAgent string
	Timestamp time.Time
}

type resendPayload struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Html    string   `json:"html"`
	// ReplyTo means hitting "Reply" in your inbox goes straight back to the
	// person who filled out the form, not to your own Resend sender address.
	ReplyTo string `json:"reply_to"`
}

func SendContactNotification(cfg Config, n ContactNotification) error {
	if cfg.Disabled {
		return fmt.Errorf("email notifications disabled: set RESEND_API_KEY and CONTACT_TO_EMAIL to enable")
	}

	body := resendPayload{
		From:    fmt.Sprintf("Portfolio Contact Form <%s>", cfg.From),
		To:      []string{cfg.ToEmail},
		Subject: fmt.Sprintf("New portfolio message from %s", n.Name),
		ReplyTo: n.Email,
		Html:    renderHTML(n),
	}

	payload, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("encoding email payload: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, resendAPIURL, bytes.NewReader(payload))
	if err != nil {
		return fmt.Errorf("building request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+cfg.APIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("calling Resend: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Resend returned %d: %s", resp.StatusCode, string(respBody))
	}
	return nil
}

func renderHTML(n ContactNotification) string {
	return fmt.Sprintf(`
		<div style="font-family: -apple-system, sans-serif; max-width: 560px;">
			<h2 style="margin-bottom: 4px;">New message from your portfolio</h2>
			<p style="color: #666; margin-top: 0;">%s</p>
			<table style="width: 100%%; border-collapse: collapse; margin: 16px 0;">
				<tr><td style="padding: 4px 8px; color: #666;">Name</td><td style="padding: 4px 8px;">%s</td></tr>
				<tr><td style="padding: 4px 8px; color: #666;">Email</td><td style="padding: 4px 8px;">%s</td></tr>
				<tr><td style="padding: 4px 8px; color: #666;">Referrer</td><td style="padding: 4px 8px;">%s</td></tr>
				<tr><td style="padding: 4px 8px; color: #666;">IP</td><td style="padding: 4px 8px;">%s</td></tr>
				<tr><td style="padding: 4px 8px; color: #666; vertical-align: top;">User agent</td><td style="padding: 4px 8px; font-size: 12px; color: #888;">%s</td></tr>
			</table>
			<div style="background: #f6f6f6; border-radius: 8px; padding: 16px; white-space: pre-wrap;">%s</div>
			<p style="color: #999; font-size: 12px; margin-top: 16px;">Reply to this email to respond directly to %s.</p>
		</div>
	`,
		html.EscapeString(n.Timestamp.Format("Jan 2, 2006 3:04 PM MST")),
		html.EscapeString(n.Name),
		html.EscapeString(n.Email),
		html.EscapeString(orDash(n.Referrer)),
		html.EscapeString(orDash(n.IP)),
		html.EscapeString(orDash(n.UserAgent)),
		html.EscapeString(n.Message),
		html.EscapeString(n.Name),
	)
}

func orDash(s string) string {
	if s == "" {
		return "—"
	}
	return s
}
