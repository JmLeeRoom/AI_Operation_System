import { config } from '../config/env'
import { log } from '../utils/logger'

export interface AIAgentRequest {
  code?: string
  instruction: string
  action: 'generate' | 'modify' | 'explain'
}

export interface AIAgentResponse {
  success: boolean
  code?: string
  message?: string
  error?: string
}

export async function generateCode(request: AIAgentRequest): Promise<AIAgentResponse> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/ai/generate`
    
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

    const data: AIAgentResponse = await response.json()
    return data
  } catch (error) {
    log.error('Failed to generate code via AI Agent', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    }
  }
}

export const aiAgentService = {
  generateCode,
}
