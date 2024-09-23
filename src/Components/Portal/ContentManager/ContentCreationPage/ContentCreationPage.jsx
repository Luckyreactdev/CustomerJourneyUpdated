import React, { useState } from "react";
import { Button, Col, Row, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../../../../helpers/endpoints/api_endpoints";
import "./ContentCreationPage.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";

const ContentCreationPage = ({ keyword }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const contentData = {
        keyword,
        ...formData,
      };
      const response = await axios.post(
        `${baseURL}/content/create/`,
        contentData,
        {
          headers,
        }
      );
      toast.success("Content submitted for review successfully");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit content for review");
    }
  };

  return (
    <>
      <HabotAppBar />
      <div className="container_form">
        <span className="sub_title_form">Content Creation</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <Form onSubmit={handleSubmit}>
                <Row className="form-field-TM mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Keyword (Read-Only)</Form.Label>
                      <Form.Control type="text" value={keyword} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="form-field-TM mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter content title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="form-field-TM mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Enter content description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="form-field-TM mt-4">
                  <Col md={12}>
                    <Form.Group>
                      <Button variant="primary" type="submit" className="mt-3">
                        Submit for Review
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentCreationPage;
