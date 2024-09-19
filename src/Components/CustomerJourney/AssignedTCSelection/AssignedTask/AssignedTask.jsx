import React, { useState, useEffect } from "react";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import {
  Button,
  Modal,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import {
  baseURL,
  assignedTask,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";

import "./AssignedTask.css";

function AssignedTask() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${assignedTask}`, { headers })
      .then((response) => {
        console.log(response.data);
        setTasks(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, []);
  return (
    <div>
      <HabotAppBar />
      <div>
        <Container>
          <div className="job-cont cmd_table">
            <table className="customers job_tab mt-4">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.description}</td>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default AssignedTask;
