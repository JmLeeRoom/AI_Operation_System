import { useState, useCallback, useEffect } from 'react'
import './SaveNodePanel.css'
import { objectApiService } from '../../services/objectApiService'
import { log } from '../../utils/logger'

export interface SaveNodePanelProps {
  open: boolean
  onClose: () => void
  nodeId: string
  nodeName?: string
  initialConfig?: SaveNodeConfig
  onConfigChange?: (config: SaveNodeConfig) => void
  objectId?: string
  flowId?: string | null
  onObjectIdChange?: (objectId: string) => void
}

export interface SaveNodeConfig {
  saveFormat: 'file' | 'database' | 'api'
  filePath?: string
  fileFormat?: 'csv' | 'json' | 'parquet' | 'excel'
  databaseConnection?: string
  databaseTable?: string
  databaseMode?: 'append' | 'overwrite' | 'upsert'
  apiUrl?: string
  apiMethod?: 'POST' | 'PUT'
  apiHeaders?: Record<string, string>
  inputVariable?: string
}

function SaveNodePanel({
  open,
  onClose,
  nodeId,
  nodeName,
  initialConfig,
  onConfigChange,
  objectId,
  flowId,
  onObjectIdChange,
}: SaveNodePanelProps) {
  const [config, setConfig] = useState<SaveNodeConfig>(
    initialConfig || {
      saveFormat: 'file',
      fileFormat: 'csv',
      inputVariable: 'data',
    }
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig)
    }
  }, [initialConfig])

  const handleConfigChange = useCallback(
    (newConfig: Partial<SaveNodeConfig>) => {
      const updatedConfig = { ...config, ...newConfig }
      setConfig(updatedConfig)
      onConfigChange?.(updatedConfig)
    },
    [config, onConfigChange]
  )

  const handleSave = useCallback(async () => {
    if (!flowId) {
      setError('Please save the DAG first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = {
        type: 'save',
        config: config,
      }

      if (!objectId) {
        // Create new object
        const createResult = await objectApiService.createObject({
          label: nodeName || nodeId,
          type: 'save',
          f_id: flowId,
          params: params,
        })

        if (createResult.success && createResult.data) {
          onObjectIdChange?.(createResult.data.o_id)
          log.success('Save node saved', { objectId: createResult.data.o_id, nodeId })
        } else {
          throw new Error(createResult.message || 'Failed to create object')
        }
      } else {
        // Update existing object
        const updateResult = await objectApiService.updateObject(objectId, {
          label: nodeName || nodeId,
          type: 'save',
          params: params,
        })

        if (!updateResult.success) {
          throw new Error(updateResult.message || 'Failed to update object')
        }
        log.success('Save node updated', { objectId, nodeId })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      log.error('Failed to save save node', err)
    } finally {
      setIsLoading(false)
    }
  }, [objectId, flowId, nodeId, nodeName, config, onObjectIdChange])

  if (!open) return null

  return (
    <div className="save-node-panel-overlay">
      <div className="save-node-panel-backdrop" onClick={onClose} />
      <div className="save-node-panel">
        <div className="save-node-panel-header">
          <div className="save-node-panel-header-left">
            <div className="save-node-panel-icon">💾</div>
            <div>
              <h3 className="save-node-panel-title">Save Node</h3>
              <p className="save-node-panel-subtitle">{nodeName || nodeId}</p>
            </div>
          </div>
          <button onClick={onClose} className="save-node-panel-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="save-node-panel-content">
          <div className="save-node-panel-section">
            <label className="save-node-panel-label">Input Variable Name</label>
            <input
              type="text"
              value={config.inputVariable || 'data'}
              onChange={(e) => handleConfigChange({ inputVariable: e.target.value })}
              placeholder="data"
              className="save-node-panel-input"
            />
            <p className="save-node-panel-hint">
              Variable name from upstream nodes (e.g., from Python node output)
            </p>
          </div>

          <div className="save-node-panel-section">
            <label className="save-node-panel-label">Save Format</label>
            <select
              value={config.saveFormat}
              onChange={(e) => handleConfigChange({ saveFormat: e.target.value as SaveNodeConfig['saveFormat'] })}
              className="save-node-panel-select"
            >
              <option value="file">File</option>
              <option value="database">Database</option>
              <option value="api">API</option>
            </select>
          </div>

          {config.saveFormat === 'file' && (
            <>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">File Path</label>
                <input
                  type="text"
                  value={config.filePath || ''}
                  onChange={(e) => handleConfigChange({ filePath: e.target.value })}
                  placeholder="/path/to/output.csv"
                  className="save-node-panel-input"
                />
              </div>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">File Format</label>
                <select
                  value={config.fileFormat || 'csv'}
                  onChange={(e) => handleConfigChange({ fileFormat: e.target.value as SaveNodeConfig['fileFormat'] })}
                  className="save-node-panel-select"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="parquet">Parquet</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </>
          )}

          {config.saveFormat === 'database' && (
            <>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">Connection String</label>
                <input
                  type="text"
                  value={config.databaseConnection || ''}
                  onChange={(e) => handleConfigChange({ databaseConnection: e.target.value })}
                  placeholder="postgresql://user:pass@host:port/db"
                  className="save-node-panel-input"
                />
              </div>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">Table Name</label>
                <input
                  type="text"
                  value={config.databaseTable || ''}
                  onChange={(e) => handleConfigChange({ databaseTable: e.target.value })}
                  placeholder="output_table"
                  className="save-node-panel-input"
                />
              </div>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">Save Mode</label>
                <select
                  value={config.databaseMode || 'append'}
                  onChange={(e) => handleConfigChange({ databaseMode: e.target.value as SaveNodeConfig['databaseMode'] })}
                  className="save-node-panel-select"
                >
                  <option value="append">Append</option>
                  <option value="overwrite">Overwrite</option>
                  <option value="upsert">Upsert</option>
                </select>
                <p className="save-node-panel-hint">
                  Append: Add new rows | Overwrite: Replace table | Upsert: Update existing, insert new
                </p>
              </div>
            </>
          )}

          {config.saveFormat === 'api' && (
            <>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">API URL</label>
                <input
                  type="text"
                  value={config.apiUrl || ''}
                  onChange={(e) => handleConfigChange({ apiUrl: e.target.value })}
                  placeholder="https://api.example.com/save"
                  className="save-node-panel-input"
                />
              </div>
              <div className="save-node-panel-section">
                <label className="save-node-panel-label">HTTP Method</label>
                <select
                  value={config.apiMethod || 'POST'}
                  onChange={(e) => handleConfigChange({ apiMethod: e.target.value as 'POST' | 'PUT' })}
                  className="save-node-panel-select"
                >
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="save-node-panel-error">
              {error}
            </div>
          )}
        </div>

        <div className="save-node-panel-footer">
          <button
            onClick={handleSave}
            disabled={isLoading || !flowId}
            className="save-node-panel-button save-node-panel-button-save"
            title={!flowId ? 'Please save the DAG first' : 'Save configuration (Ctrl+S)'}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="save-node-panel-button save-node-panel-button-cancel"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SaveNodePanel
