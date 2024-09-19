import React, { useState, useEffect } from "react";
import "./TrackManagerDashboard.css";
import { Button, Modal, Form, FormControl, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  baseURL,
  taskDashboard,
} from "../../../../helpers/endpoints/api_endpoints";

function MasterDashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${taskDashboard}`, {
          headers,
        });
        setTasks(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching sectors:", error);
      }
    };
    fetchTasks();
  }, []);

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
      await axios.patch(`${baseURL}${taskDashboard}${taskId}/`, patchData, {
        headers,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, approval_status: "APPROVED" } : task
        )
      );
    } catch (error) {
      console.error("Error approving task:", error);
    }
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
        `${baseURL}${taskDashboard}${taskId}/`,
        patchDataReject,
        {
          headers,
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, approval_status: "REJECTED" } : task
        )
      );
    } catch (error) {
      console.error("Error rejecting task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      await axios.delete(`${baseURL}${taskDashboard}${taskId}/`, {
        headers,
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
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
        `${baseURL}${taskDashboard}${currentTask.id}/`,
        currentTask,
        { headers }
      );
      setTasks((prevTasks) =>
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
    <div>
      <div className="mt-3 job-cont">
        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name of the Campaign</th>
              {/* <th>Name of the Station</th> */}
              {/* <th>Station ID</th> */}
              <th>Description</th>
              <th>Assigned Employee</th>
              <th>Task Status</th>
              {/* <th>Name of the Document</th> */}
              <th>Document Link</th>
              <th>Approval Status</th>
              <th>Status</th>
              <th>Update/ Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                {/* <td>{task.assignee_info.profile_info.station_name}</td> */}
                {/* <td>{task.assignee_info.profile_info.station_id}</td> */}
                <td>{task.description}</td>
                <td>{task.assignee_info.email}</td>
                <td>{task.status}</td>
                {/* <td></td> */}
                <td>{task.document_link}</td>
                <td>{task.approval_status}</td>
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
                    <Button disabled size="sm" className="status-btn status_on_review">
                      On Review
                    </Button>
                  )}
                  {task.approval_status === "APPROVED" && (
                    <Button disabled size="sm" className="status-btn status_on_approve">
                      Approved
                    </Button>
                  )}
                  {task.approval_status === "REJECTED" && (
                    <Button disabled size="sm" className="status-btn status_on_reject">
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

      <div className="Track_MD_btn mt-3">
        {/* <Link to="/task-assignment-page">
          <Button variant="outline-primary" className="close_form mx-2">
            Back to Task Assignment
          </Button>
        </Link> */}
        <Link to="/sector-selection">
          <Button variant="outline-primary" className="close_form mx-2 mb-4">
            Select New Sector
          </Button>
        </Link>
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
  );
}

export default MasterDashboard;
