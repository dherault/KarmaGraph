import { Dispatch, SetStateAction, createContext } from 'react'

export type IsKarmicDepletionContextType = {
  isKarmicDepletion: boolean,
  setIsKarmicDepletion: Dispatch<SetStateAction<boolean>>
}

export default createContext<IsKarmicDepletionContextType>({
  isKarmicDepletion: false,
  setIsKarmicDepletion: () => {},
})
