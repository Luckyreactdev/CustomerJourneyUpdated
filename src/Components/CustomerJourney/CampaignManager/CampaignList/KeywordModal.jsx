import React from "react";
import { Modal, Button } from "react-bootstrap";

function KeywordModal({ show, handleClose, items, title }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item?.name || item}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default KeywordModal;
