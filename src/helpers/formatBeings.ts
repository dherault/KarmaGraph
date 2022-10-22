import { GraphType } from '../types'

function formatBeings(graph: GraphType) {
  let result = ''

  graph.nodes.forEach((node, i) => {
    result += `${node.id}:${node.being}`

    if (i < graph.nodes.length - 1) result += ' | '
  })

  return result
}

export default formatBeings
