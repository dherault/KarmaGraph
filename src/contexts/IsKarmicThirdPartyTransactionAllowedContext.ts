import { Dispatch, SetStateAction, createContext } from 'react'

export type IsKarmicThirdPartyTransactionAllowedContextType = {
  isKarmicThirdPartyTransactionAllowed: boolean,
  setIsKarmicThirdPartyTransactionAllowed: Dispatch<SetStateAction<boolean>>
}

export default createContext<IsKarmicThirdPartyTransactionAllowedContextType>({
  isKarmicThirdPartyTransactionAllowed: false,
  setIsKarmicThirdPartyTransactionAllowed: () => {},
})
