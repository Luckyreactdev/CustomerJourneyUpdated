import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function NoteModal({ show, onHide, note }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Note Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{note}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteModal;
