import { Button, Div } from 'honorable'
import cloneDeep from 'lodash.clonedeep'
import { useCallback, useContext } from 'react'

import GraphContext from '../contexts/GraphContext'
import StepsContext from '../contexts/StepsContext'
import TransactionContext from '../contexts/TransactionContext'
import IsKarmicDeptAllowedContext from '../contexts/IsKarmicDeptAllowedContext'
import IsKarmicThirdPartyTransactionAllowedContext from '../contexts/IsKarmicThirdPartyTransactionAllowedContext'
import IsKarmicDepletionContext from '../contexts/IsKarmicDepletionContext'

import formatGraph from '../helpers/formatGraph'

import { NodeType, PsyType } from '../types'

function Executor() {
  const { graph, setGraph } = useContext(GraphContext)
  const { fromNodeId } = useContext(TransactionContext)
  const { steps, setSteps, currentStepIndex, setCurrentStepIndex } = useContext(StepsContext)
  const { isKarmicDeptAllowed } = useContext(IsKarmicDeptAllowedContext)
  const { isKarmicThirdPartyTransactionAllowed } = useContext(IsKarmicThirdPartyTransactionAllowedContext)
  const { setIsKarmicDepletion } = useContext(IsKarmicDepletionContext)

  const executePsy = useCallback((goalNode: NodeType, fromNode: NodeType, toNode: NodeType, psy: PsyType) => {
    const { cost, fun } = psy

    if (fromNode.karma[fromNode.id] < cost) return false
    if (!isKarmicDeptAllowed && toNode.karma[fromNode.id] < cost) return false

    fromNode.karma[fromNode.id] -= cost
    fromNode.karma[toNode.id] += cost
    toNode.karma[fromNode.id] -= cost
    toNode.karma[toNode.id] += cost
    goalNode.being = fun(goalNode.being)

    return true
  }, [isKarmicDeptAllowed])

  const executeStep = useCallback(() => {
    console.log('currentStepIndex', currentStepIndex)
    const step = steps[currentStepIndex]

    if (!step) return

    const nextGraph = cloneDeep(graph)
    const goalNode = nextGraph.nodes.find(n => n.id === fromNodeId)

    if (!goalNode) return

    const { from, to, psy } = step

    const fromNode = nextGraph.nodes.find(n => n.id === from)

    if (!fromNode) return

    const toNode = nextGraph.nodes.find(n => n.id === to)

    if (!toNode) return

    const success = executePsy(goalNode, fromNode, toNode, psy)

    // console.log('nextGraph', nextGraph)

    if (success) {
      setGraph(formatGraph(nextGraph))
      setCurrentStepIndex(currentStepIndex + 1)
      setIsKarmicDepletion(false)
    }
    else {
      setIsKarmicDepletion(true)

      return
    }

    const result = goalNode.being

    setSteps(steps => steps.map((s, i) => i === currentStepIndex ? { ...s, result } : s))
  }, [graph, setGraph, setIsKarmicDepletion, fromNodeId, steps, setSteps, currentStepIndex, setCurrentStepIndex, executePsy])

  const resetSteps = useCallback(() => {
    setCurrentStepIndex(0)
    setSteps(steps => steps.map(s => ({ ...s, result: '' })))
  }, [setCurrentStepIndex, setSteps])

  return (
    <Div
      position="absolute"
      bottom={0}
      leftt={0}
      p={1}
    >
      {steps.map((step, i) => (
        <Div
          key={step.label}
          mt={0.5}
        >
          {i === currentStepIndex ? '+' : '-'} {step.from} {'-->'} {step.to} : {step.label} - {step.result || 'upcoming'}
        </Div>
      ))}
      {currentStepIndex < steps.length && (
        <Button
          onClick={executeStep}
          mt={1}
        >
          Execute
        </Button>
      )}
      {currentStepIndex === steps.length && (
        <Button
          onClick={resetSteps}
          mt={1}
        >
          Reset
        </Button>
      )}
    </Div>
  )
}

export default Executor
