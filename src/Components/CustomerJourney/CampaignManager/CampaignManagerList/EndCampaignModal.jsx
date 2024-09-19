import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const EndCampaignModal = ({ show, handleClose, handleEndCampaign }) => {
  const [documentLink, setDocumentLink] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);

  const handleFileChange = (e) => {
    setScreenshotFile(e.target.files[0]); 
  };

  const handleSubmit = () => {
    if (!documentLink && !screenshotFile) {
      toast.error("Please provide either a document link or upload a screenshot.");
      return;
    }
    handleEndCampaign(documentLink, screenshotFile); 

  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>End Campaign / Posting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="documentLink">
            <Form.Label>Document Link</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter the document link"
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="screenshotFile">
            <Form.Label>Upload Screenshot</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange} // Use a dedicated function to handle file changes
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          End Campaign / Posting
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EndCampaignModal;
