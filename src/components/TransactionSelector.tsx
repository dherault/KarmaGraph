import { Div, MenuItem, Select } from 'honorable'
import { useContext } from 'react'

import GraphContext from '../contexts/GraphContext'

import TransactionContext from '../contexts/TransactionContext'
import { NodeType } from '../types'

type TransactionSelectorProps = {
  connectedNodes: NodeType[]
  toNode: NodeType | undefined
}

function TransactionSelector({ connectedNodes, toNode }: TransactionSelectorProps) {
  const { graph } = useContext(GraphContext)
  const {
    fromNodeId,
    setFromNodeId,
    toNodeId,
    setToNodeId,
    psyId,
    setPsyId,
  } = useContext(TransactionContext)

  return (
    <Div
      xflex="x41"
      position="absolute"
      top={0}
      right={0}
      p={1}
      gap={1}
    >
      <Select
        value={fromNodeId}
        onChange={event => setFromNodeId(event.target.value)}
        width={64}
      >
        {Object.values(graph.nodes).map(node => (
          <MenuItem
            key={node.id}
            value={node.id}
          >
            {node.id}
          </MenuItem>
        ))}
      </Select>
      {connectedNodes.length && (
        <Select
          value={toNodeId}
          onChange={event => setToNodeId(event.target.value)}
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
      {toNode && (
        <Select
          value={psyId}
          onChange={event => setPsyId(event.target.value)}
          width={64}
        >
          {toNode.psys.map(psy => (
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
  )
}

export default TransactionSelector
