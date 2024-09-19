import React from "react";
import { Modal, Button } from "react-bootstrap";

function TCContentDownload({ show, handleClose, document }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {document ? (
          <div>
            <a
              href={document.file}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Document
            </a>
          </div>
        ) : (
          <p>No document available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TCContentDownload;
