import { Dispatch, SetStateAction, createContext } from 'react'

import { GraphType } from '../types'

export type GraphContextType = {
  graph: GraphType
  setGraph: Dispatch<SetStateAction<GraphType>>
}

export default createContext<GraphContextType>({
  graph: { nodes: [], edges: [] },
  setGraph: () => {},
})
