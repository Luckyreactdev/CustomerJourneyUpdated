import React, { useState, useEffect } from "react";
import "./OsJobAssignmentList.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button, Form } from "react-bootstrap";
import {
  baseURL,
  outsourcingJobs,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

function OsJobAssignmentList() {
  const [outsourceList, setOutsourceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalKeywordList, setModalKeywordList] = useState([]);
  const [submittedDocuments, setSubmittedDocuments] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({}); 
  const [page, setPage] = useState(1);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const { id, ids } = useParams();

  useEffect(() => {
    fetchOutsourceList(page);
  }, [page]);

  const fetchOutsourceList = async (page) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/outsourcee-tasks/?track_campaign=${ids}&page=${page}`,
        { headers }
      );
      console.log(response.data);
      setOutsourceList(response.data);
      setNext(response.data.next);
      setPrevious(response.data.previous);

      const initialSubmittedDocs = {};
      response.data.results.forEach((task) => {
        initialSubmittedDocs[task.id] = !!task.document;
      });
      setSubmittedDocuments(initialSubmittedDocs);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to fetch task details");
    }
  };

  // Handle file selection
  const handleFileChange = (event, taskId) => {
    const file = event.target.files[0];
    setSelectedFiles((prevFiles) => ({ ...prevFiles, [taskId]: file }));
  };

  // Handle file upload on button click
  const handleDocumentUpload = (taskId) => {
    const file = selectedFiles[taskId];
    if (!file) return; 

    const formData = new FormData();
    formData.append("document", file);

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    setUploading((prevState) => ({ ...prevState, [taskId]: true }));

    axios
      .patch(`${baseURL}${outsourcingJobs}${id}/`, formData, { headers })
      .then((response) => {
        toast.success("Document uploaded successfully");
        console.log(response.data);
        setSubmittedDocuments((prev) => ({ ...prev, [taskId]: true }));

        setOutsourceList((prevList) => {
          if (prevList?.results) {
            const updatedResults = prevList.results.map((task) =>
              task.id === taskId
                ? { ...task, document: response.data.document }
                : task
            );

            return { ...prevList, results: updatedResults };
          }

          return prevList;
        });
        setSelectedFiles((prevFiles) => ({ ...prevFiles, [taskId]: null }));
      })
      .catch((error) => {
        console.error("Error uploading document:", error);
        toast.error("Failed to upload document");
      })
      .finally(() => {
        setUploading((prevState) => ({ ...prevState, [taskId]: false })); 
      });
  };

  const handleShowModal = (keywords) => {
    setModalKeywordList(keywords);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleNextPage = () => {
    if (next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previous) {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_table">
        <span className="sub_title_form">OS Job Assignment List</span>
        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Sector</th>
              <th>Sub Sector</th>
              <th> Campaign Type</th>
              <th>Content Type</th>
              <th>Created By</th>
              <th>Job Assigned Date</th>
              <th>Accepted Time and Date</th>
              <th>Submission Date and Time</th>
              <th>Document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {outsourceList?.results?.map((task) => {
              const campaignName =
                task?.track_campaign_info?.campaign_info?.name || "N/A";

              return (
                <tr key={task.id}>
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
                  <td>{task?.track_campaign_info?.campaign_type}</td>
                  <td>{task?.content_type}</td>
                  <td>{task?.created_by_info?.email}</td>
                  <td>
                    {" "}
                    {task.created_at
                      ? new Date(task.created_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, 
                        })
                      : "NA"}
                  </td>
                  <td>
                    {task.accepted_date
                      ? new Date(task.accepted_date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, 
                        })
                      : "Pending"}
                  </td>
                  <td>
                    {task.submitted_date
                      ? new Date(task.submitted_date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, 
                        })
                      : "Pending"}
                  </td>
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
                  <td>
                    {submittedDocuments[task.id] ? (
                      "Document Submitted"
                    ) : (
                      <>
                        <Form.Control
                          type="file"
                          className="form-control"
                          onChange={(event) =>
                            handleFileChange(event, task.id)
                          }
                        />
                        {uploading[task.id] ? (
                          <>
                          
                            Submitting...
                          </>
                        ) : (
                          <Button onClick={() => handleDocumentUpload(task.id)}>
                            Submit
                          </Button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center my-3">
        <Button onClick={handlePreviousPage} disabled={!previous}>
          Previous
        </Button>
        <span className="page-info">&nbsp;</span>
        <Button onClick={handleNextPage} disabled={!next}>
          Next
        </Button>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default OsJobAssignmentList;
