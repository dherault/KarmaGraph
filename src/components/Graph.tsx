import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Div, MenuItem, Select, Switch } from 'honorable'
import * as vis from 'vis-network'
import { MdOutlineGridOn } from 'react-icons/md'

import cloneDeep from 'lodash.clonedeep'

import { TransactionCohortType, TransactionType } from '../types'
import graphNameToGraph from '../graphs'

import GraphContext, { GraphContextType } from '../contexts/GraphContext'
import TransactionCohort, { TransactionCohortContextType } from '../contexts/TransactionCohortContext'
import TransactionContext, { TransactionContextType } from '../contexts/TransactionContext'
import TransactionsHistoryContext, { TransactionsHistoryContextType } from '../contexts/TransactionsHistoryContext'
import IsKarmicDeptAllowedContext, { IsKarmicDeptAllowedContextType } from '../contexts/IsKarmicDeptAllowedContext'
import ShouldUseKarmicThirdPArtyTransaction, { ShouldUseKarmicThirdPartyTransactionContextType } from '../contexts/ShouldUseKarmicThirdPartyTransactionContext'
import IsKarmicDepletionContext, { IsKarmicDepletionContextType } from '../contexts/IsKarmicDepletionContext'

import formatGraph from '../helpers/formatGraph'

import TransactionsHistory from './TransactionsHistory'
import TransactionSelector from './TransactionSelector'
import Executor from './Executor'
import KarmaMatrixModal from './KarmaMatrixModal'

