import { config } from '../config/env'
import { log } from '../utils/logger'

export interface DataLoadRequest {
  dataSource: 'file' | 'database' | 'api' | 'manual'
  config: Record<string, any>
}

export interface DataLoadResponse {
  success: boolean
  data?: any
  preview?: string
  error?: string
  meta?: Record<string, any>
}

export interface DataSaveRequest {
  data: any
  saveFormat: 'file' | 'database' | 'api'
  config: Record<string, any>
}

export interface DataSaveResponse {
  success: boolean
  path?: string
  message?: string
  error?: string
}

export interface WorkflowExecuteRequest {
  dataConfig: Record<string, any>
  pythonCode: string
  saveConfig: Record<string, any>
}

export interface WorkflowStepResult {
  step: string
  success: boolean
  message: string
  error?: string
}

export interface WorkflowExecuteResponse {
  success: boolean
  steps: WorkflowStepResult[]
  error?: string
  outputPath?: string
}

export interface FilePreviewRequest {
  filePath: string
  format?: string
}

export async function loadData(request: DataLoadRequest): Promise<DataLoadResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/data/load`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return {
        success: false,
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: DataLoadResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to load data', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export async function saveData(request: DataSaveRequest): Promise<DataSaveResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/data/save`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return {
        success: false,
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: DataSaveResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to save data', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export async function previewFile(request: FilePreviewRequest): Promise<DataLoadResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/data/preview`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return {
        success: false,
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: DataLoadResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to preview file', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export async function executeWorkflow(request: WorkflowExecuteRequest): Promise<WorkflowExecuteResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/workflow/execute`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return {
        success: false,
        steps: [],
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: WorkflowExecuteResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to execute workflow', error)
    return {
      success: false,
      steps: [],
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export const dataApiService = {
  loadData,
  saveData,
  previewFile,
  executeWorkflow,
}
