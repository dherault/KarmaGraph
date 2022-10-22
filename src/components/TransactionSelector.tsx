import { Div, MenuItem, Select } from 'honorable'
import { useContext, useEffect } from 'react'

import GraphContext from '../contexts/GraphContext'
import ShouldUseKarmicThirdPartyTransactionContext from '../contexts/ShouldUseKarmicThirdPartyTransactionContext'

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
    thirdNodeId,
    setThirdNodeId,
    psyId,
    setPsyId,
  } = useContext(TransactionContext)
  const { shouldUseKarmicThirdPartyTransaction } = useContext(ShouldUseKarmicThirdPartyTransactionContext)

  useEffect(() => {
    if (shouldUseKarmicThirdPartyTransaction) {
      setThirdNodeId(graph.nodes.filter(n => n.id !== fromNodeId && n.id !== toNodeId)[0]?.id || '')
    }
    else {
      setThirdNodeId('')
    }
  }, [shouldUseKarmicThirdPartyTransaction, graph, fromNodeId, toNodeId, setThirdNodeId])

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
              {node.id}
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
      {shouldUseKarmicThirdPartyTransaction && (
        <Select
          value={thirdNodeId}
          onChange={event => setThirdNodeId(event.target.value)}
          width={64}
        >
          {Object.values(graph.nodes)
          .filter(node => node.id !== fromNodeId && node.id !== toNodeId)
          .map(node => (
            <MenuItem
              key={node.id}
              value={node.id}
            >
              {node.id}
            </MenuItem>
          ))}
        </Select>
      )}
    </Div>
  )
}

export default TransactionSelector
