import { Div } from 'honorable'
import { useContext, useMemo } from 'react'

import GraphContext from '../contexts/GraphContext'

const cellSize = 32 + 16 + 8 + 4 + 2

function KarmaMatrix() {
  const { graph } = useContext(GraphContext)

  const matrix = useMemo(() => graph.nodes.map(n => graph.nodes.map(node => node.karma[n.id])), [graph])

  return (
    <Div
      width="fit-content"
      borderTop="1px solid border"
      borderLeft="1px solid border"
    >
      <Div
        xflex="x4"
        borderBottom="1px solid border"
      >
        <Div
          width={cellSize}
          height={cellSize}
          flexShrink={0}
          borderRight="1px solid border"
        />
        {graph.nodes.map(node => (
          <Div
            xflex="x5"
            key={node.id}
            width={cellSize}
            height={cellSize}
            flexShrink={0}
            borderRight="1px solid border"
          >
            {node.id}
          </Div>
        ))}
      </Div>
      {matrix.map((row, i) => (
        <Div
          key={i}
          width="fit-content"
          xflex="x4"
          borderBottom="1px solid border"
        >
          <Div
            xflex="x5"
            width={cellSize}
            height={cellSize}
            flexShrink={0}
            borderRight="1px solid border"
          >
            {graph.nodes[i].id}
          </Div>
          {row.map((cell, j) => (
            <Div
              key={j}
              xflex="x5"
              width={cellSize}
              height={cellSize}
              flexShrink={0}
              borderRight="1px solid border"
            >
              {cell}
            </Div>
          ))}
        </Div>
      ))}
    </Div>
  )
}

export default KarmaMatrix
