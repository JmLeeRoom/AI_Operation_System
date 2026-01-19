import { useState, useCallback, useEffect, useRef } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import './PythonNodePanel.css'
import { objectApiService } from '../../services/objectApiService'
import { jupyterApiService } from '../../services/jupyterApiService'
import { aiAgentService } from '../../services/aiAgentService'
import { dataApiService } from '../../services/dataApiService'
import { log } from '../../utils/logger'

export interface ConnectedDataConfig {
  dataSource?: string
  filePath?: string
  fileFormat?: string
  outputVariable?: string
}

export interface PythonNodePanelProps {
  open: boolean
  onClose: () => void
  nodeId: string
  nodeName?: string
  initialCode?: string
  onCodeChange?: (code: string) => void
  objectId?: string
  flowId?: string | null
  onObjectIdChange?: (objectId: string) => void
  connectedDataConfig?: ConnectedDataConfig
}

function PythonNodePanel({
  open,
  onClose,
  nodeId,
  nodeName,
  initialCode = '',
  onCodeChange,
  objectId,
  flowId,
  onObjectIdChange,
  connectedDataConfig,
}: PythonNodePanelProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set())
  const [currentLine, setCurrentLine] = useState<number | null>(null)
  const [isDebugging, setIsDebugging] = useState(false)
  const [debugPaused, setDebugPaused] = useState(false)
  const [debugVariables, setDebugVariables] = useState<Record<string, any>>({})
  const [debugSessionId, setDebugSessionId] = useState<string | null>(null)
  const [callStack, setCallStack] = useState<Array<{name: string; file: string; line: number; variables: Record<string, any>}>>([])
  const [editingVariable, setEditingVariable] = useState<{name: string; value: string} | null>(null)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiInstruction, setAIInstruction] = useState('')
  const [aiAction, setAIAction] = useState<'generate' | 'modify' | 'explain'>('generate')
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      onCodeChange?.(newCode)
    },
    [onCodeChange]
  )

  const toggleBreakpoint = useCallback((lineNumber: number) => {
    setBreakpoints((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber)
      } else {
        newSet.add(lineNumber)
      }
      return newSet
    })
  }, [])

  // Update Monaco Editor decorations for breakpoints and current line
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    const monaco = monacoRef.current
    const decorations: editor.IModelDeltaDecoration[] = []

    // Add breakpoint decorations (red dots)
    breakpoints.forEach((lineNumber) => {
      decorations.push({
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: 1,
        },
        options: {
          glyphMarginClassName: 'breakpoint-glyph',
          glyphMarginHoverMessage: { value: `Breakpoint at line ${lineNumber}` },
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      })
    })

    // Add current line decoration (highlight + arrow)
    if (currentLine !== null) {
      decorations.push({
        range: {
          startLineNumber: currentLine,
          startColumn: 1,
          endLineNumber: currentLine,
          endColumn: 1000,
        },
        options: {
          className: 'current-line-highlight',
          glyphMarginClassName: 'current-line-arrow',
          glyphMarginHoverMessage: { value: `Current execution line ${currentLine}` },
          isWholeLine: true,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      })
    }

    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, decorations)
  }, [breakpoints, currentLine])

  // Internal save function that returns success status
  const saveCodeInternal = useCallback(async (showOutput: boolean = true): Promise<boolean> => {
    // If no objectId, try to create one (requires flowId)
    if (!objectId) {
      if (!flowId) {
        if (showOutput) {
          setOutput('Error: Please save the DAG first to create a flow, then you can save Python code.\n')
          setStatus('error')
        }
        return false
      }

      // Create new object
      if (showOutput) {
        setOutput((prev) => prev + 'Creating new object...\n')
      }

      try {
        const createResult = await objectApiService.createObject({
          label: nodeName || nodeId,
          type: 'python',
          f_id: flowId,
          params: {
            type: 'python',
            code: code,
          },
        })

        if (createResult.success && createResult.data) {
          const newObjectId = createResult.data.o_id
          onObjectIdChange?.(newObjectId)
          if (showOutput) {
            setOutput((prev) => prev + `Object created (ID: ${newObjectId}). Code saved successfully.\n`)
            setStatus('success')
          }
          log.success('Object created and code saved', { objectId: newObjectId, nodeId })
          return true
        } else {
          if (showOutput) {
            setOutput((prev) => `${prev}Error: ${createResult.message || 'Failed to create object'}\n`)
            setStatus('error')
          }
          log.error('Failed to create object', new Error(createResult.message || 'Unknown error'))
          return false
        }
      } catch (error) {
        if (showOutput) {
          setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
          setStatus('error')
        }
        log.error('Failed to create object', error)
        return false
      }
    }

    // Update existing object
    if (showOutput) {
      setOutput((prev) => prev + 'Saving code...\n')
    }
    
    try {
      const result = await objectApiService.updateObject(objectId, {
        label: nodeName || nodeId,
        type: 'python',
        params: {
          type: 'python',
          code: code,
        },
      })

      if (result.success) {
        if (showOutput) {
          setOutput((prev) => prev + 'Code saved successfully.\n')
          setStatus('success')
        }
        log.success('Code saved', { objectId, nodeId })
        return true
      } else {
        if (showOutput) {
          setOutput((prev) => `${prev}Error: ${result.message || 'Failed to save code'}\n`)
          setStatus('error')
        }
        log.error('Failed to save code', new Error(result.message || 'Unknown error'))
        return false
      }
    } catch (error) {
      if (showOutput) {
        setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
        setStatus('error')
      }
      log.error('Failed to save code', error)
      return false
    }
  }, [objectId, flowId, nodeId, nodeName, code, onObjectIdChange])

  // Public save handler (for Save button)
  const handleSave = useCallback(async () => {
    setIsLoading(true)
    setStatus('idle')
    setOutput('')
    
    const success = await saveCodeInternal(true)
    
    setIsLoading(false)
    if (!success) {
      setStatus('error')
    }
  }, [saveCodeInternal])

  const handleRun = useCallback(async () => {
    setIsLoading(true)
    setStatus('idle')
    setOutput('')
    setIsDebugging(false)
    setDebugPaused(false)
    setCurrentLine(null)
    setDebugVariables({})

    // Phase 1: Auto-save code before running (if objectId exists)
    if (objectId) {
      setOutput('Auto-saving code before execution...\n')
      const saveSuccess = await saveCodeInternal(false)
      
      if (!saveSuccess) {
        setOutput((prev) => `${prev}Error: Failed to save code. Execution cancelled.\n`)
        setStatus('error')
        setIsLoading(false)
        return
      }
      setOutput((prev) => prev + 'Code saved.\n')
    }

    // Phase 2: Load data from connected Data node (if available)
    let inputData: any = null
    if (connectedDataConfig?.filePath) {
      setOutput((prev) => prev + `Loading data from ${connectedDataConfig.filePath}...\n`)
      try {
        const dataResult = await dataApiService.loadData({
          dataSource: (connectedDataConfig.dataSource as 'file' | 'database' | 'api' | 'manual') || 'file',
          config: {
            filePath: connectedDataConfig.filePath,
            fileFormat: connectedDataConfig.fileFormat || 'csv',
          },
        })
        if (dataResult.success && dataResult.data) {
          inputData = dataResult.data
          setOutput((prev) => prev + `✓ Data loaded: ${Array.isArray(inputData) ? inputData.length + ' rows' : 'object'}\n`)
        } else {
          setOutput((prev) => prev + `⚠ Failed to load data: ${dataResult.error}\n`)
        }
      } catch (err) {
        setOutput((prev) => prev + `⚠ Error loading data: ${err}\n`)
      }
    }

    // Phase 3: Execute in Jupyter with injected data
    setOutput((prev) => prev + 'Executing code in Jupyter...\n')
    
    // Build code with data injection
    let codeToExecute = code
    if (inputData) {
      const varName = connectedDataConfig?.outputVariable || 'data'
      const dataJson = JSON.stringify(inputData).replace(/'/g, "\\'")
      codeToExecute = `import json
import pandas as pd

# Data injected from connected Data node
${varName} = json.loads('${dataJson}')
df = pd.DataFrame(${varName})

# ========== Your Code ==========
${code}
`
    }
    
    try {
      const result = await jupyterApiService.executePythonCode({
        code: codeToExecute,
        username: 'default',
      })

      if (result.success) {
        setOutput((prev) => prev + result.output)
        setStatus('success')
        log.success('Jupyter execution completed', { outputLength: result.output.length })
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Execution failed'}\n`)
        if (result.output) {
          setOutput((prev) => prev + result.output)
        }
        setStatus('error')
        log.error('Jupyter execution failed', new Error(result.error || 'Unknown error'))
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
      setStatus('error')
      log.error('Jupyter execution error', error)
    } finally {
      setIsLoading(false)
    }
  }, [objectId, saveCodeInternal, code, connectedDataConfig])

  const handleDebug = useCallback(async () => {
    if (breakpoints.size === 0) {
      setOutput('No breakpoints set. Please set breakpoints first.\n')
      setStatus('error')
      return
    }

    setIsLoading(true)
    setIsDebugging(true)
    setStatus('idle')
    setOutput('')
    setDebugPaused(false)
    setCurrentLine(null)
    setDebugVariables({})
    setCallStack([])

    // Phase 1: Auto-save code before debugging (if objectId exists)
    if (objectId) {
      setOutput('Auto-saving code before debugging...\n')
      const saveSuccess = await saveCodeInternal(false)
      
      if (!saveSuccess) {
        setOutput((prev) => `${prev}Error: Failed to save code. Debugging cancelled.\n`)
        setStatus('error')
        setIsLoading(false)
        setIsDebugging(false)
        return
      }
      setOutput((prev) => prev + 'Code saved.\n')
    }

    // Phase 2: Start debug session
    setOutput((prev) => prev + 'Starting debugging session...\n')
    
    try {
      const breakpointsArray = Array.from(breakpoints)
      const result = await jupyterApiService.debugSessionControl({
        action: 'start',
        code: code,
        breakpoints: breakpointsArray,
      })

      if (result.success) {
        setDebugSessionId(result.sessionId || null)
        setOutput((prev) => prev + result.output)
        
        if (result.isPaused) {
          setDebugPaused(true)
          setCurrentLine(result.currentLine)
          setDebugVariables(result.variables || {})
          setCallStack(result.callStack || [])
          setStatus('idle')
          setIsLoading(false)
          setOutput((prev) => prev + `\n⏸ Paused at line ${result.currentLine}\n`)
        } else if (result.isFinished) {
          setStatus('success')
          setIsDebugging(false)
          setIsLoading(false)
        }
        log.success('Debug session started', { sessionId: result.sessionId, currentLine: result.currentLine })
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Debugging failed'}\n`)
        setStatus('error')
        setIsDebugging(false)
        setIsLoading(false)
        log.error('Debug session failed', new Error(result.error || 'Unknown error'))
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
      setStatus('error')
      setIsDebugging(false)
      setIsLoading(false)
      log.error('Debug session error', error)
    }
  }, [objectId, saveCodeInternal, code, breakpoints])

  const handleContinue = useCallback(async () => {
    if (!debugPaused || !debugSessionId) return

    setIsLoading(true)
    setOutput((prev) => prev + 'Continuing execution...\n')

    try {
      const result = await jupyterApiService.debugSessionControl({
        action: 'continue',
        sessionId: debugSessionId,
      })

      if (result.success) {
        setOutput((prev) => prev + result.output)
        
        if (result.isPaused) {
          setDebugPaused(true)
          setCurrentLine(result.currentLine)
          setDebugVariables(result.variables || {})
          setCallStack(result.callStack || [])
          setOutput((prev) => prev + `\n⏸ Paused at line ${result.currentLine}\n`)
        } else if (result.isFinished) {
          setStatus('success')
          setIsDebugging(false)
          setDebugPaused(false)
          setCurrentLine(null)
          setDebugVariables({})
          setCallStack([])
        }
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Execution failed'}\n`)
        setStatus('error')
        setIsDebugging(false)
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
      setStatus('error')
      setIsDebugging(false)
    } finally {
      setIsLoading(false)
    }
  }, [debugPaused, debugSessionId])

  const handleStepOver = useCallback(async () => {
    if (!debugPaused || !debugSessionId) return

    setIsLoading(true)
    setOutput((prev) => prev + 'Stepping over...\n')

    try {
      const result = await jupyterApiService.debugSessionControl({
        action: 'step_over',
        sessionId: debugSessionId,
      })

      if (result.success) {
        setOutput((prev) => prev + result.output)
        
        if (result.isPaused) {
          setDebugPaused(true)
          setCurrentLine(result.currentLine)
          setDebugVariables(result.variables || {})
          setCallStack(result.callStack || [])
          setOutput((prev) => prev + `\n⏸ Paused at line ${result.currentLine}\n`)
        } else if (result.isFinished) {
          setStatus('success')
          setIsDebugging(false)
          setDebugPaused(false)
        }
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Step over failed'}\n`)
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }, [debugPaused, debugSessionId])

  const handleStepInto = useCallback(async () => {
    if (!debugPaused || !debugSessionId) return

    setIsLoading(true)
    setOutput((prev) => prev + 'Stepping into...\n')

    try {
      const result = await jupyterApiService.debugSessionControl({
        action: 'step_into',
        sessionId: debugSessionId,
      })

      if (result.success) {
        setOutput((prev) => prev + result.output)
        
        if (result.isPaused) {
          setDebugPaused(true)
          setCurrentLine(result.currentLine)
          setDebugVariables(result.variables || {})
          setCallStack(result.callStack || [])
          setOutput((prev) => prev + `\n⏸ Paused at line ${result.currentLine}\n`)
        } else if (result.isFinished) {
          setStatus('success')
          setIsDebugging(false)
          setDebugPaused(false)
        }
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Step into failed'}\n`)
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }, [debugPaused, debugSessionId])

  const handleStepOut = useCallback(async () => {
    if (!debugPaused || !debugSessionId) return

    setIsLoading(true)
    setOutput((prev) => prev + 'Stepping out...\n')

    try {
      const result = await jupyterApiService.debugSessionControl({
        action: 'step_out',
        sessionId: debugSessionId,
      })

      if (result.success) {
        setOutput((prev) => prev + result.output)
        
        if (result.isPaused) {
          setDebugPaused(true)
          setCurrentLine(result.currentLine)
          setDebugVariables(result.variables || {})
          setCallStack(result.callStack || [])
          setOutput((prev) => prev + `\n⏸ Paused at line ${result.currentLine}\n`)
        } else if (result.isFinished) {
          setStatus('success')
          setIsDebugging(false)
          setDebugPaused(false)
        }
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Step out failed'}\n`)
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }, [debugPaused, debugSessionId])

  const handleSetVariable = useCallback(async (variableName: string, value: string) => {
    if (!debugPaused || !debugSessionId) return

    setIsLoading(true)
    setOutput((prev) => prev + `Setting ${variableName} = ${value}...\n`)

    try {
      const result = await jupyterApiService.debugSessionControl({
        action: 'set_variable',
        sessionId: debugSessionId,
        variable: variableName,
        value: value,
      })

      if (result.success) {
        setDebugVariables(result.variables || {})
        setOutput((prev) => prev + `Variable ${variableName} set to ${value}\n`)
        setEditingVariable(null)
      } else {
        setOutput((prev) => `${prev}Error: ${result.error || 'Failed to set variable'}\n`)
      }
    } catch (error) {
      setOutput((prev) => `${prev}Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsLoading(false)
    }
  }, [debugPaused, debugSessionId])

  const handleAIGenerate = useCallback(async () => {
    if (!aiInstruction.trim()) {
      setOutput((prev) => prev + 'Error: Please enter an instruction\n')
      return
    }

    setIsAIGenerating(true)
    setOutput((prev) => prev + `🤖 AI Agent: ${aiAction === 'generate' ? 'Generating' : aiAction === 'modify' ? 'Modifying' : 'Explaining'} code...\n`)

    try {
      const result = await aiAgentService.generateCode({
        code: aiAction === 'modify' || aiAction === 'explain' ? code : undefined,
        instruction: aiInstruction,
        action: aiAction,
      })

      if (result.success && result.code) {
        handleCodeChange(result.code)
        setOutput((prev) => prev + `✅ AI Agent: Code ${aiAction === 'generate' ? 'generated' : aiAction === 'modify' ? 'modified' : 'explained'} successfully\n`)
        setIsAIModalOpen(false)
        setAIInstruction('')
      } else {
        setOutput((prev) => `${prev}❌ AI Agent Error: ${result.error || 'Failed to generate code'}\n`)
      }
    } catch (error) {
      setOutput((prev) => `${prev}❌ AI Agent Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`)
    } finally {
      setIsAIGenerating(false)
    }
  }, [aiInstruction, aiAction, code, handleCodeChange])

  // Keyboard shortcuts for debugging
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // F5: Run / Continue
      if (e.key === 'F5') {
        e.preventDefault()
        if (debugPaused && debugSessionId) {
          handleContinue()
        } else if (!isDebugging && !isLoading) {
          handleRun()
        }
        return
      }

      // F9: Toggle Breakpoint
      if (e.key === 'F9' || (e.ctrlKey && e.key === 'b')) {
        e.preventDefault()
        if (editorRef.current) {
          const position = editorRef.current.getPosition()
          if (position) {
            toggleBreakpoint(position.lineNumber)
          }
        }
        return
      }

      // F10: Step Over
      if (e.key === 'F10' && debugPaused && debugSessionId) {
        e.preventDefault()
        handleStepOver()
        return
      }

      // F11: Step Into
      if (e.key === 'F11' && !e.shiftKey && debugPaused && debugSessionId) {
        e.preventDefault()
        handleStepInto()
        return
      }

      // Shift+F11: Step Out
      if (e.key === 'F11' && e.shiftKey && debugPaused && debugSessionId) {
        e.preventDefault()
        handleStepOut()
        return
      }

      // Ctrl+S: Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (!isLoading) {
          handleSave()
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, debugPaused, debugSessionId, isDebugging, isLoading, handleContinue, handleRun, handleStepOver, handleStepInto, handleStepOut, handleSave, toggleBreakpoint])

  if (!open) return null

  return (
    <div className="python-node-panel-overlay">
      <div className="python-node-panel-backdrop" onClick={onClose} />
      <div className="python-node-panel">
        <div className="python-node-panel-header">
          <div className="python-node-panel-header-left">
            <div className="python-node-panel-icon">🐍</div>
            <div>
              <h3 className="python-node-panel-title">Python Node</h3>
              <p className="python-node-panel-subtitle">{nodeName || nodeId}</p>
            </div>
          </div>
          <button onClick={onClose} className="python-node-panel-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="python-node-panel-toolbar">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="python-node-panel-button python-node-panel-button-save"
            title={!flowId ? 'Please save the DAG first' : 'Save code (Ctrl+S)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <path d="M17 21v-8H7v8M7 3v5h8" />
            </svg>
            Save
          </button>
          <button
            onClick={handleRun}
            disabled={isLoading || isDebugging}
            className="python-node-panel-button python-node-panel-button-run"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Run
          </button>
          <button
            onClick={() => setIsAIModalOpen(true)}
            disabled={isLoading || isAIGenerating}
            className="python-node-panel-button python-node-panel-button-ai"
            title="AI Agent: Generate or modify code"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            AI Agent
          </button>
          <button
            onClick={handleDebug}
            disabled={isLoading || breakpoints.size === 0}
            className="python-node-panel-button python-node-panel-button-debug"
            title="Debug with breakpoints (F5)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Debug
          </button>
          {debugPaused && (
            <>
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="python-node-panel-button python-node-panel-button-continue"
                title="Continue (F5)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Continue
              </button>
              <button
                onClick={handleStepOver}
                disabled={isLoading}
                className="python-node-panel-button python-node-panel-button-step"
                title="Step Over (F10)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 3h12v6H6zM6 15h12v6H6z" />
                  <path d="M12 3v18" />
                </svg>
                Step Over
              </button>
              <button
                onClick={handleStepInto}
                disabled={isLoading}
                className="python-node-panel-button python-node-panel-button-step"
                title="Step Into (F11)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M6 12l6-6M18 12l-6-6" />
                </svg>
                Step Into
              </button>
              <button
                onClick={handleStepOut}
                disabled={isLoading}
                className="python-node-panel-button python-node-panel-button-step"
                title="Step Out (Shift+F11)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M6 12l6 6M18 12l-6-6" />
                </svg>
                Step Out
              </button>
            </>
          )}
        </div>

        <div className="python-node-panel-content">
          <div className="python-node-panel-editor-wrapper">
            <div className="python-node-panel-editor-header">
              <span className="python-node-panel-editor-label">Code Editor</span>
              {breakpoints.size > 0 && (
                <span className="python-node-panel-breakpoint-count">
                  {breakpoints.size} breakpoint{breakpoints.size > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="python-node-panel-editor-container">
              <Editor
                height="100%"
                language="python"
                value={code}
                onChange={(value) => handleCodeChange(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  glyphMargin: true,
                  folding: true,
                  lineDecorationsWidth: 20,
                  lineNumbersMinChars: 3,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  tabSize: 4,
                  insertSpaces: true,
                }}
                onMount={(editor, monaco) => {
                  editorRef.current = editor
                  monacoRef.current = monaco

                  // Handle click on glyph margin (line numbers area) to toggle breakpoints
                  editor.onMouseDown((e) => {
                    if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                      const lineNumber = e.target.position?.lineNumber
                      if (lineNumber) {
                        toggleBreakpoint(lineNumber)
                      }
                    }
                  })
                }}
              />
            </div>
          </div>

          {debugPaused && (
            <>
              {callStack.length > 0 && (
                <div className="python-node-panel-callstack-wrapper">
                  <div className="python-node-panel-callstack-header">
                    <span className="python-node-panel-callstack-label">Call Stack</span>
                  </div>
                  <div className="python-node-panel-callstack-content">
                    {callStack.map((frame, idx) => (
                      <div key={idx} className="python-node-panel-callstack-frame">
                        <div className="python-node-panel-callstack-frame-name">
                          {frame.name} ({frame.file}:{frame.line})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="python-node-panel-variables-wrapper">
                <div className="python-node-panel-variables-header">
                  <span className="python-node-panel-variables-label">Variables (Line {currentLine})</span>
                </div>
                <div className="python-node-panel-variables-content">
                  {Object.entries(debugVariables).map(([key, value]) => (
                    <div key={key} className="python-node-panel-variable-item">
                      <span className="python-node-panel-variable-name">{key}:</span>
                      {editingVariable?.name === key ? (
                        <div className="python-node-panel-variable-edit">
                          <input
                            type="text"
                            value={editingVariable.value}
                            onChange={(e) => setEditingVariable({ name: key, value: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSetVariable(key, editingVariable.value)
                              } else if (e.key === 'Escape') {
                                setEditingVariable(null)
                              }
                            }}
                            className="python-node-panel-variable-input"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSetVariable(key, editingVariable.value)}
                            className="python-node-panel-variable-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingVariable(null)}
                            className="python-node-panel-variable-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="python-node-panel-variable-value">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                          <button
                            onClick={() => setEditingVariable({ name: key, value: String(value) })}
                            className="python-node-panel-variable-edit-btn"
                            title="Edit variable"
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="python-node-panel-output-wrapper">
            <div className="python-node-panel-output-header">
              <span className="python-node-panel-output-label">Output</span>
              {status === 'success' && <span className="python-node-panel-status-success">✓ Success</span>}
              {status === 'error' && <span className="python-node-panel-status-error">✗ Error</span>}
              {isLoading && <span className="python-node-panel-status-loading">⏳ Running...</span>}
              {debugPaused && <span className="python-node-panel-status-paused">⏸ Paused</span>}
            </div>
            <div className="python-node-panel-output">
              {output || <span className="python-node-panel-output-placeholder">Output will appear here...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Modal */}
      {isAIModalOpen && (
        <div className="python-node-panel-ai-modal-overlay">
          <div className="python-node-panel-ai-modal-backdrop" onClick={() => setIsAIModalOpen(false)} />
          <div className="python-node-panel-ai-modal">
            <div className="python-node-panel-ai-modal-header">
              <h3>🤖 AI Agent</h3>
              <button onClick={() => setIsAIModalOpen(false)} className="python-node-panel-ai-modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="python-node-panel-ai-modal-body">
              <div className="python-node-panel-ai-modal-action-selector">
                <button
                  onClick={() => setAIAction('generate')}
                  className={aiAction === 'generate' ? 'active' : ''}
                >
                  Generate
                </button>
                <button
                  onClick={() => setAIAction('modify')}
                  className={aiAction === 'modify' ? 'active' : ''}
                  disabled={!code.trim()}
                >
                  Modify
                </button>
                <button
                  onClick={() => setAIAction('explain')}
                  className={aiAction === 'explain' ? 'active' : ''}
                  disabled={!code.trim()}
                >
                  Explain
                </button>
              </div>
              <div className="python-node-panel-ai-modal-instruction">
                <label>Instruction:</label>
                <textarea
                  value={aiInstruction}
                  onChange={(e) => setAIInstruction(e.target.value)}
                  placeholder={
                    aiAction === 'generate'
                      ? 'Describe what code you want to generate...'
                      : aiAction === 'modify'
                      ? 'Describe how to modify the code...'
                      : 'The code will be explained...'
                  }
                  rows={4}
                />
              </div>
            </div>
            <div className="python-node-panel-ai-modal-footer">
              <button
                onClick={handleAIGenerate}
                disabled={!aiInstruction.trim() || isAIGenerating}
                className="python-node-panel-ai-modal-generate"
              >
                {isAIGenerating ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={() => setIsAIModalOpen(false)}
                disabled={isAIGenerating}
                className="python-node-panel-ai-modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PythonNodePanel
