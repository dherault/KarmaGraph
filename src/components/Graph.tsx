import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Div, MenuItem, Select } from 'honorable'
import * as vis from 'vis-network'

import { PsyType, StepsType } from '../types'
import graphNameToGraph from '../graphs'

import GraphContext, { GraphContextType } from '../contexts/GraphContext'
import StepsContext, { StepsContextType } from '../contexts/StepsContext'
import TransactionContext, { TransactionContextType } from '../contexts/TransactionContext'
import IsKarmicDepletionContext, { IsKarmicDepletionContextType } from '../contexts/IsKarmicDepletionContext'

import formatGraph from '../helpers/formatGraph'

import TransactionSelector from './TransactionSelector'
import Executor from './Executor'
import KarmicDepletionWarning from './KarmicDepletionWarning'

const options = {
  physics: {
    barnesHut: {
      gravitationalConstant: -1000,
      centralGravity: 0.1,
      springLength: 400,
      springConstant: 0.05,
      damping: 0.09,
    },
    repulsion: {
      centralGravity: 0.1,
      springLength: 50,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09,
    },
  },
}

function Graph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [network, setNetwork] = useState<vis.Network | null>(null)
  const [graphName, setGraphName] = useState(Object.keys(graphNameToGraph)[0])
  const [graph, setGraph] = useState(formatGraph(graphNameToGraph[graphName]))
  const [fromNodeId, setFromNodeId] = useState<string>('')
  const [toNodeId, setToNodeId] = useState<string>('')
  const [psyId, setPsyId] = useState<string>('')
  const [steps, setSteps] = useState<StepsType>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isKarmicDepletion, setIsKarmicDepletion] = useState(false)

  const graphContextValue = useMemo<GraphContextType>(() => ({ graph, setGraph }), [graph])
  const transactionContextValue = useMemo<TransactionContextType>(() => ({
    fromNodeId,
    setFromNodeId,
    toNodeId,
    setToNodeId,
    psyId,
    setPsyId,
  }), [fromNodeId, toNodeId, psyId])
  const stepsContextValue = useMemo<StepsContextType>(() => ({ steps, setSteps, currentStepIndex, setCurrentStepIndex }), [steps, currentStepIndex])
  const isKarmicDepletionContextValue = useMemo<IsKarmicDepletionContextType>(() => ({ isKarmicDepletion, setIsKarmicDepletion }), [isKarmicDepletion])

  const connectedNodes = useMemo(() => {
    if (!graph) return []

    const connectedEdges = graph.edges.filter(e => e.from === fromNodeId)

    return graph.nodes.filter(n => connectedEdges.some(e => e.to === n.id))
  }, [graph, fromNodeId])

  const toNode = useMemo(() => connectedNodes.find(n => n.id === toNodeId), [connectedNodes, toNodeId])

  const addSteps = useCallback((steps: StepsType, fromNodeId: string, toNodeId: string, psy: PsyType) => {
    const { id, composition } = psy

    composition.forEach(composable => {
      const [nodeId, psyId] = composable.split(':')

      const node = graph.nodes.find(n => n.id === nodeId)

      if (!node) return

      const psy = node.psys.find(p => p.id === psyId)

      if (!psy) return

      addSteps(steps, toNodeId, nodeId, psy)
    })

    steps.unshift({
      label: id,
      from: fromNodeId,
      to: toNodeId,
      psy,
      result: '',
    })
  }, [graph])

  const load = useCallback(() => {
    if (!toNode) return

    const psy = toNode.psys.find(p => p.id === psyId)

    if (!psy) return

    const steps: StepsType = []

    addSteps(steps, fromNodeId, toNode.id, psy)

    console.log('steps', steps)

    setSteps(steps)
  }, [fromNodeId, toNode, psyId, addSteps, setSteps])

  const reset = useCallback(() => {
    setGraph(formatGraph(graphNameToGraph[graphName]))
  }, [graphName])

  useEffect(() => {
    if (!graphNameToGraph[graphName]) return

    setGraph(formatGraph(graphNameToGraph[graphName]))
  }, [graphName])

  useEffect(() => {
    if (!graph) return

    setFromNodeId(graph.nodes[0].id)
  }, [graph])

  useEffect(() => {
    const firstConnectedNode = connectedNodes[0]

    if (!firstConnectedNode) {
      setToNodeId('')
      setPsyId('')

      return
    }

    setToNodeId(firstConnectedNode.id)
    setPsyId(firstConnectedNode.psys[0]?.id || '')
    setCurrentStepIndex(0)
  }, [connectedNodes, setCurrentStepIndex])

  useEffect(() => {
    if (!toNodeId) return

    setPsyId(graph.nodes.find(n => n.id === toNodeId)?.psys[0]?.id || '')
  }, [graph, toNodeId])

  useEffect(() => {
    if (!containerRef.current) return

    setNetwork(new vis.Network(containerRef.current, graph, options))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!network) return

    network.setData(graph)
  }, [network, graph])

  useEffect(() => {
    load()
  }, [load])

  return (
    <GraphContext.Provider value={graphContextValue}>
      <TransactionContext.Provider value={transactionContextValue}>
        <StepsContext.Provider value={stepsContextValue}>
          <IsKarmicDepletionContext.Provider value={isKarmicDepletionContextValue}>
            <Div
              postion="relative"
              width="100vw"
              height="100vh"
            >
              <Div
                ref={containerRef}
                width="100vw"
                height="100vh"
              />
              <Div
                xflex="x41"
                position="absolute"
                top={0}
                left={0}
                p={1}
                gap={1}
              >
                <Select
                  value={graphName}
                  onChange={event => setGraphName(event.target.value)}
                >
                  {Object.keys(graphNameToGraph).map(graphName => (
                    <MenuItem
                      key={graphName}
                      value={graphName}
                    >
                      {graphName}
                    </MenuItem>
                  ))}
                </Select>
                <Button onClick={reset}>Reset</Button>
              </Div>
              <TransactionSelector
                connectedNodes={connectedNodes}
                toNode={toNode}
              />
              <Executor />
              <KarmicDepletionWarning />
            </Div>
          </IsKarmicDepletionContext.Provider>
        </StepsContext.Provider>
      </TransactionContext.Provider>
    </GraphContext.Provider>
  )
}

export default Graph
