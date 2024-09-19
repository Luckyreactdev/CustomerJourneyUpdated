import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { Link, useNavigate } from "react-router-dom";
import AdminFooter from "../../../Footer/AdminFooter";
import "./TaskAssignmentPage.css";

function TaskAssignmentPage() {
  const [task, setTask] = useState("");

  const handleSaveAndProceed = () => {
    // Perform validation if needed
    console.log("data");
  };
  return (
    <div className="screen-cont">
      {/* <HabotAppBar /> */}
      <div className="container_form  container_form">
        <span className="sub_title_form">Task Assignment</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Sr no:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Name of the Campaign:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Name of the Station:</Form.Label>
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
                      <Form.Label>Station ID:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Description:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Compliance Checks:</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Container>
            <Container>
              <Row className="form-field-TM mt-4">
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>Asignee</Form.Label>
                      <FormControl
                        type="email"
                        placeholder="abc@gmail.com"
                        id="task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>TC 1 Assignee</Form.Label>
                      <FormControl
                        type="email"
                        placeholder="abc@gmail.com"
                        id="task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>TC 2 Assignee</Form.Label>
                      <FormControl
                        type="email"
                        placeholder="abc@gmail.com"
                        id="task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                      />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Link to="/customer-journey">
              {" "}
              <Button variant="outline-primary" className="close_form mx-2">
              Add more Assignee
              </Button>
            </Link>
            <Link>
              <Button
                className="job_accept mx-2"
                onClick={handleSaveAndProceed}
              >
                Assign Task
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="footer-ad">
        <AdminFooter />
      </div> */}
    </div>
  );
}

export default TaskAssignmentPage;
