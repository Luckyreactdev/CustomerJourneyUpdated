import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import {
  baseURL,
  accountProfile,
  portalNotifications,
  tasksubmission,
  csvfileupload,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import "./KeywordAssessment.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { useLocation, useParams } from "react-router-dom";
import { useTrackmanager } from "../../../../Hooks/SeoManagercheck";
function KeywordAssessment() {
  const [userId, setUserId] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [modal, setmodal] = useState(false);
  const [portalid, setportalid] = useState(null);
  const [screenshotvalue, setScreenshotvalue] = useState(null);
  const [dataid, setdataid] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [loader, setloader] = useState(false);

  const location = useLocation();

  const { id } = useParams();
  const trackmanager = useTrackmanager();

  const fetchKeywords = async (
    url = `${baseURL}${csvfileupload}?page=${currentPage}`
  ) => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(url, { headers });
      setloader(false);
      setKeywords(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
      console.log("keywordfilesdata", response);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setloader(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, [trackmanager]);

  const handleApprovalStatus = async (keywordId, status) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const patchBody = {
        status: status === "APPROVE" ? "APPROVED" : "REJECTED",
        is_acknowledge: status === "APPROVE",
        acknowledge_at: status === "APPROVE" ? new Date().toISOString() : null,
      };
      const response = await axios.patch(
        `${baseURL}${csvfileupload}${keywordId}/`,
        patchBody,
        { headers }
      );

      await fetchKeywords();
      toast.success(
        status === "APPROVE" ? "Approved successfully" : "Rejected Successfully"
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="portalstatusdiv">
        {loader && <div className="loader"></div>}
        <Container>
          <h1>Keyword Assessment</h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Sector Name</th>
                <th>Approver</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>File</th>
                <th>Acknowledge Date & Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {keywords.length > 0 ? (
                keywords.map((keyword) => (
                  <tr key={keyword.id}>
                    <td>{keyword?.sector || "-"}</td>
                    <td>{keyword.approved_by?.email || "N/A"}</td>
                    <td>{keyword.status}</td>
                    <td>
                      <p>{new Date(keyword.created_at).toLocaleDateString()}</p>
                      <p>
                        {new Date(keyword.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td>
                      {keyword.file ? (
                        <a
                          href={keyword.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View File
                        </a>
                      ) : (
                        "No file"
                      )}
                    </td>
                    <td></td>
                    <td className="actionbuttons">
                      <div className="actionbutton_keywordsbutton">
                        {keyword.status === "APPROVED" ? (
                          <Button variant="outline-primary" disabled>
                            APPROVED
                          </Button>
                        ) : keyword.status === "PENDING" ? (
                          <>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                handleApprovalStatus(keyword.id, "APPROVE")
                              }
                            >
                              APPROVE
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={() =>
                                handleApprovalStatus(keyword.id, "REJECTED")
                              }
                            >
                              REJECT
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
                  <td colSpan="5">No Keywords available</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="paginationdiv">
            {prevPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => fetchKeywords(prevPageUrl)}
              >
                Previous
              </Button>
            )}
            {nextPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => fetchKeywords(nextPageUrl)}
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

export default KeywordAssessment;
