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
import "./ContentCreationPage.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";

const ContentCreationPage = () => {
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

  // Fetch existing content for each assignment
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

  const fetchAssignments = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        if (cache[page]) {
          setAssignments(cache[page].assignments);
          setExistingContent(cache[page].existingContent);
          setTotalPages(cache[page].totalPages);
        } else {
          const accessToken = localStorage.getItem("accessToken");
          const headers = {
            Authorization: `Token ${accessToken}`,
            "Content-Type": "application/json",
          };
          const profileResponse = await axios.get(
            `${baseURL}/accounts/profile/`,
            { headers }
          );
          const assigneeID = profileResponse.data.id;
          const response = await axios.get(
            `${baseURL}${KeywordAssignment}?assignee=${assigneeID}&page=${page}`,
            { headers }
          );
          const assignmentsData = response.data.results;
          const totalPagesData = response.data.total_pages;

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

  const handleAcceptAssignment = async (assignmentId) => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Send the request to acknowledge the assignment
      await axios.patch(
        `${baseURL}${KeywordAssignment}${assignmentId}/`,
        {
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString(),
        },
        { headers }
      );

      // Update the specific assignment in the state
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, is_acknowledged: true }
            : assignment
        )
      );

      // Display success message
      toast.success("Assignment accepted successfully");
    } catch (error) {
      console.error("Error accepting assignment:", error);
      toast.error("Failed to accept assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUploadContent = async () => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      let response;

      if (modalType === "description") {
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        response = await axios.post(
          `${baseURL}${uploadDescription}`,
          {
            keyword: currentAssignment.id,
            assignee: currentAssignment.assignee_info.id,
            description: modalContent.description,
          },
          { headers }
        );
      } else {
        const formData = new FormData();
        formData.append("keyword", currentAssignment.id);
        formData.append("assignee", currentAssignment.assignee_info.id);

        if (modalType === "image") {
          formData.append("image_file", modalContent.file);
        } else if (modalType === "video") {
          formData.append("video_file", modalContent.file);
        }

        const documentUploadHeaders = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "multipart/form-data",
        };

        const endpoint = modalType === "image" ? uploadImage : uploadVideo;
        response = await axios.post(`${baseURL}${endpoint}`, formData, {
          headers: documentUploadHeaders,
        });
      }

      setExistingContent((prevContent) => ({
        ...prevContent,
        [currentAssignment.id]: [
          ...(prevContent[currentAssignment.id] || []),
          response.data,
        ],
      }));

      setCache((prevCache) => ({
        ...prevCache,
        [currentPage]: {
          ...prevCache[currentPage],
          existingContent: {
            ...prevCache[currentPage].existingContent,
            [currentAssignment.id]: [
              ...(prevCache[currentPage].existingContent[
                currentAssignment.id
              ] || []),
              response.data,
            ],
          },
        },
      }));

      setShowModal(false);
      toast.success("Content uploaded successfully");
    } catch (error) {
      console.error("Error uploading content:", error);
      toast.error("Failed to upload content.");
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

  const handleReupload = (assignment) => {
    setModalType(assignment.content_type);
    setModalContent({});
    setShowModal(true);
    setCurrentAssignment(assignment);
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
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}, ${date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  return (
    <>
      <HabotAppBar />
      <div className="portalstatusdiv">
        <Container>
          <h1>Content Creation</h1>
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
              {assignments.flatMap((assignment) =>
                existingContent[assignment.id] &&
                existingContent[assignment.id].length > 0 ? (
                  existingContent[assignment.id].map((content, index) => (
                    <tr key={`${assignment.id}-${content.id}`}>
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
                          {content.status === "REJECTED" && (
                            <Button
                              variant="outline-primary"
                              onClick={() => handleReupload(assignment)}
                            >
                              Reupload
                            </Button>
                          )}
                          {!content.status && assignment.is_acknowledged && (
                            <Button
                              variant="outline-primary"
                              onClick={() => {
                                setModalType(assignment.content_type);
                                setModalContent({});
                                setShowModal(true);
                                setCurrentAssignment(assignment);
                              }}
                            >
                              Upload
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={assignment.id}>
                    <td>
                      {assignment.keyword_info.keyword_file.sector_info.name}
                    </td>
                    <td>{assignment.keyword_info.name}</td>
                    <td>{assignment.content_type}</td>
                    <td>{formatDate(assignment.assigned_at)}</td>
                    <td>{assignment.creation_instructions || "-"}</td>
                    <td>
                      {assignment.is_acknowledged ? "Accepted" : "Not Accepted"}
                    </td>
                    <td>-</td>
                    <td>
                      {!assignment.is_acknowledged && (
                        <Button
                          variant="outline-primary"
                          onClick={() => handleAcceptAssignment(assignment.id)}
                        >
                          Accept
                        </Button>
                      )}
                      {assignment.is_acknowledged && (
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            setModalType(assignment.content_type);
                            setModalContent({});
                            setShowModal(true);
                            setCurrentAssignment(assignment);
                          }}
                        >
                          Upload
                        </Button>
                      )}
                    </td>
                  </tr>
                )
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
          {modalType !== "viewDescription" && (
            <Button variant="primary" onClick={handleUploadContent}>
              Upload
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ContentCreationPage;
