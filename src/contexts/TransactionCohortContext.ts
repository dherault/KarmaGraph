import { Dispatch, SetStateAction, createContext } from 'react'

import { TransactionCohortType } from '../types'

export type TransactionCohortContextType = {
  transactionCohort: TransactionCohortType,
  setTransactionCohort: Dispatch<SetStateAction<TransactionCohortType>>
  currentTransactionIndex: number,
  setCurrentTransactionIndex: Dispatch<SetStateAction<number>>
}

export default createContext<TransactionCohortContextType>({
  transactionCohort: [],
  setTransactionCohort: () => {},
  currentTransactionIndex: 0,
  setCurrentTransactionIndex: () => {},
})
