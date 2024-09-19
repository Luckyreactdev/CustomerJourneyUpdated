import React, { useState, useEffect } from "react";
import AdminFooter from "../../../Footer/AdminFooter";
import { Link, useNavigate } from "react-router-dom";
import { Button, Tab, Row, Col, Nav, Form, Modal, FormControl, } from "react-bootstrap";
import "./CampaignManagerDashboard.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import axios from "axios";
import {
  campaignTask,
  baseURL,
} from "../../../../helpers/endpoints/api_endpoints";
function CampaignManagerDashboard() {
  const [taskList, setTaskList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${campaignTask}`, {
          headers,
        });
        setTaskList(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching task list:", error);
      }
    };

    fetchTaskList();
  }, []);

  const getAssigneeDisplay = (assigneeInfo) => {
    if (!assigneeInfo) return "";
    const { email, profile_info } = assigneeInfo;
    return profile_info?.full_name ? profile_info.full_name : email;
  };

  const handleReject = async (taskId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const patchDataReject = {
        approval_status: "REJECTED",
      };
      await axios.patch(
        `${baseURL}${campaignTask}${taskId}/`,
        patchDataReject,
        {
          headers,
        }
      );
      setTaskList(prevTaskList =>
        prevTaskList.map(task =>
          task.id === taskId ? { ...task, approval_status: "REJECTED" } : task
        )
      );
    } catch (error) {
      console.error("Error rejecting task:", error);
    }
  };

  const handleApprove = async (taskId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const patchData = {
        approval_status: "APPROVED",
      };
      await axios.patch(`${baseURL}${campaignTask}${taskId}/`, patchData, {
        headers,
      });
      setTaskList(prevTaskList =>
        prevTaskList.map(task =>
          task.id === taskId ? { ...task, approval_status: "APPROVED" } : task
        )
      );
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      await axios.delete(`${baseURL}${campaignTask}${taskId}/`, {
        headers,
      });
      setTaskList(prevTaskList =>
        prevTaskList.filter(task => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
  const handleSaveChanges = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      await axios.patch(
        `${baseURL}${campaignTask}${currentTask.id}/`,
        currentTask,
        { headers }
      );
      setTaskList((prevTasks) =>
        prevTasks.map((task) =>
          task.id === currentTask.id ? currentTask : task
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <Tab.Container id="dashboard-tabs" defaultActiveKey="master-dashboard">
        <Row>
          <Nav variant="pills" className="cmd_tabs">
            <Nav.Item>
              <Nav.Link eventKey="master-dashboard">Master Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="job">Google Analytics</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="task-assignment">Email</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sector-selection">WhatsApp</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Link to="/campaign-task-form">
              <Button>Campaign Task Form</Button>
            </Link>
            <Tab.Pane eventKey="master-dashboard">
              <div className="job-cont cmd_table cmd_cont">
                <div className="mt-4">
                  <table className="customers job_tab">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Compliance Checks</th>
                        <th>Status</th>
                        <th>Document Link</th>
                        <th>Approval Status</th>
                        {/* <th>Keyword Campaign</th> */}
                        {/* <th>Track Campaign</th> */}
                        <th>Assignee</th>
                        <th>TC Assignee 1</th>
                        <th>TC Assignee 2</th>
                        <th>Status</th>
                        <th>Update/Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taskList.map((task) => (
                        <tr key={task.id}>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>{task.compliance_checks}</td>
                          <td>{task.status}</td>
                          <td>{task.document_link}</td>
                          <td>{task.approval_status}</td>
                          {/* <td>{task.keyword_campaign}</td> */}
                          {/* <td>{task.track_campaign}</td> */}
                          <td>{getAssigneeDisplay(task.assignee_info)}</td>
                          <td>{getAssigneeDisplay(task.tc_assignee_1_info)}</td>
                          <td>{getAssigneeDisplay(task.tc_assignee_2_info)}</td>
                          <td>
                            {task.approval_status === "PENDING" && (
                              <>
                                <Button
                                  className="job_accept mx-2 status-btn"
                                  onClick={() => handleApprove(task.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  className="job_table_close_status mx-2 mt-2 status-btn"
                                  onClick={() => handleReject(task.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {task.approval_status === "ON_REVIEW" && (
                              <Button
                                disabled
                                size="sm"
                                className="status-btn status_on_review"
                              >
                                On Review
                              </Button>
                            )}
                            {task.approval_status === "APPROVED" && (
                              <Button
                                disabled
                                size="sm"
                                className="status-btn status_on_approve"
                              >
                                Approved
                              </Button>
                            )}
                            {task.approval_status === "REJECTED" && (
                              <Button
                                disabled
                                size="sm"
                                className="status-btn status_on_reject"
                              >
                                Rejected
                              </Button>
                            )}
                          </td>
                          <td>
                  <>
                    <Button
                      className="job_accept mx-2 status-btn"
                      onClick={() => handleUpdate(task)}
                    >
                      Update
                    </Button>
                    <Button
                      className="job_table_close_status mx-2 mt-2 status-btn"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </>
                </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTask && (
            <Form>
              <Row className="form-field-TM mt-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Title"
                      name="title"
                      value={currentTask.title}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Description"
                      name="description"
                      value={currentTask.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={currentTask.status}
                      onChange={handleChange}
                    >
                      <option value="ASSIGNED">Assigned</option>
                      <option value="ONGOING">Ongoing</option>
                      <option value="COMPLETED">Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Approval Status</Form.Label>
                    <Form.Select
                      name="approval_status"
                      value={currentTask.approval_status}
                      onChange={handleChange}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ON_REVIEW">On Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Document Link</Form.Label>
                    <FormControl
                      type="text"
                      placeholder="Document Link"
                      name="document_link"
                      value={currentTask.document_link}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
              </div>

              <div className="Track_MD_btn mt-3">
                <Link to="/task-assignment-page">
                  <Button variant="outline-primary" className="close_form mx-2">
                    Back to Task Assignment Page
                  </Button>
                </Link>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="job">
              <div className="job-cont cmd_table cmd_cont">
                <Form.Select className="tmd_select">
                  <option>Filter</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
                <table className="customers job_tab">
                  <tr>
                    <th>Page location</th>
                    <th>Country</th>
                    <th>Date</th>
                    <th>Device Sategory</th>
                    <th>Session Source</th>
                    <th>Website Visitors</th>
                    <th>Source Medium</th>
                    <th>First visits</th>
                    <th>Views</th>
                    <th>Bounce Rate</th>
                    <th>Engagement Rate</th>
                    <th>Average session duration</th>
                    <th>Impression</th>
                    <th>CPM</th>
                    <th>CTR</th>
                  </tr>

                  <tr>
                    <td>data</td>
                    <td>data</td>
                    <td>data</td>
                    <td>data</td>
                    <td>data</td>
                    <td>
                      <Link>View</Link>
                    </td>
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
                  <tr>
                    <td>data</td>
                    <td>data</td>
                    <td>data</td>
                    <td>data</td>
                    <td>data</td>
                    <td>
                      <Link>View</Link>
                    </td>
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
                </table>
              </div>

              <div className="Track_MD_btn mt-3">
                <Link to="/task-assignment-page">
                  <Button variant="outline-primary" className="close_form mx-2">
                    Back to Task Assignment Page
                  </Button>
                </Link>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="task-assignment">
              <div className="job-cont cmd_table cmd_cont">
                <table className="customers job_tab">
                  <tr>
                    <th>No of Content created for Email</th>
                    <th>No of Email Sent</th>
                    <th>No of clicks</th>
                    <th>Frequency of Email</th>
                    <th>Open Rate</th>
                    <th>Bounce Rate</th>
                    <th>Response Rate</th>
                    <th>No of Visitors to the website</th>
                  </tr>

                  <tr>
                    <td>data</td>
                    <td>data</td>
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
                    <td>data</td>
                    <td>data</td>
                  </tr>
                </table>
              </div>

              <div className="Track_MD_btn mt-3">
                <Link to="/task-assignment-page">
                  <Button variant="outline-primary" className="close_form mx-2">
                    Back to Task Assignment Page
                  </Button>
                </Link>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="sector-selection">
              <div className="job-cont cmd_table cmd_cont">
                <table className="customers job_tab">
                  <tr>
                    <th>No of contacts Contacted</th>
                    <th>Read Rate</th>
                    <th>Reply Rate</th>
                    <th>Website Click</th>
                    <th>Bounce Rate</th>
                    <th>Visitors to the Website</th>
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
                    <td>data </td>
                    <td>data </td>
                    <td>data </td>
                    <td>data </td>
                    <td>data </td>
                    <td>data </td>
                  </tr>
                </table>
              </div>

              <div className="Track_MD_btn mt-3">
                <Link to="/task-assignment-page">
                  <Button variant="outline-primary" className="close_form mx-2">
                    Back to Task Assignment Page
                  </Button>
                </Link>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CampaignManagerDashboard;
