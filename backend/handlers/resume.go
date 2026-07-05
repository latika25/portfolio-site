package handlers

import (
	"encoding/json"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"portfolio-backend/data"
	"portfolio-backend/models"
)

var resumeDataPath = envOr("RESUME_DATA_PATH", "data/resume_data.json")

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func loadGraph() models.ResumeGraph {
	var graph models.ResumeGraph

	raw, err := os.ReadFile(resumeDataPath)
	if err != nil {
		log.Printf("[resume] could not read %s from disk (%v) — using embedded fallback copy", resumeDataPath, err)
		raw = data.Raw
	}

	if err := json.Unmarshal(raw, &graph); err != nil {
		log.Printf("[resume] resume data failed to parse (%v) — falling back to embedded copy", err)
		if err := json.Unmarshal(data.Raw, &graph); err != nil {
			log.Fatalf("embedded resume_data.json is also invalid: %v", err)
		}
	}

	return graph
}

func GetResumeGraph(c *fiber.Ctx) error {
	return c.JSON(loadGraph())
}

func GetResumeNode(c *fiber.Ctx) error {
	id := c.Params("id")
	graph := loadGraph()

	for _, n := range graph.Nodes {
		if n.ID == id {
			return c.JSON(n)
		}
	}
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "node not found",
	})
}
