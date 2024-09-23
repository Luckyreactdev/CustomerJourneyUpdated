import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "./ImageVerificationPage.css";
import HabotAppBar from "../Habotech/HabotAppBar/HabotAppBar";

function ImageVerification() {
  const [contents, setContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [loader, setLoader] = useState(false);

  const fetchContents = async (
    url = `API_ENDPOINT_HERE?page=${currentPage}`
  ) => {
    try {
      setLoader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(url, { headers });
      setLoader(false);
      setContents(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
    } catch (error) {
      console.error("Error fetching contents:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleApprovalStatus = async (contentId, status, comments) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const patchBody = {
        status: status,
        comments: comments,
      };
      await axios.patch(`API_ENDPOINT_HERE/${contentId}/`, patchBody, {
        headers,
      });

      await fetchContents();
      toast.success(
        `Content ${
          status === "APPROVED" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <HabotAppBar />
      <div className="content-verification-page">
        {loader && <div className="loader"></div>}
        <Container>
          <h1>Video Creation</h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contents.length > 0 ? (
                contents.map((content) => (
                  <tr key={content.id}>
                    <td>{content.keyword}</td>
                    <td>{content.title}</td>
                    <td>{content.description}</td>
                    <td>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const status = e.target.status.value;
                          const comments = e.target.comments.value;
                          handleApprovalStatus(content.id, status, comments);
                        }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="comments"
                            placeholder="Enter your comments here"
                          />
                        </Form.Group>
                        <div className="action-buttons">
                          <Button
                            type="submit"
                            name="status"
                            value="APPROVED"
                            variant="success"
                          >
                            Approve
                          </Button>
                          <Button
                            type="submit"
                            name="status"
                            value="REJECTED"
                            variant="danger"
                          >
                            Reject
                          </Button>
                        </div>
                        <Button
                          variant="primary"
                          type="submit"
                          className="mt-2"
                        >
                          Submit
                        </Button>
                      </Form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="4">Not available</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="pagination-div">
            {prevPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => fetchContents(prevPageUrl)}
              >
                Previous
              </Button>
            )}
            {nextPageUrl && (
              <Button
                variant="outline-primary"
                onClick={() => fetchContents(nextPageUrl)}
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

export default ImageVerification;
