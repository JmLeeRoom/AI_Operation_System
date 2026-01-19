import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import DagPage from './components/DagPage'
import AgentLab from './components/AgentLab'
import './App.css'

type View = 'dag' | 'agentlab'

function App() {
  const [currentView, setCurrentView] = useState<View>('dag')

  return (
    <div className="app-container">
      {/* Global Navigation */}
      <nav className="app-nav">
        <div className="app-nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span>Data Pipeline</span>
        </div>
        <div className="app-nav-tabs">
          <button
            className={`app-nav-tab ${currentView === 'dag' ? 'active' : ''}`}
            onClick={() => setCurrentView('dag')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            DAG Editor
          </button>
          <button
            className={`app-nav-tab ${currentView === 'agentlab' ? 'active' : ''}`}
            onClick={() => setCurrentView('agentlab')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v10M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h10M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24" />
            </svg>
            Agent Lab
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'dag' ? (
          <ReactFlowProvider>
            <DagPage />
          </ReactFlowProvider>
        ) : (
          <AgentLab />
        )}
      </main>
    </div>
  )
}

export default App
