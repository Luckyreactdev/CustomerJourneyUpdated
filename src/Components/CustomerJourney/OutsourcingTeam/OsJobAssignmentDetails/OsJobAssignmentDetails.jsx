import React, { useState, useEffect } from "react";
import "./OsJobAssignmentDetails.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button, Container, Form, Modal } from "react-bootstrap";
import {
  baseURL,
  outsourcingJobs,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function OsJobAssignmentDetails() {
  const [outsourceList, setOutsourceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalKeywordList, setModalKeywordList] = useState([]);
  const { id, ids } = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/outsourcee-tasks/${id}/`,
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setOutsourceList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, []);

  const handleDocumentUpload = (event, taskId) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    console.log(id);
    axios
      .patch(`${baseURL}${outsourcingJobs}${id}/`, formData, { headers })
      .then((response) => {
        toast.success("Document uploaded successfully");
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error uploading document:", error);
        toast.error("Failed to upload document");
      });
  };

  const handleShowModal = (keywords) => {
    setModalKeywordList(keywords);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_table">
        <table className="customers job_tab mt-4">
          <thead>
            <tr>
              <th>Sector</th>
              <th>Sub Sector</th>
              <th>Name of the Campaign</th>
              <th>Keyword List</th>
              <th>Content Type</th>
              <th>View Document</th>
              <th>Add Document</th>
              <th>Job Assigned Date and Time</th>
              {/* <th>End Date and Time</th> */}
            </tr>
          </thead>
          <tbody>
            {outsourceList?.results?.map((task) => {
              return (
                <tr key={task?.id}>
                  <td>
                    {/* {
                      task?.track_campaign_info?.keyword_file_info
                        ?.sub_sector_info?.sector_info?.name
                    } */}
                  </td>
                  <td>
                    {/* {
                      task?.track_campaign_info?.keyword_file_info
                        ?.sub_sector_info?.name
                    } */}
                  </td>
                  {/* <td>{campaignName}</td> */}
                  <td>
                    {/* <ul>
                      {keywordList?.slice(0, 3).map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                      {keywordList.length > 3 && (
                        <li>
                          <Button
                            variant="link"
                            onClick={() => handleShowModal(keywordList)}
                          >
                            more...
                          </Button>
                        </li>
                      )}
                    </ul> */}
                  </td>
                  <td>{task?.content_type || "N/A"}</td>
                  <td>
                    {task?.document ? (
                      <Link
                        onClick={() => window.open(task?.document, "_blank")}
                      >
                        View Document
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="mt-3 mb-3 d-flex justify-content-center">
                    <Form.Control
                      type="file"
                      className="form-control"
                      onChange={(event) => handleDocumentUpload(event, task.id)}
                    />
                    <Button>Submit</Button>
                  </td>
                  <td>
                    {task.assigned_date
                      ? new Date(task.assigned_date).toLocaleString("en-GB", {
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
                  {/* <td>
                    {task.updated_at
                      ? new Date(task.updated_at).toLocaleString()
                      : "N/A"}
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>All Keywords</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {modalKeywordList.map((keyword, index) => (
                <li key={index}>{keyword}</li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default OsJobAssignmentDetails;
