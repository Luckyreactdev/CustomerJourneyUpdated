import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./SectorSelectionPage.css";
import {
  baseURL,
  sectorSelection,
  accountUsers,
  taskDashboard,
  accountProfile,
} from "../../../../helpers/endpoints/api_endpoints";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { toast } from "react-toastify";

const SectorSelectionPage = () => {
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [subSectors, setSubSectors] = useState([]);
  const [accountProf, setAccountProf] = useState([]);
  const [formData, setFormData] = useState({
    assignee: "",
    tc_assignee_1: "",
    tc_assignee_2: "",
    sub_sector: "",
  });

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${sectorSelection}`, {
          headers,
        });
        setSectors(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };

    fetchSectors();
  }, []);

  const handleSectorChange = (event) => {
    const sectorId = event.target.value;
    const sector = sectors.find((s) => s.id === parseInt(sectorId));
    setSelectedSector(sector);
    if (sector) {
      setSubSectors(sector.sub_sectors || []);
    } else {
      setSubSectors([]);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAssignTask = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const payload = {
        assignee: parseInt(formData.assignee),
        tc_assignee_1: formData.tc_assignee_1
          ? parseInt(formData.tc_assignee_1)
          : null,
        tc_assignee_2: formData.tc_assignee_2
          ? parseInt(formData.tc_assignee_2)
          : null,
        sub_sector: parseInt(formData.sub_sector),
      };

      console.log("Form data sending:", payload);

      const response = await axios.post(`${baseURL}${taskDashboard}`, payload, {
        headers,
      });
      console.log("Response data:", response.data);
      toast.success("Submitted Successfully");
      navigate('/track-keyword-job-assignment');
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${accountUsers}`, {
          headers,
        });
        setUserList(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserList();
  }, []);



  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form  container_form">
        <span className="sub_title_form">Keyword-Upload</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <Row className="form-field-TM mt-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Sector</Form.Label>
                    <select
                      className="form-select action_drop"
                      value={selectedSector ? selectedSector.id : ""}
                      onChange={handleSectorChange}
                    >
                      <option value="">Select Sector</option>
                      {sectors.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.name}
                        </option>
                      ))}
                    </select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Sub-Sector</Form.Label>
                    <select
                      className="form-select action_drop"
                      value={formData.sub_sector}
                      onChange={handleChange}
                      name="sub_sector"
                    >
                      <option value="">Select Sub-Sector</option>
                      {subSectors.map((subSector) => (
                        <option key={subSector.id} value={subSector.id}>
                          {subSector.name}
                        </option>
                      ))}
                    </select>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
      <div>
        <div className="screen-cont">
          <div className="container_form-sect">
            <div className="form_page">
              <div className="form_page_sub">
                <Container>
                  <Row className="form-field-TM mt-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Assignee</Form.Label>
                        <Form.Select
                          name="assignee"
                          value={formData.assignee}
                          onChange={handleChange}
                        >
                          <option value="">Select Assignee</option>
                          {userList.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.email}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>TC 1 Assignee</Form.Label>
                        <Form.Select
                          name="tc_assignee_1"
                          value={formData.tc_assignee_1}
                          onChange={handleChange}
                        >
                          <option value="">Select TC 1 Assignee</option>
                          {userList.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.email}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>TC 2 Assignee</Form.Label>
                        <Form.Select
                          name="tc_assignee_2"
                          value={formData.tc_assignee_2}
                          onChange={handleChange}
                        >
                          <option value="">Select TC 2 Assignee</option>
                          {userList.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.email}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <Button className="job_accept mx-2" onClick={handleAssignTask}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
};

export default SectorSelectionPage;