const options = {
  physics: {
    barnesHut: {
      gravitationalConstant: -1,
      centralGravity: 0.001,
      springLength: 300,
      springConstant: 0.0333,
      damping: 0.09,
    },
    repulsion: {
      centralGravity: 1,
      springLength: 200,
      springConstant: 1,
      nodeDistance: 600,
      damping: 0.05,
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
  const [thirdNodeId, setThirdNodeId] = useState<string>('')
  const [psyId, setPsyId] = useState<string>('')
  const [transactionCohort, setTransactionCohort] = useState<TransactionCohortType>([])
  const [transactionsHistory, setTransactionsHistory] = useState<TransactionType[]>([])
  const [currentTransactionIndex, setCurrentTransactionIndex] = useState(0)
  const [isKarmicDeptAllowed, setIsKarmicDeptAllowed] = useState(false)
  const [shouldUseKarmicThirdPartyTransaction, setShouldUseKarmicThirdPartyTransaction] = useState(true)
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
    thirdNodeId,
    setThirdNodeId,
    psyId,
    setPsyId,
  }), [fromNodeId, toNodeId, thirdNodeId, psyId])
  const transactionCohortContextValue = useMemo<TransactionCohortContextType>(() => ({ transactionCohort, setTransactionCohort, currentTransactionIndex, setCurrentTransactionIndex }), [transactionCohort, currentTransactionIndex])
  const transactionsHistoryContextValue = useMemo<TransactionsHistoryContextType>(() => ({ transactionsHistory, setTransactionsHistory }), [transactionsHistory])
  const isKarmicDeptAllowedContextValue = useMemo<IsKarmicDeptAllowedContextType>(() => ({ isKarmicDeptAllowed, setIsKarmicDeptAllowed }), [isKarmicDeptAllowed])
  const shouldUseKarmicThirdPartyTransactionContextValue = useMemo<ShouldUseKarmicThirdPartyTransactionContextType>(() => ({ shouldUseKarmicThirdPartyTransaction, setShouldUseKarmicThirdPartyTransaction }), [shouldUseKarmicThirdPartyTransaction])
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
  const createTransactions = useCallback((fromNodeId: string, toNodeId: string, psyId: string) => {
    const transactions: TransactionType[] = []
    const toNode = unchangedGraph.nodes.find(n => n.id === toNodeId)

    if (!toNode) return transactions

    const psy = toNode.psys.find(p => p.id === psyId)

    if (!psy) return transactions

    psy.composition.forEach(composable => {
      const [nodeId, psyId] = composable.split(':')

      transactions.push(...createTransactions(toNodeId, nodeId, psyId))
    })

    transactions.unshift({
      id: Math.random().toString().slice(2),
      fromNodeId,
      toNodeId,
      thirdNodeId: '',
      psyId,
      formatedOutput: '',
    })

    return transactions
  }, [unchangedGraph])

  const load = useCallback(() => {
    if (!(fromNodeId && toNodeId && psyId)) return

    setTransactionCohort(createTransactions(fromNodeId, toNodeId, psyId))
  }, [fromNodeId, toNodeId, psyId, createTransactions])

  const reset = useCallback(() => {
    if (!graphNameToGraph[graphName]) return

    const nextGraph = formatGraph(graphNameToGraph[graphName])

    setGraph(nextGraph)
    setUnchangedGraph(nextGraph)
    setTransactionsHistory([])
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
    setCurrentTransactionIndex(0)
  }, [connectedNodes, setCurrentTransactionIndex])

  useEffect(() => {
    if (!toNodeId) return

    setPsyId(graph.nodes.find(n => n.id === toNodeId)?.psys[0]?.id || '')
  }, [graph, toNodeId])

  useEffect(() => {
    if (graph.nodes.length < 3) {
      setShouldUseKarmicThirdPartyTransaction(false)
    }
  }, [graph])

  useEffect(() => {
    if (!containerRef.current) return

    setNetwork(new vis.Network(containerRef.current, graph, options))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!network) return

    network.setData(graph)
    setIsKarmicDepletion(false)
  }, [network, graph])

  /* --
    * RETURN
  -- */
  return (
    <GraphContext.Provider value={graphContextValue}>
      <TransactionContext.Provider value={transactionContextValue}>
        <TransactionCohort.Provider value={transactionCohortContextValue}>
          <TransactionsHistoryContext.Provider value={transactionsHistoryContextValue}>
            <IsKarmicDeptAllowedContext.Provider value={isKarmicDeptAllowedContextValue}>
              <ShouldUseKarmicThirdPArtyTransaction.Provider value={shouldUseKarmicThirdPartyTransactionContextValue}>
                <IsKarmicDepletionContext.Provider value={isKarmicDepletionContextValue}>
                  <Div xflex="x2s">
                    <Div
                      position="relative"
                      width="75vw"
                      height="100vh"
                    >
                      <Div
                        ref={containerRef}
                        width="100%"
                        height="100%"
                      />
                      <Div
                        xflex="y11"
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
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
                          <TransactionSelector
                            connectedNodes={connectedNodes}
                            toNode={toNode}
                          />
                          <Button onClick={() => setIsKarmaMatrixModalOpen(true)}>
                            <MdOutlineGridOn />
                          </Button>
                          <Button onClick={reset}>
                            Reset
                          </Button>
                        </Div>
                        <Div
                          xflex="y11"
                          gap={1}
                        >
                          {graph.nodes.length >= 3 && (
                            <Switch
                              checked={shouldUseKarmicThirdPartyTransaction}
                              onChange={event => setShouldUseKarmicThirdPartyTransaction(event.target.checked)}
                            >
                              Use 3rd party for next transaction
                            </Switch>
                          )}
                          <Switch
                            checked={isKarmicDeptAllowed}
                            onChange={event => setIsKarmicDeptAllowed(event.target.checked)}
                          >
                            Allow karmic dept
                          </Switch>
                        </Div>
                      </Div>
                    </Div>
                    <Div
                      xflex="y2s"
                      width="25vw"
                      height="100vh"
                      borderLeft="1px solid border"
                    >
                      <Div height="25vh">
                        <Executor />
                      </Div>
                      <Div
                        height="75vh"
                        borderTop="1px solid border"
                      >
                        <TransactionsHistory />
                      </Div>
                    </Div>
                  </Div>
                  <KarmaMatrixModal
                    open={isKarmaMatrixModalOpen}
                    onClose={() => setIsKarmaMatrixModalOpen(false)}
                  />
                </IsKarmicDepletionContext.Provider>
              </ShouldUseKarmicThirdPArtyTransaction.Provider>
            </IsKarmicDeptAllowedContext.Provider>
          </TransactionsHistoryContext.Provider>
        </TransactionCohort.Provider>
      </TransactionContext.Provider>
    </GraphContext.Provider>
  )
}

export default Graph
