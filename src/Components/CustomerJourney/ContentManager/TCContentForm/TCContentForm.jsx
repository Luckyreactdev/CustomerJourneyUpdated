import React, { useState, useEffect } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button, Modal, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  baseURL,
  campaignTask,
  dashboardContent,
  trackCampaign,
  contentKeyword,
} from "../../../../helpers/endpoints/api_endpoints";
import "./TCContentForm.css";
import TCContentDownload from "./TCContentDownload";
import TCContentView from "./TCContentView";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function TCContentForm() {
  const [taskList, setTaskList] = useState([]);
  const [trackCamp, setTrackCamp] = useState([]);
  const [document, setDocument] = useState(null);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [note, setNote] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [contentTask, setContentTask] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [updateUI, setUpdateUI] = useState();
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);
  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = savedUserInfo?.user_profile?.user?.roles?.find(
          (role) => role?.name === "TRACK_MANAGER"
        )
          ? await axios.get(`${baseURL}${campaignTask}`, {
              headers,
            })
          : await axios.get(
              `${baseURL}${campaignTask}?tc_assignee_id=${savedUserInfo?.user_profile?.user?.id}`,
              {
                headers,
              }
            );
        setTaskList(response.data.results);

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching task list:", error);
      }
    };

    fetchTaskList();
  }, []);

  useEffect(() => {
    const fetchContentStatus = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${contentKeyword}`, {
          headers,
        });
        setContentTask(response.data.results);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching task list:", error);
      }
    };

    fetchContentStatus();
  }, [updateUI]);

  const fetchDocument = async (taskId) => {
    try {
      console.log("Task ID:", taskId);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/content/?track_campaign_task_id=${taskId}`,
        {
          headers,
        }
      );

      const document = response.data.results.find(
        (doc) => doc.track_campaign_task === taskId
      );
      setDocument(document);
      setShowDocumentModal(true);
      console.log(document);
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleEditNote = (taskId, currentNote) => {
    setEditingTaskId(taskId);
    setNote(currentNote);
  };

  const handleSaveNote = async (taskId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      await axios.put(
        `${baseURL}${campaignTask}${taskId}/`,
        { note },
        { headers }
      );

      setTaskList((prevTaskList) =>
        prevTaskList.map((task) =>
          task.id === taskId ? { ...task, note } : task
        )
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  useEffect(() => {
    const fetchTrackCamp = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${trackCampaign}`, {
          headers,
        });
        setTrackCamp(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching task list:", error);
      }
    };

    fetchTrackCamp();
  }, []);

  const handleViewClick = (taskId) => {
    const selected = trackCamp.find((camp) => camp.id === taskId);
    setSelectedCampaign(selected);
    setShowKeywordModal(true);
  };

  const handleCloseModal = () => {
    setShowKeywordModal(false);
    setShowDocumentModal(false);
    setSelectedCampaign(null);
    setDocument(null);
  };

  const handleRejectClick = (taskId) => {
    setSelectedTaskId(taskId);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    console.log("Submitting feedback for content ID:", selectedTaskId);
    console.log("Feedback content:", feedback);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      await axios.post(
        `${baseURL}${contentKeyword}`,
        {
          status: "REJECTED",
          feedback,
          content: selectedTaskId,
        },
        { headers }
      );

      toast.success("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      setFeedback("");
      setSelectedTaskId(null);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
    }
  };

  const handleApproveClick = async (taskId) => {
    console.log(taskId);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Make the API call and capture the response
      await axios.post(
        `${baseURL}${contentKeyword}`,
        {
          status: "APPROVED",
          content: taskId,
        },
        { headers }
      );

      // Update the local state to reflect the changes
      setTaskList((prevTaskList) =>
        prevTaskList.map((task) =>
          task.uploaded_content?.id === taskId
            ? { ...task, status: "APPROVED" }
            : task
        )
      );

      toast.success("Task approved successfully!");
    } catch (error) {
      console.error("Error approving task:", error);
      toast.error("Error approving task");
    }
  };
  const userId = savedUserInfo?.user_profile?.user?.id;

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_cont">
        <span>TC for Content</span>
        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Name of the Sector</th>
              <th>Name of the Subsector</th>
              <th>Notes from Campaign Manager</th>
              <th>View Keywords</th>
              <th>TC Assignee 1</th>
              <th>TC Assignee 2</th>
              <th>Assign Date and Time</th>
              <th>Accepted Date & Time TC 1</th>
              <th>Approval Date & Time TC 1</th>
              <th>Accepted Date & Time TC 2</th>
              <th>Approval Date & Time TC 2</th>
              {/* <th>End Date and Time</th> */}
              <th>View Document</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {taskList.length > 0 ? (
              taskList.map((task) => (
                <tr key={task.id}>
                  <td>{task.sub_sector_info?.sector_info?.name || "N/A"}</td>
                  <td>{task.sub_sector_info?.name || "N/A"}</td>
                  <td>
                    {editingTaskId === task.id ? (
                      <div>
                        <FormControl
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                        <Link onClick={() => handleSaveNote(task.id)}>
                          {" "}
                          Save
                        </Link>
                      </div>
                    ) : (
                      <div>
                        {task.note || "N/A"}
                        <Link
                          onClick={() => handleEditNote(task.id, task.note)}
                        >
                          {" "}
                          Edit
                        </Link>
                      </div>
                    )}
                  </td>
                  <td>
                    <Link onClick={() => handleViewClick(task.id)}>View</Link>
                  </td>
                  <td>{task?.tc_assignee_1_info?.email}</td>
                  <td>{task?.tc_assignee_2_info?.email}</td>
                  <td>
                    {task.created_at
                      ? new Date(task.created_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "N/A"}
                  </td>

                  <td>
                    {task?.tc_1_accepted_at
                      ? new Date(task.tc_1_accepted_at).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                          }
                        )
                      : "Not Accepted"}
                  </td>
                  <td>
                    {task?.uploaded_content?.tc_1_approved_at
                      ? new Date(
                          task?.uploaded_content?.tc_1_approved_at
                        ).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "Not Approved"}
                  </td>

                  <td>
                    {userId === task?.tc_assignee_2 && task?.tc_2_accepted_at
                      ? new Date(task.tc_2_accepted_at).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                          }
                        )
                      : "Not Accepted"}
                  </td>
                  <td>
                    {task?.uploaded_content?.tc_2_approved_at
                      ? new Date(
                          task?.uploaded_content?.tc_2_approved_at
                        ).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "Not Approved"}
                  </td>
                  {/* <td>
                    {task.end_date
                      ? new Date(task.end_date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "Not Completed"}
                  </td> */}

                  <td>
                    {task?.uploaded_content?.file ? (
                      <Link onClick={() => fetchDocument(task.id)}>
                        View Document
                      </Link>
                    ) : (
                      "No Document Available"
                    )}
                  </td>
                  <td>{task.status || "N/A"}</td>
                  {/* <td>
                    {(task?.uploaded_content?.file &&
                      savedUserInfo?.user_profile?.user?.id ===
                        task?.tc_assignee_1) ||
                    savedUserInfo?.user_profile?.user?.id ===
                      task?.tc_assignee_2 ? (
                      <div className="Track_MD_btn">
                        {task.status === "REJECTED" ? (
                          <Button className="job_accept mx-1" disabled>
                            Rejected
                          </Button>
                        ) : (
                          <>
                            <Button
                              className="job_accept mx-1"
                              onClick={() =>
                                handleApproveClick(task?.uploaded_content?.id)
                              }
                              disabled={task.has_given_feedback}
                            >
                              {task.has_given_feedback ? "Approved" : "Approve"}
                            </Button>
                            {!task.has_given_feedback && (
                              <Button
                                className="job_table_close mx-1"
                                onClick={() => handleRejectClick(task.id)}
                              >
                                Reject
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </td> */}
                  <td>
                    {savedUserInfo?.user_profile?.user?.id ===
                      task?.tc_assignee_1 ||
                    savedUserInfo?.user_profile?.user?.id ===
                      task?.tc_assignee_2 ? (
                      task?.uploaded_content?.file ? (
                        <div className="Track_MD_btn">
                          {
                            <>
                              <Button
                                className="job_accept mx-1"
                                onClick={() =>
                                  handleApproveClick(task?.uploaded_content?.id)
                                }
                                disabled={task.has_given_feedback}
                              >
                                {task.has_given_feedback
                                  ? "Approved"
                                  : "Approve"}
                              </Button>
                              {!task.has_given_feedback && (
                                <Button
                                  className="job_table_close mx-1"
                                  onClick={() => handleRejectClick(task.id)}
                                >
                                  Reject
                                </Button>
                              )}
                            </>
                          }
                        </div>
                      ) : (
                        <span>Document not available</span>
                      )
                    ) : (
                      "Not a TC"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>

      <TCContentDownload
        show={showDocumentModal}
        handleClose={handleCloseModal}
        document={document}
      />

      <TCContentView
        showKeywordModal={showKeywordModal}
        handleCloseModal={handleCloseModal}
        selectedCampaign={selectedCampaign}
      />

      {/* Feedback Modal */}
      <Modal
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            as="textarea"
            rows={3}
            placeholder="Enter your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFeedbackModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleFeedbackSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TCContentForm;
