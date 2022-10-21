import cloneDeep from 'lodash.clonedeep'

import { GraphType, NodeType } from '../types'

function formatKarma(node: NodeType) {
  let result = ''
  const entries = Object.entries(node.karma).sort(a => a[0] === node.id ? -1 : 1)

  entries.forEach(([key, value], i) => {
    result += `${key}: ${value}`

    if (i < entries.length - 1) result += '\n'
  })

  return result
}

function formatGraph(graph: GraphType) {
  const nextGraph = cloneDeep(graph)

  nextGraph.nodes.forEach(node => {
    node.label = `${node.id}\n${formatKarma(node)}`
  })

  return nextGraph
}

export default formatGraph
