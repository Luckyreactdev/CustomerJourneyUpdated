import React, { useEffect, useState } from "react";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import "./Portalsetup.css";
import { Button, Tab, Nav, Col, Row, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../helpers/axios/axios";
import {
  activityexecutors,
  baseURL,
} from "../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";

const Portalsetup = () => {
  const [portalname, setportalname] = useState("");
  const navigate = useNavigate();
  const [executorsname, setExecutors] = useState([]);
  const [formData, setFormData] = useState({
    Assigneeemail: "",
    Assigneeid: null,
    AssigneeName: "",
  });

  useEffect(() => {
    const fetchactivityexecutor = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}/seo/activity-executors/`, {
          headers,
        });
        setExecutors(response.data.results);
        console.log(executorsname);
      } catch (error) {
        console.log(error);
      }
    };
    fetchactivityexecutor();
  }, []);

  const handleportal = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const portaldata = {
        name: portalname,
        assignee: formData.Assigneeid,
      };
      const response = await axios.post(`${baseURL}/seo/portals/`, portaldata, {
        headers,
      });
      toast.success("Portal created successfully");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create the portal ");
    }
  };
  return (
    <>
      <div className="container_form  container_form">
        <span className="sub_title_form">Portal Initilisation</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <Form onSubmit={handleportal}>
                <Row className="form-field-TM mt-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Portal name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter portal name"
                        name="portalName"
                        value={portalname}
                        onChange={(e) => setportalname(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Assignee Selection</Form.Label>
                      <Form.Select
                        className="action_drop"
                        value={formData.Assigneeid || ""}
                        name="sub_sector"
                        onChange={(e) => {
                          const selectedOption =
                            e.target.options[e.target.selectedIndex];
                          const selectedId = parseInt(selectedOption.value);
                          const selectedExecutor = executorsname.find(
                            (executor) => executor.id === selectedId
                          );

                          if (selectedExecutor) {
                            setFormData({
                              ...formData,
                              Assigneeemail: selectedExecutor.email,
                              Assigneeid: selectedId,
                              AssigneeName:
                                selectedExecutor.profile_info.full_name,
                            });
                          }
                        }}
                      >
                        <option value="">Select Assignee</option>
                        {executorsname.map((names) => (
                          <option key={names.id} value={names.id}>
                            {names.profile_info.full_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Button variant="primary" type="submit" className="mt-3">
                        Submit
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

export default Portalsetup;
