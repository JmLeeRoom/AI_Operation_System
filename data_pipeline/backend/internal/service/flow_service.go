package service

import (
	"data-pipeline-backend/internal/models"
	"data-pipeline-backend/internal/repository"
	"errors"
	"time"
)

type FlowService struct {
	flowRepo *repository.FlowRepository
}

func NewFlowService(flowRepo *repository.FlowRepository) *FlowService {
	return &FlowService{
		flowRepo: flowRepo,
	}
}

func (s *FlowService) Create(req *models.FlowRequestDTO) (*models.FlowResponseDTO, error) {
	if req.Name == "" {
		return nil, errors.New("플로우명은 필수입니다")
	}

	flow := &models.Flow{
		Name:      req.Name,
		RunType:   req.RunType,
		CreatedBy: req.UserID,
	}

	if err := s.flowRepo.Create(flow); err != nil {
		return nil, err
	}

	return flow.ToResponseDTO(), nil
}

func (s *FlowService) FindByID(id int64) (*models.FlowResponseDTO, error) {
	flow, err := s.flowRepo.FindByID(id)
	if err != nil {
		return nil, err
	}

	return flow.ToResponseDTO(), nil
}

func (s *FlowService) FindAll() ([]*models.FlowResponseDTO, error) {
	flows, err := s.flowRepo.FindAll()
	if err != nil {
		return nil, err
	}

	var dtos []*models.FlowResponseDTO
	for _, flow := range flows {
		dtos = append(dtos, flow.ToResponseDTO())
	}

	return dtos, nil
}

func (s *FlowService) Update(req *models.FlowRequestDTO) (*models.FlowResponseDTO, error) {
	if req.ID == nil {
		return nil, errors.New("플로우 ID는 필수입니다")
	}

	if req.Name == "" {
		return nil, errors.New("플로우명은 필수입니다")
	}

	flow, err := s.flowRepo.FindByID(*req.ID)
	if err != nil {
		if err == repository.ErrFlowNotFound {
			return nil, repository.ErrFlowNotFound
		}
		return nil, err
	}

	flow.Name = req.Name
	flow.RunType = req.RunType
	flow.CreatedBy = req.UserID

	if err := s.flowRepo.Update(flow); err != nil {
		return nil, err
	}

	return flow.ToResponseDTO(), nil
}

func (s *FlowService) Delete(id int64) error {
	return s.flowRepo.Delete(id)
}

func (s *FlowService) UpdateLatestRun(id int64) error {
	_, err := s.flowRepo.FindByID(id)
	if err != nil {
		if err == repository.ErrFlowNotFound {
			return errors.New("플로우를 찾을 수 없습니다")
		}
		return err
	}

	now := time.Now()
	return s.flowRepo.UpdateLatestRun(id, now)
}
