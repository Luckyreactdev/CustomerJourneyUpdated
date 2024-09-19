// export default Notification;
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Notification.css";
import { useSelector } from "react-redux";
import {
  baseURL,
  notification,
  portalNotifications,
} from "../../../helpers/endpoints/api_endpoints";
import AdminFooter from "../../Footer/AdminFooter";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import CheckIcon from "@rsuite/icons/Check";
import { useSeomanager } from "../../../Hooks/SeoManagercheck";
import { useIsActivityexecutor } from "../../../Hooks/Activityexecutor";
import { toast } from "react-toastify";

function Notification() {
  const [notifications, setNotifications] = useState({ results: [] });
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const [notifyportal, setnotifyportal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [loader, setloader] = useState(false);

  const seomanager = useSeomanager();
  const executor = useIsActivityexecutor();
  // seo code
  const fetchNotifications = async (
    url = `${baseURL}${portalNotifications}?page=${currentPage}`
  ) => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const [portalNotificationsResponse] = await Promise.all([
        axios.get(url, { headers }),
        ,
      ]);
      setloader(false);
      setnotifyportal(portalNotificationsResponse.data.results);
      setNextPageUrl(portalNotificationsResponse.data.next);
      setPrevPageUrl(portalNotificationsResponse.data.previous);
      console.log(portalNotificationsResponse);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setnotifyportal([]);
    }
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${notification}`, { headers })
      .then((response) => {
        console.log(response.data);
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error :", error);
      });
    fetchNotifications();
  }, []);

  const notificationReadHandler = (id) => {
    console.log(id);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .patch(
        `${baseURL}${notification}${id}/`,
        {
          is_read: true,
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error :", error);
      });
  };

  const markAllAsRead = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
      };

      const promises = notifyportal.map(async (notification) => {
        if (!notification.is_read) {
          await axios.patch(
            `${baseURL}${portalNotifications}${notification.id}/`,
            { is_read: true },
            { headers }
          );
        }
      });

      await Promise.all(promises);
      toast.success("Done");
      await fetchNotifications();
    } catch (error) {
      toast.error("failed to mark");
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div className="screen-cont">
      <Helmet>
        <title>Customer Journey</title>
        <meta name="description" content="Customer Journey." />
      </Helmet>
      <HabotAppBar />

      <Container>
        <div className="notifications-container">
          <Row>
            <Col sm className="page-heading">
              <div className="notifcationandmark">
                <p>Notifications</p>
                <Button variant="outline-primary" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </div>
            </Col>
            {/* <Col sm className="filter-col">
              <Dropdown align="end">
                <Dropdown.Toggle id="dropdown-custom-components"></Dropdown.Toggle>
                <Dropdown.Menu className="filterMenuIcon">
                  <Dropdown.Item eventKey="1">
                    <b>All Notifications</b>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="2">Recent</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="3">Read</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col> */}
          </Row>
          {!executor && (
            <div className="notification-list">
              {loader && <div class="loader"></div>}
              {notifications?.results &&
                Array.isArray(notifications.results) &&
                notifications.results.length > 0 &&
                notifications.results.map((notification, index) => (
                  <Link
                    onClick={() => notificationReadHandler(notification?.id)}
                    key={index}
                    to={
                      (notification?.title ===
                        "New Task Assigned as TC assignee" &&
                        notification?.notification_type === "CAMPAIGN_TASK" &&
                        "/tc-job-list") ||
                      (notification?.title ===
                        "New Task Assigned as TC assignee" &&
                        "/tc-job-assignment") ||
                      (notification?.title === "New Task Assigned" &&
                        "/campaign-keyword-assignment") ||
                      (notification?.title === "Task Completed by Assignee" &&
                        "/campaign-keyword-assignment") ||
                      (notification?.title ===
                        "New Track Campaign Task Assigned" &&
                        "/content-job-assignment") ||
                      (notification?.title === "Content Approval Needed" &&
                        "/tc-job-list")
                    }
                  >
                    <div
                      className={`notify-list-item ${
                        notification?.is_read === false &&
                        "notify-list-item-hover"
                      }`}
                    >
                      <div className="bell-icon icon">
                        <img
                          className="ps-2"
                          src="https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/bell-icon.svg"
                          alt="Bell Icon-Habot"
                        />
                      </div>
                      <div className="notification-description fontFourteen">
                        <h5>{notification?.title}</h5>
                        <span>{notification?.body} </span>
                        <p className="time">
                          {new Date(notification?.created_at).toLocaleString(
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
                          )}
                        </p>
                      </div>
                      {notification?.is_read === false ? (
                        <div className="notification-read icon">
                          <i className="fa-solid fa-bell read-icon"></i>
                        </div>
                      ) : (
                        <div className="notification-read icon">
                          <i className="fa-solid fa-envelope-open read-icon"></i>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          )}

          {notifyportal.length > 0 ? (
            notifyportal.map((notification) => (
              <div className="notification-list">
                {loader && <div class="loader"></div>}
                <div
                  className={`notify-list-item ${
                    notification?.is_read === false && "notify-list-item-hover"
                  }`}
                >
                  <div className="bell-icon icon">
                    <img
                      className="ps-2"
                      src="https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/bell-icon.svg"
                      alt="Bell Icon-Habot"
                    />
                  </div>
                  <div className="notification-description fontFourteen">
                    <h5>{notification?.title}</h5>
                    <span>{notification?.message} </span>
                    <p className="time">
                      {new Date(notification?.created_at).toLocaleString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        }
                      )}
                    </p>
                  </div>
                  {notification?.is_read === false ? (
                    <div className="notification-read icon">
                      <i className="fa-solid fa-bell read-icon"></i>
                    </div>
                  ) : (
                    <div className="notification-read icon">
                      <i className="fa-solid fa-envelope-open read-icon"></i>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="nofounddiv">no notification available</div>
          )}

          <div className="paginationdiv">
            {prevPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => fetchNotifications(prevPageUrl)}
              >
                Previous
              </Button>
            )}
            {nextPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => fetchNotifications(nextPageUrl)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </Container>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default Notification;
