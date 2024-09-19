import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  baseURL,
  accountUsers,
  campaignTask,
  dashboardContent,
  trackCampaign,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import axios from "axios";

function ContentCreation({ show, handleClose, taskId, onSuccess }) {
  const [selectedTC1, setSelectedTC1] = useState("");
  const [selectedTC2, setSelectedTC2] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [campManager, setCampManager] = useState([]);
  const [trackCampaignData, setTrackCampaignData] = useState(null);
  const [showKeywordsModal, setShowKeywordsModal] = useState(false); // State to control keywords modal visibility

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

  useEffect(() => {
    fetchUsers();
    fetchTaskList();
  }, []);

  const fetchTrackCampaignDetails = async (trackCampaignId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${baseURL}${trackCampaign}${trackCampaignId}/`,
        { headers }
      );
      setTrackCampaignData(response.data);
    } catch (error) {
      console.error("Error fetching track campaign details:", error);
    }
  };

  useEffect(() => {
    if (campManager.length > 0) {
      const filteredTasks = campManager.filter((task) => task.id === taskId);
      if (filteredTasks.length > 0) {
        const trackCampaignId = filteredTasks[0].track_campaign;
        fetchTrackCampaignDetails(trackCampaignId);
      }
    }
  }, [campManager, taskId]);

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
      setCampManager(response.data.results);
    } catch (error) {
      console.error("Error fetching task list:", error);
    }
  };

  const filteredTasks = campManager.filter((task) => task.id === taskId);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAndSubmit = async () => {
    try {
      if (!selectedFile) {
        toast.error("Please select a file to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("track_campaign_task", parseInt(taskId, 10));

      const accessToken = localStorage.getItem("accessToken");
      const documentUploadHeaders = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      await axios.post(`${baseURL}${dashboardContent}`, formData, {
        headers: documentUploadHeaders,
      });

      const updatedTaskData = {
        status: "SENT_TO_TC",
      };

      await axios.patch(
        `${baseURL}${campaignTask}${taskId}/`,
        updatedTaskData,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const currentDate = new Date().toISOString();
      const updatedEndedAtData = {
        ended_at: currentDate,
      };

      await axios.patch(
        `${baseURL}${campaignTask}${taskId}/`,
        updatedEndedAtData,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Document uploaded and task submitted to TC successfully.");
      handleClose();
      onSuccess();
    } catch (error) {
      console.error("Error uploading document and submitting task:", error);
      toast.error(
        "Failed to upload document or submit task. Please try again."
      );
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Upload and Submit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="customers job_tab">
            <thead>
              <tr>
                <th>Name of the Sector</th>
                <th>Name of the Subsector</th>
                <th>Content Type</th>
                <th>Notes from Campaign Manager</th>
                <th>View Keywords</th>
                <th>Assign Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((contCreation) => (
                <tr key={contCreation.id}>
                  <td>
                    {contCreation.sub_sector_info?.sector_info?.name || "N/A"}
                  </td>
                  <td>{contCreation.sub_sector_info?.name || "N/A"}</td>
                  <td>{contCreation.content_type || "N/A"}</td>
                  <td>{contCreation.note || "N/A"}</td>
                  <td>
                    {trackCampaignData?.extracted_keywords_info.length > 3 ? (
                      <>
                        {trackCampaignData.extracted_keywords_info
                          .slice(0, 3)
                          .map((keyword, index) => (
                            <div key={index}>{keyword.name}</div>
                          ))}
                        <Button
                          variant="link"
                          onClick={() => setShowKeywordsModal(true)}
                        >
                          more...
                        </Button>
                      </>
                    ) : trackCampaignData?.extracted_keywords_info.length >
                      0 ? (
                      trackCampaignData.extracted_keywords_info.map(
                        (keyword, index) => (
                          <div key={index}>{keyword.name}</div>
                        )
                      )
                    ) : (
                      "No keywords available"
                    )}
                  </td>
                  <td>
                    {new Date(contCreation.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                    })}
                  </td>
                  <td>{contCreation.status || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Row className="mt-4 mb-2">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Upload File</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              {/* <Form.Group>
                <Form.Label>TC1</Form.Label>
                <Form.Select
                  name="campaign-manager-tc1"
                  value={selectedTC1}
                  onChange={(e) => setSelectedTC1(e.target.value)}
                >
                  <option value="">Select TC1</option>
                  {userList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group> */}
            </Col>
            <Col md={4}>
              {/* <Form.Group>
                <Form.Label>TC2</Form.Label>
                <Form.Select
                  name="campaign-manager-tc2"
                  value={selectedTC2}
                  onChange={(e) => setSelectedTC2(e.target.value)}
                >
                  <option value="">Select TC2</option>
                  {userList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group> */}
            </Col>
          </Row>
          <Button variant="primary" onClick={handleUploadAndSubmit}>
            Upload and submit for TC
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Keywords Modal */}
      <Modal
        show={showKeywordsModal}
        onHide={() => setShowKeywordsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>All Keywords</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trackCampaignData?.extracted_keywords_info.map((keyword, index) => (
            <div key={index}>{keyword.name}</div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowKeywordsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ContentCreation;
