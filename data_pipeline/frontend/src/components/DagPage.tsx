import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'
import './DagPage.css'
import SlideMenu from './menu/SlideMenu'
import PythonNodePanel from './panels/PythonNodePanel'
import DataNodePanel, { type DataNodeConfig } from './panels/DataNodePanel'
import SaveNodePanel, { type SaveNodeConfig } from './panels/SaveNodePanel'
import SaveDagModal from './modals/SaveDagModal'
import LoadDagModal from './modals/LoadDagModal'
import { nodeTypes } from './nodes'
import { saveDag, loadDag } from '../utils/dagStorage'
import { log } from '../utils/logger'
import { flowApiService } from '../services/flowApiService'
import { objectApiService, type Object } from '../services/objectApiService'
import { dataApiService } from '../services/dataApiService'
import { jupyterApiService } from '../services/jupyterApiService'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function calculateNodePosition(nodesCount: number) {
  const spacing = 200
  const cols = Math.floor(Math.sqrt(nodesCount + 1))
  const row = Math.floor(nodesCount / cols)
  const col = nodesCount % cols
  return {
    x: col * spacing + 100,
    y: row * spacing + 100,
  }
}

function generateNodeId(nodeType: string, index: number): string {
  return `${nodeType}-${Date.now()}-${index}`
}

interface DagPageProps {
  dagId?: string | null
}

