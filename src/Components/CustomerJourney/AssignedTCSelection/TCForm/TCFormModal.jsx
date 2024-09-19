import React from "react";
import { Modal, Button } from "react-bootstrap";
import TCForm from "./TCForm"; // Import the TCForm component

const TCFormModal = ({ show, handleClose, keywordId,task }) => {
    console.log(task)
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Keyword Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TCForm task={task} keywordId={keywordId}  />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TCFormModal;
