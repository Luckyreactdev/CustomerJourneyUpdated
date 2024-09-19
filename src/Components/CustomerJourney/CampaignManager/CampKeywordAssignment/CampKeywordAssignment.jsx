import React, { useState, useEffect } from "react";
import "./CampKeywordAssignment.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import {
  baseURL,
  extractedKeywords,
  taskDashboard,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import ViewDocumentModal from "./ViewDocumentModal";
import UploadDocumentModal from "./UploadDocumentModal";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function CampKeywordAssignment() {
  const [tcFormData, setTcFormData] = useState(null);
  const [tasksDash, setTasksDash] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [file, setFile] = useState(null);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);
  console.log(selectedTask);

  useEffect(() => {
    fetchTaskData();
    fetchKeywordData();
  }, []);

  const fetchTaskData = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    // Determine the correct URL based on user role
    const userRole = savedUserInfo?.user_profile?.user?.roles?.find(
      (role) => role?.name === "TRACK_MANAGER"
    );

    const baseUrl =
      "https://customer-journey-19042024.uc.r.appspot.com/dashboards/tasks/";
    const url =
      userRole?.name === "TRACK_MANAGER"
        ? baseUrl
        : `${baseUrl}?assignee=${savedUserInfo?.user_profile?.user?.id}`;
    console.log(url, userRole);
    axios
      .get(url, { headers })
      .then((response) => {
        console.log(response.data);
        setTasksDash(response.data);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  };

  const handleStatusUpdate = () => {
    fetchTaskData();
  };

  const fetchKeywordData = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${extractedKeywords}`, { headers })
      .then((response) => {
        setTcFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  };

  const handleShowModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleShowAddModal = (taskId) => {
    setSelectedTaskId(taskId);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleAcceptClick = (taskId) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .patch(
        `${baseURL}${taskDashboard}${taskId}/`, // Adjust URL if needed
        {
          status: "ONGOING",
          started_at: new Date().toISOString(), // Current date in ISO format
        },
        { headers }
      )
      .then((response) => {
        toast.success("Task status updated to ONGOING");
        fetchTaskData(); // Refresh tasks data to reflect changes
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      });
  };
  const roles = savedUserInfo?.user_profile?.user?.roles || [];
  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <span className="sub_title_form">Campaign Initiation and Listing</span>

        <table className="customers job_tab">
          <thead>
            <tr>
              <td>
                <b>Id</b>
              </td>
              <td>
                <b>Sector</b>
              </td>
              <td>
                <b>Sub-Sector</b>
              </td>
              <td>
                <b>Assignment Date and Time</b>
              </td>
              <td>
                <b>Accepted Date and Time</b>
              </td>
              <td>
                <b>End Date and Time</b>
              </td>
              <td>
                <b>Assignee</b>
              </td>
              <td>
                <b>TC Assignee 1</b>
              </td>
              <td>
                <b>TC Assignee 2</b>
              </td>
              <td>
                <b>Status</b>
              </td>
              <td>
                <b>Action</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {tasksDash?.results?.map((task, index) => (
              <tr key={index}>
                <td>{task?.id}</td>
                <td>{task?.sub_sector_info?.sector_info?.name || "N/A"}</td>
                <td>{task?.sub_sector_info?.name || "N/A"}</td>
                <td>
                  {task?.created_at
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
                  {task?.started_at
                    ? new Date(task.started_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                      })
                    : "Not Accepted"}
                </td>
                <td>
                  {task?.ended_at
                    ? new Date(task.ended_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                      })
                    : "Not Completed"}
                </td>

                <td>{task?.assignee_info?.email}</td>
                <td>{task?.tc_assignee_1_info?.email}</td>
                <td>{task?.tc_assignee_2_info?.email}</td>
                <td>{task?.status}</td>
                <td>
                  {task.status === "ASSIGNED" ? (
                    roles.find((role) => role?.name === "TRACK_MANAGER") ? (
                      "On Going"
                    ) : (
                      <Button
                        className="job_accept mx-2 status-btn btn-success"
                        onClick={() => handleAcceptClick(task.id)}
                      >
                        Accept
                      </Button>
                    )
                  ) : task?.keyword_file_info ? (
                    <Button
                      className="job_accept mx-2 status-btn "
                      onClick={() => handleShowModal(task)}
                    >
                      View Document
                    </Button>
                  ) : roles.find((role) => role?.name === "TRACK_MANAGER") ? (
                    "On Going"
                  ) : (
                    <Button
                      className="job_accept mx-2 status-btn"
                      onClick={() => handleShowAddModal(task.id)}
                    >
                      Add Document
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center my-3">
          <Button
            className="mx-2"
            onClick={() => fetchTaskData(prevPage)}
            disabled={!prevPage}
          >
            Previous
          </Button>
          <Button
            className="mx-2"
            onClick={() => fetchTaskData(nextPage)}
            disabled={!nextPage}
          >
            Next
          </Button>
        </div>
      </div>

      {selectedTask && (
        <ViewDocumentModal
          show={showModal}
          onHide={() => setShowModal(false)}
          task={selectedTask}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <UploadDocumentModal
        show={showAddModal}
        onHide={handleCloseAddModal}
        setFile={setFile}
        file={file}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        setShowAddModal={setShowAddModal}
        setTasksDash={setTasksDash} // Added this line to pass down setTasksDash
        fetchTaskData={fetchTaskData} // Pass fetchTaskData to refresh tasks after upload
      />

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CampKeywordAssignment;
