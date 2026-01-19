package models

import "encoding/json"

// Object represents an object (node) entity
type Object struct {
	ID     int64           `json:"o_id" db:"o_id"`
	Type   string          `json:"type" db:"type"`
	X      *int64          `json:"x,omitempty" db:"x"`
	Y      *int64          `json:"y,omitempty" db:"y"`
	Label  string          `json:"label" db:"label"`
	Params json.RawMessage `json:"-" db:"params"`
	Target *int64          `json:"target,omitempty" db:"target"`
	FlowID *int64          `json:"-" db:"flow"`
}

// ObjectRequestDTO represents the request payload for object operations
type ObjectRequestDTO struct {
	ID     *int64                 `json:"o_id,omitempty"`
	FlowID *int64                 `json:"f_id,omitempty"`
	MenuID *int64                 `json:"m_id,omitempty"`
	Target *int64                 `json:"target,omitempty"`
	X      *int64                 `json:"x,omitempty"`
	Y      *int64                 `json:"y,omitempty"`
	Type   string                 `json:"type"`
	Label  string                 `json:"label"`
	Params map[string]interface{} `json:"params,omitempty"`
}

// ObjectResponseDTO represents the response payload for object operations
type ObjectResponseDTO struct {
	ID     int64                  `json:"o_id"`
	Type   string                 `json:"type"`
	Label  string                 `json:"label"`
	Params map[string]interface{} `json:"params,omitempty"`
	Target *int64                 `json:"target,omitempty"`
	X      *int64                 `json:"x,omitempty"`
	Y      *int64                 `json:"y,omitempty"`
}

// ToResponseDTO converts Object entity to ObjectResponseDTO
func (o *Object) ToResponseDTO() (*ObjectResponseDTO, error) {
	dto := &ObjectResponseDTO{
		ID:     o.ID,
		Type:   o.Type,
		Label:  o.Label,
		Target: o.Target,
		X:      o.X,
		Y:      o.Y,
	}
	
	if len(o.Params) > 0 {
		var params map[string]interface{}
		if err := json.Unmarshal(o.Params, &params); err != nil {
			return nil, err
		}
		dto.Params = params
	}
	
	return dto, nil
}
