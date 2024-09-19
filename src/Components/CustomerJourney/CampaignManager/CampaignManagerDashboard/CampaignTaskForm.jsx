import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import {
  campaignTask,
  baseURL,
  accountUsers,
  keywordCampaign,
  sectorSelection,
  dashboardCampaigns,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import axios from "axios";
import "./CampaignManagerDashboard.css";

function CampaignTaskForm() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  // const assigneeId = useParams();
  // const keywordCampaignId = assigneeId.id;
  // console.log(keywordCampaignId);
  // console.log(assigneeId);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    compliance_checks: "",
    status: "",
    document_link: "",
    approval_status: "",
    assignee: "",
    tc_assignee_1: "",
    tc_assignee_2: "",
    sector: "",
    campaign: "",
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
    const taskData = {
      ...formData,
      keyword_campaign: formData.sector,
      track_campaign: formData.campaign,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${baseURL}${campaignTask}`, taskData, {
        headers,
      });
      toast.success("Submitted Successfully");
      resetFormFields();
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error assigning task:", error);
      if (error.response && error.response.data) {
        console.log(error.response.data);
      }
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
      assignee: "",
      tc_assignee_1: "",
      tc_assignee_2: "",
      sector: "",
      campaign: "",
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

    const fetchSectorList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${sectorSelection}`, {
          headers,
        });
        setSectorList(response.data);
      } catch (error) {
        console.error("Error fetching sector list:", error);
      }
    };

    const fetchCampaignList = async () => {
      // Add this function
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${dashboardCampaigns}`, {
          headers,
        });
        setCampaignList(response.data);
      } catch (error) {
        console.error("Error fetching campaign list:", error);
      }
    };

    fetchUserList();
    fetchSectorList();
    fetchCampaignList();
  }, []);
  return (
    <div>
      <div className="screen-cont">
        <HabotAppBar />
        {/* <div className="job-cont cmd_cont">
          <span>Task Assignment Page</span>
          <table className="customers job_tab">
            <tr>
              <th>Sr no</th>
              <th>Name of the Campaign</th>
              <th>Name of the Station</th>
              <th>Station ID</th>
              <th>Description</th>
              <th>Compliance Checks</th>
            </tr>

            <tr>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
            </tr>
            <tr>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
            </tr>
          </table>
        </div> */}
        <div className="container_form">
          <div className="form_page">
            <div className="form_page_sub">
              <Row>
                <Col md={6}>
                  {" "}
                  <Form.Group>
                    <Form.Label>Sector</Form.Label>
                    <Form.Select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                    >
                      <option value="">Select Sector</option>
                      {sectorList.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Campaign</Form.Label>
                    <Form.Select
                      name="campaign"
                      value={formData.campaign}
                      onChange={handleChange}
                    >
                      <option value="">Select Campaign</option>
                      {campaignList.map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

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
                      <Form.Label>Compliance Checks</Form.Label>
                      <FormControl
                        type="text"
                        placeholder="Compliance Checks"
                        name="compliance_checks"
                        value={formData.compliance_checks}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Approval Status</Form.Label>
                      <Form.Select
                        name="approval_status"
                        value={formData.approval_status}
                        onChange={handleChange}
                      >
                        <option value="">Select Approval Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="ON_REVIEW">On Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
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
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Document Link</Form.Label>
                      <FormControl
                        type="text"
                        placeholder="Document Link"
                        name="document_link"
                        value={formData.document_link}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    {/* <Form.Group>
                      <Form.Label>Feedback</Form.Label>
                      <FormControl
                        type="text"
                        placeholder="Feedback"
                        name="feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                      />
                    </Form.Group> */}
                  </Col>
                  <Col md={4}></Col>
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
        <div className="footer-ad">
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default CampaignTaskForm;
