import React, { useState, useEffect } from "react";
import "./TrackManagerDashboard.css";
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  baseURL,
  uploadEmailData,
  emailData,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function TrackEmail() {
  const [emailTableData, setEmailTableData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [websiteLinkClicksFilter, setWebsiteLinkClicksFilter] = useState("");
  const [socialMediaLinkClicksFilter, setSocialMediaLinkClicksFilter] =
    useState("");
  const [openRateFilter, setOpenRateFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");
  const itemsPerPage = 20;
  const savedUserInfo = useSelector((state) => state.account.savedUserData);

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchEmailData = async (page = 1) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
      };

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const queryParams = new URLSearchParams({
        page,
        page_size: itemsPerPage,
        ordering: `${sortOrder === "asc" ? "" : "-"}${sortColumn}`,
        ...(websiteLinkClicksFilter && {
          no_of_website_link_clicks: websiteLinkClicksFilter,
        }),
        ...(socialMediaLinkClicksFilter && {
          no_of_social_media_link_clicks: socialMediaLinkClicksFilter,
        }),
        ...(openRateFilter && {
          open_rate: openRateFilter,
        }),
        ...(formattedStartDate &&
          formattedStartDate !== "" && {
            start_date: formattedStartDate,
          }),
        ...(formattedEndDate &&
          formattedEndDate !== "" && {
            end_date: formattedEndDate,
          }),
      }).toString();
      const response = await axios.get(
        `${baseURL}${emailData}?${queryParams}`,
        { headers }
      );
      console.log(response.data);
      if (response.data.results.length === 0) {
        setNoDataMessage("No matching data found");
      } else {
        setNoDataMessage("");
      }
      setEmailTableData(response.data);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
    } catch (error) {
      // toast.error("Failed to fetch email data");
      // console.error(error);
    }
  };

  const handleSort = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      await axios.post(`${baseURL}${uploadEmailData}`, formData, { headers });
      toast.success("File uploaded successfully");
      fetchEmailData();
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

  const resetFilters = () => {
    setWebsiteLinkClicksFilter("");
    setSocialMediaLinkClicksFilter("");
    setOpenRateFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  useEffect(() => {
    fetchEmailData(currentPage);
  }, [
    currentPage,
    sortColumn,
    sortOrder,
    websiteLinkClicksFilter,
    socialMediaLinkClicksFilter,
    openRateFilter,
    startDate,
    endDate,
  ]);

  const previousPage = currentPage > 1;
  const nextPage = currentPage < totalPages;

  const getSortSymbol = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↓↑";
  };

  return (
    <div>
      <div className="container mt-4">
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
            <Form.Group controlId="openRateFilter" className="mb-4">
              <Form.Label>Filter by Open Rate</Form.Label>
              <Form.Control
                type="text"
                value={openRateFilter}
                onChange={(e) => setOpenRateFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            {" "}
            <Form.Group controlId="websiteLinkClicksFilter" className="mb-4">
              <Form.Label>Filter by Website Link Clicks</Form.Label>
              <Form.Control
                type="text"
                value={websiteLinkClicksFilter}
                onChange={(e) => setWebsiteLinkClicksFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="socialMediaLinkClicksFilter"
              className="mb-4"
            >
              <Form.Label>Filter by Social Media Link Clicks</Form.Label>
              <Form.Control
                type="text"
                value={socialMediaLinkClicksFilter}
                onChange={(e) => setSocialMediaLinkClicksFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="startDateFilter" className="mb-4">
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
            <Form.Group controlId="endDateFilter" className="mb-4">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="End Date (dd/mm/yyyy)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
        {/* Email Data Table */}
        <div className="job-cont">
          <table className="customers job_tab">
            <thead>
              <tr>
                <th onClick={() => handleSort("date")}>
                  Date {getSortSymbol("date")}
                </th>
                <th>No of Graphic Creatives for the Email</th>
                <th>No of Content Created for Email</th>
                <th onClick={() => handleSort("no_of_emails_sent")}>
                  No of Email Sent {getSortSymbol("no_of_emails_sent")}
                </th>
                <th>No of Unsubscribes</th>
                <th onClick={() => handleSort("open_rate")}>
                  Open Rate {getSortSymbol("open_rate")}
                </th>
                <th>Bounce Rate</th>
                <th>No of Response</th>
                <th onClick={() => handleSort("no_of_website_link_clicks")}>
                  No of Website Link Clicks{" "}
                  {getSortSymbol("no_of_website_link_clicks")}
                </th>
                <th
                  onClick={() => handleSort("no_of_social_media_link_clicks")}
                >
                  No of Social Media Links Clicked{" "}
                  {getSortSymbol("no_of_social_media_link_clicks")}
                </th>
                <th onClick={() => handleSort("no_of_emails_delivered")}>
                  No of Email Delivered{" "}
                  {getSortSymbol("no_of_emails_delivered")}
                </th>
                <th onClick={() => handleSort("no_of_complaints")}>
                  No of Complaints {getSortSymbol("no_of_complaints")}
                </th>
              </tr>
            </thead>
            <tbody>
              {emailTableData.results && emailTableData.results.length > 0 ? (
                emailTableData.results.map((email) => (
                  <tr key={email?.id}>
                    <td>
                      {email?.date
                        ? new Date(email?.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Not Accepted"}
                    </td>
                    {/* <td>{new Date(email?.date).toLocaleDateString()}</td> */}
                    <td>{email?.no_of_graphic_creatives}</td>
                    <td>{email?.no_of_content_created}</td>
                    <td>{email?.no_of_emails_sent}</td>
                    <td>{email?.no_of_unsubcribers}</td>
                    <td>{email?.open_rate}</td>
                    <td>{email?.bounce_rate}%</td>
                    <td>{email?.no_of_response}</td>
                    <td>{email?.no_of_website_link_clicks}</td>
                    <td>{email?.no_of_social_media_link_clicks}</td>
                    <td>{email?.no_of_emails_delivered}</td>
                    <td>{email?.no_of_complaints}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">
                    {" "}
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

export default TrackEmail;
