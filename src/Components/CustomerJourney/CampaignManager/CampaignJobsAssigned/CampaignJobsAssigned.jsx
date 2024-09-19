import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import "./CampaignJobsAssigned.css";
import {
  baseURL,
  campaignTask,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

function CampaignJobsAssigned() {
  const [campJobs, setCampJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/?track_campaign=${id}`,
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setCampJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, [id]);

  const handleStatusChangeClick = (job, status) => {
    setSelectedJob(job);
    setNewStatus(status);
    setShowModal(true);
  };

  const confirmStatusChange = () => {
    if (selectedJob && newStatus) {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      axios
        .patch(
          `https://customer-journey-19042024.uc.r.appspot.com/dashboards/campaign-task/${selectedJob.id}/`,
          { status: newStatus },
          { headers }
        )
        .then((response) => {
          setCampJobs((prevJobs) => ({
            ...prevJobs,
            results: prevJobs?.results?.map((job) =>
              job?.id === selectedJob.id ? { ...job, status: newStatus } : job
            ),
          }));
          toast.success("Status updated successfully");
          setShowModal(false);
        })
        .catch((error) => {
          toast.error("Failed to update status");
        });
    }
  };

  const allJobsCompleted = campJobs?.results?.every(
    (job) => job.status === "COMPLETED"
  );

  const handleViewDocument = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      toast.error("Document not available");
    }
  };

  const hasUploadedContent = campJobs?.results?.some(
    (job) => job.uploaded_content?.file
  );
  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <span className="sub_title_form">Campaign Jobs Assignment</span>

        {campJobs?.results?.length > 0 ? (
          <table className="customers job_tab">
            <thead>
              <tr>
                <th>
                  <b>Sector Name</b>
                </th>
                <th>
                  <b>Sub Sector</b>
                </th>
                <th>
                  <b>Content Type</b>
                </th>
                <th>
                  <b>Note</b>
                </th>

                <th>
                  <b>Assign Date and Time</b>
                </th>
                <th>
                  <b>Accepted Date and Time</b>
                </th>
                <th>
                  <b>Ended Date and Time</b>
                </th>
                <th>
                  <b>TC Assignee 1 </b>
                </th>
                <th>
                  <b>TC Assignee 2 </b>
                </th>
                {/* <th>
                  <b>End Date and Time</b>
                </th> */}
                <th>
                  <b>Status</b>
                </th>
                {campJobs?.results?.some(
                  (job) =>
                    job.status === "COMPLETED" ||
                    job.status === "SENT_TO_MANAGER_FROM_TC"
                ) && (
                  <th>
                    <b>Document</b>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {campJobs?.results?.map((job) => (
                <tr key={job.id}>
                  <td>
                    {job.sub_sector_info
                      ? job.sub_sector_info.sector_info.name
                      : "N/A"}
                  </td>
                  <td>
                    {job.sub_sector_info ? job.sub_sector_info.name : "N/A"}
                  </td>
                  <td>{job.content_type || "N/A"}</td>
                  <td>{job.note || "N/A"}</td>

                  <td>
                    {job.created_at
                      ? new Date(job.created_at).toLocaleString("en-GB", {
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
                  <td>
                    {job.started_at
                      ? new Date(job.started_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "Not Assigned"}
                  </td>
                  <td>
                    {job.ended_at
                      ? new Date(job.ended_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "Not Completed"}
                  </td>
                  {/* <td>{new Date(job.updated_at).toLocaleString()}</td> */}
                  <td>{job?.tc_assignee_1_info?.email}</td>
                  <td>{job?.tc_assignee_2_info?.email}</td>

                  <td
                    className={
                      job.status === "COMPLETED" ? "status-completed" : ""
                    }
                  >
                    {job.status}
                  </td>
                  {(job.status === "COMPLETED" ||
                    job.status === "SENT_TO_MANAGER_FROM_TC") &&
                    job.uploaded_content && (
                      <td>
                        <Button
                          variant="link"
                          onClick={() =>
                            handleViewDocument(job.uploaded_content.file)
                          }
                        >
                          View Document
                        </Button>
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-3">
            <p>No data available. Request content to view data.</p>
          </div>
        )}
        {!hasUploadedContent && (
          <div className="mt-3 mb-3 d-flex justify-content-center">
            <Link to={`/campaign-task-assignment/${id}`}>
              <Button>Request Content</Button>
            </Link>{" "}
            &nbsp;
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to change the status to{" "}
          {newStatus === "ONGOING" ? "In Progress" : "Completed"}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CampaignJobsAssigned;
