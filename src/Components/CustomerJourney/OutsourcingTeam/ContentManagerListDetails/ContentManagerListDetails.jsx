import React, { useState, useEffect } from "react";
import "./ContentManagerListDetails.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button, Modal } from "react-bootstrap";
import {
  baseURL,
  outsourcingJobs,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function ContentManagerListDetails() {
  const [task, setTask] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${outsourcingJobs}${id}/`, { headers })
      .then((response) => {
        console.log(response.data);
        setTask(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, [id]);

  const handleViewDocument = () => {
    setShowDocument(true);
  };

  const handleDownloadDocument = () => {
    const link = document.createElement("a");
    link.href = task.document;
    link.setAttribute("download", "document.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const campaignName =
    task?.track_campaign_info?.campaign_info?.name ||
    task?.track_campaign_info?.campaign_type ||
    "N/A";

  const keywordNames = task?.track_campaign_info?.extracted_keywords_info
    ? task.track_campaign_info.extracted_keywords_info.map(
        (keyword) => keyword.name
      )
    : ["N/A"];

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_table">
        <span className="sub_title_form">Content Manager List Deatils</span>

        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Sector</th>
              <th>Sub Sector</th>
              <th>Name of the Campaign</th>
              <th>Keyword List</th>
              <th>Content Type</th>
              <th>OS Job Assignee</th>
              {task?.document && <th>Actions</th>}
              <th>Assigned Date and Time</th>
              {/* <th>End Date and Time</th> */}
              <th>Accepted Date and Time</th>
              <th>Submitted Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {task ? (
              <tr>
                <td>
                  {
                    task?.track_campaign_info?.keyword_file_info
                      ?.sub_sector_info?.sector_info?.name
                  }
                </td>
                <td>
                  {
                    task?.track_campaign_info?.keyword_file_info
                      ?.sub_sector_info?.name
                  }
                </td>
                <td>{campaignName}</td>
                <td>
                  <ul>
                    {keywordNames.slice(0, 3).map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                  {keywordNames.length > 3 && (
                    <Link
                      onClick={handleShowModal}
                      style={{ cursor: "pointer" }}
                    >
                      more...
                    </Link>
                  )}
                </td>
                <td>{task.content_type || "N/A"}</td>
                <td>{task.operations_manager_info?.email || "N/A"}</td>
                {task.document && (
                  <td>
                    <div className="mt-3 mb-3 d-flex justify-content-center">
                      <Link onClick={handleDownloadDocument}>
                        Download Document
                      </Link>{" "}
                      &nbsp;
                      <Link onClick={handleViewDocument}>View Document</Link>
                    </div>
                  </td>
                )}
                <td>
                  {task.created_at
                    ? new Date(task.created_at).toLocaleString("en-GB", {
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
                <td>
                  {task.accepted_date
                    ? new Date(task.accepted_date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                      })
                    : "Pending"}
                </td>

                <td>
                  {task?.submitted_date
                    ? new Date(task?.submitted_date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                      })
                    : "Pending"}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No task details available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {showDocument && (
          <div className="document-viewer mt-4">
            <iframe
              src={task.document}
              width="100%"
              height="600px"
              title="Document Viewer"
            />
          </div>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Keyword List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {keywordNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default ContentManagerListDetails;
