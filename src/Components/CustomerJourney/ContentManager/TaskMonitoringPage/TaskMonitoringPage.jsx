import React, { useState, useEffect } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button, Container, Form, FormControl, Row, Col } from "react-bootstrap";
import "./TaskMonitoringPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { campaignTask, baseURL, accountProfile } from "../../../../helpers/endpoints/api_endpoints";

function TaskMonitoringPage() {
  const [tasks, setTasks] = useState([]);
  const [userList, setUserList] = useState(null);  

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${accountProfile}`, { headers });
        setUserList(response.data);
        console.log("User List:", response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserList();
  }, []);

  useEffect(() => {
    if (!userList || !userList.user || !userList.user.id) return;

    const userId = userList.user.id;
    console.log("User ID:", userId);

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/?assignee=${userId}`, { headers })
      .then((response) => {
        console.log("API Response:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  }, [userList]);

  return (
    <div className="screen-cont">
      <HabotAppBar />

      <div className="job-cont cmd_cont">
        <span>Content Manager Task Monitoring</span>
        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>TC Assignee 1</th>
              <th>TC Assignee 2</th>
              <th>Status</th>
              <th>Description</th>
              <th>Compliance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.results?.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.tc_assignee_1_info.email}</td>
                <td>{task.tc_assignee_2_info.email}</td>
                <td>{task.status}</td>
                <td>{task.description}</td>
                <td>{task.compliance_checks}</td>
                <td>
                  <div className="Track_MD_btn">
                    <Link to={`/content-creation-form/${task.track_campaign}`}>
                      <Button variant="outline-primary" className="close_form mx-2">
                        Initiate
                      </Button>
                    </Link>
                    <Button variant="outline-primary" className="close_form mx-2">
                      Outsource the task
                    </Button>
                  </div>
                </td>
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

export default TaskMonitoringPage;
