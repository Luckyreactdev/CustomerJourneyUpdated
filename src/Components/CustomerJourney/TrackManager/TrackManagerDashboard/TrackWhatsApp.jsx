import React, { useState, useEffect } from "react";
import "./TrackManagerDashboard.css";
import { Button, Form, Table, Col, Row } from "react-bootstrap";
import axios from "axios";
import {
  baseURL,
  UploadwhatsappData,
  whatsappData,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function TrackWhatsApp() {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const [whatsAppTableData, setWhatsAppTableData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [websiteClicksFilter, setWebsiteClicksFilter] = useState("");
  const [readRateFilter, setReadRateFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [noDataMessage, setNoDataMessage] = useState("");

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchWhatsAppData = async (page = 1) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
      };

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const queryParams = new URLSearchParams({
        page,
        ...(websiteClicksFilter && { website_clicks: websiteClicksFilter }),
        ...(readRateFilter && { read_rate: readRateFilter }),
        ...(formattedStartDate && { start_date: formattedStartDate }),
        ...(formattedEndDate && { end_date: formattedEndDate }),
        sort_by: sortColumn,
        order: sortOrder,
      }).toString();

      const response = await axios.get(
        `${baseURL}${whatsappData}?${queryParams}`,
        { headers }
      );
      setWhatsAppTableData(response.data);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
      setNoDataMessage(
        response.data.results.length === 0 ? "No matching data found" : ""
      );
      console.log(response.data);
    } catch (error) {
      // toast.error("Failed to fetch data");
      setNoDataMessage("");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(formData);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      await axios.post(`${baseURL}${UploadwhatsappData}`, formData, {
        headers,
      });
      toast.success("File uploaded successfully");
      fetchWhatsAppData(currentPage);
    } catch (error) {
      console.log(error);
      if (error.response) {
        const { status, data } = error.response;

        if (
          status === 400 &&
          data.date?.[0]?.includes("Datetime has wrong format")
        ) {
          toast.error(
            "Please use the template and date format should be in YYYY-MM-DD"
          );
        } else if (status === 500 && data.error === "Server Error (500)") {
          toast.error(
            "Please use the template and data format should match the template given"
          );
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("An error occurred while uploading the file.");
      }
    }
  };

  useEffect(() => {
    fetchWhatsAppData(currentPage);
  }, [
    currentPage,
    websiteClicksFilter,
    readRateFilter,
    startDate,
    endDate,
    sortColumn,
    sortOrder,
  ]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getSortSymbol = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↓↑";
  };

  const resetFilters = () => {
    setWebsiteClicksFilter("");
    setReadRateFilter("");
    setStartDate("");
    setEndDate("");
  };
  return (
    <div>
      <div className="container mt-4">
        {/* File Upload Section */}
        {savedUserInfo?.user_profile?.user?.roles?.find(
          (role) => role?.name === "TRACK_MANAGER"
        ) ||
        savedUserInfo?.user_profile?.user?.roles?.find(
          (role) => role?.name === "DATA ANALYST"
        ) ? (
          <Form.Group controlId="fileUpload" className="mb-4">
            <Form.Label>Upload File</Form.Label>
            <div className="d-flex">
              <Form.Control
                className="upload-file-btn"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <Button
                variant="primary"
                className="ms-3"
                onClick={handleFileUpload}
              >
                Upload
              </Button>
            </div>
          </Form.Group>
        ) : (
          ""
        )}

        <Row>
          <Col>
            <Form.Group controlId="filters" className="mb-4">
              <Form.Label>Filters by Website Clicks</Form.Label>

              <Form.Control
                value={websiteClicksFilter}
                onChange={(e) => setWebsiteClicksFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="filters" className="mb-4">
              <Form.Label>Filters by Read Rate</Form.Label>

              <Form.Control
                value={readRateFilter}
                onChange={(e) => setReadRateFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <div className="mt-4">
              <Button variant="secondary" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="startDate" className="mb-4">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Start Date (dd/mm/yyyy)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="endDate" className="mb-4">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="End Date (dd/mm/yyyy)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col></Col>
        </Row>
        <div className="job-cont">
          <table className="customers job_tab">
            <thead>
              <tr>
                <th onClick={() => handleSort("date")}>
                  Date {getSortSymbol("date")}
                </th>
                <th onClick={() => handleSort("no_of_messages_sent")}>
                  No of Messages Sent {getSortSymbol("no_of_messages_sent")}
                </th>
                <th>No of Successful Messages Delivered</th>
                <th onClick={() => handleSort("no_of_unread_messages")}>
                  No of Unread Messages {getSortSymbol("no_of_unread_messages")}
                </th>
                <th>No of no Response</th>
                <th>No of Stopped Sessages</th>
                <th onClick={() => handleSort("read_rate")}>
                  Read Rate {getSortSymbol("read_rate")}
                </th>
                <th>Reply Rate</th>
                <th onClick={() => handleSort("website_clicks")}>
                  Website Click {getSortSymbol("website_clicks")}
                </th>
                <th>No of Sebsite Visitors Redirected via Whats app icon</th>
              </tr>
            </thead>
            <tbody>
              {whatsAppTableData?.results &&
              whatsAppTableData?.results?.length > 0 ? (
                whatsAppTableData?.results?.map((whatsapp) => (
                  <tr key={whatsapp?.id}>
                    <td>
                      {whatsapp?.date
                        ? new Date(whatsapp?.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Not Accepted"}
                    </td>
                    {/* <td>{new Date(whatsapp.date).toLocaleDateString()}</td> */}
                    <td>{whatsapp?.no_of_messages_sent}</td>
                    <td>{whatsapp?.no_of_successful_messages_delivered}</td>
                    <td>{whatsapp?.no_of_unread_messages}</td>
                    <td>{whatsapp?.no_of_responses}</td>
                    <td>{whatsapp?.no_of_stopped_messages}</td>
                    <td>{whatsapp?.read_rate}</td>
                    <td>{whatsapp?.reply_rate}</td>
                    <td>{whatsapp?.website_clicks}</td>
                    <td>{whatsapp?.no_of_website_visitors}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    <h5>{noDataMessage}</h5>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-container mt-3 mb-2 d-flex justify-content-center">
          <Button
            variant="primary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!previousPage}
          >
            Previous
          </Button>
          &nbsp;
          <Button
            variant="primary"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={!nextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrackWhatsApp;
