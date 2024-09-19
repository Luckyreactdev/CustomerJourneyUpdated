import React, { useState, useEffect } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import {
  Button,
  Modal,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./KeywordSelectionForm.css";
import {
  baseURL,
  keywordSelectionForm,
  taskDashboard,
  accountProfile,
  assignedTask,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";

function KeywordSelectionForm() {
  const [documentName, setDocumentName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [taskId, setTaskId] = useState(null);
  const [userList, setUserList] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const handleFormSubmit = (taskId) => {
    console.log(taskId);

    const data = {
      file: selectedFile,
      documentName: documentName,
      task: taskId,
    };
    console.log(data);

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    axios
      .post(`${baseURL}${keywordSelectionForm}`, data, { headers })
      .then((response) => {
        console.log("Response:", response.data);
        toast.success("Submitted Successfully");
        // navigate("/tc-form");
      })
      .catch((error) => {
        console.log(error);

        // toast.error("Submission Failed");
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    setSelectedFile(file);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${accountProfile}`, { headers })
      .then((response) => {
        setUserList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${assignedTask}`, { headers })
      .then((response) => {
        console.log(response.data);
        setTasks(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, [userList]);
  console.log(userList);

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form">
        <span className="sub_title_form">Keyword Selection Form</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Name of the Sector:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Station Name:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Station ID:</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Container>
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Description:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Compliance Check:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}></Col>
                </Row>
              </div>
            </Container>
          </div>
        </div>
        <Container>
          <div className="job-cont cmd_table cmd_cont">
            <table className="customers job_tab mt-4">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{task.status}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        Keyword Selection Form
                      </Button>
                      <Modal
                        show={showModal}
                        onHide={handleCloseModal}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Keyword Selection Form</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Container>
                            <Form>
                              <div className="form-field-TM mt-4">
                                <Row>
                                  <Col md={4}>
                                    <Form.Group>
                                      <Form.Label>Document Name</Form.Label>
                                      <FormControl
                                        type="text"
                                        placeholder="Document Name"
                                        value={documentName}
                                        onChange={(e) =>
                                          setDocumentName(e.target.value)
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col md={4}>
                                    <Form.Group>
                                      <Form.Label>Upload File</Form.Label>
                                      <FormControl
                                        type="file"
                                        onChange={handleFileChange}
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col md={4}>
                                    <div className="d-flex justify-content-center mt-3">
                                      <Button
                                        onClick={() =>
                                          handleFormSubmit(task.id)
                                        }
                                        variant="outline-primary"
                                        className="close_form mx-2"
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </Form>
                          </Container>
                        </Modal.Body>
                      </Modal>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default KeywordSelectionForm;
