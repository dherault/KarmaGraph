import { Button, Div, Span } from 'honorable'
import cloneDeep from 'lodash.clonedeep'
import { useCallback, useContext } from 'react'

import GraphContext from '../contexts/GraphContext'
import StepsContext from '../contexts/StepsContext'
import TransactionContext from '../contexts/TransactionContext'
import IsKarmicDeptAllowedContext from '../contexts/IsKarmicDeptAllowedContext'
import IsKarmicDepletionContext from '../contexts/IsKarmicDepletionContext'

import formatGraph from '../helpers/formatGraph'

import { NodeType, PsyType } from '../types'

import KarmicDepletionWarning from './KarmicDepletionWarning'

function Executor() {
  const { graph, setGraph } = useContext(GraphContext)
  const { fromNodeId, thirdNodeId } = useContext(TransactionContext)
  const { steps, setSteps, currentStepIndex, setCurrentStepIndex } = useContext(StepsContext)
  const { isKarmicDeptAllowed } = useContext(IsKarmicDeptAllowedContext)
  const { setIsKarmicDepletion } = useContext(IsKarmicDepletionContext)

  const executePsy = useCallback((goalNode: NodeType, fromNode: NodeType, toNode: NodeType, psy: PsyType) => {
    const { cost, fun } = psy
    const alterNodeId = thirdNodeId || fromNode.id

    if (!isKarmicDeptAllowed && (fromNode.karma[alterNodeId] < cost || toNode.karma[fromNode.id] < cost)) return false

    // Give
    fromNode.karma[alterNodeId] -= cost
    toNode.karma[alterNodeId] += cost
    // Take
    fromNode.karma[toNode.id] += cost
    toNode.karma[fromNode.id] -= cost
    // Effectuate
    goalNode.being = fun(goalNode.being)

    return true
  }, [thirdNodeId, isKarmicDeptAllowed])

  const executeStep = useCallback(() => {
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

    if (success) {
      setGraph(formatGraph(nextGraph))
      setCurrentStepIndex(currentStepIndex + 1)
      setIsKarmicDepletion(false)
    }
    else {
      setIsKarmicDepletion(true)

      return
    }

    setSteps(steps => steps.map((s, i) => i === currentStepIndex ? { ...s, result: goalNode.being } : s))
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
          xflex="x4"
          key={step.label}
          mt={0.5}
          gap={0.5}
        >
          <Span visibility={i === currentStepIndex ? 'visible' : 'hidden'}>
            •
          </Span>
          <Span>
            {step.from} {'-->'} {step.to} : {step.label} - {step.result || 'upcoming'}
          </Span>
        </Div>
      ))}
      <Div
        xflex="x4"
        mt={1}
        gap={1}
      >
        {currentStepIndex < steps.length && (
          <Button onClick={executeStep}>
            Execute
          </Button>
        )}
        {currentStepIndex === steps.length && (
          <Button onClick={resetSteps}>
            Reset
          </Button>
        )}
        <KarmicDepletionWarning />
      </Div>
    </Div>
  )
}

export default Executor
