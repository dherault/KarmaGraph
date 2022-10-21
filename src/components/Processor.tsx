import { Button, Div } from 'honorable'
import { useCallback, useContext } from 'react'

import StepsContext from '../contexts/StepsContext'

import { GraphType, PsyType, StepsType } from '../types'

type ProcessorProps = {
  graph: GraphType
  fromNodeId: string
  toNodeId: string
  psyId: string
}

function Processor({ graph, fromNodeId, toNodeId, psyId }: ProcessorProps) {
  const { setSteps } = useContext(StepsContext)

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
    const toNode = graph.nodes.find(n => n.id === toNodeId)

    if (!toNode) return

    const psy = toNode.psys.find(p => p.id === psyId)

    if (!psy) return

    const steps: StepsType = []

    addSteps(steps, fromNodeId, toNodeId, psy)

    console.log('steps', steps)

    setSteps(steps)
  }, [graph, fromNodeId, toNodeId, psyId, addSteps, setSteps])

  return (
    <Button onClick={load}>
      Load
    </Button>
  )
}

export default Processor
