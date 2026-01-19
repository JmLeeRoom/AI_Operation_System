/**
 * K8s API Service
 */

import { config } from '../config/env'
import { log } from '../utils/logger'

export interface K8sRequestDTO {
  flowId: string
  user: string
  steps: number[]
  namespace?: string
}

export interface ProgressEvent {
  phase: string
  message: string
  ok: boolean
  data?: Record<string, any>
}

export type ProgressCallback = (event: ProgressEvent) => void

export async function deployFlow(
  request: K8sRequestDTO,
  onProgress: ProgressCallback,
  onError?: (error: Error) => void
): Promise<AbortController> {
  const baseUrl = config.apiUrl || '/api'
  const url = `${baseUrl}/k8s/deploy/stream?op=deploy&createNamespaceIfMissing=true&verifyTimeoutSeconds=40`
  
  const abortController = new AbortController()

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        FlowID: request.flowId,
        User: request.user,
        Steps: request.steps,
      }),
      signal: abortController.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6))
            onProgress({
              phase: data.phase || 'unknown',
              message: data.message || '',
              ok: data.ok !== false,
              data: data.data,
            })
          } catch (e) {
            log.warn('Failed to parse SSE event', { line, error: e })
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      log.info('Deployment cancelled')
      return abortController
    }
    
    log.error('Deployment failed', error)
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error'))
    }
  }

  return abortController
}

export async function deleteK8sResources(flowId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/k8s/delete?flowId=${flowId}`
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data = await response.json().catch(() => ({}))
    return { success: true, message: data.message }
  } catch (error) {
    log.error('Failed to delete K8s resources', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export const k8sApiService = {
  deployFlow,
  deleteK8sResources,
}
