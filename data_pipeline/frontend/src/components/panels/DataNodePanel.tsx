import { useState, useCallback, useEffect } from 'react'
import './DataNodePanel.css'
import { objectApiService } from '../../services/objectApiService'
import { dataApiService } from '../../services/dataApiService'
import { log } from '../../utils/logger'

export interface DataNodePanelProps {
  open: boolean
  onClose: () => void
  nodeId: string
  nodeName?: string
  initialConfig?: DataNodeConfig
  onConfigChange?: (config: DataNodeConfig) => void
  objectId?: string
  flowId?: string | null
  onObjectIdChange?: (objectId: string) => void
}

export interface DataNodeConfig {
  dataSource: 'file' | 'database' | 'api' | 'manual'
  filePath?: string
  fileFormat?: 'csv' | 'json' | 'parquet' | 'excel'
  databaseConnection?: string
  databaseQuery?: string
  apiUrl?: string
  apiMethod?: 'GET' | 'POST'
  apiHeaders?: Record<string, string>
  apiBody?: string
  manualData?: string
  outputVariable?: string
}

function DataNodePanel({
  open,
  onClose,
  nodeId,
  nodeName,
  initialConfig,
  onConfigChange,
  objectId,
  flowId,
  onObjectIdChange,
}: DataNodePanelProps) {
  const [config, setConfig] = useState<DataNodeConfig>(
    initialConfig || {
      dataSource: 'file',
      fileFormat: 'csv',
      outputVariable: 'data',
    }
  )
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig)
    }
  }, [initialConfig])

  const handleConfigChange = useCallback(
    (newConfig: Partial<DataNodeConfig>) => {
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
        type: 'data',
        config: config,
      }

      if (!objectId) {
        // Create new object
        const createResult = await objectApiService.createObject({
          label: nodeName || nodeId,
          type: 'data',
          f_id: flowId,
          params: params,
        })

        if (createResult.success && createResult.data) {
          onObjectIdChange?.(createResult.data.o_id)
          log.success('Data node saved', { objectId: createResult.data.o_id, nodeId })
        } else {
          throw new Error(createResult.message || 'Failed to create object')
        }
      } else {
        // Update existing object
        const updateResult = await objectApiService.updateObject(objectId, {
          label: nodeName || nodeId,
          type: 'data',
          params: params,
        })

        if (!updateResult.success) {
          throw new Error(updateResult.message || 'Failed to update object')
        }
        log.success('Data node updated', { objectId, nodeId })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      log.error('Failed to save data node', err)
    } finally {
      setIsLoading(false)
    }
  }, [objectId, flowId, nodeId, nodeName, config, onObjectIdChange])

  const handlePreview = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setPreview('')

    try {
      if (config.dataSource === 'file') {
        if (!config.filePath) {
          setError('Please enter a file path')
          return
        }
        const result = await dataApiService.previewFile({
          filePath: config.filePath,
          format: config.fileFormat || 'csv',
        })
        if (result.success) {
          setPreview(result.preview || 'No preview available')
          log.info('File preview loaded', { path: config.filePath })
        } else {
          setError(result.error || 'Failed to load preview')
        }
      } else if (config.dataSource === 'manual') {
        if (config.manualData) {
          try {
            const parsed = JSON.parse(config.manualData)
            setPreview(JSON.stringify(parsed, null, 2).slice(0, 500))
          } catch {
            setError('Invalid JSON data')
          }
        } else {
          setError('Please enter manual data')
        }
      } else {
        setPreview('Preview not available for this data source')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview')
    } finally {
      setIsLoading(false)
    }
  }, [config])

  if (!open) return null

  return (
    <div className="data-node-panel-overlay">
      <div className="data-node-panel-backdrop" onClick={onClose} />
      <div className="data-node-panel">
        <div className="data-node-panel-header">
          <div className="data-node-panel-header-left">
            <div className="data-node-panel-icon">📊</div>
            <div>
              <h3 className="data-node-panel-title">Data Node</h3>
              <p className="data-node-panel-subtitle">{nodeName || nodeId}</p>
            </div>
          </div>
          <button onClick={onClose} className="data-node-panel-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="data-node-panel-content">
          <div className="data-node-panel-section">
            <label className="data-node-panel-label">Data Source</label>
            <select
              value={config.dataSource}
              onChange={(e) => handleConfigChange({ dataSource: e.target.value as DataNodeConfig['dataSource'] })}
              className="data-node-panel-select"
            >
              <option value="file">File</option>
              <option value="database">Database</option>
              <option value="api">API</option>
              <option value="manual">Manual Input</option>
            </select>
          </div>

          {config.dataSource === 'file' && (
            <>
              <div className="data-node-panel-section">
                <label className="data-node-panel-label">File Path</label>
                <input
                  type="text"
                  value={config.filePath || ''}
                  onChange={(e) => handleConfigChange({ filePath: e.target.value })}
                  placeholder="/path/to/file.csv"
                  className="data-node-panel-input"
                />
              </div>
              <div className="data-node-panel-section">
                <label className="data-node-panel-label">File Format</label>
                <select
                  value={config.fileFormat || 'csv'}
                  onChange={(e) => handleConfigChange({ fileFormat: e.target.value as DataNodeConfig['fileFormat'] })}
                  className="data-node-panel-select"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="parquet">Parquet</option>
                  <option value="excel">Excel</option>
                </select>
              </div>
            </>
          )}

          {config.dataSource === 'database' && (
            <>
              <div className="data-node-panel-section">
                <label className="data-node-panel-label">Connection String</label>
                <input
                  type="text"
                  value={config.databaseConnection || ''}
                  onChange={(e) => handleConfigChange({ databaseConnection: e.target.value })}
                  placeholder="postgresql://user:pass@host:port/db"
                  className="data-node-panel-input"
                />
              </div>
              <div className="data-node-panel-section">
                <label className="data-node-panel-label">SQL Query</label>
                <textarea
                  value={config.databaseQuery || ''}
                  onChange={(e) => handleConfigChange({ databaseQuery: e.target.value })}
                  placeholder="SELECT * FROM table WHERE ..."
                  rows={6}
                  className="data-node-panel-textarea"
                />
              </div>
            </>
          )}

          {config.dataSource === 'api' && (
            <>
              <div className="data-node-panel-section">
                <label className="data-node-panel-label">API URL</label>
                <input
                  type="text"
                  value={config.apiUrl || ''}
                  onChange={(e) => handleConfigChange({ apiUrl: e.target.value })}
                  placeholder="https://api.example.com/data"
                  className="data-node-panel-input"
                />
              </div>
              <div className="data-node-panel-section">
                <label className="data-node-panel-label">HTTP Method</label>
                <select
                  value={config.apiMethod || 'GET'}
                  onChange={(e) => handleConfigChange({ apiMethod: e.target.value as 'GET' | 'POST' })}
                  className="data-node-panel-select"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>
              </div>
              {config.apiMethod === 'POST' && (
                <div className="data-node-panel-section">
                  <label className="data-node-panel-label">Request Body (JSON)</label>
                  <textarea
                    value={config.apiBody || ''}
                    onChange={(e) => handleConfigChange({ apiBody: e.target.value })}
                    placeholder='{"key": "value"}'
                    rows={4}
                    className="data-node-panel-textarea"
                  />
                </div>
              )}
            </>
          )}

          {config.dataSource === 'manual' && (
            <div className="data-node-panel-section">
              <label className="data-node-panel-label">Data (JSON)</label>
              <textarea
                value={config.manualData || ''}
                onChange={(e) => handleConfigChange({ manualData: e.target.value })}
                placeholder='[{"col1": "value1", "col2": "value2"}]'
                rows={8}
                className="data-node-panel-textarea"
              />
            </div>
          )}

          <div className="data-node-panel-section">
            <label className="data-node-panel-label">Output Variable Name</label>
            <input
              type="text"
              value={config.outputVariable || 'data'}
              onChange={(e) => handleConfigChange({ outputVariable: e.target.value })}
              placeholder="data"
              className="data-node-panel-input"
            />
            <p className="data-node-panel-hint">
              This variable will be available in downstream Python nodes
            </p>
          </div>

          {error && (
            <div className="data-node-panel-error">
              {error}
            </div>
          )}

          {preview && (
            <div className="data-node-panel-preview">
              <div className="data-node-panel-preview-header">Preview</div>
              <pre className="data-node-panel-preview-content">{preview}</pre>
            </div>
          )}
        </div>

        <div className="data-node-panel-footer">
          <button
            onClick={handlePreview}
            disabled={isLoading}
            className="data-node-panel-button data-node-panel-button-preview"
          >
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !flowId}
            className="data-node-panel-button data-node-panel-button-save"
            title={!flowId ? 'Please save the DAG first' : 'Save configuration (Ctrl+S)'}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="data-node-panel-button data-node-panel-button-cancel"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataNodePanel
