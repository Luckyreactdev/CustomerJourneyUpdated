import React, { useState, useEffect } from "react";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  baseURL,
  accountUsers,
  campaignTask,
  trackCampaign,
} from "../../../../helpers/endpoints/api_endpoints";
import "./TaskAssignCampaignManager.css";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function TaskAssignCampaignManager() {
  const [selectedCampaignManager, setSelectedCampaignManager] = useState("");
  const [selectedTC1, setSelectedTC1] = useState(""); 
  const [selectedTC2, setSelectedTC2] = useState("");
  const [note, setNote] = useState("");
  const [contentType, setContentType] = useState("");
  const [userList, setUserList] = useState([]);
  const [userTask, setUserTask] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const fetchCampTask = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${trackCampaign}${id}/`, {
        headers,
      });
      setUserTask(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAssignTask = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const requestBody = {
        content_manager: parseInt(selectedCampaignManager, 10),
        ...(contentType && { content_type: contentType }),
        ...(note && { note }),
        track_campaign: parseInt(id, 10),
        tc_assignee_1: parseInt(selectedTC1, 10), 
        tc_assignee_2: parseInt(selectedTC2, 10),
      };
      console.log(requestBody);
      const response = await axios.post(
        `${baseURL}${campaignTask}`,
        requestBody,
        { headers }
      );
      console.log("Task assigned successfully:", response.data);
      toast.success("Task assigned successfully!");
      navigate(`/campaign-jobs-assigned/${id}`);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCampTask();
  }, []);

  const campaignTypeMap = {
    SOCIAL_MEDIA_POST: "Social Media Post",
    AD_CAMPAIGN: "Ad Campaign",
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form container_form">
        <span className="sub_title_form">Request for Content Page</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM"></div>
            </Container>
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        <b>Sector :</b>{" "}
                        {
                          userTask?.keyword_file_info?.sub_sector_info
                            ?.sector_info?.name
                        }
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        <b>Sub-Sector :</b>{" "}
                        {userTask?.keyword_file_info?.sub_sector_info?.name}
                      </Form.Label>{" "}
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        <b>Type of Campaign : </b>
                        {campaignTypeMap[userTask?.campaign_type] || "N/A"}
                        <br></br>
                        <b>Type of Media : </b>
                        {userTask?.campaign_info?.name ||
                          userTask?.social_media_post_info?.name ||
                          "N/A"}
                      </Form.Label>
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
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Content Manager</Form.Label>
                      <Form.Select
                        name="campaign-manager"
                        value={selectedCampaignManager}
                        onChange={(e) =>
                          setSelectedCampaignManager(e.target.value)
                        }
                      >
                        <option value="">Select Content Manager</option>
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
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>TC Assignee 1</Form.Label>
                      <Form.Select
                        value={selectedTC1}
                        onChange={(e) => setSelectedTC1(e.target.value)}
                      >
                        <option value="">Select TC Assignee 1</option>
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
                      <Form.Label>TC Assignee 2</Form.Label>
                      <Form.Select
                        value={selectedTC2}
                        onChange={(e) => setSelectedTC2(e.target.value)}
                      >
                        <option value="">Select TC Assignee 2</option>
                        {userList.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Button className="job_accept mx-2" onClick={handleAssignTask}>
              Assign Task
            </Button>{" "}
          </div>
        </div>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default TaskAssignCampaignManager;
