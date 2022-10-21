import { Button, Div } from 'honorable'
import { useCallback, useContext } from 'react'

import StepsContext from '../contexts/StepsContext'

import { GraphType, NodeType, PsyType } from '../types'

type ExecutorProps = {
  graph: GraphType
  selectedNodeId: string
}

function Executor({ graph, selectedNodeId }: ExecutorProps) {
  const { steps, setSteps, currentStepIndex, setCurrentStepIndex } = useContext(StepsContext)

  const executePsy = useCallback((goalNode: NodeType, fromNode: NodeType, toNode: NodeType, psy: PsyType) => {
    const { cost, fun } = psy
    const fromKarma = fromNode.karma[fromNode.id]

    if (fromKarma < cost) return false

    fromNode.karma[fromNode.id] -= cost
    fromNode.karma[toNode.id] += cost
    toNode.karma[fromNode.id] -= cost
    toNode.karma[toNode.id] += cost
    goalNode.being = fun(goalNode.being)

    return true
  }, [])

  const executeStep = useCallback(() => {
    const step = steps[currentStepIndex]

    if (!step) return

    const goalNode = graph.nodes.find(n => n.id === selectedNodeId)

    if (!goalNode) return

    const { from, to, psy } = step

    const fromNode = graph.nodes.find(n => n.id === from)

    if (!fromNode) return

    const toNode = graph.nodes.find(n => n.id === to)

    if (!toNode) return

    const success = executePsy(goalNode, fromNode, toNode, psy)

    if (success) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
    else {
      console.log('Not enough Karma, transaction aborted')

      return
    }

    const result = goalNode.being

    setSteps(steps => steps.map((s, i) => i === currentStepIndex ? { ...s, result } : s))
  }, [graph, selectedNodeId, steps, setSteps, currentStepIndex, setCurrentStepIndex, executePsy])

  const resetSteps = useCallback(() => {
    setCurrentStepIndex(0)
    setSteps([])
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
