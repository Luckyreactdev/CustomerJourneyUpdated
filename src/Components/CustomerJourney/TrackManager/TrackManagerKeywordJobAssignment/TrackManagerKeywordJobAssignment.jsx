import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TrackManagerKeywordJobAssignment.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button, Pagination } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function TrackManagerKeywordJobAssignment() {
  const [tasksDash, setTasksDash] = useState([]);
  const navigate = useNavigate();
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);

  useEffect(() => {
    const fetchTasks = (page) => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      axios
        .get(
          `https://customer-journey-19042024.uc.r.appspot.com/dashboards/tasks/?page=${page}`,
          { headers }
        )
        .then((response) => {
          setTasksDash(response.data);
          setNextPageUrl(response.data.next);
          setPreviousPageUrl(response.data.previous);
          const totalItems = response.data.count; 
          const itemsPerPage = 10; 
          setTotalPages(Math.ceil(totalItems / itemsPerPage));
        })
        .catch((error) => {
          console.error("Error fetching task details:", error);
          toast.error("Failed to fetch task details");
        });
    };

    fetchTasks(currentPage);
  }, [currentPage]);

  const handleViewDocument = (documentUrl) => {
    window.open(documentUrl, "_blank");
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPageUrl) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
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
          onClick={handlePreviousPage}
          disabled={!previousPageUrl}
        />
        {items}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={!nextPageUrl}
        />
        <Pagination.Last
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <span className="sub_title_form">Keyword-Job Listing</span>

        <table className="customers job_tab">
          <thead>
            <tr>
              <td><b>Id</b></td>
              <td><b>Sector</b></td>
              <td><b>Sub Sector</b></td>
              <td><b>Assigned Date and Time</b></td>
              <td><b>Accepted Date and Time</b></td>
              <td><b>Job Completion Date and Time</b></td>
              <td><b>Assignee</b></td>
              <td><b>TC Assignee 1</b></td>
              <td><b>TC Assignee 2</b></td>
              <td><b>Status</b></td>
            </tr>
          </thead>
          <tbody>
            {tasksDash?.results?.map((task, index) => (
              <tr key={index}>
                <td>{task?.id}</td>
                <td>{task?.sub_sector_info?.sector_info?.name || "N/A"}</td>
                <td>{task?.sub_sector_info?.name || "N/A"}</td>
                <td>
                  {task?.created_at
                    ? new Date(task.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </td>
                <td>
                  {task?.started_at
                    ? new Date(task.started_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "Not Accepted"}
                </td>
                <td>
                  {task?.ended_at
                    ? new Date(task.ended_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                    : "Not Completed"}
                </td>
                <td>{task?.assignee_info?.email}</td>
                <td>{task?.tc_assignee_1_info?.email}</td>
                <td>{task?.tc_assignee_2_info?.email}</td>

                <td>
                  {task?.status === "COMPLETED" ? (
                    <Button
                      className="job_accept mx-2 status-btn"
                      onClick={() =>
                        handleViewDocument(task?.keyword_file_info?.file)
                      }
                    >
                      View Document
                    </Button>
                  ) : (
                    task?.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-bootstrap-main">
        {renderPagination()}
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default TrackManagerKeywordJobAssignment;
