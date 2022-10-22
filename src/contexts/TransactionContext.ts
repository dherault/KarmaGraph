import { Dispatch, SetStateAction, createContext } from 'react'

export type TransactionContextType = {
  fromNodeId: string
  setFromNodeId: Dispatch<SetStateAction<string>>
  toNodeId: string
  setToNodeId: Dispatch<SetStateAction<string>>
  thirdNodeId: string
  setThirdNodeId: Dispatch<SetStateAction<string>>
  psyId: string
  setPsyId: Dispatch<SetStateAction<string>>
}

export default createContext<TransactionContextType>({
  fromNodeId: '',
  setFromNodeId: () => {},
  toNodeId: '',
  setToNodeId: () => {},
  thirdNodeId: '',
  setThirdNodeId: () => {},
  psyId: '',
  setPsyId: () => {},
})
