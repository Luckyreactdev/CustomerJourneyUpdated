import React, { useState, useEffect, useCallback } from "react";
import { Button, Table, Modal, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import {
  baseURL,
  KeywordAssignment,
  uploadDescription,
  uploadImage,
  uploadVideo,
} from "../../../../helpers/endpoints/api_endpoints";
import "./ContentVerificationPage.css";

const ContentVerificationPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [modalType, setModalType] = useState("");
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [existingContent, setExistingContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cache, setCache] = useState({});

  const fetchAssignments = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        if (cache[page]) {
          // Use cached data if available
          setAssignments(cache[page].assignments);
          setExistingContent(cache[page].existingContent);
          setTotalPages(cache[page].totalPages);
        } else {
          const accessToken = localStorage.getItem("accessToken");
          const headers = {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          };
          const response = await axios.get(
            `${baseURL}${KeywordAssignment}?page=${page}`,
            { headers }
          );
          const assignmentsData = response.data.results;
          const totalPagesData = response.data.total_pages; // Assuming the backend returns total_pages

          // Fetch existing content for each assignment
          const contentPromises = assignmentsData.map((assignment) =>
            fetchExistingContent(
              assignment.id,
              assignment.content_type,
              headers
            )
          );
          const contentResults = await Promise.all(contentPromises);
          const contentMap = {};
          contentResults.forEach((content, index) => {
            contentMap[assignmentsData[index].id] = content;
          });

          // Update state and cache
          setAssignments(assignmentsData);
          setExistingContent(contentMap);
          setTotalPages(totalPagesData);
          setCache((prevCache) => ({
            ...prevCache,
            [page]: {
              assignments: assignmentsData,
              existingContent: contentMap,
              totalPages: totalPagesData,
            },
          }));
        }
      } catch (error) {
        if (error.response && error.response.data.detail === "Invalid page.") {
          toast.error("Invalid page. Reverting to the previous page.");
          setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        } else {
          console.error("Error fetching assignments:", error);
          toast.error("Failed to fetch assignments. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cache]
  );

  const fetchExistingContent = async (assignmentId, contentType, headers) => {
    try {
      let endpoint;
      switch (contentType) {
        case "description":
          endpoint = uploadDescription;
          break;
        case "image":
          endpoint = uploadImage;
          break;
        case "video":
          endpoint = uploadVideo;
          break;
        default:
          return [];
      }
      const response = await axios.get(
        `${baseURL}${endpoint}?keyword=${assignmentId}`,
        { headers }
      );
      return response.data.results;
    } catch (error) {
      console.error(`Error fetching existing ${contentType}:`, error);
      return [];
    }
  };

  const handleApprove = async (assignmentId, contentType, contentId) => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      let endpoint;
      switch (contentType) {
        case "description":
          endpoint = uploadDescription;
          break;
        case "image":
          endpoint = uploadImage;
          break;
        case "video":
          endpoint = uploadVideo;
          break;
        default:
          throw new Error("Invalid content type");
      }

      // Update the content status to "APPROVED"
      await axios.patch(
        `${baseURL}${endpoint}${contentId}/`,
        { status: "APPROVED" },
        { headers }
      );

      // Update the existing content in the state
      setExistingContent((prevContent) => ({
        ...prevContent,
        [assignmentId]: prevContent[assignmentId].map((content) =>
          content.id === contentId
            ? { ...content, status: "APPROVED" }
            : content
        ),
      }));

      // Update cache
      setCache((prevCache) => ({
        ...prevCache,
        [currentPage]: {
          ...prevCache[currentPage],
          existingContent: {
            ...prevCache[currentPage].existingContent,
            [assignmentId]: prevCache[currentPage].existingContent[
              assignmentId
            ].map((content) =>
              content.id === contentId
                ? { ...content, status: "APPROVED" }
                : content
            ),
          },
        },
      }));

      toast.success("Content approved successfully.");
    } catch (error) {
      console.error("Error approving content:", error);
      toast.error("Failed to approve content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (assignmentId, contentType, contentId) => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      let endpoint;
      switch (contentType) {
        case "description":
          endpoint = uploadDescription;
          break;
        case "image":
          endpoint = uploadImage;
          break;
        case "video":
          endpoint = uploadVideo;
          break;
        default:
          throw new Error("Invalid content type");
      }

      // Update the content status to "REJECTED"
      await axios.patch(
        `${baseURL}${endpoint}${contentId}/`,
        { status: "REJECTED" },
        { headers }
      );

      // Update the existing content in the state
      setExistingContent((prevContent) => ({
        ...prevContent,
        [assignmentId]: prevContent[assignmentId].map((content) =>
          content.id === contentId
            ? { ...content, status: "REJECTED" }
            : content
        ),
      }));

      // Update cache
      setCache((prevCache) => ({
        ...prevCache,
        [currentPage]: {
          ...prevCache[currentPage],
          existingContent: {
            ...prevCache[currentPage].existingContent,
            [assignmentId]: prevCache[currentPage].existingContent[
              assignmentId
            ].map((content) =>
              content.id === contentId
                ? { ...content, status: "REJECTED" }
                : content
            ),
          },
        },
      }));

      toast.success("Content rejected successfully.");
    } catch (error) {
      console.error("Error rejecting content:", error);
      toast.error("Failed to reject content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDownload = (assignment, content) => {
    if (assignment.content_type === "description") {
      setModalType("viewDescription");
      setModalContent({ description: content.description });
      setShowModal(true);
    } else {
      const fileUrl =
        assignment.content_type === "image"
          ? content.image_file
          : content.video_file;
      window.open(fileUrl, "_blank");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchAssignments(newPage);
  };

  useEffect(() => {
    fetchAssignments(currentPage);
  }, [fetchAssignments, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    const formattedTime = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  return (
    <>
      <div className="portalstatusdiv">
        <Container>
          <h1>Content Verification</h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Sector Name</th>
                <th>Keyword</th>
                <th>Content Type</th>
                <th>Assigned At</th>
                <th>Instructions</th>
                <th>Acknowledgement</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments
                .filter((assignment) => existingContent[assignment.id])
                .flatMap((assignment) =>
                  existingContent[assignment.id].map((content, index) => (
                    <tr key={`${assignment.id}-${content.id}`}>
                      {/* Only show assignment details in the first row of the group */}
                      {index === 0 && (
                        <>
                          <td rowSpan={existingContent[assignment.id].length}>
                            {
                              assignment.keyword_info.keyword_file.sector_info
                                .name
                            }
                          </td>
                          <td rowSpan={existingContent[assignment.id].length}>
                            {assignment.keyword_info.name}
                          </td>
                          <td rowSpan={existingContent[assignment.id].length}>
                            {assignment.content_type}
                          </td>
                          <td rowSpan={existingContent[assignment.id].length}>
                            {formatDate(assignment.assigned_at)}
                          </td>
                          <td rowSpan={existingContent[assignment.id].length}>
                            {assignment.creation_instructions || "-"}
                          </td>
                          <td rowSpan={existingContent[assignment.id].length}>
                            {assignment.is_acknowledged
                              ? "Accepted"
                              : "Not Accepted"}
                          </td>
                        </>
                      )}

                      {/* Render the content status and actions for each file */}
                      <td>{content.status}</td>
                      <td>
                        <div className="actionbuttons">
                          <Button
                            variant="outline-primary"
                            onClick={() =>
                              handleViewDownload(assignment, content)
                            }
                          >
                            View
                          </Button>
                          {content.status !== "APPROVED" &&
                            content.status !== "REJECTED" && (
                              <>
                                <Button
                                  variant="outline-success"
                                  onClick={() =>
                                    handleApprove(
                                      assignment.id,
                                      assignment.content_type,
                                      content.id
                                    )
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleReject(
                                      assignment.id,
                                      assignment.content_type,
                                      content.id
                                    )
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </Table>
          <div className="pagination-controls">
            <Button
              variant="outline-primary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </Container>
      </div>

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "viewDescription"
              ? "View Description"
              : `Upload ${modalType}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "viewDescription" ? (
            <p>{modalContent.description}</p>
          ) : modalType === "description" ? (
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={modalContent.description || ""}
                onChange={(e) =>
                  setModalContent({
                    ...modalContent,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          ) : (
            <Form.Group>
              <Form.Label>Upload {modalType}</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setModalContent({ ...modalContent, file: e.target.files[0] })
                }
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ContentVerificationPage;
