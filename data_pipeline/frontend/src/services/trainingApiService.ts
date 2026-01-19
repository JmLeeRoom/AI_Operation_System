/**
 * Training API Service
 * Handles communication with ML pipeline endpoints
 */

import { config } from '../config/env'
import { log } from '../utils/logger'

// ============================================================
// Types
// ============================================================

export interface TrainingRun {
  run_id: number
  name: string
  description?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  base_model: string
  model_type: string
  hyperparameters?: Hyperparameters
  dataset_id?: number
  started_at?: string
  completed_at?: string
  duration_seconds?: number
  output_model_path?: string
  metrics?: Record<string, number>
  created_at: string
}

export interface Hyperparameters {
  learning_rate: number
  num_epochs: number
  batch_size: number
  gradient_accumulation_steps: number
  lora_r: number
  lora_alpha: number
  lora_dropout: number
  max_seq_length: number
  warmup_ratio: number
}

export interface TrainingStatus {
  run_id: number
  status: string
  progress: number
  current_epoch?: number
  total_epochs?: number
  current_step?: number
  total_steps?: number
  train_loss?: number
  eval_loss?: number
  learning_rate?: number
  elapsed_seconds?: number
  estimated_eta?: number
  gpu_memory_used_gb?: number
  logs?: string[]
}

export interface Feedback {
  feedback_id: number
  feedback_type: string
  input_prompt: string
  input_code?: string
  output_code?: string
  output_explanation?: string
  execution_success?: boolean
  rating?: number
  is_accepted?: boolean
  user_correction?: string
  model_version?: string
  used_for_training: boolean
  created_at: string
}

export interface Dataset {
  dataset_id: number
  name: string
  version: string
  description?: string
  total_samples: number
  train_samples: number
  eval_samples: number
  test_samples: number
  data_path?: string
  status: 'building' | 'ready' | 'archived'
  is_active: boolean
  created_at: string
}

export interface Model {
  model_id: number
  name: string
  version: string
  description?: string
  base_model: string
  model_type: string
  model_path: string
  adapter_path?: string
  training_run_id?: number
  dataset_id?: number
  eval_metrics?: Record<string, number>
  benchmark_scores?: Record<string, number>
  is_active: boolean
  is_production: boolean
  deployed_at?: string
  ollama_model_name?: string
  created_at: string
}

export interface Evaluation {
  eval_id: number
  model_id: number
  dataset_id?: number
  eval_type: string
  metrics: Record<string, number>
  passed?: boolean
  code_tests_total: number
  code_tests_passed: number
  code_tests_failed: number
  created_at: string
}

export interface FeedbackStats {
  total_feedbacks: number
  accepted_feedbacks: number
  high_rating_count: number
  unused_for_training: number
}

// ============================================================
// API Functions
// ============================================================

class TrainingApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.apiUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // ============================================================
  // Training Runs
  // ============================================================

  async startTraining(params: {
    name: string
    description?: string
    base_model?: string
    model_type?: string
    hyperparameters?: Partial<Hyperparameters>
    dataset_id?: number
  }): Promise<{ run_id: number; status: string; message: string }> {
    log.info('Starting training', params)
    return this.request('/train/start', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async listTrainingRuns(limit = 50, offset = 0): Promise<TrainingRun[]> {
    const result = await this.request<TrainingRun[] | null>(`/train/runs?limit=${limit}&offset=${offset}`)
    return result || []
  }

  async getTrainingRun(id: number): Promise<TrainingRun> {
    return this.request(`/train/runs/${id}`)
  }

  async getTrainingStatus(id: number): Promise<TrainingStatus> {
    return this.request(`/train/runs/${id}/status`)
  }

  async cancelTraining(id: number): Promise<{ message: string }> {
    log.info('Cancelling training', { id })
    return this.request(`/train/runs/${id}/cancel`, {
      method: 'POST',
    })
  }

  // ============================================================
  // Feedbacks
  // ============================================================

  async createFeedback(params: {
    feedback_type: string
    input_prompt: string
    input_code?: string
    output_code?: string
    output_explanation?: string
    execution_success?: boolean
    execution_output?: string
    execution_error?: string
    rating?: number
    is_accepted?: boolean
    user_correction?: string
    node_id?: string
    flow_id?: number
    model_version?: string
  }): Promise<Feedback> {
    log.info('Creating feedback', { type: params.feedback_type })
    return this.request('/feedbacks', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async listFeedbacks(
    limit = 50,
    offset = 0,
    filters?: { min_rating?: number; is_accepted?: boolean }
  ): Promise<Feedback[]> {
    let url = `/feedbacks?limit=${limit}&offset=${offset}`
    if (filters?.min_rating) {
      url += `&min_rating=${filters.min_rating}`
    }
    if (filters?.is_accepted !== undefined) {
      url += `&is_accepted=${filters.is_accepted}`
    }
    const result = await this.request<Feedback[] | null>(url)
    return result || []
  }

  async getFeedbackStats(): Promise<FeedbackStats> {
    return this.request('/feedbacks/stats')
  }

  // ============================================================
  // Datasets
  // ============================================================

  async buildDataset(params: {
    name: string
    version: string
    description?: string
    source_type?: string
    feedback_filters?: {
      min_rating?: number
      is_accepted?: boolean
      feedback_types?: string[]
    }
    train_split_ratio?: number
    eval_split_ratio?: number
    test_split_ratio?: number
    dedup_enabled?: boolean
    min_sample_length?: number
  }): Promise<Dataset> {
    log.info('Building dataset', { name: params.name, version: params.version })
    return this.request('/datasets/build', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async listDatasets(limit = 50, offset = 0): Promise<Dataset[]> {
    const result = await this.request<Dataset[] | null>(`/datasets?limit=${limit}&offset=${offset}`)
    return result || []
  }

  async getDataset(id: number): Promise<Dataset> {
    return this.request(`/datasets/${id}`)
  }

  async setActiveDataset(id: number): Promise<{ message: string }> {
    log.info('Setting active dataset', { id })
    return this.request(`/datasets/${id}/activate`, {
      method: 'POST',
    })
  }

  // ============================================================
  // Models
  // ============================================================

  async listModels(limit = 50, offset = 0): Promise<Model[]> {
    const result = await this.request<Model[] | null>(`/models?limit=${limit}&offset=${offset}`)
    return result || []
  }

  async getModel(id: number): Promise<Model> {
    return this.request(`/models/${id}`)
  }

  async getActiveModel(): Promise<Model | null> {
    try {
      return await this.request('/models/active')
    } catch {
      return null
    }
  }

  async activateModel(params: {
    model_id: number
    ollama_name?: string
    is_production?: boolean
  }): Promise<{ model_id: number; status: string; ollama_name?: string; message: string }> {
    log.info('Activating model', params)
    return this.request('/models/activate', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  // ============================================================
  // Evaluations
  // ============================================================

  async runEvaluation(params: {
    model_id: number
    dataset_id?: number
    eval_type?: string
  }): Promise<{
    eval_id: number
    model_id: number
    passed: boolean
    metrics: Record<string, number>
    code_tests_passed: number
    code_tests_total: number
    pass_rate: number
    message: string
  }> {
    log.info('Running evaluation', params)
    return this.request('/evaluations/run', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  async listEvaluations(modelId: number): Promise<Evaluation[]> {
    const result = await this.request<Evaluation[] | null>(`/evaluations/model/${modelId}`)
    return result || []
  }
}

export const trainingApiService = new TrainingApiService()
