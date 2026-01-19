import { useState, useCallback } from 'react'
import './SlideMenu.css'

export interface SlideMenuProps {
  isOpen: boolean
  onClose: () => void
  onNodeSelect: (nodeType: string) => void
}

// 노드 타입 목록
const menuItems = [
  { id: 'data', label: 'Data', type: 'data', icon: '📊', description: 'Load data from various sources' },
  { id: 'python', label: 'Python', type: 'python', icon: '🐍', description: 'Process data with Python code' },
  { id: 'save', label: 'Save', type: 'save', icon: '💾', description: 'Save processed data' },
]

function SlideMenu({ isOpen, onClose, onNodeSelect }: SlideMenuProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleNodeClick = useCallback(
    (nodeType: string) => {
      onNodeSelect(nodeType)
      onClose()
    },
    [onNodeSelect, onClose]
  )

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <>
      <div className="slide-menu-backdrop" onClick={onClose} />
      <div className="slide-menu-panel">
        <div className="slide-menu-header">
          <h2>Add Node</h2>
          <button onClick={onClose} className="slide-menu-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="slide-menu-search">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nodes..."
            className="slide-menu-search-input"
          />
        </div>

        <div className="slide-menu-items">
          {filteredItems.length === 0 ? (
            <div className="slide-menu-empty">No nodes found</div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNodeClick(item.type)}
                className="slide-menu-item"
                title={item.description}
              >
                <span className="slide-menu-item-icon">{item.icon}</span>
                <div className="slide-menu-item-content">
                  <span className="slide-menu-item-label">{item.label}</span>
                  {item.description && (
                    <span className="slide-menu-item-description">{item.description}</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default SlideMenu