function DagPage({ dagId }: DagPageProps = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedPythonNode, setSelectedPythonNode] = useState<Node | null>(null)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [dagName, setDagName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null)
  const { fitView } = useReactFlow()

  useEffect(() => {
    if (dagId) {
      const savedDag = loadDag(dagId)
      if (savedDag) {
        setNodes(savedDag.nodes)
        setEdges(savedDag.edges)
        setDagName(savedDag.name)
        log.info('DAG loaded', { dagId, name: savedDag.name, nodeCount: savedDag.nodes.length })
      } else {
        log.warn('DAG not found', { dagId })
      }
    } else {
      setNodes(initialNodes)
      setEdges(initialEdges)
      setDagName('')
      log.debug('New DAG initialized')
    }
  }, [dagId, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const node = nds.find((n) => n.id === nodeId)
        log.info('Node deleted', { nodeId, nodeType: node?.type })
        return nds.filter((n) => n.id !== nodeId)
      })
      setEdges((eds) => {
        return eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      })
    },
    [setNodes, setEdges]
  )

  const handleNodeSelect = useCallback(
    (nodeType: string) => {
      try {
        console.log('handleNodeSelect called', { nodeType, currentNodesCount: nodes.length })
        const position = calculateNodePosition(nodes.length)
        const nodeId = generateNodeId(nodeType, nodes.length)

        const newNode: Node = {
          id: nodeId,
          type: nodeType,
          position,
          data: {
            label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
            type: nodeType,
            onDeleteNode: handleDeleteNode,
          },
        }

        console.log('Adding new node', newNode)
        setNodes((nds) => {
          const updated = [...nds, newNode]
          console.log('Nodes updated', { oldCount: nds.length, newCount: updated.length })
          // 노드 추가 후 화면에 보이도록 fitView 호출
          setTimeout(() => {
            fitView({ padding: 0.2, duration: 300 })
          }, 100)
          return updated
        })
        log.info('Node added successfully', { nodeType, nodeId, position })
      } catch (error) {
        console.error('Error adding node', error)
        log.error('Failed to add node', { nodeType, error })
      }
    },
    [nodes.length, setNodes, handleDeleteNode, fitView]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.metaKey) {
        const selectedNodes = nodes.filter((node) => node.selected)
        if (selectedNodes.length > 0) {
          e.preventDefault()
          selectedNodes.forEach((node) => handleDeleteNode(node.id))
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, handleDeleteNode])

  const onNodeClick: NodeMouseHandler = useCallback(() => {}, [])

  const [selectedDataNode, setSelectedDataNode] = useState<Node | null>(null)
  const [selectedSaveNode, setSelectedSaveNode] = useState<Node | null>(null)

  const onNodeDoubleClick: NodeMouseHandler = useCallback((_, node) => {
    if (node.type === 'python') {
      setSelectedPythonNode(node)
      setSelectedDataNode(null)
      setSelectedSaveNode(null)
    } else if (node.type === 'data') {
      setSelectedDataNode(node)
      setSelectedPythonNode(null)
      setSelectedSaveNode(null)
    } else if (node.type === 'save') {
      setSelectedSaveNode(node)
      setSelectedPythonNode(null)
      setSelectedDataNode(null)
    }
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedPythonNode(null)
    setSelectedDataNode(null)
    setSelectedSaveNode(null)
  }, [])

  const handlePythonCodeChange = useCallback(
    (nodeId: string, code: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  code,
                },
              }
            : node
        )
      )
    },
    [setNodes]
  )

  const handleDataConfigChange = useCallback(
    (nodeId: string, config: DataNodeConfig) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  config,
                },
              }
            : node
        )
      )
    },
    [setNodes]
  )

  const handleSaveConfigChange = useCallback(
    (nodeId: string, config: SaveNodeConfig) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  config,
                },
              }
            : node
        )
      )
    },
    [setNodes]
  )

  const handleSave = useCallback(async () => {
    if (!dagName.trim()) return

    setIsSaving(true)
    try {
      let flowId = currentFlowId

      if (!flowId) {
        const flowResult = await flowApiService.createFlow({
          name: dagName.trim(),
          run_type: 'manual',
        })

        if (!flowResult.success || !flowResult.data) {
          throw new Error(flowResult.message || 'Failed to create flow')
        }

        flowId = flowResult.data.f_id
        setCurrentFlowId(flowId)
        log.info('Flow created', { flowId, name: dagName.trim() })
      } else {
        const flowResult = await flowApiService.updateFlow(flowId, {
          name: dagName.trim(),
          run_type: 'manual',
        })

        if (!flowResult.success) {
          throw new Error(flowResult.message || 'Failed to update flow')
        }

        log.info('Flow updated', { flowId, name: dagName.trim() })
      }

      const objectPromises = nodes.map(async (node) => {
        const nodeData = node.data || {}
        const existingObjectId = nodeData.objectId

        const objectData = {
          label: nodeData.label || node.id,
          type: nodeData.type || node.type || 'python',
          f_id: flowId,
          x: Math.round(node.position.x),
          y: Math.round(node.position.y),
          params: {
            type: nodeData.type || node.type || 'python',
            code: nodeData.code || '',
          },
        }

        if (existingObjectId) {
          const result = await objectApiService.updateObject(existingObjectId, objectData)
          if (result.success) {
            return { nodeId: node.id, objectId: existingObjectId, success: true }
          } else {
            log.warn('Failed to update object', { objectId: existingObjectId, error: result.message })
            return { nodeId: node.id, objectId: existingObjectId, success: false }
          }
        } else {
          const result = await objectApiService.createObject(objectData)
          if (result.success && result.data) {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        objectId: result.data!.o_id,
                      },
                    }
                  : n
              )
            )
            return { nodeId: node.id, objectId: result.data.o_id, success: true }
          } else {
            log.warn('Failed to create object', { nodeId: node.id, error: result.message })
            return { nodeId: node.id, objectId: null, success: false }
          }
        }
      })

      await Promise.all(objectPromises)

      log.success('DAG saved successfully', {
        flowId,
        dagName: dagName.trim(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
      })

      const cleanNodes: Node[] = nodes.map(({ id, type, position, data }) => ({
        id,
        type: type || undefined,
        position,
        data: {
          label: data?.label,
          type: data?.type,
          code: data?.code,
          objectId: data?.objectId,
        },
      }))

      const cleanEdges: Edge[] = edges.map(({ id, source, target, sourceHandle, targetHandle }) => ({
        id,
        source,
        target,
        sourceHandle,
        targetHandle,
      }))

      saveDag(dagName.trim(), cleanNodes, cleanEdges)

      setIsSaveModalOpen(false)
      setDagName('')
    } catch (error) {
      log.error('Failed to save DAG', error, { dagName })
      alert(`저장 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsSaving(false)
    }
  }, [dagName, nodes, edges, currentFlowId, setNodes])

  const handleOpenSaveModal = useCallback(() => {
    setDagName('')
    setIsSaveModalOpen(true)
  }, [])

  const handleOpenLoadModal = useCallback(() => {
    setIsLoadModalOpen(true)
  }, [])

  // Execute workflow: Data nodes → Python nodes → Save nodes
  const handleExecuteWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      alert('No nodes to execute')
      return
    }

    setIsExecuting(true)
    setExecutionLog([])

    const addLog = (message: string) => {
      setExecutionLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
      log.info('Workflow execution', { message })
    }

    try {
      addLog('Starting workflow execution...')

      // Build execution graph from edges
      const nodeMap = new Map(nodes.map((n) => [n.id, n]))
      const incomingEdges = new Map<string, string[]>() // target -> [sources]
      const outgoingEdges = new Map<string, string[]>() // source -> [targets]

      edges.forEach((edge) => {
        if (!incomingEdges.has(edge.target)) {
          incomingEdges.set(edge.target, [])
        }
        incomingEdges.get(edge.target)!.push(edge.source)

        if (!outgoingEdges.has(edge.source)) {
          outgoingEdges.set(edge.source, [])
        }
        outgoingEdges.get(edge.source)!.push(edge.target)
      })

      // Find starting nodes (nodes with no incoming edges)
      const startNodes = nodes.filter((node) => !incomingEdges.has(node.id) || incomingEdges.get(node.id)!.length === 0)

      if (startNodes.length === 0) {
        throw new Error('No starting nodes found. Workflow must have at least one node with no incoming edges.')
      }

      addLog(`Found ${startNodes.length} starting node(s)`)

      // Store data from each node execution
      const nodeData = new Map<string, any>()

      // Execute nodes in topological order
      const executed = new Set<string>()
      const queue = [...startNodes.map((n) => n.id)]

      while (queue.length > 0) {
        const nodeId = queue.shift()!
        if (executed.has(nodeId)) continue

        const node = nodeMap.get(nodeId)!
        const nodeType = node.type || 'python'

        // Check if all dependencies are executed
        const dependencies = incomingEdges.get(nodeId) || []
        const allDepsExecuted = dependencies.every((depId) => executed.has(depId))

        if (!allDepsExecuted) {
          queue.push(nodeId) // Re-queue for later
          continue
        }

        addLog(`Executing ${nodeType} node: ${node.data?.label || nodeId}`)

        try {
          let outputData: any = null

          if (nodeType === 'data') {
            // Load data from Data node
            const config = (node.data?.config || {}) as any
            const result = await dataApiService.loadData({
              dataSource: config.dataSource || 'file',
              config: config,
            })

            if (!result.success) {
              throw new Error(result.error || 'Failed to load data')
            }

            outputData = result.data
            const outputVar = config.outputVariable || 'data'
            nodeData.set(nodeId, { [outputVar]: outputData })
            addLog(`✓ Data loaded: ${outputVar}`)
          } else if (nodeType === 'python') {
            // Execute Python code with input data from upstream nodes
            const inputData: Record<string, any> = {}

            // Collect data from all upstream nodes
            dependencies.forEach((depId) => {
              const depData = nodeData.get(depId)
              if (depData) {
                Object.assign(inputData, depData)
              }
            })

            // Prepare Python code with input data injection and output capture
            const code = node.data?.code || ''
            const outputVar = node.data?.outputVariable || 'result'
            
            // Build code that:
            // 1. Imports pandas
            // 2. Injects input data as both raw JSON and DataFrame
            // 3. Runs user code
            // 4. Captures output as JSON
            const codeWithInput = `
import json
import pandas as pd

# Input data from upstream nodes (as dict/list)
${Object.entries(inputData)
  .map(([key, value]) => {
    const jsonValue = JSON.stringify(value)
    return `${key} = json.loads('${jsonValue.replace(/'/g, "\\'")}')`
  })
  .join('\n')}

# Convert to DataFrame if data is a list of dicts
${Object.entries(inputData)
  .map(([key]) => `if isinstance(${key}, list): df_${key} = pd.DataFrame(${key})`)
  .join('\n')}

# Shortcut: 'df' is the first DataFrame
${Object.keys(inputData).length > 0 ? `df = pd.DataFrame(${Object.keys(inputData)[0]})` : ''}

# ========== User Code Start ==========
${code}
# ========== User Code End ==========

# Capture output for downstream nodes
_output_data = None
if 'result' in dir():
    if isinstance(result, pd.DataFrame):
        _output_data = result.to_dict(orient='records')
    elif isinstance(result, (list, dict)):
        _output_data = result
    else:
        _output_data = str(result)
elif 'df' in dir() and isinstance(df, pd.DataFrame):
    _output_data = df.to_dict(orient='records')
else:
    _output_data = ${Object.keys(inputData)[0] || '[]'}

print("__PIPELINE_OUTPUT_START__")
print(json.dumps(_output_data))
print("__PIPELINE_OUTPUT_END__")
`

            const result = await jupyterApiService.executePythonCode({
              code: codeWithInput,
              username: 'default',
            })

            if (!result.success) {
              throw new Error(result.error || 'Python execution failed')
            }

            // Extract structured output from Python execution
            const output = result.output || ''
            const startMarker = '__PIPELINE_OUTPUT_START__'
            const endMarker = '__PIPELINE_OUTPUT_END__'
            const startIdx = output.indexOf(startMarker)
            const endIdx = output.indexOf(endMarker)

            if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
              const jsonStr = output.slice(startIdx + startMarker.length, endIdx).trim()
              try {
                outputData = JSON.parse(jsonStr)
                nodeData.set(nodeId, { [outputVar]: outputData })
                addLog(`✓ Python executed: ${Array.isArray(outputData) ? outputData.length + ' rows' : 'data'} output`)
              } catch {
                // If JSON parse fails, store as string
                nodeData.set(nodeId, { [outputVar]: jsonStr })
                addLog(`✓ Python executed: raw output stored`)
              }
            } else {
              // No structured output, pass through input data
              const firstInputKey = Object.keys(inputData)[0]
              if (firstInputKey) {
                nodeData.set(nodeId, { [outputVar]: inputData[firstInputKey] })
                addLog(`✓ Python executed: input data passed through`)
              }
            }
          } else if (nodeType === 'save') {
            // Save data from upstream nodes
            const config = (node.data?.config || {}) as any
            const inputVar = config.inputVariable || 'data'

            // Get data from upstream nodes
            let dataToSave: any = null
            dependencies.forEach((depId) => {
              const depData = nodeData.get(depId)
              if (depData && depData[inputVar]) {
                dataToSave = depData[inputVar]
              } else if (depData) {
                // If no specific variable, use the first available
                dataToSave = Object.values(depData)[0]
              }
            })

            if (dataToSave === null) {
              throw new Error(`No data found for variable: ${inputVar}`)
            }

            const result = await dataApiService.saveData({
              data: dataToSave,
              saveFormat: config.saveFormat || 'file',
              config: config,
            })

            if (!result.success) {
              throw new Error(result.error || 'Failed to save data')
            }

            addLog(`✓ Data saved: ${result.path || result.message}`)
          }

          executed.add(nodeId)

          // Add dependent nodes to queue
          const dependents = outgoingEdges.get(nodeId) || []
          dependents.forEach((depId) => {
            if (!executed.has(depId) && !queue.includes(depId)) {
              queue.push(depId)
            }
          })
        } catch (error) {
          addLog(`✗ Error in ${nodeType} node: ${error instanceof Error ? error.message : 'Unknown error'}`)
          throw error
        }
      }

      addLog(`✓ Workflow execution completed successfully!`)
      alert('Workflow execution completed successfully!')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      addLog(`✗ Workflow execution failed: ${errorMsg}`)
      alert(`Workflow execution failed: ${errorMsg}`)
      log.error('Workflow execution failed', error)
    } finally {
      setIsExecuting(false)
    }
  }, [nodes, edges])

  const handleLoadFlow = useCallback(async (flowId: string, flowName: string) => {
    setIsLoading(true)
    setIsLoadModalOpen(false)
    
    try {
      // Load objects for this flow
      const objectsResult = await objectApiService.getObjects(flowId)
      
      if (!objectsResult.success || !objectsResult.data) {
        throw new Error(objectsResult.message || 'Failed to load flow objects')
      }

      const objects: Object[] = objectsResult.data
      log.info('Flow objects loaded', { flowId, objectCount: objects.length })

      // Convert objects to nodes
      const loadedNodes: Node[] = objects.map((obj) => {
        const params = obj.params || {}
        const nodeType = params.type || obj.type || 'python'
        const code = params.code || ''
        
        return {
          id: `node-${obj.o_id}`,
          type: nodeType,
          position: {
            x: obj.x || 100,
            y: obj.y || 100,
          },
          data: {
            label: obj.label || `Node ${obj.o_id}`,
            type: nodeType,
            code: code,
            objectId: obj.o_id,
            onDeleteNode: handleDeleteNode,
          },
        }
      })

      // Convert objects to edges (based on target relationships)
      const loadedEdges: Edge[] = []
      objects.forEach((obj) => {
        if (obj.target) {
          const sourceNode = loadedNodes.find(n => n.data?.objectId === String(obj.o_id))
          const targetNode = loadedNodes.find(n => n.data?.objectId === String(obj.target))
          
          if (sourceNode && targetNode) {
            loadedEdges.push({
              id: `edge-${obj.o_id}-${obj.target}`,
              source: sourceNode.id,
              target: targetNode.id,
            })
          }
        }
      })

      setNodes(loadedNodes)
      setEdges(loadedEdges)
      setCurrentFlowId(flowId)
      setDagName(flowName)
      
      log.success('Flow loaded successfully', {
        flowId,
        flowName,
        nodeCount: loadedNodes.length,
        edgeCount: loadedEdges.length,
      })
    } catch (error) {
      log.error('Failed to load flow', error)
      alert(`Flow 로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }, [setNodes, setEdges, handleDeleteNode])

  const nodesWithDeleteHandler = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDeleteNode: handleDeleteNode,
    },
  }))

  return (
    <div className="dag-page">
      <div className="dag-header">
        <div className="dag-header-left">
          <h1>DAG Editor</h1>
          <p>워크플로우를 시각적으로 편집하세요</p>
        </div>
        <div className="dag-header-actions">
          <button
            onClick={handleOpenLoadModal}
            className="dag-load-button"
            aria-label="Load DAG"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Load
          </button>
          <button
            onClick={handleOpenSaveModal}
            className="dag-save-button"
            aria-label="Save DAG"
            disabled={nodes.length === 0 || isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <path d="M17 21v-8H7v8M7 3v5h8" />
            </svg>
            Save
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="dag-add-node-button"
            aria-label="Add Node"
            disabled={isLoading || isExecuting}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Node
          </button>
          <button
            onClick={handleExecuteWorkflow}
            className="dag-execute-button"
            aria-label="Execute Workflow"
            disabled={nodes.length === 0 || isLoading || isExecuting}
            title="Execute the workflow (Data → Python → Save)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Execute
          </button>
        </div>
      </div>
      <div className="dag-canvas-container">
        <ReactFlow
          nodes={nodesWithDeleteHandler}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionLineType={'smoothstep' as any}
          snapToGrid={true}
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            style: {
              strokeWidth: 2,
              stroke: '#b1b1b7',
            },
            type: 'smoothstep',
          }}
        >
          <Controls />
          <Background />
          <MiniMap />
        </ReactFlow>
      </div>
      <SlideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNodeSelect={handleNodeSelect}
      />
      {selectedPythonNode && (
        <PythonNodePanel
          open={!!selectedPythonNode}
          onClose={() => setSelectedPythonNode(null)}
          nodeId={selectedPythonNode.id}
          nodeName={selectedPythonNode.data?.label}
          initialCode={selectedPythonNode.data?.code || ''}
          onCodeChange={(code) => handlePythonCodeChange(selectedPythonNode.id, code)}
          objectId={selectedPythonNode.data?.objectId}
          flowId={currentFlowId}
          onObjectIdChange={(newObjectId) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === selectedPythonNode.id
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        objectId: newObjectId,
                      },
                    }
                  : n
              )
            )
          }}
          connectedDataConfig={(() => {
            // Find connected Data node
            const incomingEdge = edges.find((e) => e.target === selectedPythonNode.id)
            if (incomingEdge) {
              const sourceNode = nodes.find((n) => n.id === incomingEdge.source)
              if (sourceNode && sourceNode.type === 'data') {
                const config = sourceNode.data?.config as DataNodeConfig | undefined
                return {
                  dataSource: config?.dataSource,
                  filePath: config?.filePath,
                  fileFormat: config?.fileFormat,
                  outputVariable: config?.outputVariable,
                }
              }
            }
            return undefined
          })()}
        />
      )}
      {selectedDataNode && (
        <DataNodePanel
          open={!!selectedDataNode}
          onClose={() => setSelectedDataNode(null)}
          nodeId={selectedDataNode.id}
          nodeName={selectedDataNode.data?.label}
          initialConfig={selectedDataNode.data?.config as DataNodeConfig}
          onConfigChange={(config) => handleDataConfigChange(selectedDataNode.id, config)}
          objectId={selectedDataNode.data?.objectId}
          flowId={currentFlowId}
          onObjectIdChange={(newObjectId) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === selectedDataNode.id
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        objectId: newObjectId,
                      },
                    }
                  : n
              )
            )
          }}
        />
      )}
      {selectedSaveNode && (
        <SaveNodePanel
          open={!!selectedSaveNode}
          onClose={() => setSelectedSaveNode(null)}
          nodeId={selectedSaveNode.id}
          nodeName={selectedSaveNode.data?.label}
          initialConfig={selectedSaveNode.data?.config as SaveNodeConfig}
          onConfigChange={(config) => handleSaveConfigChange(selectedSaveNode.id, config)}
          objectId={selectedSaveNode.data?.objectId}
          flowId={currentFlowId}
          onObjectIdChange={(newObjectId) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === selectedSaveNode.id
                  ? {
                      ...n,
                      data: {
                        ...n.data,
                        objectId: newObjectId,
                      },
                    }
                  : n
              )
            )
          }}
        />
      )}
      <SaveDagModal
        open={isSaveModalOpen}
        dagName={dagName}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
        onNameChange={setDagName}
        isLoading={isSaving}
      />
      <LoadDagModal
        open={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onLoad={handleLoadFlow}
      />

      {/* Execution Log Modal */}
      {isExecuting && executionLog.length > 0 && (
        <div className="dag-execution-log-overlay">
          <div className="dag-execution-log">
            <div className="dag-execution-log-header">
              <h3>Workflow Execution</h3>
              <button onClick={() => setIsExecuting(false)} className="dag-execution-log-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="dag-execution-log-content">
              {executionLog.map((log, idx) => (
                <div key={idx} className="dag-execution-log-line">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DagPage
