import React from "react";
import "./GoogleData.css";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../Footer/AdminFooter";
import axios from "axios";
// import { baseURL, trackCampaign } from "../../../../helpers/endpoints/api_endpoints";
import { Button, Container, Form, Row, Col } from "react-bootstrap";

function GoogleData() {
  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form  container_form">
        <span className="sub_title_form">Sector Selection</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <Row className="form-field-TM mt-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Sector:</Form.Label>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Sub Sector:</Form.Label>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Name of the Campaign:</Form.Label>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="form-field-TM">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Date of Report Submission:</Form.Label>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
      <div className="mt-3 job-cont">
        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Page location</th>
              <th>Country</th>
              <th>Date</th>
              <th>Device Sategory</th>
              <th>Session Source</th>
              <th>Website Visitors</th>
              <th>Source Medium</th>
              <th>Views</th>
              <th>Bounce Rate</th>
              <th>Engagement Rate</th>
              <th>Average session duration</th>
              <th>Impression</th>
              <th>CPM</th>
              <th>CTR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
            </tr>
          </tbody>
        </table>
        <div className="form_page_sub mt-3">
          <Container>
            <div className="form-field-TM ">
              <Row>
                <Col md={4}></Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Add a document</Form.Label>
                    <Form.Control type="file" className="form-control" />
                  </Form.Group>
                </Col>
                <Col md={4}></Col>
              </Row>
            </div>
          </Container>
        </div>
        <div className="mt-3 mb-3 d-flex justify-content-center">
          <Button>Submit</Button>
        </div>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default GoogleData;
