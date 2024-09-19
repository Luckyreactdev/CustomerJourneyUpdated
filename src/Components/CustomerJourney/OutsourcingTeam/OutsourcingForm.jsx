import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../Footer/AdminFooter";
import { baseURL, outsourcingJobs, accountProfile } from "../../../helpers/endpoints/api_endpoints";
import "./OutsourcingTeam.css";

function OutsourcingForm() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    required_deliverables: "",
    skills_required: "",
    scope_of_work: "",
    budget: "",
    due_date: "",
    // documents: [],
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${accountProfile}`, { headers });
        setUserId(response.data.id);
        console.log("User ID:", response.data.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const jobData = {
      ...formData,
      created_by: userId,
    };

    console.log("Form Data:", jobData);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${baseURL}${outsourcingJobs}`, jobData, {
        headers,
      });
      toast.success("Submitted Successfully");
      resetFormFields();
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };

  const resetFormFields = () => {
    setFormData({
      title: "",
      description: "",
      required_deliverables: "",
      skills_required: "",
      scope_of_work: "",
      budget: "",
      due_date: "",
      // documents: [],
    });
  };
  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form">
        <div className="form_page">
          <Container>
            <Row className="form-field-TM mt-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Required Deliverables</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Required Deliverables"
                    name="required_deliverables"
                    value={formData.required_deliverables}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Skills Required</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Skills Required"
                    name="skills_required"
                    value={formData.skills_required}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Scope of Work</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Scope of Work"
                    name="scope_of_work"
                    value={formData.scope_of_work}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Budget</Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <FormControl
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
          <div className="d-flex justify-content-center mt-3">
            <Button className="job_accept mx-2" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default OutsourcingForm;
