import { useContext } from 'react'
import { Div } from 'honorable'

import IsKarmicDepletionContext from '../contexts/IsKarmicDepletionContext'

function KarmicDepletionWarning() {
  const { isKarmicDepletion } = useContext(IsKarmicDepletionContext)

  if (!isKarmicDepletion) return null

  return (
    <Div color="danger">
      Karmic depletion!
    </Div>
  )
}

export default KarmicDepletionWarning
