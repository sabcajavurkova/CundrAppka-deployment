import { Modal, Button } from 'react-bootstrap'

// takes arguments:
// message: what is shown
// show: whether modal is opened or closed
// onClose: what happens when canceling intended action or closing modal
// onConfirm: execute the intended action
function DeleteConfirmComp({ message, show, onClose, onConfirm }: { message: string; show: boolean; onClose: () => void; onConfirm: () => void }) {
  
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Potvrď smazání</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Zrušit
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteConfirmComp
