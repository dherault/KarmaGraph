import { Dispatch, SetStateAction, createContext } from 'react'

export type IsKarmicDeptAllowedContextType = {
  isKarmicDeptAllowed: boolean,
  setIsKarmicDeptAllowed: Dispatch<SetStateAction<boolean>>
}

export default createContext<IsKarmicDeptAllowedContextType>({
  isKarmicDeptAllowed: false,
  setIsKarmicDeptAllowed: () => {},
})
