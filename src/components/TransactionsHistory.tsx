import { useContext } from 'react'
import { Div, H2 } from 'honorable'

import TransactionsHistoryContext from '../contexts/TransactionsHistoryContext'

import Transaction from './Transaction'

function TransactionsHistory() {
  const { transactionsHistory } = useContext(TransactionsHistoryContext)

  return (
    <Div
      position="relative"
      xflex="y2s"
      overflow="auto"
      maxWidth="100%"
      maxHeight="100%"
      p={1}
      gap={1}
    >
      <H2 mt={0.25}>
        History
      </H2>
      {transactionsHistory.map(transaction => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
          mt={1}
        />
      ))}
    </Div>
  )
}

export default TransactionsHistory
