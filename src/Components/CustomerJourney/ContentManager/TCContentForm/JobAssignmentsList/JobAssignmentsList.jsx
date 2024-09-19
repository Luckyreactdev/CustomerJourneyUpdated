import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./JobAssignmentsList.css";
import HabotAppBar from "../../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import {
  accountProfile,
  baseURL,
  taskDashboard,
} from "../../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TCFormModal from "../../../AssignedTCSelection/TCForm/TCFormModal";

function JobAssignmentsList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedKeywordId, setSelectedKeywordId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState([]);
  const [tasksDash, setTasksDash] = useState([]);
  const [task, setTask] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const userId = Number(savedUserInfo?.user_profile?.user?.id);

    if (
      savedUserInfo?.user_profile?.user?.roles?.find(
        (role) => role?.name === "TRACK_MANAGER"
      )
    ) {
      axios
        .get(`${baseURL}${taskDashboard}?page=${currentPage}`, { headers })
        .then((response) => {
          setTasksDash(response.data);
          setTotalPages(Math.ceil(response.data.count / 10));
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching task details:", error);
          toast.error("Failed to fetch task details");
        });
    } else {
      axios
        .get(
          `${baseURL}${taskDashboard}?tc_assignee_id=${userId}&page=${currentPage}`,
          { headers }
        )
        .then((response) => {
          setTasksDash(response.data);
          setTotalPages(Math.ceil(response.data.count / 10));
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching task details:", error);
          toast.error("Failed to fetch task details");
        });
    }
  }, [savedUserInfo?.user_profile?.user?.id, currentPage]);

  const handleShowModal = (task) => {
    console.log(task);
    setTask(task);
    const taskId = task?.id;
    const keywordId = task?.keyword_file_info?.id;
    setSelectedTaskId(taskId);
    console.log(taskId);
    setSelectedKeywordId(keywordId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTaskId(null);
    setSelectedKeywordId(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const refreshTasks = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${taskDashboard}?page=${currentPage}`, { headers })
      .then((response) => {
        setTasksDash(response.data);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch((error) => {
        console.error("Error refreshing tasks:", error);
      });
  };
  const handleAccept = (task) => {
    console.log(task);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    const userId = savedUserInfo?.user_profile?.user?.id;
    const isTcAssignee1 = userId === task?.tc_assignee_1_info?.id;
    const isTcAssignee2 = userId === task?.tc_assignee_2_info?.id;
    console.log(userId, isTcAssignee1, isTcAssignee2);

    if (isTcAssignee1) {
      // PATCH the task for tc_1_accepted_at
      axios
        .patch(
          `${baseURL}${taskDashboard}${task?.id}/`,
          {
            tc_1_accepted_at: new Date().toISOString(),
          },
          { headers }
        )
        .then((response) => {
          refreshTasks();
          console.log(response.data);
          toast.success("Job accepted");
          // Update the specific task in state
          setTasksDash((prevTasks) => ({
            ...prevTasks,
            results: Array.isArray(prevTasks.results)
              ? prevTasks.results.map((t) =>
                  t.id === task.id
                    ? { ...t, tc_1_accepted_at: response.data.tc_1_accepted_at }
                    : t
                )
              : [],
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (isTcAssignee2) {
      // PATCH the task for tc_2_accepted_at
      axios
        .patch(
          `${baseURL}${taskDashboard}${task?.id}/`,
          {
            tc_2_accepted_at: new Date().toISOString(),
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          refreshTasks();
          toast.success("Job accepted");
          // Update the specific task in state
          setTasksDash((prevTasks) => ({
            ...prevTasks,
            results: Array.isArray(prevTasks.results)
              ? prevTasks.results.map((t) =>
                  t.id === task.id
                    ? { ...t, tc_2_accepted_at: response.data.tc_2_accepted_at }
                    : t
                )
              : [],
          }));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const userId = savedUserInfo?.user_profile?.user?.id;

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <span className="sub_title_form">TC Job Assignment</span>

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
                <b>Assigned Date & Time</b>
              </td>
              <td>
                <b>Accepted Date & Time TC 1</b>
              </td>
              <td>
                <b>Approval Date & Time TC 1</b>
              </td>
              <td>
                <b>Accepted Date & Time TC 2</b>
              </td>
              <td>
                <b>Approval Date & Time TC 2</b>
              </td>
              {/* <td>
                <b>End Date & Time</b>
              </td> */}
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
                  {task?.tc_1_accepted_at
                    ? new Date(task.tc_1_accepted_at).toLocaleString("en-GB", {
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
                  {task?.keyword_file_info?.tc_1_approved_at
                    ? new Date(
                        task?.keyword_file_info?.tc_1_approved_at
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
                  {task?.tc_2_accepted_at
                    ? new Date(task.tc_2_accepted_at).toLocaleString("en-GB", {
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
                  {task?.keyword_file_info?.tc_2_approved_at
                    ? new Date(
                        task?.keyword_file_info?.tc_2_approved_at
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
                </td> */}
                <td>{task?.assignee_info?.email}</td>
                <td>{task?.tc_assignee_1_info?.email}</td>
                <td>{task?.tc_assignee_2_info?.email}</td>
                <td>
                  {userId === task?.tc_assignee_1 &&
                  task.tc_1_accepted_at === null ? (
                    <Button
                      className="job_accept mx-2 status-btn btn-success"
                      onClick={() => handleAccept(task)}
                    >
                      Accept Job
                    </Button>
                  ) : userId === task?.tc_assignee_2 &&
                    task.tc_2_accepted_at === null ? (
                    <Button
                      className="job_accept mx-2 status-btn btn-success"
                      onClick={() => handleAccept(task)}
                    >
                      Accept Job
                    </Button>
                  ) : (
                    <Button
                      className="job_accept mx-2 status-btn"
                      onClick={() => handleShowModal(task)}
                    >
                      View Keyword
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center my-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        &nbsp;
        <Button
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>

      <TCFormModal
        task={task}
        show={showModal}
        handleClose={handleCloseModal}
        // taskId={selectedTaskId}
        keywordId={selectedKeywordId}
      />
    </div>
  );
}

export default JobAssignmentsList;
