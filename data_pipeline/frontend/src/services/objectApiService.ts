/**
 * Object API Service
 */

import { config } from '../config/env'
import { log } from '../utils/logger'

export interface Object {
  o_id: string
  label: string
  type: string
  params?: Record<string, any>
  x?: number
  y?: number
  target?: number
}

export interface ObjectRequest {
  label: string
  type?: string
  params?: Record<string, any>
  f_id?: string
  x?: number
  y?: number
  target?: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export async function getObjects(flowId?: string): Promise<ApiResponse<Object[]>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    let url = `${baseUrl}/objects`
    
    if (flowId) {
      url = `${baseUrl}/objects/flow/${flowId}`
    }
    
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

    const data: Object[] = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to fetch objects', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function createObject(object: ObjectRequest): Promise<ApiResponse<Object>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/objects`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(object),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data: Object = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to create object', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function updateObject(id: string, object: ObjectRequest): Promise<ApiResponse<Object>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/objects/${id}`
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(object),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      return { success: false, message: error.error || `HTTP ${response.status}` }
    }

    const data: Object = await response.json()
    return { success: true, data }
  } catch (error) {
    log.error('Failed to update object', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export async function deleteObject(id: string): Promise<ApiResponse<void>> {
  try {
    const baseUrl = config.apiUrl || '/api'
    const url = `${baseUrl}/objects/${id}`
    
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

    return { success: true }
  } catch (error) {
    log.error('Failed to delete object', error)
    return { success: false, message: error instanceof Error ? error.message : '알 수 없는 오류' }
  }
}

export const objectApiService = {
  getObjects,
  createObject,
  updateObject,
  deleteObject,
}
