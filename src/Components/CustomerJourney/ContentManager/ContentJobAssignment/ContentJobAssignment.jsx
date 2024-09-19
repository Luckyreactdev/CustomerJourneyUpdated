import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import "./ContentJobAssignment.css";
import {
  baseURL,
  campaignTask,
  accountProfile,
} from "../../../../helpers/endpoints/api_endpoints";
import ContentCreationManager from "./ContentCreationManager";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ContentJobAssignment() {
  const [taskList, setTaskList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${accountProfile}`, {
        headers,
      });
      setUserList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchTaskList = useCallback(
    async (page = 1) => {
      try {
        setLoading(true); // Start loading
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };

        let response;
        if (
          savedUserInfo?.user_profile?.user?.roles?.find(
            (role) => role?.name === "TRACK_MANAGER"
          )
        ) {
          response = await axios.get(
            `https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/?page=${page}`,
            { headers }
          );
        } else {
          response = await axios.get(
            `https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/?content_manager=${userList?.user?.id}&page=${page}`,
            { headers }
          );
        }
        console.log(response.data);
        setTaskList(response.data);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (error) {
        console.error("Error fetching task list:", error);
      } finally {
        setLoading(false); // End loading
      }
    },
    [savedUserInfo, userList]
  );

  useEffect(() => {
    if (userList?.user?.id) {
      fetchTaskList(currentPage);
    }
  }, [userList?.user?.id, currentPage, fetchTaskList]);

  const handleShowModal = (taskId) => {
    setSelectedTaskId(taskId);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleAcceptTask = async (taskId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Get the current date in the desired format (ISO 8601 format)
      const currentDate = new Date().toISOString();

      console.log(taskId);
      await axios.patch(
        `${baseURL}${campaignTask}${taskId}/`,
        {
          status: "ONGOING",
          started_at: currentDate, // Include the current date
        },
        { headers }
      );

      toast.success("Task accepted successfully!");
      fetchTaskList();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleRefreshTaskList = () => {
    fetchTaskList();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_cont">
        <span className="sub_title_form">Content Jobs Listing</span>

        {loading ? (
          <div className="spinner">
            <table className="customers job_tab">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Sector</th>
                  <th>Sub-Sector</th>
                  <th>Content Type</th>
                  <th>Campaign Name</th>
                  <th>Note</th>
                  <th>TC Assignee 1</th>
                  <th>TC Assignee 2</th>
                  <th>Job initiated Date and Time</th>
                  <th>Accepted Date and Time</th>
                  <th>Submitted Date and Time</th>
                  <th>Content Link</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={14}>Loading...</td>
                </tr>
              </tbody>
            </table>
          </div> // Show spinner
        ) : (
          <table className="customers job_tab">
            <thead>
              <tr>
                <th>Id</th>
                <th>Sector</th>
                <th>Subsector</th>
                <th>Content Type</th>
                <th>Campaign Name</th>
                <th>Note</th>
                <th>TC Assignee 1</th>
                <th>TC Assignee 2</th>
                <th>Job initiated Date and Time</th>
                <th>Accepted Date and Time</th>
                <th>Submitted Date and Time</th>
                <th>Content Link</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {taskList?.results?.map((task) => (
                <tr key={task?.id}>
                  <td>{task?.id}</td>
                  <td>{task?.sub_sector_info?.sector_info?.name || "N/A"}</td>
                  <td>{task?.sub_sector_info?.name || "N/A"}</td>
                  <td>{task?.content_type || "N/A"}</td>
                  <td>
                    {" "}
                    {task?.track_campaign_info?.campaign_type ===
                    "SOCIAL_MEDIA_POST"
                      ? "Social Media Post"
                      : task?.track_campaign_info?.campaign_type ===
                        "AD_CAMPAIGN"
                      ? "Ad Campaign"
                      : "N/A"}
                  </td>
                  <td>{task?.note || "N/A"}</td>
                  <td>{task?.tc_assignee_1_info?.email}</td>
                  <td>{task?.tc_assignee_2_info?.email}</td>
                  <td>
                    {task?.created_at
                      ? new Date(task?.created_at).toLocaleString("en-GB", {
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
                  <td>
                    {task?.uploaded_content?.file ? (
                      <a
                        href={task?.uploaded_content?.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </a>
                    ) : (
                      "No Document"
                    )}
                  </td>
                  <td>{task?.status || "N/A"}</td>
                  <td>
                    {task?.status === "COMPLETED" ? (
                      <>
                        <Button variant="success" disabled>
                          DONE
                        </Button>
                      </>
                    ) : task?.status === "ONGOING" ? (
                      <>
                        <Button
                          className="m-1"
                          onClick={() => handleShowModal(task?.id)}
                        >
                          Upload & Submit
                        </Button>
                        &nbsp;
                        <Link
                          to={`/outsourcee-manager/${task?.track_campaign}`}
                        >
                          <Button variant="primary">Outsourcee</Button>
                        </Link>
                      </>
                    ) : task?.status === "ASSIGNED" ? (
                      <Button
                        className="btn-success"
                        onClick={() => handleAcceptTask(task?.id)}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Button disabled>Accepted</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="d-flex justify-content-center my-3">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        &nbsp;{" "}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <ContentCreationManager
        show={showModal}
        handleClose={handleCloseModal}
        taskId={selectedTaskId}
        onSuccess={handleRefreshTaskList}
      />
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default ContentJobAssignment;
