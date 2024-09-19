import React, { useState, useEffect } from "react";
import "./KeywordJobAssignment.css";
import HabotAppBar from "../../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import { baseURL, extractedKeywords, taskDashboard,keywordSelectionForm } from "../../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";

function KeywordJobAssignment() {
  const [tasksDash, setTasksDash] = useState([]);

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
        // setTasksDash(response.data);
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
                  <b>Assignee name</b>
                </td>
                <td>
                  <b>Date</b>
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
              <tr>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>data</td>

                <td>
                  <Button className="job_accept mx-2 status-btn">
                    View Document
                  </Button>
                </td>
              </tr>
  
              <tr>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>data</td>

                <td>
                  <Button className="job_accept mx-2 status-btn">
                    View Document
                  </Button>
                </td>
              </tr>
              <tr>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>data</td>
                <td>
                  <Button className="job_accept mx-2 status-btn">
                    View Document
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="footer-ad">
          <AdminFooter />
        </div>
      </div>
    )
}

export default KeywordJobAssignment
