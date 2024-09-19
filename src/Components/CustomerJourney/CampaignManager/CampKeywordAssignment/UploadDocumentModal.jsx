import React, { useState } from "react";
import { Modal, Form, Container, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import {
  baseURL,
  keywordSelectionForm,
  taskDashboard,
} from "../../../../helpers/endpoints/api_endpoints";

const UploadDocumentModal = ({
  show,
  onHide,
  setFile,
  file,
  selectedTaskId,
  setSelectedTaskId,
  setShowAddModal,
  setTasksDash,
  fetchTaskData, // Add this prop to use the parent function
}) => {
  const [loading, setLoading] = useState(false);
  console.log(selectedTaskId);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedExtensions = /(\.xlsx)$/i;

    if (!allowedExtensions.exec(selectedFile.name)) {
      toast.error("Only .xlsx files are allowed.");
      e.target.value = ""; // Clear the file input
      setFile(null); // Reset the file state
      return;
    }

    setFile(selectedFile);
  };

  const handleFileUpload = () => {
    if (!file || !selectedTaskId) {
      toast.error("Please select a file and try again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task", selectedTaskId);

    toast.info("Uploading file...");
    setLoading(true);

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    axios
      .post(`${baseURL}${keywordSelectionForm}`, formData, { headers })
      .then((response) => {
        toast.success("File uploaded successfully");
        setShowAddModal(false);
        setLoading(false);

        // Call fetchTaskData to refresh tasks after upload
        fetchTaskData();
        axios
          .patch(
            `https://customer-journey-19042024.uc.r.appspot.com/dashboards/tasks/${selectedTaskId}/`,
            { ended_at: new Date().toISOString() },
            { headers }
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status");
          });
        fetchTaskData();
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file");
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <div className="form-field-TM mt-4">
              <Row>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Upload File</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFileUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadDocumentModal;
