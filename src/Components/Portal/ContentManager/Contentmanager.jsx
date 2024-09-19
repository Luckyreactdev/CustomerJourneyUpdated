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
import "./Contentmanager.css";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
function Contentmanager() {
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

  return (
    <>
      <HabotAppBar />

      <div className="portalstatusdiv">
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
                <th>Acknowledge Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </Container>
        <div className="paginationdiv">
          <div></div>
        </div>
      </div>
    </>
  );
}

export default Contentmanager;
