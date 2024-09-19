import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import {
  baseURL,
  accountProfile,
  portalNotifications,
  portaltask,
  tasksubmission,
} from "../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import "./PortalStatus.css";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
function PortalStatus() {
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [modal, setmodal] = useState(false);
  const [portalid, setportalid] = useState(null);
  const [screenshotvalue, setScreenshotvalue] = useState(null);
  const [buttonstate, setbuttonstate] = useState("");
  const [loader, setloader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPageUrls, setPrevPageUrls] = useState({});
  const [nextPageUrls, setNextPageUrls] = useState({});
  const [tasksubmission, setTaskSubmissions] = useState([]);

  const location = useLocation();
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const fetchData = useCallback(
    async (nextUrls = null) => {
      try {
        setloader(true);
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };

        let notificationsUrl = `${baseURL}${portaltask}?assignee=${savedUserInfo.user_profile.user.id}`;
        let taskSubmissionsUrl = `${baseURL}/seo/task-submissions/?user=${savedUserInfo.user_profile.user.id}`;

        if (nextUrls) {
          notificationsUrl = nextUrls.portalTask || notificationsUrl;
          // Keep the original task submissions URL to fetch all submissions
        } else {
          notificationsUrl += `&page=${currentPage}`;
          // For task submissions, we'll fetch all pages
        }

        const notificationsResponse = await axios.get(notificationsUrl, {
          headers,
        });

        // Fetch all task submissions
        let allTaskSubmissions = [];
        let nextTaskSubmissionsUrl = taskSubmissionsUrl;

        while (nextTaskSubmissionsUrl) {
          const taskSubmissionsResponse = await axios.get(
            nextTaskSubmissionsUrl,
            { headers }
          );
          allTaskSubmissions = [
            ...allTaskSubmissions,
            ...taskSubmissionsResponse.data.results,
          ];
          nextTaskSubmissionsUrl = taskSubmissionsResponse.data.next;
        }

        setloader(false);

        const newNotifications = notificationsResponse.data.results;

        setNotifications(newNotifications);
        setTaskSubmissions(allTaskSubmissions);

        setPrevPageUrls({
          portalTask: notificationsResponse?.data?.previous,
          taskSubmissions: null, // We're fetching all task submissions, so no need for pagination
        });

        setNextPageUrls({
          portalTask: notificationsResponse?.data?.next,
          taskSubmissions: null, // We're fetching all task submissions, so no need for pagination
        });

        // Update notifications with task submission data
        const updatedNotifications = newNotifications.map((notification) => {
          const submissionsForTask = allTaskSubmissions.filter(
            (submission) => submission.portal_task === notification.id
          );

          const submissionWithScreenshot = submissionsForTask.find(
            (submission) => submission.screenshot
          );

          if (submissionWithScreenshot) {
            return {
              ...notification,
              buttonstate: submissionWithScreenshot.status,
              screenshot: submissionWithScreenshot.screenshot,
              feedback: submissionWithScreenshot.feedback || "",
            };
          }

          return notification;
        });

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error fetching data:", error);
        setloader(false);
      }
    },
    [currentPage, savedUserInfo.user_profile.user.id, baseURL, portaltask]
  );

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      await fetchData();
    };

    fetchAndUpdateData();
  }, [fetchData]);

  const modalopen = () => {
    setmodal((prev) => !prev);
  };

  const screenshotUpload = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${accessToken}`,
        },
      };
      const ssbody = {
        portal_task: portalid,
        screenshot: screenshotvalue,
      };
      const response = await axios.post(
        `${baseURL}/seo/task-submissions/`,
        ssbody,
        config
      );
      // Complete at date and time patch
      const completedDateTime = new Date();

      const datepatchbody = {
        completed_at: completedDateTime,
      };
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      await axios.patch(`${baseURL}${portaltask}${portalid}/`, datepatchbody, {
        headers,
      });

      await fetchData();
      setmodal(false);
      toast.success("Screenshot Submitted");
    } catch (error) {
      console.log(error);
      toast.error("Screenshot Submit Failed");
    }
    console.log(screenshotvalue);
  };

  const handleacknowledge = async (acknowledgeid) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const acknowledgebody = {
        is_acknowledged: true,
      };
      const response = await axios.patch(
        `${baseURL}${portaltask}${acknowledgeid}/`,
        acknowledgebody,
        {
          headers,
        }
      );

      await fetchData();

      console.log(response);
      toast.success("Acknowledged");
    } catch (error) {
      console.error("Acknowledge Failed:", error);
    }
  };

  const handleNextClick = () => {
    fetchData(nextPageUrls);
  };

  const handlePreviousClick = () => {
    fetchData(prevPageUrls);
  };

  return (
    <>
      <HabotAppBar />
      <Modal show={modal}>
        <Modal.Header closeButton={modalopen}>
          <Modal.Title>Upload Screenshot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="feedback">
              <Form.Label>Upload Screenshot</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setScreenshotvalue(e.target.files[0])}
                placeholder="Enter feedback"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalopen}>
            Close
          </Button>
          <Button variant="primary" onClick={screenshotUpload}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="portalstatusdiv">
        {loader && <div class="loader"></div>}
        <Container>
          <h1>Task managment</h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Portal Name</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Task Created</th>
                <th>Completed at</th>
                <th>Document</th>
                <th>Feedback</th>
                <th>Acknowledge Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>{notification.portal.name}</td>
                    <td>{notification.task.name}</td>
                    <td>{notification.task.description}</td>
                    <td>
                      {notification.buttonstate
                        ? notification.buttonstate
                        : notification.is_acknowledged
                        ? "Ongoing"
                        : null}
                    </td>
                    <td>
                      <p>
                        {new Date(
                          notification?.task?.created_at
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        {new Date(
                          notification?.task?.created_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td>
                      {notification.completed_at ? (
                        <>
                          <p>
                            {new Date(
                              notification.completed_at
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            {new Date(
                              notification.completed_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <a
                        href={notification.screenshot}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td>
                      {notification.feedback ? notification.feedback : "-"}
                    </td>
                    <td>
                      {notification.is_acknowledged && (
                        <>
                          <p>
                            {new Date(
                              notification?.acknowledged_at
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            {new Date(
                              notification?.acknowledged_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </>
                      )}
                    </td>
                    <td>
                      {notification.buttonstate ? (
                        <Button variant="outline-primary" disabled>
                          {notification.buttonstate === "APPROVED"
                            ? "Completed"
                            : notification.buttonstate === "PENDING"
                            ? "Uploaded"
                            : "REJECTED"}
                        </Button>
                      ) : notification.is_acknowledged ? (
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            modalopen();
                            setportalid(notification.id);
                            console.log(notification.id);
                          }}
                        >
                          Upload Screenshot
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={() => handleacknowledge(notification.id)}
                        >
                          Accept
                        </Button>
                      )}

                      {/* {notification.is_acknowledged ? 
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            modalopen();
                            setportalid(notification.id);
                            console.log(notification.id);
                          }}
                        >
                          Upload Screenshot
                        </Button>
                       : 
                         buttonstate=="Verification Pending" ? <Button
                         variant="outline-primary"
                         disabled
                       >
                         Verification Pending
                       </Button>
                       : <Button
                       variant="outline-primary"
                       onClick={() => handleacknowledge(notification.id)}
                     >
                       Accept
                     </Button>

} */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No Task available</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>
        <div className="paginationdiv">
          <div></div>
          <Button
            variant="outline-primary"
            onClick={handlePreviousClick}
            disabled={!prevPageUrls.portalTask && !prevPageUrls.taskSubmissions}
          >
            Previous
          </Button>

          <Button
            variant="outline-primary"
            onClick={handleNextClick}
            disabled={!nextPageUrls.portalTask && !nextPageUrls.taskSubmissions}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default PortalStatus;
