import { Modal, Button } from 'react-bootstrap'

// takes arguments:
// message: what is shown
// show: whether modal is opened or closed
// onClose: what happens when canceling intended log-out or closing modal
// onConfirm: log-out user
function LogoutConfirmComp({ message, show, onClose, onConfirm, }: { message:string, show: boolean; onClose: () => void; onConfirm: () => void;}) {

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Potvrď odhlášení</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="d-flex justify-content-end gap-2">
        <Button variant="light" onClick={onClose}>
          Zůstat přihlášený
        </Button>
        <Button variant="dark" onClick={onConfirm}>
          Odhlásit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LogoutConfirmComp
