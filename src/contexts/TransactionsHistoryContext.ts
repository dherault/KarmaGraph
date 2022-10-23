import { Dispatch, SetStateAction, createContext } from 'react'

import { TransactionType } from '../types'

export type TransactionsHistoryContextType = {
  transactionsHistory: TransactionType[],
  setTransactionsHistory: Dispatch<SetStateAction<TransactionType[]>>
}

export default createContext<TransactionsHistoryContextType>({
  transactionsHistory: [],
  setTransactionsHistory: () => {},
})
