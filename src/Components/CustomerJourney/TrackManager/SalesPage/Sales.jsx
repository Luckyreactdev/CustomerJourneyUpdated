import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Sales.css";

function Sales() {
    return (
        <div className="screen-cont">
      {/* <HabotAppBar /> */}
      <div className="container_form">
        <span className="sub_title_form">Sales and Sign-in</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <Row className="form-field-TM mt-4">
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>Total Buyer Signups</Form.Label>
                      <FormControl type="email" placeholder="Total Buyer Signups" />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>No of Post from Buyers</Form.Label>
                      <FormControl type="email" placeholder="No of Post from BUyers" />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>Total AED Earned from Buyer</Form.Label>
                      <FormControl type="email" placeholder="Total AED Earned from Buyer" />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
              <Row className="form-field-TM mt-4">
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>Total Supplier Signups</Form.Label>
                      <FormControl type="email" placeholder="Total SupplierSignups" />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>No of Response  from Supplier</Form.Label>
                      <FormControl type="email" placeholder="No of Response  from Supplier" />
                    </Form.Group>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Form.Group>
                      <Form.Label>Total AED Earned from Supplier</Form.Label>
                      <FormControl type="email" placeholder="Total AED Earned from Supplier" />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          
          <div className="d-flex justify-content-center mt-3">
            {/* <Link to="/customer-journey"> */}{" "}
            <Button variant="outline-primary" className="close_form mx-2">
             Save
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>
     
    </div>
    )
}

export default Sales
