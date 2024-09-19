import React, { useState, useEffect } from "react";
import "./ContentManagerJobList.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import { Button } from "react-bootstrap";
import {
  baseURL,
  outsourcingJobs,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ContentManagerJobList() {
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  const [outsourceList, setOutsourceList] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const fetchData = async () => {
      try {
        const url = `${baseURL}${outsourcingJobs}?page=${page}`;
        const FilterUrl = `${baseURL}${outsourcingJobs}?created_by=${savedUserInfo?.user_profile?.user?.id}&page=${page}`;

        const response = savedUserInfo?.user_profile?.user?.roles?.find(
          (role) => role?.name === "TRACK_MANAGER"
        )
          ? await axios.get(url, { headers })
          : await axios.get(FilterUrl, { headers });

        setOutsourceList(response.data);
        console.log(response.data);
        setCount(response.data.count);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_table">
        <span className="sub_title_form">
          Outsourcees Submitted Jobs Listing
        </span>

        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Id</th>
              <th>Sector</th>
              <th>Sub Sector</th>
              <th>Name of the Campaign</th>
              <th>Content Type</th>
              <th>Assigned Date and Time</th>
              <th>Accepted Date and Time</th>
              <th>Submitted Date and Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {outsourceList?.results?.map((task) => {
              const campaignName =
                task?.track_campaign_info?.campaign_info?.name ||
                task?.track_campaign_info?.campaign_type ||
                "N/A";

              return (
                <tr key={task?.id}>
                  <td>{task?.id}</td>
                  <td>
                    {
                      task?.track_campaign_info?.keyword_file_info
                        ?.sub_sector_info?.sector_info?.name
                    }
                  </td>
                  <td>
                    {
                      task?.track_campaign_info?.keyword_file_info
                        ?.sub_sector_info?.name
                    }
                  </td>
                  <td>{campaignName}</td>
                  <td>{task.content_type || "N/A"}</td>
                  <td>
                    {task.created_at
                      ? new Date(task.created_at).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "N/A"}
                  </td>
                  <td>
                    {task.accepted_date
                      ? new Date(task.accepted_date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "N/A"}
                  </td>
                  <td>
                    {task.submitted_date
                      ? new Date(task.submitted_date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                        })
                      : "N/A"}
                  </td>
                  <td>
                    <Link to={`/content-manager-list-details/${task.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mb-2">
        <Button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <span className="page-info">&nbsp; </span>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page * 10 >= count}
        >
          Next
        </Button>
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default ContentManagerJobList;
