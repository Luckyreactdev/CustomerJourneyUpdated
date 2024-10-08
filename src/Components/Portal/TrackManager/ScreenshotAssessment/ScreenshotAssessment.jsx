import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import {
  baseURL,
  accountProfile,
  portalNotifications,
  tasksubmission,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import "./ScreenshotAssessment.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { useLocation, useParams } from "react-router-dom";
import { useTrackmanager } from "../../../../Hooks/TrackManager";
function ScreenshotAssessment() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [modal, setmodal] = useState(false);
  const [portalid, setportalid] = useState(null);
  const [screenshotvalue, setScreenshotvalue] = useState(null);
  const [dataid, setdataid] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [loader, setloader] = useState(false);

  const location = useLocation();

  const { id } = useParams();
  const trackmanager = useTrackmanager();

  const fetchNotifications = async () => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const params = {
        page: currentPage,
        page_size: 10,
      };
      const response = await axios.get(`${baseURL}${tasksubmission}`, {
        headers,
        params,
      });
      setloader(false);
      setNotifications(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
      console.log("submiited task", response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setloader(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, [trackmanager, currentPage]);

  //   const modalopen = () => {
  //     setmodal((prev) => !prev);
  //   };

  //   const screenshotUpload = async () => {
  //     try {
  //       const accessToken = localStorage.getItem("accessToken");
  //       const headers = {
  //         Authorization: `Token ${accessToken}`,
  //         "Content-Type": "multipart/form-data",
  //       };
  //       const ssbody = {
  //         user: userId,
  //         portal_task: portalid,
  //         screenshot: screenshotvalue,
  //       };
  //       const response = axios.post(`${baseURL}/seo/task-submissions/`, ssbody, {
  //         headers,
  //       });
  //       console.log(response);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     console.log(screenshotvalue);
  //   };

  const handleApprovalStatus = async (approveid, status, feedback) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const patchBody = {
        status: status === "APPROVE" ? "APPROVED" : "REJECTED",
        feedback: feedback || "",
      };
      const response = await axios.patch(
        `${baseURL}${tasksubmission}${approveid}/`,
        patchBody,
        {
          headers,
        }
      );
      toast.success(
        status === "APPROVE" ? "Approved successfully" : "Rejected Successfully"
      );

      await fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="portalstatusdiv">
        {loader && <div class="loader"></div>}
        <Container>
          <h1>Screenshot Assessment</h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Portal Task</th>
                <th>Approver</th>
                <th>Activity executor</th>
                <th>Submiited At</th>
                <th>View Screenshot</th>
                <th>Approval Status</th>
                <th>Feedback</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>{notification.portal_task}</td>
                    <td>{notification?.approved_by?.email}</td>
                    <td>{notification.user.profile_info.full_name}</td>
                    <td>
                      <p>
                        {new Date(
                          notification?.submitted_at
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        {new Date(
                          notification?.submitted_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td>
                      <a
                        href={notification.screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        view
                      </a>
                    </td>
                    <td>{notification.status}</td>
                    <td>
                      <div className="feedbackdiv">
                        <input
                          type="text"
                          className="inputfeedback"
                          value={
                            notification.feedback
                              ? notification.feedback
                              : feedback[notification.id]
                          }
                          disabled={notification.feedback}
                          style={{
                            backgroundColor:
                              notification.feedback && "lightgray",
                          }}
                          onChange={(e) =>
                            setFeedback({
                              ...feedback,
                              [notification.id]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </td>
                    <td className="actionbuttons">
                      <div className="actionbutton">
                        {notification.status === "APPROVED" ? (
                          <Button variant="outline-primary" disabled>
                            APPROVED
                          </Button>
                        ) : notification.status === "PENDING" ? (
                          <>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                handleApprovalStatus(
                                  notification.id,
                                  "APPROVE",
                                  feedback[notification.id]
                                )
                              }
                            >
                              APPROVE & SUBMIT
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                handleApprovalStatus(
                                  notification.id,
                                  "REJECTED",
                                  feedback[notification.id]
                                )
                              }
                            >
                              REJECT & SUBMIT
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline-primary" disabled>
                            REJECTED
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="emptyrow">
                  <td colSpan="8">No Assessment available</td>
        
                </tr>
              )}
            </tbody>
          </Table>
          <div className="paginationdiv">
            {prevPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
            )}
            {nextPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}

export default ScreenshotAssessment;
