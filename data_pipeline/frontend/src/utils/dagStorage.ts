import type { Node, Edge } from 'reactflow'
import { log } from './logger'

export interface SavedDag {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'data_pipeline_saved_dags'

export function getSavedDags(): SavedDag[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const dags = JSON.parse(stored)
    log.debug('Loaded saved DAGs', { count: dags.length })
    return dags
  } catch (error) {
    log.error('Failed to load saved DAGs', error)
    return []
  }
}

export function saveDag(name: string, nodes: Node[], edges: Edge[]): SavedDag {
  const dags = getSavedDags()
  const now = new Date().toISOString()
  
  const newDag: SavedDag = {
    id: `dag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    nodes,
    edges,
    createdAt: now,
    updatedAt: now,
  }

  const existingIndex = dags.findIndex((dag) => dag.name === name)
  if (existingIndex >= 0) {
    dags[existingIndex] = {
      ...dags[existingIndex],
      ...newDag,
      createdAt: dags[existingIndex].createdAt,
      updatedAt: now,
    }
  } else {
    dags.push(newDag)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dags))
  log.success('DAG saved', { id: newDag.id, name: newDag.name, nodeCount: nodes.length })
  return newDag
}

export function deleteDag(id: string): boolean {
  try {
    const dags = getSavedDags()
    const filtered = dags.filter((dag) => dag.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    log.info('DAG deleted', { id })
    return true
  } catch (error) {
    log.error('Failed to delete DAG', error, { id })
    return false
  }
}

export function loadDag(id: string): SavedDag | null {
  const dags = getSavedDags()
  return dags.find((dag) => dag.id === id) || null
}
