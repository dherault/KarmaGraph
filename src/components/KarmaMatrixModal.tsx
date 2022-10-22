import { Div, H2, Modal } from 'honorable'

import KarmaMatrix from './KarmaMatrix'

type KarmaMatrixModalProps = {
  open: boolean
  onClose: () => void
}

function KarmaMatrixModal({ open, onClose }: KarmaMatrixModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <H2>
        Karma matrix
      </H2>
      <Div mt={2}>
        <KarmaMatrix />
      </Div>
    </Modal>
  )
}

export default KarmaMatrixModal
