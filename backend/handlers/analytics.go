package handlers

import (
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"portfolio-backend/models"
)

var (
	totalViews  int
	nodeViews   = map[string]int{}
	analyticsMu sync.Mutex
)

func PostView(c *fiber.Ctx) error {
	var evt models.ViewEvent
	_ = c.BodyParser(&evt)

	analyticsMu.Lock()
	totalViews++
	if id := strings.TrimSpace(evt.NodeID); id != "" {
		nodeViews[id]++
	}
	analyticsMu.Unlock()

	return c.JSON(fiber.Map{"recorded": true, "timestamp": time.Now().UTC().Format(time.RFC3339)})
}

func GetAnalyticsSummary(c *fiber.Ctx) error {
	analyticsMu.Lock()
	defer analyticsMu.Unlock()

	snapshot := make(map[string]int, len(nodeViews))
	for k, v := range nodeViews {
		snapshot[k] = v
	}

	return c.JSON(models.AnalyticsSummary{
		TotalViews: totalViews,
		NodeViews:  snapshot,
	})
}
