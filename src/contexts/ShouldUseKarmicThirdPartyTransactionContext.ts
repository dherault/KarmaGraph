import { Dispatch, SetStateAction, createContext } from 'react'

export type ShouldUseKarmicThirdPartyTransactionContextType = {
  shouldUseKarmicThirdPartyTransaction: boolean,
  setShouldUseKarmicThirdPartyTransaction: Dispatch<SetStateAction<boolean>>
}

export default createContext<ShouldUseKarmicThirdPartyTransactionContextType>({
  shouldUseKarmicThirdPartyTransaction: false,
  setShouldUseKarmicThirdPartyTransaction: () => {},
})
