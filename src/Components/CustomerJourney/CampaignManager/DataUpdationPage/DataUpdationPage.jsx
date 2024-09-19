import React, { useState } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,FormFile,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./DataUpdationPage.css";

const DataUpdationPage = () => {
  const [sector, setSector] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSaveAndProceed = () => {
    // Perform validation if needed
    console.log("data");
  };
  return (
    <div className="screen-cont">
      <div className="container_form  container_form">
        <span className="sub_title_form">Data Updation</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <Row className="form-field-TM mt-4">
                <Col >
                  <div>
                  <input 
                      type="file" 
                      onChange={handleFileChange} 
                      className="form-control" 
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Link to="/customer-journey">
              {" "}
              <Button variant="outline-primary" className="close_form mx-2">
                Cancel
              </Button>
            </Link>
            <Link>
              <Button
                className="job_accept mx-2"
                onClick={handleSaveAndProceed}
              >
                Save and Proceed
              </Button>
            </Link>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default DataUpdationPage;
