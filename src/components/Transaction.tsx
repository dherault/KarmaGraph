import { Div, DivProps } from 'honorable'

import { TransactionType } from '../types'

type TransactionProps = DivProps & {
  transaction: TransactionType
}

function Transaction({ transaction, ...props }: TransactionProps) {
  return (
    <Div
      whiteSpace="pre"
      {...props}
    >
      {transaction.fromNodeId} {'-->'} {transaction.toNodeId} {transaction.thirdNodeId ? `, ${transaction.thirdNodeId}` : ''} : {transaction.psyId} {transaction.formatedOutput ? `- ${transaction.formatedOutput}` : ''}
    </Div>
  )
}

export default Transaction
