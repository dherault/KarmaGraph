import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Div, MenuItem, Select } from 'honorable'
import * as vis from 'vis-network'
import cloneDeep from 'lodash.clonedeep'

import { NodeType, PsyType, StepsType } from '../types'
import graphNameToGraph from '../graphs'

import StepsContext from '../contexts/StepsContext'

import Executor from './Executor'

const options = {
  physics: {
    barnesHut: {
      enabled: true,
      gravitationalConstant: -2000,
      centralGravity: 0.1,
      springLength: 200,
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

function formatKarma(node: NodeType) {
  let result = ''
  const entries = Object.entries(node.karma).sort(a => a[0] === node.id ? -1 : 1)

  entries.forEach(([key, value], i) => {
    result += `${key}: ${value}`

    if (i < entries.length - 1) result += ' / '
  })

  return result
}

function Graph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentStepIndex, setSteps } = useContext(StepsContext)
  const [network, setNetwork] = useState<vis.Network | null>(null)
  const [graphName, setGraphName] = useState('Two individuals')
  const [selectedFromNodeId, setSelectedFromNodeId] = useState<string>('')
  const [selectedToNodeId, setSelectedToNodeId] = useState<string>('')
  const [selectedPsyId, setSelectedPsyId] = useState<string>('')

  const graph = useMemo(() => graphNameToGraph[graphName], [graphName])
  const connectedNodes = useMemo(() => {
    if (!graph) return []

    const connectedEdges = graph.edges.filter(e => e.from === selectedFromNodeId)

    return graph.nodes.filter(n => connectedEdges.some(e => e.to === n.id))
  }, [graph, selectedFromNodeId])
  const selectedToNode = useMemo(() => connectedNodes.find(n => n.id === selectedToNodeId), [connectedNodes, selectedToNodeId])
  const graphWithMetadata = useMemo(() => {
    const nextGraph = cloneDeep(graph)

    nextGraph.nodes.forEach(node => {
      node.label = `${node.id}\n${formatKarma(node)}`
    })

    return nextGraph
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, currentStepIndex])

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
    if (!selectedToNode) return

    const psy = selectedToNode.psys.find(p => p.id === selectedPsyId)

    if (!psy) return

    const steps: StepsType = []

    addSteps(steps, selectedFromNodeId, selectedToNode.id, psy)

    console.log('steps', steps)

    setSteps(steps)
  }, [selectedFromNodeId, selectedToNode, selectedPsyId, addSteps, setSteps])

  useEffect(() => {
    if (!graph) return

    const firstNodeId = graph.nodes[0].id

    setSelectedFromNodeId(firstNodeId)
  }, [graph])

  useEffect(() => {
    const firstConnectedNode = connectedNodes[0]

    if (!firstConnectedNode) {
      setSelectedToNodeId('')
      setSelectedPsyId('')

      return
    }

    setSelectedToNodeId(firstConnectedNode.id)
    setSelectedPsyId(firstConnectedNode.psys[0]?.id || '')
  }, [connectedNodes])

  useEffect(() => {
    if (!selectedToNodeId) return

    setSelectedPsyId(graph.nodes.find(n => n.id === selectedToNodeId)?.psys[0]?.id || '')
  }, [graph, selectedToNodeId])

  useEffect(() => {
    if (!containerRef.current) return

    setNetwork(new vis.Network(containerRef.current, graphWithMetadata, options))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!network) return

    network.setData(graphWithMetadata)
  }, [network, graphWithMetadata])

  useEffect(() => {
    load()
  }, [load])

  return (
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
        <Select
          value={selectedFromNodeId}
          onChange={event => setSelectedFromNodeId(event.target.value)}
          width={64}
        >
          {Object.values(graph.nodes).map(node => (
            <MenuItem
              key={node.id}
              value={node.id}
            >
              {node.label}
            </MenuItem>
          ))}
        </Select>
        {connectedNodes.length && (
          <Select
            value={selectedToNodeId}
            onChange={event => setSelectedToNodeId(event.target.value)}
            width={64}
          >
            {connectedNodes.map(node => (
              <MenuItem
                key={node.id}
                value={node.id}
              >
                {node.label}
              </MenuItem>
            ))}
          </Select>
        )}
        {selectedToNode && (
          <Select
            value={selectedPsyId}
            onChange={event => setSelectedPsyId(event.target.value)}
            width={64}
          >
            {selectedToNode.psys.map(psy => (
              <MenuItem
                key={psy.id}
                value={psy.id}
              >
                {psy.id}
              </MenuItem>
            ))}
          </Select>
        )}
      </Div>
      <Executor
        graph={graph}
        selectedNodeId={selectedFromNodeId}
      />
    </Div>
  )
}

export default Graph
