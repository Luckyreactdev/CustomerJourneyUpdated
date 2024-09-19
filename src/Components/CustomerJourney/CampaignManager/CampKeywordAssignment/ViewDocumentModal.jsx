import React, { useEffect, useState } from "react";
import { Button, Modal, Row, Col, Form, Pagination } from "react-bootstrap";
import "./CampKeywordAssignment.css";
import axios from "axios";
import {
  baseURL,
  keywordSelectionForm,
  taskDashboard,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ViewDocumentModal = ({ show, onHide, task, onStatusUpdate }) => {
  const [keywordFileInfo, setKeywordFileInfo] = useState([]);
  const [status, setStatus] = useState(task?.status || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Initialize totalPages state
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [hasPassedTC, setHasPassedTC] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    average_monthly_searches_min: "",
    average_monthly_searches_max: "",
    competition__in: "",
  });
  const [ordering, setOrdering] = useState("");
  const savedUserInfo = useSelector((state) => state.account.savedUserData);

  const fetchKeywordFileInfo = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const queryParams = new URLSearchParams({
      keyword_file_id: task?.keyword_file_info?.id,
      page: currentPage,
      ordering: ordering,
      ...(filters.name && { name: filters.name }),
      ...(filters.average_monthly_searches_min && {
        average_monthly_searches_min: filters.average_monthly_searches_min,
      }),
      ...(filters.average_monthly_searches_max && {
        average_monthly_searches_max: filters.average_monthly_searches_max,
      }),
      ...(filters.competition__in && {
        competition__in: filters.competition__in,
      }),
    });

    axios
      .get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/extracted-keywords/?${queryParams.toString()}`,
        { headers }
      )
      .then((response) => {
        setKeywordFileInfo(response.data.results);
        setNextPage(response.data.next);
        setPreviousPage(response.data.previous);

        const totalItems = response.data.count;
        const itemsPerPage = 50;
        const pages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(pages);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });
  };

  useEffect(() => {
    fetchKeywordFileInfo();
  }, [task?.keyword_file_info?.id, currentPage, filters, ordering]);

  const handleRequestForTC = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    console.log("Keyword File Info ID:", task?.id);

    axios
      .patch(
        `${baseURL}${taskDashboard}${task?.id}/`,
        { status: "SENT_TO_TC" },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        setStatus("SENT_TO_TC");
        toast.success("Request for TC submitted successfully");
        onHide();
        onStatusUpdate();
      })
      .catch((error) => {
        console.error("Error submitting request for TC:", error);
        toast.error("Failed to submit request for TC");
      });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      axios
        .get(
          `${baseURL}${keywordSelectionForm}${task?.keyword_file_info?.id}/`,
          {
            headers,
          }
        )
        .then((response) => {
          console.log(response.data);
          setHasPassedTC(response.data.has_passed_tc);
        })
        .catch((error) => {
          console.error("Error fetching task details:", error);
        });
    } else {
      console.error("Access token is missing");
    }
  }, [task.keyword_file_info]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
  };

  const handleFilterReset = () => {
    setFilters({
      name: "",
      average_monthly_searches_min: "",
      average_monthly_searches_max: "",
      competition__in: "",
    });
    setOrdering("");
  };

  const renderPagination = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
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
      <Pagination>
        <Pagination.First
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!previousPage}
        />
        {items}
        <Pagination.Next
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!nextPage}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Keyword Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="filterName">
                <Form.Label>Keyword Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Keyword Name"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="filterCompetition">
                <Form.Label>Competition</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Low,Medium"
                  name="competition__in"
                  value={filters.competition__in}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="filterAvgMin">
                <Form.Label>Average Monthly Searches (Min)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Min Search Volume"
                  name="average_monthly_searches_min"
                  value={filters.average_monthly_searches_min}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="filterAvgMax">
                <Form.Label>Average Monthly Searches (Max)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Max Search Volume"
                  name="average_monthly_searches_max"
                  value={filters.average_monthly_searches_max}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="filterOrdering">
                <Form.Label>Order By</Form.Label>
                <Form.Control
                  as="select"
                  value={ordering}
                  onChange={handleOrderingChange}
                >
                  <option value="">Select Order</option>
                  <option value="average_monthly_searches">
                    Average Monthly Searches (Ascending)
                  </option>
                  <option value="-average_monthly_searches">
                    Average Monthly Searches (Descending)
                  </option>
                  <option value="competition">Competition (Ascending)</option>
                  <option value="-competition">Competition (Descending)</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <div className="modal-body-container mt-3">
          <table className="customers job_tab">
            <thead>
              <tr>
                <td>
                  <b>Sector</b>
                </td>
                <td>
                  <b>Sub Sector</b>
                </td>
                <td>
                  <b>Keyword Name</b>
                </td>
                <td>
                  <b>Competency</b>
                </td>
                <td>
                  <b>Search Volume</b>
                </td>
              </tr>
            </thead>
            {keywordFileInfo?.map((data, index) => (
              <tbody key={index}>
                <tr>
                  <td>{data?.sub_sector_info?.sector_info?.name || "N/A"}</td>
                  <td>{data?.sub_sector_info?.name || "N/A"}</td>
                  <td>{data?.name}</td>
                  <td>{data?.competition}</td>
                  <td>{data?.average_monthly_searches}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="pagination-bootstrap">{renderPagination()}</div>

        <div className="button-container">
        {hasPassedTC ? (
          <>
            {savedUserInfo?.user_profile?.user?.roles?.find(
              (role) => role?.name === "TRACK_MANAGER"
            ) && (
              <Link
                to={`/campaign-selection-page/${task?.keyword_file_info?.id}`}
              >
                <Button className="job_accept mx-2 status-btn">
                  Campaign Initiation
                </Button>
              </Link>
            )}
            <Button
              variant="success"
              onClick={handleRequestForTC}
              disabled={status === "SENT_TO_TC"}
            >
              {status === "SENT_TO_TC" ? "Requested to TC" : "Passed TC"}
            </Button>
          </>
        ) : (
          <Button
            variant="success"
            onClick={handleRequestForTC}
            disabled={status === "SENT_TO_TC"}
          >
            {status === "SENT_TO_TC" ? "Requested to TC" : "Request For TC"}
          </Button>
        )}

       &nbsp;   <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDocumentModal;
