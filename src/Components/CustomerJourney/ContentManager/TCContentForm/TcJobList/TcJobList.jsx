import React, { useState, useEffect } from "react";
import HabotAppBar from "../../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import {
  baseURL,
  campaignTask,
  accountProfile,
} from "../../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import "./TcJobList.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function TcJobList() {
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState(null);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);

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

  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        console.log(userList?.user?.id);
        const response = savedUserInfo?.user_profile?.user?.roles?.find(
          (role) => role?.name === "TRACK_MANAGER"
        )
          ? await axios.get(
              `https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/`,
              {
                headers,
              }
            )
          : await axios.get(
              `https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/?tc_assignee_id=${userList?.user?.id}`,
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
    fetchTaskList();

    fetchTaskList();
  }, [userList?.user?.id]);

  // console.log(task.id)
  const userId = savedUserInfo?.user_profile?.user?.id;

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

    if (isTcAssignee1) {
      // PATCH the task for tc_1_accepted_at
      axios
        .patch(
          `${baseURL}${campaignTask}${task?.id}/`,
          {
            tc_1_accepted_at: new Date().toISOString(),
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Job accepted");

          // Update the task in the taskList
          setTaskList((prevTasks) =>
            prevTasks.map((prevTask) =>
              prevTask.id === task.id
                ? { ...prevTask, tc_1_accepted_at: new Date().toISOString() }
                : prevTask
            )
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else if (isTcAssignee2) {
      // PATCH the task for tc_2_accepted_at
      axios
        .patch(
          `${baseURL}${campaignTask}${task?.id}/`,
          {
            tc_2_accepted_at: new Date().toISOString(),
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          toast.success("Job accepted");

          // Update the task in the taskList
          setTaskList((prevTasks) =>
            prevTasks.map((prevTask) =>
              prevTask.id === task.id
                ? { ...prevTask, tc_2_accepted_at: new Date().toISOString() }
                : prevTask
            )
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <div className="screen-cont">
        <HabotAppBar />
        <div className="mt-3 job-cont">
          <span className="sub_title_form">TC Job List</span>

          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <table className="customers job_tab">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Sector</th>
                  <th>Sub-Sector</th>
                  <th>Created Date and Time</th>
                  <th>Accepted Date & Time TC 1</th>
                  <th>Accepted Date & Time TC 2</th>
                  <th>End Date and Time</th>
                  <th>Notes from Campaign Manager</th>
                  <th>Content Assignee</th>
                  <th>TC Assignee 1</th>
                  <th>TC Assignee 2</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {taskList.length > 0 ? (
                  taskList.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>
                        {task.sub_sector_info?.sector_info?.name || "N/A"}
                      </td>
                      <td>{task.sub_sector_info?.name || "N/A"}</td>
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
                      {
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
                      }
                      {
                        <td>
                          {userId === task?.tc_assignee_2 &&
                          task?.tc_2_accepted_at
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
                      }
                      <td>
                        {task.ended_at
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
                      <td>{task.note || "N/A"}</td>
                      <td>{task?.content_manager_info?.email}</td>
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
                          <Link to={`/tc-content-form/${task.id}`}>
                            <Button>TC for Content</Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="footer-ad">
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}

export default TcJobList;
