import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Div, MenuItem, Select, Switch } from 'honorable'
import * as vis from 'vis-network'

import cloneDeep from 'lodash.clonedeep'

import { PsyType, StepsType } from '../types'
import graphNameToGraph from '../graphs'

import GraphContext, { GraphContextType } from '../contexts/GraphContext'
import StepsContext, { StepsContextType } from '../contexts/StepsContext'
import TransactionContext, { TransactionContextType } from '../contexts/TransactionContext'
import IsKarmicDeptAllowedContext, { IsKarmicDeptAllowedContextType } from '../contexts/IsKarmicDeptAllowedContext'
import IsKarmicThirdPartyTransactionAllowedContext, { IsKarmicThirdPartyTransactionAllowedContextType } from '../contexts/IsKarmicThirdPartyTransactionAllowedContext'
import IsKarmicDepletionContext, { IsKarmicDepletionContextType } from '../contexts/IsKarmicDepletionContext'

import formatGraph from '../helpers/formatGraph'

import TransactionSelector from './TransactionSelector'
import Executor from './Executor'
import KarmaMatrixModal from './KarmaMatrixModal'
import KarmicDepletionWarning from './KarmicDepletionWarning'

const options = {
  physics: {
    barnesHut: {
      gravitationalConstant: -1000,
      centralGravity: 0.05,
      springLength: 200,
      springConstant: 0.0333,
      damping: 0.09,
    },
    repulsion: {
      centralGravity: 0.05,
      springLength: 100,
      springConstant: 1,
      nodeDistance: 100,
      damping: 0.09,
    },
  },
}

function Graph() {
  /* --
    * STATE
  -- */
  const containerRef = useRef<HTMLDivElement>(null)
  const [network, setNetwork] = useState<vis.Network | null>(null)
  const [graphName, setGraphName] = useState(Object.keys(graphNameToGraph)[0])
  const [graph, setGraph] = useState(formatGraph(graphNameToGraph[graphName]))
  const [unchangedGraph, setUnchangedGraph] = useState(cloneDeep(graph))
  const [fromNodeId, setFromNodeId] = useState<string>('')
  const [toNodeId, setToNodeId] = useState<string>('')
  const [psyId, setPsyId] = useState<string>('')
  const [steps, setSteps] = useState<StepsType>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isKarmicDeptAllowed, setIsKarmicDeptAllowed] = useState(false)
  const [isKarmicThirdPartyTransactionAllowed, setIsKarmicThirdPartyTransactionAllowed] = useState(true)
  const [isKarmicDepletion, setIsKarmicDepletion] = useState(false)
  const [isKarmaMatrixModalOpen, setIsKarmaMatrixModalOpen] = useState(false)

  /* --
    * CONTEXTS
  -- */
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
  const isKarmicDeptAllowedContextValue = useMemo<IsKarmicDeptAllowedContextType>(() => ({ isKarmicDeptAllowed, setIsKarmicDeptAllowed }), [isKarmicDeptAllowed])
  const isKarmicThirdPartyTransactionAllowedContextValue = useMemo<IsKarmicThirdPartyTransactionAllowedContextType>(() => ({ isKarmicThirdPartyTransactionAllowed, setIsKarmicThirdPartyTransactionAllowed }), [isKarmicThirdPartyTransactionAllowed])
  const isKarmicDepletionContextValue = useMemo<IsKarmicDepletionContextType>(() => ({ isKarmicDepletion, setIsKarmicDepletion }), [isKarmicDepletion])

  /* --
    * MEMOED
  -- */
  const connectedNodes = useMemo(() => {
    if (!unchangedGraph) return []

    const connectedEdges = unchangedGraph.edges.filter(e => e.from === fromNodeId)

    return unchangedGraph.nodes.filter(n => connectedEdges.some(e => e.to === n.id))
  }, [unchangedGraph, fromNodeId])

  const toNode = useMemo(() => connectedNodes.find(n => n.id === toNodeId), [connectedNodes, toNodeId])

  /* --
    * HELPERS
  -- */
  const addSteps = useCallback((steps: StepsType, fromNodeId: string, toNodeId: string, psy: PsyType) => {
    const { id, composition } = psy

    composition.forEach(composable => {
      const [nodeId, psyId] = composable.split(':')

      const node = unchangedGraph.nodes.find(n => n.id === nodeId)

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
  }, [unchangedGraph])

  const load = useCallback(() => {
    if (!toNode) return

    const psy = toNode.psys.find(p => p.id === psyId)

    if (!psy) return

    const steps: StepsType = []

    addSteps(steps, fromNodeId, toNode.id, psy)
    setSteps(steps)
  }, [fromNodeId, toNode, psyId, addSteps])

  const reset = useCallback(() => {
    if (!graphNameToGraph[graphName]) return

    const nextGraph = formatGraph(graphNameToGraph[graphName])

    setGraph(nextGraph)
    setUnchangedGraph(nextGraph)
  }, [graphName])

  /* --
    * EFFECTS
  -- */
  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    reset()
  }, [reset])

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

  /* --
    * RETURN
  -- */
  return (
    <GraphContext.Provider value={graphContextValue}>
      <TransactionContext.Provider value={transactionContextValue}>
        <StepsContext.Provider value={stepsContextValue}>
          <IsKarmicDeptAllowedContext.Provider value={isKarmicDeptAllowedContextValue}>
            <IsKarmicThirdPartyTransactionAllowedContext.Provider value={isKarmicThirdPartyTransactionAllowedContextValue}>
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
                    xflex="y11"
                    position="absolute"
                    top={0}
                    left={0}
                    p={1}
                    gap={1}
                  >
                    <Div
                      xflex="x41"
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
                      <Button onClick={() => setIsKarmaMatrixModalOpen(true)}>
                        Matrix
                      </Button>
                      <Button onClick={reset}>
                        Reset
                      </Button>
                    </Div>
                    <Div
                      xflex="y11"
                      gap={1}
                    >
                      <Switch
                        checked={isKarmicThirdPartyTransactionAllowed}
                        onChange={event => setIsKarmicThirdPartyTransactionAllowed(event.target.checked)}
                      >
                        Allow 3rd party transactions
                      </Switch>
                      <Switch
                        checked={isKarmicDeptAllowed}
                        onChange={event => setIsKarmicDeptAllowed(event.target.checked)}
                      >
                        Allow karmic dept
                      </Switch>
                    </Div>
                  </Div>
                  <TransactionSelector
                    connectedNodes={connectedNodes}
                    toNode={toNode}
                  />
                  <Executor />
                  <KarmicDepletionWarning />
                </Div>
                <KarmaMatrixModal
                  open={isKarmaMatrixModalOpen}
                  onClose={() => setIsKarmaMatrixModalOpen(false)}
                />
              </IsKarmicDepletionContext.Provider>
            </IsKarmicThirdPartyTransactionAllowedContext.Provider>
          </IsKarmicDeptAllowedContext.Provider>
        </StepsContext.Provider>
      </TransactionContext.Provider>
    </GraphContext.Provider>
  )
}

export default Graph
