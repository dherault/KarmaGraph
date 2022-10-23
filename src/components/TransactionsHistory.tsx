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
      gap={0.5}
    >
      <H2
        mt={0.25}
        mb={0.5}
      >
        History
      </H2>
      {transactionsHistory.map(transaction => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </Div>
  )
}

export default TransactionsHistory
