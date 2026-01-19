import { useCallback, useEffect, useState } from 'react'
import './LoadDagModal.css'
import { flowApiService, type Flow } from '../../services/flowApiService'
import { log } from '../../utils/logger'

export interface LoadDagModalProps {
  open: boolean
  onClose: () => void
  onLoad: (flowId: string, flowName: string) => void
}

function LoadDagModal({
  open,
  onClose,
  onLoad,
}: LoadDagModalProps) {
  const [flows, setFlows] = useState<Flow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadFlows()
    }
  }, [open])

  const loadFlows = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await flowApiService.getFlows()
      if (result.success && result.data) {
        setFlows(result.data)
        log.info('Flows loaded', { count: result.data.length })
      } else {
        setError(result.message || 'Failed to load flows')
        log.error('Failed to load flows', new Error(result.message || 'Unknown error'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
      log.error('Failed to load flows', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLoad = useCallback(() => {
    if (selectedFlowId) {
      const selectedFlow = flows.find(f => f.f_id === selectedFlowId)
      if (selectedFlow) {
        onLoad(selectedFlowId, selectedFlow.name)
      }
    }
  }, [selectedFlowId, flows, onLoad])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  if (!open) return null

  return (
    <div className="load-dag-modal-overlay">
      <div className="load-dag-modal-backdrop" onClick={onClose} />
      <div className="load-dag-modal">
        <div className="load-dag-modal-header">
          <h3>Load DAG</h3>
          <p>Select a saved flow to load.</p>
          <button onClick={onClose} className="load-dag-modal-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="load-dag-modal-body">
          {isLoading ? (
            <div className="load-dag-modal-loading">
              <span>Loading flows...</span>
            </div>
          ) : error ? (
            <div className="load-dag-modal-error">
              <span>Error: {error}</span>
              <button onClick={loadFlows} className="load-dag-modal-retry">
                Retry
              </button>
            </div>
          ) : flows.length === 0 ? (
            <div className="load-dag-modal-empty">
              <span>No saved flows found.</span>
            </div>
          ) : (
            <div className="load-dag-modal-list" onKeyDown={handleKeyDown}>
              {flows.map((flow) => (
                <div
                  key={flow.f_id}
                  className={`load-dag-modal-item ${selectedFlowId === flow.f_id ? 'selected' : ''}`}
                  onClick={() => setSelectedFlowId(flow.f_id)}
                >
                  <div className="load-dag-modal-item-name">{flow.name}</div>
                  <div className="load-dag-modal-item-meta">
                    <span>ID: {flow.f_id}</span>
                    {flow.saved_at && (
                      <span>Saved: {new Date(flow.saved_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="load-dag-modal-footer">
          <button
            onClick={handleLoad}
            disabled={!selectedFlowId || isLoading}
            className="load-dag-modal-load"
          >
            Load
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="load-dag-modal-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoadDagModal
