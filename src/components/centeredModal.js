import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function CenteredModal({ show, onHide, header, body, onSuccess, successText='' }) {
    const [deleting, setDeleting] = useState(false)

    const accepted = () => {
        setDeleting(true)
        onSuccess()
        setDeleting(false)
    }
    return (
        <Modal
            show={show}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={onHide}
        >
            <Modal.Header closeButton={onHide}>
                <Modal.Title id="contained-modal-title-vcenter">
                {header}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p dangerouslySetInnerHTML={{__html: body}}>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='dark' disabled={deleting} onClick={accepted}>{successText}</Button>
                <Button variant='danger' onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
