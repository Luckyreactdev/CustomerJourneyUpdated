import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskList.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import {
  baseURL,
  taskDashboard,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
function TaskList() {
  const [tasksDash, setTasksDash] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${taskDashboard}`, { headers })
      .then((response) => {
        console.log(response.data);
        setTasksDash(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, []);

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <table className="customers job_tab">
          <thead>
            <tr>
              <td>
                <b>Sector Name</b>
              </td>
              <td>
                <b>Sub Sector</b>
              </td>
              <td>
                <b>Assigned Date</b>
              </td>
              <td>
                <b>Date</b>
              </td>
              <td>
                <b>Status</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {tasksDash?.results?.map((task, index) => (
              <tr key={index}>
                <td>{task?.sub_sector_info?.sector_info?.name || "N/A"}</td>
                <td>{task?.sub_sector_info?.name || "N/A"}</td>
                <td>
                  {new Date(task.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                  })}
                </td>
                <td>
                  {new Date(task?.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                  }) || "N/A"}
                </td>
                <td>{task?.status || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default TaskList;
