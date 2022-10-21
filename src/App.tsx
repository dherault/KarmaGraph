import { CssBaseline, ThemeProvider } from 'honorable'

import theme from './theme'

import Graph from './components/Graph'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Graph />
    </ThemeProvider>
  )
}

export default App
