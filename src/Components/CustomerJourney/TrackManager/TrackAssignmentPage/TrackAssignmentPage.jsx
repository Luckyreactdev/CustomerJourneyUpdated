import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import "./TrackAssignmentPage.css";
import { useNavigate } from "react-router-dom";
import {
  taskDashboard,
  baseURL,
  accountUsers,
  keywordCampaign,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";

function TrackAssignmentPage() {
  // const [keywordCampId,setKeywordCampId]=useState([]);
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const assigneeId = useParams();
  const keywordCampaignId = assigneeId.id;
  console.log(keywordCampaignId);
  console.log(assigneeId);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    compliance_checks: "",
    status: "",
    document_link: "",
    approval_status: "",
    keyword_campaign: keywordCampaignId,
    assignee: "",
    tc_assignee_1: "",
    tc_assignee_2: "",
  });
  console.log(formData);
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

      const response = await axios.post(
        `${baseURL}${taskDashboard}`,
        formData,
        { headers }
      );
      console.log(formData);

      toast.success("Submitted Successfully");
      // resetFormFields();
      navigate("/assigned-task");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const resetFormFields = () => {
    setFormData({
      title: "",
      description: "",
      compliance_checks: "",
      status: "",
      document_link: "",
      approval_status: "",
      keyword_campaign: "",
      assignee: "",
      tc_assignee_1: "",
      tc_assignee_2: "",
    });
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
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserList();
  }, []);

  return (
    <div>
      <div className="screen-cont">
        {/* <HabotAppBar /> */}
        <div className="job-cont cmd_cont">
          <span>Task Assignment Page</span>
        </div>
        <div className="container_form">
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
                Assign Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackAssignmentPage;
