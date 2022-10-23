import { useCallback, useContext, useEffect } from 'react'
import { Button, Div, DivProps, H2, MenuItem, Select, Span } from 'honorable'
import cloneDeep from 'lodash.clonedeep'
import { MdPlaylistPlay, MdReplay } from 'react-icons/md'

import GraphContext from '../contexts/GraphContext'
import TransactionCohortContext from '../contexts/TransactionCohortContext'
import TransactionContext from '../contexts/TransactionContext'
import TransactionsHistoryContext from '../contexts/TransactionsHistoryContext'
import IsKarmicDeptAllowedContext from '../contexts/IsKarmicDeptAllowedContext'
import ShouldUseKarmicThirdPartyTransactionContext from '../contexts/ShouldUseKarmicThirdPartyTransactionContext'
import IsKarmicDepletionContext from '../contexts/IsKarmicDepletionContext'

import formatGraph from '../helpers/formatGraph'
import formatBeings from '../helpers/formatBeings'

import { NodeType, PsyType } from '../types'

import KarmicDepletionWarning from './KarmicDepletionWarning'
import Transaction from './Transaction'

function Executor(props: DivProps) {
  /* --
    * CONTEXTS
  -- */
  const { graph, setGraph } = useContext(GraphContext)
  const { thirdNodeId, setThirdNodeId } = useContext(TransactionContext)
  const { transactionCohort, setTransactionCohort, currentTransactionIndex, setCurrentTransactionIndex } = useContext(TransactionCohortContext)
  const { setTransactionsHistory } = useContext(TransactionsHistoryContext)
  const { isKarmicDeptAllowed } = useContext(IsKarmicDeptAllowedContext)
  const { shouldUseKarmicThirdPartyTransaction } = useContext(ShouldUseKarmicThirdPartyTransactionContext)
  const { isKarmicDepletion, setIsKarmicDepletion } = useContext(IsKarmicDepletionContext)

  /* --
    * HANDLERS
  -- */
  const executePsy = useCallback((fromNode: NodeType, toNode: NodeType, thirdNode: NodeType | null, psy: PsyType, cohortNodeHistory: NodeType[]) => {
    const { cost, fun } = psy
    const alterFromNodeId = thirdNode ? thirdNode.id : fromNode.id
    const alterToNodeId = thirdNode ? thirdNode.id : toNode.id

    if (!isKarmicDeptAllowed && (fromNode.karma[alterFromNodeId] < cost || toNode.karma[fromNode.id] < cost)) return false

    // Effectuate
    // The cost should be returned by the psy function
    const results = fun(...cohortNodeHistory.map(n => n.being))

    cohortNodeHistory.forEach((n, i) => n.being = results[i])

    // Give
    fromNode.karma[alterFromNodeId] -= cost
    toNode.karma[alterToNodeId] += cost

    // Take
    toNode.karma[fromNode.id] -= cost
    fromNode.karma[toNode.id] += cost

    if (thirdNode) {
      thirdNode.karma[fromNode.id] += cost
      thirdNode.karma[toNode.id] -= cost
    }

    return true
  }, [isKarmicDeptAllowed])

  const executeStep = useCallback(() => {
    const transaction = transactionCohort[currentTransactionIndex]

    if (!transaction) return

    const { fromNodeId, toNodeId, thirdNodeId, psyId } = transaction
    const nextGraph = cloneDeep(graph)
    const fromNode = nextGraph.nodes.find(n => n.id === fromNodeId)

    if (!fromNode) return

    const toNode = nextGraph.nodes.find(n => n.id === toNodeId)

    if (!toNode) return

    let thirdNode = null

    if (thirdNodeId) {
      thirdNode = nextGraph.nodes.find(n => n.id === thirdNodeId)

      if (!thirdNode) return
    }

    const psy = toNode.psys.find(p => p.id === psyId)

    if (!psy) return

    const cohortNodeHistory: NodeType[] = []

    for (let i = 0; i <= currentTransactionIndex; i++) {
      const node = nextGraph.nodes.find(n => n.id === transactionCohort[i].fromNodeId)

      if (!node) return

      cohortNodeHistory.push(node)
    }

    const success = executePsy(fromNode, toNode, thirdNode, psy, cohortNodeHistory)

    if (success) {
      cohortNodeHistory.forEach(n => {
        const node = nextGraph.nodes.find(node => node.id === n.id)

        if (!node) return

        node.being = n.being
      })

      setGraph(formatGraph(nextGraph))
      setCurrentTransactionIndex(currentTransactionIndex + 1)
      setIsKarmicDepletion(false)
    }
    else {
      setIsKarmicDepletion(true)

      return
    }

    const formatedOutput = formatBeings(nextGraph)

    setTransactionCohort(transactionCohort.map((t, i) => i === currentTransactionIndex ? { ...t, formatedOutput } : t))
    setTransactionsHistory(transactions => [...transactions, { ...transaction, formatedOutput }])
  }, [
    graph,
    setGraph,
    setIsKarmicDepletion,
    currentTransactionIndex,
    setCurrentTransactionIndex,
    transactionCohort,
    setTransactionCohort,
    setTransactionsHistory,
    executePsy,
  ])

  const resetSteps = useCallback(() => {
    setCurrentTransactionIndex(0)
    setTransactionCohort(transactionCohort => transactionCohort.map(t => ({ ...t, formatedOutput: '' })))
  }, [setCurrentTransactionIndex, setTransactionCohort])

  /* --
    * EFFECTS
  -- */
  // TODO in honorable: export HonorableChangeValueEvent and HonorableChangeCheckedEvent
  useEffect(() => {
    setTransactionCohort(transactionCohort => transactionCohort.map((transaction, i) => i === currentTransactionIndex ? { ...transaction, thirdNodeId } : transaction))
  }, [setTransactionCohort, currentTransactionIndex, thirdNodeId])

  useEffect(() => {
    if (shouldUseKarmicThirdPartyTransaction) {
      const transaction = transactionCohort[currentTransactionIndex]

      if (!transaction) return

      setThirdNodeId(transaction ? graph.nodes.filter(n => n.id !== transaction.fromNodeId && n.id !== transaction.toNodeId)[0]?.id || '' : '')
    }
    else {
      setThirdNodeId('')
    }
  }, [
    shouldUseKarmicThirdPartyTransaction,
    transactionCohort,
    currentTransactionIndex,
    graph,
    setThirdNodeId,
  ])

  /* --
    * RETURN
  -- */
  return (
    <Div
      height="100%"
      overflow="auto"
      p={1}
      {...props}
    >
      <Div
        xflex="x5b"
        gap={1}
      >
        <H2>
          Cohort
        </H2>
        {currentTransactionIndex < transactionCohort.length && (
          <Button onClick={executeStep}>
            <MdPlaylistPlay />
          </Button>
        )}
        {currentTransactionIndex === transactionCohort.length && (
          <Button onClick={resetSteps}>
            <MdReplay />
          </Button>
        )}
      </Div>
      <Div mt={0.5}>
        <KarmicDepletionWarning />
      </Div>
      <Div
        xflex="y2s"
        gap={0.5}
        mt={0.5}
      >
        {transactionCohort.map((transaction, i) => (
          <Div
            xflex="x4"
            key={transaction.id}
            mt={0.5}
            gap={0.5}
          >
            <Span
              color={isKarmicDepletion ? 'danger' : 'success'}
              visibility={i === currentTransactionIndex ? 'visible' : 'hidden'}
            >
              •
            </Span>
            <Transaction transaction={transaction} />
            {shouldUseKarmicThirdPartyTransaction && i === currentTransactionIndex && (
              <Select
                value={thirdNodeId}
                onChange={event => setThirdNodeId(event.target.value)}
                width="unset"
                minWidth="unset" // TODO in honorable
              >
                {Object.values(graph.nodes)
              .filter(node => node.id !== transaction.fromNodeId && node.id !== transaction.toNodeId)
              .map(node => (
                <MenuItem
                  key={node.id}
                  value={node.id}
                >
                  {node.id}
                </MenuItem>
              ))}
              </Select>
            )}
          </Div>
        ))}
      </Div>
    </Div>
  )
}

export default Executor
