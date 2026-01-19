/**
 * Jupyter API Service
 */

import { config } from '../config/env'
import { log } from '../utils/logger'

export interface JupyterExecuteRequest {
  code: string
  username?: string
}

export interface JupyterExecuteResponse {
  success: boolean
  output: string
  error?: string
}

export async function executePythonCode(
  request: JupyterExecuteRequest
): Promise<JupyterExecuteResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/python/execute`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: request.code,
        username: request.username || 'default',
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return {
        success: false,
        output: '',
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: JupyterExecuteResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to execute Python code via Jupyter', error)
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export interface JupyterDebugRequest {
  code: string
  username?: string
  breakpoints: number[]
}

export interface JupyterDebugResponse {
  success: boolean
  output: string
  error?: string
  paused: boolean
  currentLine: number
  variables: Record<string, any>
}

export async function debugPythonCode(
  request: JupyterDebugRequest
): Promise<JupyterDebugResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/python/debug`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: request.code,
        username: request.username || 'default',
        breakpoints: request.breakpoints,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return {
        success: false,
        output: '',
        paused: false,
        currentLine: 0,
        variables: {},
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: JupyterDebugResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to debug Python code via Jupyter', error)
    return {
      success: false,
      output: '',
      paused: false,
      currentLine: 0,
      variables: {},
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export interface DebugSessionRequest {
  sessionId?: string
  code?: string
  breakpoints?: number[]
  action: 'start' | 'continue' | 'step_over' | 'step_into' | 'step_out' | 'set_variable' | 'get_session'
  variable?: string
  value?: string
}

export interface DebugSessionResponse {
  success: boolean
  sessionId?: string
  currentLine: number
  variables: Record<string, any>
  callStack: Array<{
    name: string
    file: string
    line: number
    variables: Record<string, any>
  }>
  output: string
  isPaused: boolean
  isFinished: boolean
  error?: string
}

export async function debugSessionControl(
  request: DebugSessionRequest
): Promise<DebugSessionResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/python/debug/session`
    
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
        currentLine: 0,
        variables: {},
        callStack: [],
        output: '',
        isPaused: false,
        isFinished: false,
        error: error.error || `HTTP ${response.status}`,
      }
    }

    const data: DebugSessionResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to control debug session', error)
    return {
      success: false,
      currentLine: 0,
      variables: {},
      callStack: [],
      output: '',
      isPaused: false,
      isFinished: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export async function deleteDebugSession(sessionId: string): Promise<boolean> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/python/debug/session?sessionId=${encodeURIComponent(sessionId)}`
    
    const response = await fetch(url, {
      method: 'DELETE',
    })

    return response.ok
  } catch (error) {
    log.error('Failed to delete debug session', error)
    return false
  }
}

export const jupyterApiService = {
  executePythonCode,
  debugPythonCode,
  debugSessionControl,
  deleteDebugSession,
}
