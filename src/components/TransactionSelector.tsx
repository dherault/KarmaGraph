import { Div, DivProps, MenuItem, Select } from 'honorable'
import { useContext } from 'react'

import GraphContext from '../contexts/GraphContext'

import TransactionContext from '../contexts/TransactionContext'
import { NodeType } from '../types'

type TransactionSelectorProps = DivProps & {
  connectedNodes: NodeType[]
  toNode: NodeType | undefined
}

function TransactionSelector({ connectedNodes, toNode, ...props }: TransactionSelectorProps) {
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
      gap={1}
      {...props}
    >
      <Select
        value={fromNodeId}
        onChange={event => setFromNodeId(event.target.value)}
        width="unset"
        minWidth="unset"
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
          width="unset"
          minWidth="unset"
        >
          {connectedNodes.map(node => (
            <MenuItem
              key={node.id}
              value={node.id}
            >
              {node.id}
            </MenuItem>
          ))}
        </Select>
      )}
      {toNode && (
        <Select
          value={psyId}
          onChange={event => setPsyId(event.target.value)}
          width="unset"
          minWidth="unset"
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
