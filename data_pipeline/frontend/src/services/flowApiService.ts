/**
 * Flow API Service
 */

import { config } from '../config/env'
import { log } from '../utils/logger'

export interface Flow {
  f_id: string
  name: string
  run_type: string
  lastest_run?: string
  saved_at: string
}

export interface FlowRequest {
  name: string
  run_type: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export async function getFlows(): Promise<ApiResponse<Flow[]>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/flows`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data: Flow[] = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to fetch flows', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function createFlow(flow: FlowRequest): Promise<ApiResponse<Flow>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/flows`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flow),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data: Flow = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to create flow', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function getFlow(id: string): Promise<ApiResponse<Flow>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/flows/${id}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data: Flow = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to fetch flow', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function updateFlow(id: string, flow: FlowRequest): Promise<ApiResponse<Flow>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/flows/${id}`
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flow),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data: Flow = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to update flow', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export const flowApiService = {
  getFlows,
  createFlow,
  getFlow,
  updateFlow,
}
