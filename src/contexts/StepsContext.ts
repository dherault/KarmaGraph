import { Dispatch, SetStateAction, createContext } from 'react'

import { StepsType } from '../types'

export type StepsContextType = {
  steps: StepsType,
  setSteps: Dispatch<SetStateAction<StepsType>>
  currentStepIndex: number,
  setCurrentStepIndex: Dispatch<SetStateAction<number>>
}

export default createContext<StepsContextType>({
  steps: [],
  setSteps: () => {},
  currentStepIndex: 0,
  setCurrentStepIndex: () => {},
})
