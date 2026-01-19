import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import './BaseNode.css'

export interface BaseNodeData {
  label?: string
  type?: string
  code?: string
  onDeleteNode?: (nodeId: string) => void
  [key: string]: unknown
}

export interface BaseNodeProps {
  id?: string
  data: BaseNodeData
  selected?: boolean
  type?: string
}

const iconMap: Record<string, string> = {
  python: '🐍',
  data: '📊',
  save: '💾',
}

function BaseNode({ data, selected = false, type }: BaseNodeProps) {
  const nodeType = type || data?.type || 'default'
  const label = data?.label || nodeType.charAt(0).toUpperCase() + nodeType.slice(1)
  const icon = iconMap[nodeType.toLowerCase()] || '⚙️'
  const hasInputHandle = nodeType !== 'manual'

  return (
    <div className={`base-node ${selected ? 'selected' : ''}`}>
      <div className="base-node-content">
        <div className="base-node-icon">{icon}</div>
        <div className="base-node-label">{label}</div>
      </div>

      {hasInputHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className="base-node-handle base-node-handle-target"
        />
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="base-node-handle base-node-handle-source"
      />
    </div>
  )
}

export default memo(BaseNode)
