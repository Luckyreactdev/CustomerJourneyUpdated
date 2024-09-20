import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Modal,
  Card,
  Pagination,
} from "react-bootstrap";
import {
  baseURL,
  csvfileupload,
  fetchKeyword,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import "./KeywordAssessment.css";
import { useTrackmanager } from "../../../../Hooks/SeoManagercheck";

function KeywordAssessment() {
  const [keywords, setKeywords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loader, setloader] = useState(false);
  const [showKeywordsModal, setShowKeywordsModal] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordPage, setKeywordPage] = useState(1);
  const [totalKeywords, setTotalKeywords] = useState(0);
  const [totalKeywordPages, setTotalKeywordPages] = useState(0);

  const trackmanager = useTrackmanager();

  const fetchKeywords = useCallback(async (page = 1) => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${csvfileupload}`, {
        headers,
        params: {
          page: page,
          page_size: 10,
        },
      });
      setloader(false);
      setKeywords(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setloader(false);
      toast.error("Failed to fetch keywords. Please try again later.");
    }
  }, []);

  const fetchKeywordsForSector = useCallback(async (sectorId, page = 1) => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(`${baseURL}${fetchKeyword}`, {
        headers,
        params: {
          sector_id: sectorId,
          page: page,
          page_size: 20,
        },
      });

      setSelectedKeywords(response.data.results);
      setTotalKeywords(response.data.count);
      setTotalKeywordPages(Math.ceil(response.data.count / 20));
      setKeywordPage(page);
      setShowKeywordsModal(true);
      setloader(false);
    } catch (error) {
      console.error("Error fetching keywords for sector:", error);
      setloader(false);
      toast.error(
        "Failed to fetch keywords for this sector. Please try again."
      );
    }
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      fetchKeywords(newPage);
    },
    [fetchKeywords]
  );

  const handleKeywordPageChange = useCallback(
    (newPage) => {
      fetchKeywordsForSector(
        selectedKeywords[0]?.keyword_file.sector_info.id,
        newPage
      );
    },
    [fetchKeywordsForSector, selectedKeywords]
  );

  const renderPagination = useCallback(
    (currentPage, totalPages, onPageChange) => {
      let items = [];
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => onPageChange(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
      return (
        <Pagination className="mt-3 justify-content-center">
          <Pagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {items}
          <Pagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      );
    },
    []
  );

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords, trackmanager]);

  const handleApprovalStatus = useCallback(
    async (keywordId, status) => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const patchBody = {
          status: status === "APPROVE" ? "APPROVED" : "REJECTED",
        };
        await axios.patch(
          `${baseURL}${csvfileupload}${keywordId}/`,
          patchBody,
          { headers }
        );

        await fetchKeywords();
        toast.success(
          status === "APPROVE"
            ? "Approved successfully"
            : "Rejected Successfully"
        );
      } catch (error) {
        console.error("Error updating approval status:", error);
        toast.error("Failed to update approval status. Please try again.");
      }
    },
    [fetchKeywords]
  );

  const renderKeywordCards = useCallback(() => {
    return selectedKeywords.map((keyword, index) => (
      <Card key={index} className="keyword-card">
        <Card.Body>
          <Card.Title>{keyword.name}</Card.Title>
          <Card.Text>Competition: {keyword.competition}</Card.Text>
          <Card.Text>
            Indexed Value: {keyword.competition_indexed_value || "N/A"}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
  }, [selectedKeywords]);

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
                <th>Acknowledge Date & Time</th>
                <th>Action</th>
                <th>View Keywords</th>
              </tr>
            </thead>
            <tbody>
              {keywords.length > 0 ? (
                keywords.map((keyword) => (
                  <tr key={keyword.id}>
                    <td>{keyword?.sector_info?.name || "-"}</td>
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
                      {keyword.acknowledged_at
                        ? new Date(keyword.acknowledged_at).toLocaleString()
                        : "N/A"}
                    </td>
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
                    <td>
                      <Button
                        variant="outline-primary"
                        onClick={() =>
                          fetchKeywordsForSector(keyword.sector_info.id)
                        }
                      >
                        View Keywords
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="emptyrow">
                  <td colSpan="7">No Keywords available</td>
                </tr>
              )}
            </tbody>
          </Table>
          {renderPagination(currentPage, totalPages, handlePageChange)}
        </Container>
      </div>

      <Modal
        show={showKeywordsModal}
        onHide={() => setShowKeywordsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Keywords (Total: {totalKeywords})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="keyword-cards-container">{renderKeywordCards()}</div>
          {renderPagination(
            keywordPage,
            totalKeywordPages,
            handleKeywordPageChange
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default KeywordAssessment;
