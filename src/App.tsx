import { useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider } from 'honorable'

import theme from './theme'

import { StepsType } from './types'

import Graph from './components/Graph'
import StepsContext, { StepsContextType } from './contexts/StepsContext'

function App() {
  const [steps, setSteps] = useState<StepsType>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const stepsContextValue = useMemo<StepsContextType>(() => ({ steps, setSteps, currentStepIndex, setCurrentStepIndex }), [steps, currentStepIndex])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StepsContext.Provider value={stepsContextValue}>
        <Graph />
      </StepsContext.Provider>
    </ThemeProvider>
  )
}

export default App
