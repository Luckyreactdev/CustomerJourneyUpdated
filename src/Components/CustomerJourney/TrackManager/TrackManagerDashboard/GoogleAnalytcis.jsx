import React, { useState, useEffect } from "react";
import { Button, Form, Table, Row, Col } from "react-bootstrap";
import axios from "axios";

import {
  baseURL,
  googleAnalytics,
  uploadGoogleAnalytics,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function GoogleAnalytics() {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const [googleTableData, setGoogleTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deviceCategories, setDeviceCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [sessionSource, setSessionSource] = useState("");
  const [sourceMedium, setSourceMedium] = useState("");
  const [deviceCategory, setDeviceCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFetchingAllData, setIsFetchingAllData] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  async function fetchAllPagesData(country = "", startDate = "", endDate = "") {
    setIsFetchingAllData(true);
    let nextPage = `${baseURL}${googleAnalytics}?country=${country}${
      startDate ? `&start_date=${formatDateForAPI(startDate)}` : ""
    }${endDate ? `&end_date=${formatDateForAPI(endDate)}` : ""}`;

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    let allData = [];
    try {
      while (nextPage) {
        const response = await axios.get(nextPage, { headers });
        const fetchedData = response.data.results;
        console.log(response.data);
        const convertedData = fetchedData.map(convertAnalyticsData);
        allData = [...allData, ...convertedData];
        nextPage = response.data.next;
      }

      setGoogleTableData(allData);
      setFilteredData(allData);
    } catch (error) {
      // console.error("Error fetching data:", error);
      // toast.error("Failed to fetch data");
    } finally {
      setIsFetchingAllData(false);
    }
  }

  function convertAnalyticsData(item) {
    if (item.bounce_rate) {
      item.bounce_rate = `${(parseFloat(item.bounce_rate) * 100).toFixed(2)}%`;
    }
    if (item.ctr) {
      item.ctr = `${(parseFloat(item.ctr) * 100).toFixed(2)}%`;
    }
    if (item.engagement_rate) {
      item.engagement_rate = `${(
        parseFloat(item.engagement_rate) * 100
      ).toFixed(2)}%`;
    }
    return item;
  }

  const fetchDeviceCategories = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(`${baseURL}${googleAnalytics}`, {
        headers,
      });
      const categories = ["desktop", "mobile", "tablet", "smart_tv", "other"];
      setDeviceCategories(categories);
    } catch (error) {
      console.error("Error fetching device categories:", error);
      toast.error("Failed to fetch device categories");
    }
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

      await axios.post(`${baseURL}${uploadGoogleAnalytics}`, formData, {
        headers,
      });
      toast.success("File uploaded successfully");
      fetchAllPagesData(selectedCountry);
    } catch (error) {
      console.error("Error uploading file:", error);

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
    setSelectedCountry("");
    setSessionSource("");
    setSourceMedium("");
    setDeviceCategory("");
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    fetchAllPagesData(selectedCountry, startDate, endDate);
    fetchDeviceCategories();
  }, [selectedCountry, startDate, endDate]);

  useEffect(() => {
    const filtered = googleTableData.filter(
      (data) =>
        (selectedCountry === "" ||
          data.country.toLowerCase().includes(selectedCountry.toLowerCase())) &&
        data.session_source
          .toLowerCase()
          .includes(sessionSource.toLowerCase()) &&
        data.source_medium.toLowerCase().includes(sourceMedium.toLowerCase()) &&
        (deviceCategory === "" || data.device_category === deviceCategory) &&
        (!startDate ||
          new Date(data.date).getTime() >=
            new Date(formatDateForAPI(startDate)).getTime()) &&
        (!endDate ||
          new Date(data.date).getTime() <=
            new Date(formatDateForAPI(endDate)).getTime())
    );
    setFilteredData(filtered);
  }, [
    sessionSource,
    sourceMedium,
    deviceCategory,
    startDate,
    endDate,
    googleTableData,
    selectedCountry,
  ]);

  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    const sortedData = [...filteredData].sort((a, b) => {
      if (column === "date") {
        return order === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else {
        return order === "asc" ? a[column] - b[column] : b[column] - a[column];
      }
    });
    setFilteredData(sortedData);
  };

  const itemsPerPage = 10;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSortSymbol = (column) => {
    if (column === sortColumn) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return "↓↑";
  };
  return (
    <div>
      <div className="container mt-4">
        <Row>
          {savedUserInfo?.user_profile?.user?.roles?.find(
            (role) => role?.name === "TRACK_MANAGER"
          ) ||
          savedUserInfo?.user_profile?.user?.roles?.find(
            (role) => role?.name === "DATA ANALYST"
          ) ? (
            <Col md={9}>
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
            </Col>
          ) : (
            <Col md={9}> </Col>
          )}

          <Col md={3} className="d-flex justify-content-end align-items-end">
            <div>
              <Button variant="secondary" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="countryFilter" className="mb-4">
              <Form.Label>Filter by Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group controlId="dateRangeFilter" className="mb-4">
              <Form.Label>Filter by Date Range</Form.Label>
              <div>
                <Row>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="Start Date (dd/mm/yyyy)"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="text"
                      placeholder="End Date (dd/mm/yyyy)"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Form.Group controlId="deviceCategoryFilter" className="mb-4">
              <Form.Label>Filter by Device Category</Form.Label>
              <Form.Control
                as="select"
                value={deviceCategory}
                onChange={(e) => setDeviceCategory(e.target.value)}
              >
                <option value="">All Device Categories</option>
                {deviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="sessionSourceFilter" className="mb-4">
              <Form.Label>Filter by Session Source</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter session source"
                value={sessionSource}
                onChange={(e) => setSessionSource(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="sourceMediumFilter" className="mb-4">
              <Form.Label>Filter by Source Medium</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter source medium"
                value={sourceMedium}
                onChange={(e) => setSourceMedium(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div>
          <h6>Google Analytics Data</h6>
          {isFetchingAllData ? (
            <h5 className="d-flex justify-content-center">Loading data...</h5>
          ) : filteredData.length === 0 ? (
            <h5 className="d-flex justify-content-center">
              No matching data found
            </h5>
          ) : (
            <div className="table-responsive">
              <table className="customers job_tab">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("date")}>
                      Date {getSortSymbol("date")}
                    </th>
                    <th>Country</th>
                    <th>Page Location</th>
                    <th>Device Category</th>
                    <th>Session Source</th>
                    <th onClick={() => handleSort("website_visitors")}>
                      Website Visitors {getSortSymbol("website_visitors")}
                    </th>
                    <th>Source Medium</th>
                    <th>First Visit</th>
                    <th onClick={() => handleSort("views")}>
                      Views {getSortSymbol("views")}
                    </th>
                    <th>Bounce Rate</th>
                    <th>Engagement Rate</th>
                    <th>Average Session Duration</th>
                    <th onClick={() => handleSort("impression")}>
                      Impression {getSortSymbol("impression")}
                    </th>
                    <th>CPM</th>
                    <th>CTR</th>
                    <th>SignUp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((data) => (
                    <tr key={data?.id}>
                      <td>{formatDateForAPI(data?.date)}</td>
                      <td>{data?.country}</td>
                      <td>{data?.page_location}</td>
                      <td>{data?.device_category}</td>
                      <td>{data?.session_source}</td>
                      <td>{data?.website_visitors}</td>
                      <td>{data?.source_medium}</td>
                      <td>{data?.first_visits}</td>
                      <td>{data?.views}</td>
                      <td>{data?.bounce_rate}</td>
                      <td>{data?.engagement_rate}</td>
                      <td>{data?.average_session_duration}</td>
                      <td>{data?.impression}</td>
                      <td>{data?.cpm}</td>
                      <td>{data?.ctr}</td>
                      <td>{data?.signup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination-container mt-3 mb-2 d-flex justify-content-center">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                &nbsp;
                <Button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredData.length / itemsPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredData.length / itemsPerPage)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleAnalytics;
