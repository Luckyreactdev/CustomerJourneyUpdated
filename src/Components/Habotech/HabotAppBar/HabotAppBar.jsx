import React, { useCallback, useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import "./Appbar.css";
import "./ProfileDropdown.css";
import "../../Habotech/Habotech.css";
import HabotProfileDrop from "../../CustomerJourney/HabotProfile/HabotProfileDrop";
import axios from "axios";
import {
  baseURL,
  notification,
  accountProfile,
  portalNotifications,
} from "../../../helpers/endpoints/api_endpoints";
import { Dropdown } from "react-bootstrap";
import { useIsActivityexecutor } from "../../../Hooks/Activityexecutor";
import {  IsSeomanager } from "../../../Hooks/Contentmanager";
import { useTrackmanager } from "../../../Hooks/SeoManagercheck";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <i className="fa fa-angle-down iconAngleDown" aria-hidden="true"></i>
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Find Service Tags..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter((child) =>
            child.props.children.toLowerCase().includes(value.toLowerCase())
          )}
        </ul>
      </div>
    );
  }
);

const HabotAppBar = (props) => {
  const [notifications, setNotifications] = useState([]);
  const [userinfo, setUserInfo] = useState(null);
  const [vendorInfo, setVendorInfo] = useState(null);
  const [serviceTag, setServiceTag] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);

  // instance
  const trackmanager = useTrackmanager();
  const activityexecutor = useIsActivityexecutor();
  const manager = IsSeomanager();

  const handleScroll = () => {
    setScrollPosition(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { isVendor, isClient } = useSelector((state) => state.account);
  const accessToken = localStorage.getItem("accessToken");

  const handleItemClick = (dataId) => {
    const url = `/requirements/?tags=${dataId}`;
    window.location.href = url;
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const fetchNotifications = async () => {
      try {
        const [notificationsResponse, portalNotificationsResponse] =
          await Promise.all([
            axios.get(`${baseURL}${notification}`, { headers }),
            axios.get(`${baseURL}${portalNotifications}`, { headers }),
          ]);

        const notificationsCount = notificationsResponse.data.count;
        const unreadPortalNotifications =
          portalNotificationsResponse.data.results.filter(
            (notification) => !notification.is_read
          );
        const portalNotificationsCount = unreadPortalNotifications.length;
        const totalCount = notificationsCount
          ? notificationsCount + portalNotificationsCount
          : 0 + portalNotificationsCount;

        setNotifications({ count: totalCount });
        console.log(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications({ count: 0 });
      }
    };

    fetchNotifications();
  }, []);

  const roles = savedUserInfo?.user_profile?.user?.roles || [];
  const hasOutsourceeManagerRole = roles.some(
    (role) => role?.name === "OUTSOURCEE_MANAGER"
  );
  const hasOtherRoles = roles.some(
    (role) => role?.name !== "OUTSOURCEE_MANAGER"
  );
  const shouldShowDropdown = hasOtherRoles || !hasOutsourceeManagerRole;

  return (
    <div>
      <span>
        <Link to="/customer-journey">
          <img
            className="habotech-appLogo"
            src="https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/updated%20trans-Habot-logo-png.png"
            height="25"
            alt="Logo-Habot"
          />
        </Link>
      </span>
      <div
        className="habotech-appbar-container"
        style={{
          top: scrollPosition > 75 ? "0" : "0",
        }}
      >
        <Navbar collapseOnSelect expand="lg" className="desktopApp">
          <Container className="appContain">
            <Navbar.Brand>
              <NavLink to="/signin" className="signin-link mobile-login">
                Login
              </NavLink>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto nav-items tablet-items"></Nav>
              <Nav className=" nav-items">
                {accessToken && !activityexecutor ? (
                  <>
                    {shouldShowDropdown && (
                      <>
                        <Dropdown>
                          <Dropdown.Toggle
                            className="appbar-item"
                            variant="link"
                            id="dropdown-track-manager"
                          >
                            Admin
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {roles.find(
                              (role) => role?.name === "TRACK_MANAGER"
                            ) && (
                              <Dropdown.Item>
                                <NavLink
                                  to="/add-sector"
                                  className="notification-link"
                                >
                                  Add Sector
                                </NavLink>
                              </Dropdown.Item>
                            )}
                            {roles.find(
                              (role) => role?.name === "TRACK_MANAGER"
                            ) && (
                              <Dropdown.Item>
                                <NavLink
                                  to="/sector-selection"
                                  className="notification-link"
                                >
                                  Sector Selection
                                </NavLink>
                              </Dropdown.Item>
                            )}
                            {roles.find(
                              (role) => role?.name === "TRACK_MANAGER"
                            ) && (
                              <Dropdown.Item>
                                <NavLink
                                  to="/track-keyword-job-assignment"
                                  className="notification-link"
                                >
                                  Keyword-Job Listing
                                </NavLink>
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item>
                              <NavLink
                                to="/campaign-keyword-assignment"
                                className="notification-link"
                              >
                                Campaign Initiation and Listing
                              </NavLink>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown>
                          <Dropdown.Toggle
                            className="appbar-item"
                            variant="link"
                            id="dropdown-campaign-manager"
                          >
                            Campaign
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <NavLink
                                to="/campaign-list"
                                className="notification-link"
                              >
                                Campaign List
                              </NavLink>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <NavLink
                                to="/campaign-manager-list"
                                className="notification-link"
                              >
                                Campaign Jobs Assigned
                              </NavLink>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown>
                          <Dropdown.Toggle
                            className="appbar-item"
                            variant="link"
                            id="dropdown-content-manager"
                          >
                            Content
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <NavLink
                                to="/content-job-assignment"
                                className="notification-link"
                              >
                                Content Jobs Listing
                              </NavLink>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <NavLink
                                to="/content-manager-job-list"
                                className="notification-link"
                              >
                                Outsourcees Submitted Jobs Listing
                              </NavLink>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown>
                          <Dropdown.Toggle
                            className="appbar-item"
                            variant="link"
                            id="dropdown-tc"
                          >
                            TC
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <NavLink
                                to="/tc-job-assignment"
                                className="notification-link"
                              >
                                Job Assignment
                              </NavLink>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <NavLink
                                to="/tc-job-list"
                                className="notification-link"
                              >
                                TC Job List
                              </NavLink>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <NavLink
                          to="/track-manager-dashboard"
                          className="nav-item-style"
                        >
                          Reports
                        </NavLink>
                      </>
                    )}
                    <Dropdown>
                      <Dropdown.Toggle
                        className="appbar-item"
                        variant="link"
                        id="dropdown-tc"
                      >
                        Outsourcing
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <NavLink
                            to="/list-campaign-manager"
                            className="notification-link"
                          >
                            Outsourcee Task Assignment
                          </NavLink>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    {trackmanager ? (
                      <NavLink to="/Portal-setup" className="notification-link">
                        Portal
                      </NavLink>
                    ) : null}

                    {}
                    {manager && (
                      <NavLink to="/TaskPortal" className="notification-link">
                        Task
                      </NavLink>
                    )}
                    <NavLink
                      to="/notification"
                      className="notification-link navLinkMob navLinkMobicon"
                      data-notification-count={
                        notifications.count > 0 ? notifications.count : "0"
                      }
                    >
                      <i className="fa-solid fa-bell notification_icon"></i>
                    </NavLink>
                    <HabotProfileDrop />
                  </>
                ) : activityexecutor && accessToken ? (
                  <>
                    <NavLink to="/Portal-status" className="notification-link">
                      Task
                    </NavLink>
                    <NavLink
                      to="/notification"
                      className="notification-link navLinkMob navLinkMobicon"
                      data-notification-count={
                        notifications.count > 0 ? notifications.count : "0"
                      }
                    >
                      <i className="fa-solid fa-bell notification_icon"></i>
                    </NavLink>
                    <HabotProfileDrop />
                  </>
                ) : null}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="mobileApp">
          <div className="nav">
            <input type="checkbox" id="nav-check" />
            <div className="nav-header">
              <div className="nav-title">
                <Link to="/">
                  <img
                    className="habotech-appLogo"
                    src="https://storage.googleapis.com/varal-habot-vault-marketplace-10032022/images/updated%20trans-Habot-logo-png.png"
                    height="25"
                    alt="Logo-Habot"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabotAppBar;
