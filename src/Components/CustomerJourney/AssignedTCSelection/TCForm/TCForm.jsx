import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Modal,
  Pagination,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "./TCForm.css";
import {
  accountProfile,
  baseURL,
  keywordFileFeedback,
  keywordSelectionForm,
} from "../../../../helpers/endpoints/api_endpoints";
import { useSelector } from "react-redux";

function TCForm({ keywordId, task }) {
  const { id } = useParams();
  // const keywordId = id;
  const [tcFormData, setTcFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedKeywordId, setSelectedKeywordId] = useState(null);
  const [approvedKeywords, setApprovedKeywords] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentUser, setCurrentUserInfo] = useState(null);
  const [approveData, setApproveData] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [minSearchVolume, setMinSearchVolume] = useState("");
  const [maxSearchVolume, setMaxSearchVolume] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("");
  const [ordering, setOrdering] = useState(
    "-average_monthly_searches,competition"
  );

  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);
  console.log(approvedKeywords);
  console.log(task);
  useEffect(() => {
    if (keywordId) {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      axios
        .get(
          `https://customer-journey-19042024.uc.r.appspot.com/dashboards/keyword-file-feedback/?keyword_file=${keywordId}`,
          { headers }
        )
        .then((response) => {
          setApprovedKeywords(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching approved keywords:", error);
          toast.error("Failed to fetch approved keywords");
        });

      // Build query parameters
      let queryParams = `?keyword_file_id=${keywordId}&page=${currentPage}&ordering=${ordering}`;
      if (nameFilter) {
        queryParams += `&name=${encodeURIComponent(nameFilter)}`;
      }
      if (minSearchVolume) {
        queryParams += `&average_monthly_searches_min=${encodeURIComponent(
          minSearchVolume
        )}`;
      }
      if (maxSearchVolume) {
        queryParams += `&average_monthly_searches_max=${encodeURIComponent(
          maxSearchVolume
        )}`;
      }
      if (competitionFilter) {
        queryParams += `&competition__in=${encodeURIComponent(
          competitionFilter
        )}`;
      }

      axios
        .get(
          `https://customer-journey-19042024.uc.r.appspot.com/dashboards/extracted-keywords/${queryParams}`,
          { headers }
        )
        .then((response) => {
          setTcFormData(response.data.results);
          console.log(response.data);
          setTotalPages(response.data.total_pages);
          console.log(totalPages);
          setNextPage(response.data.next);
          setPreviousPage(response.data.previous);

          const totalItems = response.data.count;
          const itemsPerPage = 50;
          const pages = Math.ceil(totalItems / itemsPerPage);

          setTotalPages(pages);
        })
        .catch((error) => {
          console.error("Error fetching task details:", error);
          toast.error("Failed to fetch task details");
        });
    }
  }, [
    keywordId,
    currentPage,
    nameFilter,
    minSearchVolume,
    maxSearchVolume,
    competitionFilter,
    ordering,
  ]);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${accountProfile}`, {
        headers,
      });
      setCurrentUserInfo(response.data);

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tcFormData && tcFormData.length > 0) {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };

        const uniqueKeywordFile = tcFormData[0].keyword_file;
        console.log(uniqueKeywordFile);

        axios
          .get(`${baseURL}${keywordSelectionForm}${uniqueKeywordFile}/`, {
            headers,
          })
          .then((response) => {
            console.log(response.data);
            setApproveData(response.data);
          })
          .catch((error) => {
            console.error("Error fetching task details:", error);
          });
      } else {
        console.error("Access token is missing");
      }
    }
  }, [approvedKeywords.results, approvedKeywords, tcFormData]);

  const handleApprove = (keywordId) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .post(
        `${baseURL}${keywordFileFeedback}`,
        {
          status: "APPROVED",
          keyword_file: keywordId,
          created_by: currentUser?.user?.id,
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Keyword approved successfully");
        const updatedApprovedKeywords = {
          ...approvedKeywords,
          [keywordId]: "APPROVED",
        };
        setApprovedKeywords(updatedApprovedKeywords);
      })
      .catch((error) => {
        console.error("Error approving keyword:", error);
        toast.error("Failed to approve keyword");
      });
  };

  const handleReject = (keywordId) => {
    console.log(keywordId);
    setSelectedKeywordId(keywordId);
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    console.log(selectedKeywordId);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .post(
        `${baseURL}${keywordFileFeedback}`,
        {
          status: "REJECTED",
          keyword_file: selectedKeywordId,
          feedback: feedback,
        },
        { headers }
      )
      .then((response) => {
        console.log(response);
        toast.success("Feedback successfully sent");
        const updatedApprovedKeywords = {
          ...approvedKeywords,
          [selectedKeywordId]: "REJECTED",
        };
        setApprovedKeywords(updatedApprovedKeywords);
        setShowModal(false);
        setFeedback("");
        setSelectedKeywordId(null);
      })
      .catch((error) => {
        console.log("Error rejecting keyword:", error);
        toast.error("Failed to reject keyword");
      });
  };

  const handleOrderingChange = (event) => {
    setOrdering(event.target.value);
    setCurrentPage(1); // Reset to first page on ordering change
  };

  const userId = savedUserInfo?.user_profile?.user?.id;
  const isTcAssignee1 = userId === task?.tc_assignee_1_info?.id;
  const isTcAssignee2 = userId === task?.tc_assignee_2_info?.id;

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div className="screen-cont">
      {/* <HabotAppBar /> */}
      <div className="job-cont Track_MD">
        <Row>
          <Col>
            <Form.Group controlId="nameFilter">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group controlId="competitionFilter">
              <Form.Label>Competition</Form.Label>
              <Form.Control
                type="text"
                placeholder="Filter by competition (e.g., Low,Medium)"
                value={competitionFilter}
                onChange={(e) => setCompetitionFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <Form.Group controlId="minSearchVolume">
              <Form.Label>Average Monthly Searches (Min)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Min searches"
                value={minSearchVolume}
                onChange={(e) => setMinSearchVolume(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group controlId="maxSearchVolume">
              <Form.Label>Average Monthly Searches (Max)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Max searches"
                value={maxSearchVolume}
                onChange={(e) => setMaxSearchVolume(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="ordering">
              <Form.Label>Ordering</Form.Label>
              <Form.Control
                as="select"
                value={ordering}
                onChange={handleOrderingChange}
              >
                {/* <option value="-average_monthly_searches,competition">Default</option> */}
                <option value="">Select Order</option>
                <option value="average_monthly_searches">
                  Search Volume (Asc)
                </option>
                <option value="-average_monthly_searches">
                  Search Volume (Desc)
                </option>
                <option value="competition">Competition (Asc)</option>
                <option value="-competition">Competition (Desc)</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <div className="modal-body-container mt-3">
          <table className="customers job_tab mt-3">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Sector</th>
                <th>Sub-Sector</th>
                <th>Keywords</th>
                <th>Search Volume</th>
                <th>Competency</th>
              </tr>
            </thead>
            <tbody>
              {tcFormData && tcFormData.length > 0 ? (
                tcFormData.map((keyword, index) => (
                  <tr key={keyword.id}>
                    <td>{index + 1 + (currentPage - 1) * 10}</td>
                    <td>
                      {keyword?.sub_sector_info?.sector_info?.name || "N/A"}
                    </td>
                    <td>{keyword?.sub_sector_info?.name || "N/A"}</td>
                    <td>{keyword.name}</td>
                    <td>{keyword.average_monthly_searches}</td>
                    <td>{keyword.competition}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-container-form mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!previousPage}
            />
            {paginationItems}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!nextPage}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>

        <div className="ap_rj_btn">
          {approveData?.has_submitted_tc_feedback === false && (
            <>
              {(isTcAssignee1 || isTcAssignee2) && (
                <>
                  <Button
                    className="job_accept mx-2 btn-success"
                    onClick={() => handleApprove(keywordId)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="job_table_close mx-2"
                    onClick={() => handleReject(keywordId)}
                  >
                    Reject
                  </Button>
                </>
              )}
            </>
          )}
          {approveData?.has_submitted_tc_feedback === true && (
            <Button className="job_accept mx-2" disabled>
              Approved
            </Button>
          )}

          {/* {approveData?.has_submitted_tc_feedback === false && (
            <Button
              className="job_accept mx-2"
              onClick={() => handleApprove(keywordId)}
            >
              Approve
            </Button>
          )}
          {approveData?.has_submitted_tc_feedback === true && (
            <Button className="job_accept mx-2" disabled>
              Approved
            </Button>
          )}
          {approveData?.has_submitted_tc_feedback === false && (
            <Button
              className="job_table_close mx-2"
              onClick={() => handleReject(keywordId)}
            >
              Reject
            </Button>
          )} */}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Keyword Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="feedback">
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TCForm;
