package service

import (
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/repository"
	"encoding/json"
	"errors"
)

type ObjectService struct {
	objectRepo *repository.ObjectRepository
	flowRepo   *repository.FlowRepository
}

func NewObjectService(objectRepo *repository.ObjectRepository, flowRepo *repository.FlowRepository) *ObjectService {
	return &ObjectService{
		objectRepo: objectRepo,
		flowRepo:   flowRepo,
	}
}

func (s *ObjectService) Create(req *models.ObjectRequestDTO) (*models.ObjectResponseDTO, error) {
	if req.FlowID == nil {
		return nil, errors.New("플로우 ID는 필수입니다")
	}

	_, err := s.flowRepo.FindByID(*req.FlowID)
	if err != nil {
		if err == repository.ErrFlowNotFound {
			return nil, errors.New("플로우를 찾을 수 없습니다")
		}
		return nil, err
	}

	var paramsJSON json.RawMessage
	if req.Params != nil && len(req.Params) > 0 {
		paramsBytes, err := json.Marshal(req.Params)
		if err != nil {
			return nil, errors.New("파라미터 JSON 변환 실패: " + err.Error())
		}
		paramsJSON = json.RawMessage(paramsBytes)
	}

	objectType := req.Type
	if objectType == "" {
		objectType = "python"
	}

	label := req.Label
	if label == "" {
		label = objectType
	}

	object := &models.Object{
		Type:   objectType,
		X:      req.X,
		Y:      req.Y,
		Label:  label,
		Params: paramsJSON,
		Target: req.Target,
		FlowID: req.FlowID,
	}

	if err := s.objectRepo.Create(object); err != nil {
		return nil, err
	}

	return object.ToResponseDTO()
}

func (s *ObjectService) FindByID(id int64) (*models.ObjectResponseDTO, error) {
	object, err := s.objectRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	return object.ToResponseDTO()
}

func (s *ObjectService) FindAll() ([]*models.ObjectResponseDTO, error) {
	objects, err := s.objectRepo.FindAll()
	if err != nil {
		return nil, err
	}

	var dtos []*models.ObjectResponseDTO
	for _, object := range objects {
		dto, err := object.ToResponseDTO()
		if err != nil {
			return nil, err
		}
		dtos = append(dtos, dto)
	}

	return dtos, nil
}

func (s *ObjectService) FindByFlow(flowID int64) ([]*models.ObjectResponseDTO, error) {
	_, err := s.flowRepo.FindByID(flowID)
	if err != nil {
		if err == repository.ErrFlowNotFound {
			return nil, errors.New("플로우를 찾을 수 없습니다")
		}
		return nil, err
	}

	objects, err := s.objectRepo.FindByFlow(flowID)
	if err != nil {
		return nil, err
	}

	var dtos []*models.ObjectResponseDTO
	for _, object := range objects {
		dto, err := object.ToResponseDTO()
		if err != nil {
			return nil, err
		}
		dtos = append(dtos, dto)
	}

	return dtos, nil
}

func (s *ObjectService) Update(req *models.ObjectRequestDTO) (*models.ObjectResponseDTO, error) {
	if req.ID == nil {
		return nil, errors.New("오브젝트 ID는 필수입니다")
	}

	if req.FlowID != nil {
		_, err := s.flowRepo.FindByID(*req.FlowID)
		if err != nil {
			if err == repository.ErrFlowNotFound {
				return nil, errors.New("플로우를 찾을 수 없습니다")
			}
			return nil, err
		}
	}

	object, err := s.objectRepo.FindByID(*req.ID)
	if err != nil {
		if err == repository.ErrObjectNotFound {
			return nil, repository.ErrObjectNotFound
		}
		return nil, err
	}

	object.X = req.X
	object.Y = req.Y
	object.Label = req.Label
	object.Target = req.Target
	object.FlowID = req.FlowID

	if req.Type != "" {
		object.Type = req.Type
	}

	if req.Params != nil {
		paramsBytes, err := json.Marshal(req.Params)
		if err != nil {
			return nil, errors.New("파라미터 JSON 변환 실패: " + err.Error())
		}
		object.Params = json.RawMessage(paramsBytes)
	}

	if err := s.objectRepo.Update(object); err != nil {
		return nil, err
	}

	return object.ToResponseDTO()
}

func (s *ObjectService) Delete(id int64) error {
	return s.objectRepo.Delete(id)
}
