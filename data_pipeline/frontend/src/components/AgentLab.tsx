/**
 * Agent Lab Component
 * ML Pipeline management UI for training, datasets, models, and monitoring
 */

import { useState, useEffect, useCallback } from 'react'
import {
  trainingApiService,
  type TrainingRun,
  type Dataset,
  type Model,
  type Feedback,
  type FeedbackStats,
} from '../services/trainingApiService'
import { log } from '../utils/logger'
import './AgentLab.css'

type TabType = 'overview' | 'training' | 'datasets' | 'models' | 'feedbacks'

export default function AgentLab() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [trainingRuns, setTrainingRuns] = useState<TrainingRun[]>([])
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null)
  const [activeModel, setActiveModel] = useState<Model | null>(null)

  // Modal states
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [showDatasetModal, setShowDatasetModal] = useState(false)

  // Load data on mount
  useEffect(() => {
    loadOverviewData()
  }, [])

  const loadOverviewData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [runsData, datasetsData, modelsData, statsData, activeModelData] = await Promise.all([
        trainingApiService.listTrainingRuns(5),
        trainingApiService.listDatasets(5),
        trainingApiService.listModels(5),
        trainingApiService.getFeedbackStats(),
        trainingApiService.getActiveModel(),
      ])
      setTrainingRuns(runsData || [])
      setDatasets(datasetsData || [])
      setModels(modelsData || [])
      setFeedbackStats(statsData)
      setActiveModel(activeModelData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      log.error('Failed to load overview data', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTabData = useCallback(async (tab: TabType) => {
    setIsLoading(true)
    setError(null)
    try {
      switch (tab) {
        case 'training':
          setTrainingRuns(await trainingApiService.listTrainingRuns(50))
          break
        case 'datasets':
          setDatasets(await trainingApiService.listDatasets(50))
          break
        case 'models':
          setModels(await trainingApiService.listModels(50))
          break
        case 'feedbacks':
          setFeedbacks(await trainingApiService.listFeedbacks(50))
          setFeedbackStats(await trainingApiService.getFeedbackStats())
          break
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'overview') {
      loadTabData(activeTab)
    }
  }, [activeTab, loadTabData])

  return (
    <div className="agent-lab">
      {/* Header */}
      <div className="agent-lab-header">
        <div className="agent-lab-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <h1>Agent Lab</h1>
        </div>
        <div className="agent-lab-actions">
          <button onClick={() => setShowTrainingModal(true)} className="agent-lab-btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            New Training
          </button>
          <button onClick={() => setShowDatasetModal(true)} className="agent-lab-btn secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Build Dataset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="agent-lab-tabs">
        {(['overview', 'training', 'datasets', 'models', 'feedbacks'] as TabType[]).map((tab) => (
          <button
            key={tab}
            className={`agent-lab-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="agent-lab-content">
        {isLoading && (
          <div className="agent-lab-loading">
            <div className="agent-lab-spinner" />
            <span>Loading...</span>
          </div>
        )}

        {error && (
          <div className="agent-lab-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                trainingRuns={trainingRuns}
                datasets={datasets}
                models={models}
                feedbackStats={feedbackStats}
                activeModel={activeModel}
                onRefresh={loadOverviewData}
              />
            )}
            {activeTab === 'training' && (
              <TrainingTab
                trainingRuns={trainingRuns}
                onRefresh={() => loadTabData('training')}
              />
            )}
            {activeTab === 'datasets' && (
              <DatasetsTab
                datasets={datasets}
                onRefresh={() => loadTabData('datasets')}
              />
            )}
            {activeTab === 'models' && (
              <ModelsTab
                models={models}
                activeModel={activeModel}
                onRefresh={() => loadTabData('models')}
              />
            )}
            {activeTab === 'feedbacks' && (
              <FeedbacksTab
                feedbacks={feedbacks}
                stats={feedbackStats}
                onRefresh={() => loadTabData('feedbacks')}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showTrainingModal && (
        <NewTrainingModal
          onClose={() => setShowTrainingModal(false)}
          onSuccess={() => {
            setShowTrainingModal(false)
            loadTabData('training')
          }}
          datasets={datasets}
        />
      )}
      {showDatasetModal && (
        <BuildDatasetModal
          onClose={() => setShowDatasetModal(false)}
          onSuccess={() => {
            setShowDatasetModal(false)
            loadTabData('datasets')
          }}
        />
      )}
    </div>
  )
}

// ============================================================
// Overview Tab
// ============================================================

function OverviewTab({
  trainingRuns,
  datasets,
  models,
  feedbackStats,
  activeModel,
  onRefresh,
}: {
  trainingRuns: TrainingRun[]
  datasets: Dataset[]
  models: Model[]
  feedbackStats: FeedbackStats | null
  activeModel: Model | null
  onRefresh: () => void
}) {
  return (
    <div className="agent-lab-overview">
      {/* Stats Cards */}
      <div className="agent-lab-stats">
        <div className="stat-card">
          <div className="stat-icon training">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{trainingRuns.length}</span>
            <span className="stat-label">Training Runs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon datasets">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{datasets.length}</span>
            <span className="stat-label">Datasets</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon models">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v10M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h10M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{models.length}</span>
            <span className="stat-label">Models</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon feedbacks">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{feedbackStats?.total_feedbacks || 0}</span>
            <span className="stat-label">Feedbacks</span>
          </div>
        </div>
      </div>

      {/* Active Model */}
      {activeModel && (
        <div className="agent-lab-section">
          <h3>Active Model</h3>
          <div className="active-model-card">
            <div className="model-badge active">Active</div>
            <h4>{activeModel.name} v{activeModel.version}</h4>
            <p>Base: {activeModel.base_model}</p>
            {activeModel.ollama_model_name && (
              <p className="ollama-name">Ollama: {activeModel.ollama_model_name}</p>
            )}
            {activeModel.eval_metrics && (
              <div className="model-metrics">
                {Object.entries(activeModel.eval_metrics).map(([key, value]) => (
                  <span key={key} className="metric">
                    {key}: {typeof value === 'number' ? value.toFixed(3) : value}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Training Runs */}
      <div className="agent-lab-section">
        <div className="section-header">
          <h3>Recent Training Runs</h3>
          <button onClick={onRefresh} className="refresh-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
        <div className="runs-list">
          {trainingRuns.length === 0 ? (
            <div className="empty-state">No training runs yet</div>
          ) : (
            trainingRuns.map((run) => (
              <div key={run.run_id} className="run-item">
                <div className="run-info">
                  <span className="run-name">{run.name}</span>
                  <span className="run-model">{run.base_model}</span>
                </div>
                <StatusBadge status={run.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Training Tab
// ============================================================

function TrainingTab({
  trainingRuns,
  onRefresh,
}: {
  trainingRuns: TrainingRun[]
  onRefresh: () => void
}) {
  const [selectedRun, setSelectedRun] = useState<TrainingRun | null>(null)

  const handleCancel = async (runId: number) => {
    if (!confirm('Cancel this training run?')) return
    try {
      await trainingApiService.cancelTraining(runId)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel')
    }
  }

  return (
    <div className="agent-lab-training">
      <div className="section-header">
        <h3>Training Runs</h3>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>
      
      <div className="training-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Base Model</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainingRuns.map((run) => (
              <tr key={run.run_id} onClick={() => setSelectedRun(run)}>
                <td>{run.run_id}</td>
                <td>{run.name}</td>
                <td className="model-cell">{run.base_model.split('/').pop()}</td>
                <td><StatusBadge status={run.status} /></td>
                <td>{run.duration_seconds ? `${Math.round(run.duration_seconds / 60)}m` : '-'}</td>
                <td>{new Date(run.created_at).toLocaleDateString()}</td>
                <td>
                  {run.status === 'running' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancel(run.run_id); }}
                      className="action-btn danger"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRun && (
        <TrainingDetailModal
          run={selectedRun}
          onClose={() => setSelectedRun(null)}
        />
      )}
    </div>
  )
}

// ============================================================
// Datasets Tab
// ============================================================

function DatasetsTab({
  datasets,
  onRefresh,
}: {
  datasets: Dataset[]
  onRefresh: () => void
}) {
  const handleActivate = async (datasetId: number) => {
    try {
      await trainingApiService.setActiveDataset(datasetId)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to activate')
    }
  }

  return (
    <div className="agent-lab-datasets">
      <div className="section-header">
        <h3>Datasets</h3>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>
      
      <div className="datasets-grid">
        {datasets.map((ds) => (
          <div key={ds.dataset_id} className={`dataset-card ${ds.is_active ? 'active' : ''}`}>
            {ds.is_active && <div className="dataset-badge">Active</div>}
            <h4>{ds.name} v{ds.version}</h4>
            <p className="dataset-desc">{ds.description || 'No description'}</p>
            <div className="dataset-stats">
              <span>Total: {ds.total_samples}</span>
              <span>Train: {ds.train_samples}</span>
              <span>Eval: {ds.eval_samples}</span>
              <span>Test: {ds.test_samples}</span>
            </div>
            <div className="dataset-footer">
              <StatusBadge status={ds.status} />
              {!ds.is_active && ds.status === 'ready' && (
                <button onClick={() => handleActivate(ds.dataset_id)} className="action-btn">
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Models Tab
// ============================================================

function ModelsTab({
  models,
  activeModel,
  onRefresh,
}: {
  models: Model[]
  activeModel: Model | null
  onRefresh: () => void
}) {
  const [evaluating, setEvaluating] = useState<number | null>(null)
  const activeModelId = activeModel?.model_id

  const handleActivate = async (modelId: number) => {
    const ollamaName = prompt('Enter Ollama model name:', `codegen-model-${modelId}`)
    if (!ollamaName) return

    try {
      await trainingApiService.activateModel({
        model_id: modelId,
        ollama_name: ollamaName,
        is_production: false,
      })
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to activate')
    }
  }

  const handleEvaluate = async (modelId: number) => {
    setEvaluating(modelId)
    try {
      const result = await trainingApiService.runEvaluation({
        model_id: modelId,
        eval_type: 'automated',
      })
      alert(`Evaluation ${result.passed ? 'PASSED' : 'FAILED'}: ${result.code_tests_passed}/${result.code_tests_total} tests passed`)
      onRefresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Evaluation failed')
    } finally {
      setEvaluating(null)
    }
  }

  return (
    <div className="agent-lab-models">
      <div className="section-header">
        <h3>Models</h3>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>
      
      <div className="models-grid">
        {models.map((model) => (
          <div key={model.model_id} className={`model-card ${model.is_active ? 'active' : ''} ${activeModelId === model.model_id ? 'current' : ''}`}>
            {model.is_active && <div className="model-badge active">Active</div>}
            {model.is_production && <div className="model-badge production">Production</div>}
            <h4>{model.name} v{model.version}</h4>
            <p className="model-base">Base: {model.base_model.split('/').pop()}</p>
            <p className="model-type">Type: {model.model_type}</p>
            {model.ollama_model_name && (
              <p className="model-ollama">Ollama: {model.ollama_model_name}</p>
            )}
            {model.eval_metrics && (
              <div className="model-metrics">
                {Object.entries(model.eval_metrics).slice(0, 3).map(([key, value]) => (
                  <span key={key}>
                    {key}: {typeof value === 'number' ? value.toFixed(2) : value}
                  </span>
                ))}
              </div>
            )}
            <div className="model-footer">
              <span className="model-date">{new Date(model.created_at).toLocaleDateString()}</span>
              <div className="model-actions">
                <button
                  onClick={() => handleEvaluate(model.model_id)}
                  disabled={evaluating === model.model_id}
                  className="action-btn"
                >
                  {evaluating === model.model_id ? 'Evaluating...' : 'Evaluate'}
                </button>
                {!model.is_active && (
                  <button onClick={() => handleActivate(model.model_id)} className="action-btn primary">
                    Activate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Feedbacks Tab
// ============================================================

function FeedbacksTab({
  feedbacks,
  stats,
  onRefresh,
}: {
  feedbacks: Feedback[]
  stats: FeedbackStats | null
  onRefresh: () => void
}) {
  return (
    <div className="agent-lab-feedbacks">
      <div className="section-header">
        <h3>Feedbacks</h3>
        <button onClick={onRefresh} className="refresh-btn">Refresh</button>
      </div>

      {stats && (
        <div className="feedback-stats">
          <div className="stat">
            <span className="stat-value">{stats.total_feedbacks}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.accepted_feedbacks}</span>
            <span className="stat-label">Accepted</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.high_rating_count}</span>
            <span className="stat-label">High Rating (4-5)</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.unused_for_training}</span>
            <span className="stat-label">Unused</span>
          </div>
        </div>
      )}
      
      <div className="feedbacks-list">
        {feedbacks.map((fb) => (
          <div key={fb.feedback_id} className="feedback-item">
            <div className="feedback-header">
              <span className="feedback-type">{fb.feedback_type}</span>
              {fb.rating && (
                <span className="feedback-rating">
                  {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                </span>
              )}
              {fb.is_accepted && <span className="feedback-accepted">✓ Accepted</span>}
            </div>
            <div className="feedback-prompt">{fb.input_prompt.slice(0, 200)}...</div>
            <div className="feedback-footer">
              <span>{new Date(fb.created_at).toLocaleString()}</span>
              {fb.used_for_training && <span className="used-badge">Used for training</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Modals
// ============================================================

function NewTrainingModal({
  onClose,
  onSuccess,
  datasets,
}: {
  onClose: () => void
  onSuccess: () => void
  datasets: Dataset[]
}) {
  const [name, setName] = useState('')
  const [baseModel, setBaseModel] = useState('codellama/CodeLlama-7b-hf')
  const [datasetId, setDatasetId] = useState<number | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await trainingApiService.startTraining({
        name,
        base_model: baseModel,
        dataset_id: datasetId,
      })
      onSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to start training')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>New Training Run</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., codegen-v1.0"
                required
              />
            </div>
            <div className="form-group">
              <label>Base Model</label>
              <select value={baseModel} onChange={(e) => setBaseModel(e.target.value)}>
                <option value="codellama/CodeLlama-7b-hf">CodeLlama 7B</option>
                <option value="codellama/CodeLlama-13b-hf">CodeLlama 13B</option>
                <option value="deepseek-ai/deepseek-coder-6.7b-instruct">DeepSeek Coder 6.7B</option>
                <option value="WizardLM/WizardCoder-Python-7B-V1.0">WizardCoder 7B</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dataset</label>
              <select
                value={datasetId || ''}
                onChange={(e) => setDatasetId(e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Select dataset...</option>
                {datasets.filter(d => d.status === 'ready').map((ds) => (
                  <option key={ds.dataset_id} value={ds.dataset_id}>
                    {ds.name} v{ds.version} ({ds.total_samples} samples)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Starting...' : 'Start Training'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function BuildDatasetModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('codegen')
  const [version, setVersion] = useState('v1.0')
  const [minRating, setMinRating] = useState(3)
  const [acceptedOnly, setAcceptedOnly] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await trainingApiService.buildDataset({
        name,
        version,
        source_type: 'feedbacks',
        feedback_filters: {
          min_rating: minRating,
          is_accepted: acceptedOnly,
        },
        dedup_enabled: true,
      })
      onSuccess()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to build dataset')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Build Dataset</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dataset name"
                required
              />
            </div>
            <div className="form-group">
              <label>Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g., v1.0"
                required
              />
            </div>
            <div className="form-group">
              <label>Minimum Rating</label>
              <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                <option value={1}>1+ stars</option>
                <option value={2}>2+ stars</option>
                <option value={3}>3+ stars</option>
                <option value={4}>4+ stars</option>
                <option value={5}>5 stars only</option>
              </select>
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={acceptedOnly}
                  onChange={(e) => setAcceptedOnly(e.target.checked)}
                />
                Accepted feedbacks only
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Building...' : 'Build Dataset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TrainingDetailModal({
  run,
  onClose,
}: {
  run: TrainingRun
  onClose: () => void
}) {
  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>Training Run: {run.name}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Run ID</label>
              <span>{run.run_id}</span>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <StatusBadge status={run.status} />
            </div>
            <div className="detail-item">
              <label>Base Model</label>
              <span>{run.base_model}</span>
            </div>
            <div className="detail-item">
              <label>Model Type</label>
              <span>{run.model_type}</span>
            </div>
            <div className="detail-item">
              <label>Created</label>
              <span>{new Date(run.created_at).toLocaleString()}</span>
            </div>
            {run.started_at && (
              <div className="detail-item">
                <label>Started</label>
                <span>{new Date(run.started_at).toLocaleString()}</span>
              </div>
            )}
            {run.completed_at && (
              <div className="detail-item">
                <label>Completed</label>
                <span>{new Date(run.completed_at).toLocaleString()}</span>
              </div>
            )}
            {run.duration_seconds && (
              <div className="detail-item">
                <label>Duration</label>
                <span>{Math.round(run.duration_seconds / 60)} minutes</span>
              </div>
            )}
            {run.output_model_path && (
              <div className="detail-item full">
                <label>Output Path</label>
                <span>{run.output_model_path}</span>
              </div>
            )}
          </div>
          
          {run.hyperparameters && (
            <div className="detail-section">
              <h4>Hyperparameters</h4>
              <pre>{JSON.stringify(run.hyperparameters, null, 2)}</pre>
            </div>
          )}
          
          {run.metrics && (
            <div className="detail-section">
              <h4>Metrics</h4>
              <pre>{JSON.stringify(run.metrics, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Shared Components
// ============================================================

function StatusBadge({ status }: { status: string }) {
  const getStatusClass = () => {
    switch (status) {
      case 'completed':
      case 'ready':
        return 'success'
      case 'running':
      case 'building':
        return 'running'
      case 'failed':
        return 'error'
      case 'cancelled':
      case 'archived':
        return 'cancelled'
      default:
        return 'pending'
    }
  }

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status}
    </span>
  )
}
