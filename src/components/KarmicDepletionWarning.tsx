import { useContext } from 'react'
import { Div } from 'honorable'

import IsKarmicDepletionContext from '../contexts/IsKarmicDepletionContext'

function KarmicDepletionWarning() {
  const { isKarmicDepletion } = useContext(IsKarmicDepletionContext)

  if (!isKarmicDepletion) return null

  return (
    <Div
      position="absolute"
      bottom={0}
      right={0}
      color="red.500"
      p={1}
    >
      Karmic depletion!
    </Div>
  )
}

export default KarmicDepletionWarning
