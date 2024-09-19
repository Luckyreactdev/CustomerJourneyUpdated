import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  baseURL,
  uploadSalesData,
  salesData,
} from "../../../../helpers/endpoints/api_endpoints";
import "./TrackManagerDashboard.css";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function TrackSales() {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const [saleTableData, setSaleTableData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [noDataMessage, setNoDataMessage] = useState("");

  const formatDateForAPI = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchSaleData = async (page = 1) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
      };

      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      const queryParams = new URLSearchParams({
        page,
        ...(formattedStartDate && { start_date: formattedStartDate }),
        ...(formattedEndDate && { end_date: formattedEndDate }),
      }).toString();

      const response = await axios.get(
        `${baseURL}${salesData}?${queryParams}`,
        {
          headers,
        }
      );

      if (response.data.results.length === 0) {
        setNoDataMessage("No matching data found");
      } else {
        setNoDataMessage("");
      }
      setSaleTableData(response.data);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
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

      await axios.post(`${baseURL}${uploadSalesData}`, formData, {
        headers,
      });
      toast.success("File uploaded successfully");
      fetchSaleData(currentPage);
    } catch (error) {
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
    fetchSaleData(currentPage);
  }, [currentPage, startDate, endDate]);

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...saleTableData.results].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setSaleTableData({ ...saleTableData, results: sortedData });
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↓↑";
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
            <Form.Group controlId="dateFilters" className="mb-4">
              <Form.Label>Date Range Filter</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Start Date (dd/mm/yyyy)"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="End Date (dd/mm/yyyy)"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
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

        <div className="job-cont">
          <table className="customers job_tab">
            <thead>
              <tr>
                <th onClick={() => sortData("date")}>
                  Date{getSortSymbol("date")}
                </th>
                <th onClick={() => sortData("buyer_signups")}>
                  Buyer Signups{getSortSymbol("buyer_signups")}
                </th>
                <th onClick={() => sortData("buyer_posts")}>
                  Buyer Posts{getSortSymbol("buyer_posts")}
                </th>
                <th onClick={() => sortData("aed_earned_from_buyers")}>
                  AED Earned from Buyers
                  {getSortSymbol("aed_earned_from_buyers")}
                </th>
                <th onClick={() => sortData("supplier_signups")}>
                  Supplier Signups{getSortSymbol("supplier_signups")}
                </th>
                <th onClick={() => sortData("supplier_responses")}>
                  Supplier Responses{getSortSymbol("supplier_responses")}
                </th>
                <th onClick={() => sortData("aed_earned_from_suppliers")}>
                  AED Earned from Suppliers
                  {getSortSymbol("aed_earned_from_suppliers")}
                </th>
              </tr>
            </thead>
            <tbody>
              {saleTableData?.results?.length ? (
                saleTableData.results.map((sale) => (
                  <tr key={sale.id}>
                    <td>
                      {sale?.date
                        ? new Date(sale?.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Not Accepted"}
                    </td>
                    {/* <td>{new Date(sale.date).toLocaleDateString()}</td> */}
                    <td>{sale?.buyer_signups}</td>
                    <td>{sale?.buyer_posts}</td>
                    <td>{sale?.aed_earned_from_buyers}</td>
                    <td>{sale?.supplier_signups}</td>
                    <td>{sale?.supplier_responses}</td>
                    <td>{sale?.aed_earned_from_suppliers}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
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

export default TrackSales;
