import { useCallback } from 'react'
import './SaveDagModal.css'

export interface SaveDagModalProps {
  open: boolean
  dagName: string
  onClose: () => void
  onSave: () => void
  onNameChange: (name: string) => void
  isLoading?: boolean
}

function SaveDagModal({
  open,
  dagName,
  onClose,
  onSave,
  onNameChange,
  isLoading = false,
}: SaveDagModalProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && dagName?.trim()) {
        onSave()
      } else if (e.key === 'Escape') {
        onClose()
      }
    },
    [onSave, onClose, dagName]
  )

  const isDisabled = !dagName?.trim() || isLoading

  if (!open) return null

  return (
    <div className="save-dag-modal-overlay">
      <div className="save-dag-modal-backdrop" onClick={onClose} />
      <div className="save-dag-modal">
        <div className="save-dag-modal-header">
          <h3>Save DAG</h3>
          <p>Please enter a name for this DAG.</p>
          <button onClick={onClose} className="save-dag-modal-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="save-dag-modal-body">
          <div className="save-dag-modal-input-group">
            <label>
              DAG Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={dagName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter DAG name"
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>

        <div className="save-dag-modal-footer">
          <button
            onClick={onSave}
            disabled={isDisabled}
            className="save-dag-modal-save"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="save-dag-modal-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveDagModal
