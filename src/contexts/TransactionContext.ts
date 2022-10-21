import { Dispatch, SetStateAction, createContext } from 'react'

export type TransactionContextType = {
  fromNodeId: string
  setFromNodeId: Dispatch<SetStateAction<string>>
  toNodeId: string
  setToNodeId: Dispatch<SetStateAction<string>>
  psyId: string
  setPsyId: Dispatch<SetStateAction<string>>
}

export default createContext<TransactionContextType>({
  fromNodeId: '',
  setFromNodeId: () => {},
  toNodeId: '',
  setToNodeId: () => {},
  psyId: '',
  setPsyId: () => {},
})
