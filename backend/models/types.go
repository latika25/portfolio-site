package models

type NodeType string

const (
	NodeTypeCore       NodeType = "core"
	NodeTypeExperience NodeType = "experience"
	NodeTypeProject    NodeType = "project"
	NodeTypeSkill      NodeType = "skill"
	NodeTypeContact    NodeType = "contact"
)

type Vec3 struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	Z float64 `json:"z"`
}

type Node struct {
	ID          string   `json:"id"`
	Type        NodeType `json:"type"`
	Label       string   `json:"label"`
	Subtitle    string   `json:"subtitle,omitempty"`
	Category    string   `json:"category,omitempty"`
	Description string   `json:"description,omitempty"`
	Bullets     []string `json:"bullets,omitempty"`
	Tech        []string `json:"tech,omitempty"`
	Links       []Link   `json:"links,omitempty"`
	Position    Vec3     `json:"position"`
	Size        float64  `json:"size"`
}

type Link struct {
	Label string `json:"label"`
	URL   string `json:"url"`
}

type Edge struct {
	Source string `json:"source"`
	Target string `json:"target"`
	Kind   string `json:"kind,omitempty"`
}

type ResumeGraph struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Company string `json:"company,omitempty"`
}

type ContactResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type ViewEvent struct {
	NodeID    string `json:"nodeId,omitempty"`
	Referrer  string `json:"referrer,omitempty"`
	Timestamp string `json:"timestamp"`
}

type AnalyticsSummary struct {
	TotalViews int            `json:"totalViews"`
	NodeViews  map[string]int `json:"nodeViews"`
}
