import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../Footer/AdminFooter";
import {
  baseURL,
  outsourcingJobs,
  accountUsers,
  keywordSelectionForm,
} from "../../../helpers/endpoints/api_endpoints";
import "./OutsourcingTeam.css";
import { useParams } from "react-router";
import { toast } from "react-toastify";

function OutsourcingTeam() {
  const { id } = useParams();

  const [outsourceeManager, setOutsourceeManager] = useState([]);
  const [selectedCampaignManager, setSelectedCampaignManager] = useState("");
  const [note, setNote] = useState("");
  const [contentType, setContentType] = useState("");
  const [userList, setUserList] = useState([]);
  const [outsourceeList, setOutsourceeList] = useState([]);
  const [assignedDate, setAssignedDate] = useState("");
  const [campaign, setCampaign] = useState("");
  const [keywordFile, setKeywordFile] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sectorInfo, setSectorInfo] = useState();
  const navigate = useNavigate();

  const handleModalToggle = () => setShowModal(!showModal);
  const keywordList = outsourceeList?.extracted_keywords_info || [];

  useEffect(() => {
    const fetchUsers = async () => {
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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOutsourcee = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(
          `
        https://customer-journey-19042024.uc.r.appspot.com/dashboards/track-campaigns/${id}/`,
          {
            headers,
          }
        );
        setOutsourceeList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOutsourcee();
  }, []);

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      // Prepare FormData
      const formData = new FormData();
      formData.append("assigned_date", assignedDate);
      formData.append("operations_manager", selectedCampaignManager);
      formData.append("content_type", contentType);
      formData.append("note", note);
      formData.append("track_campaign", id);
      // Log the FormData content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const response = await axios.post(
        `${baseURL}${outsourcingJobs}`,
        formData,
        {
          headers,
        }
      );
      navigate("/content-manager-job-list");
      toast.success("Submitted Successfully");
      console.log("Job assigned successfully:", response.data);
    } catch (error) {
      console.error("Error assigning job:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      console.log(outsourceeList);
      axios
        .get(
          `${baseURL}${keywordSelectionForm}${outsourceeList?.keyword_file}/`,
          {
            headers,
          }
        )
        .then((response) => {
          console.log(response.data);
          setSectorInfo(response.data);
        })
        .catch((error) => {
          console.log("Error fetching task details:", error);
        });
    } else {
      console.error("Access token is missing");
    }
  }, [outsourceeList]);

  return (
    <div className="screen-cont">
      <HabotAppBar />

      <div className="container_form container_form">
        <span className="sub_title_form">Outsourcee Manager</span>

        <div className="form_page mb-3">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <b>
                        Sector :{" "}
                        {sectorInfo?.sub_sector_info?.sector_info?.name || "NA"}{" "}
                      </b>
                    </Form.Label>
                  </Col>
                  <Col md={4}>
                    <Form.Label>
                      <b>
                        Sub Sector : {sectorInfo?.sub_sector_info?.name || "NA"}{" "}
                      </b>
                    </Form.Label>
                  </Col>
                  <Col md={4}>
                    <Form.Label>
                      <b>
                        Name of the Campaign :{" "}
                        {outsourceeList?.campaign_info?.name ||
                          outsourceeList?.social_media_post_info?.name ||
                          "NA"}
                      </b>
                    </Form.Label>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Label>
                      <b>Keyword List : </b>
                      <ul>
                        {keywordList.slice(0, 3).map((keyword, index) => (
                          <li key={index}>{keyword.name}</li>
                        ))}
                        {/* Show "more..." if there are more than 3 keywords */}
                        {keywordList.length > 3 && (
                          <li>
                            <Button variant="link" onClick={handleModalToggle}>
                              more...
                            </Button>
                          </li>
                        )}
                      </ul>
                    </Form.Label>
                  </Col>
                  <Col md={4}>
                    <Form.Label>
                      <b>
                        campaign_type : {outsourceeList?.campaign_type || "NA"}
                      </b>
                      <ul></ul>
                    </Form.Label>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
        </div>

        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Type of content</Form.Label>
                      <Form.Select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                      >
                        <option value="">Select Type of content</option>
                        <option value="google content">Google Content</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="blogs">Blogs</option>
                        <option value="social media content">
                          Social Media Content
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Operations Manager</Form.Label>
                      <Form.Select
                        name="campaign-manager"
                        value={selectedCampaignManager}
                        onChange={(e) =>
                          setSelectedCampaignManager(e.target.value)
                        }
                      >
                        <option value="">Select Operations Manager</option>
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
                      <Form.Label>Note about the content creation</Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4} className="mt-2">
                    <Form.Group>
                      <Form.Label>Assign Date</Form.Label>
                      <input
                        type="date"
                        className="form-control"
                        value={assignedDate}
                        onChange={(e) => setAssignedDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Button className="job_accept mx-2" onClick={handleSubmit}>
              Assign Task
            </Button>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Extracted Keywords</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {keywordList.map((keyword, index) => (
              <li key={index}>{keyword.name}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalToggle}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default OutsourcingTeam;
