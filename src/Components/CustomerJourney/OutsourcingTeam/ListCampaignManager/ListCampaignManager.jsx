import React, { useState, useEffect } from "react";
import "./ListCampaignManager.css";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import axios from "axios";
import {
  baseURL,
  outsourcingJobs,
} from "../../../../helpers/endpoints/api_endpoints";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import NoteModal from "./NoteModal";
import { useSelector } from "react-redux";

function ListCampaignManager() {
  const [campaignList, setCampaignList] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [page, setPage] = useState(1);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);
  useEffect(() => {
    fetchCampaignList(page);
  }, [page]);

  const fetchCampaignList = async (page) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    try {
      if (
        savedUserInfo?.user_profile?.user?.roles?.find(
          (role) => role?.name === "TRACK_MANAGER"
        )
      ) {
        const response = await axios.get(
          `${baseURL}${outsourcingJobs}?page=${page}`,
          { headers }
        );
        setCampaignList(response.data.results);
        console.log(response.data);
        setNext(response.data.next);
        setPrevious(response.data.previous);
      } else {
        const response = await axios.get(
          `${baseURL}${outsourcingJobs}?operations_manager=${savedUserInfo?.user_profile?.user?.id}&page=${page}`,
          { headers }
        );
        setCampaignList(response.data.results);
        console.log(response.data);
        setNext(response.data.next);
        setPrevious(response.data.previous);
      }
    } catch (error) {
      console.error("Error fetching campaign list:", error);
    }
  };

  const handleAccept = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    console.log(id);

    const currentDate = new Date().toISOString();

    try {
      const response = await axios.patch(
        `${baseURL}${outsourcingJobs}${id}/`,
        { accepted_date: currentDate },
        { headers }
      );
      console.log(response.data);
      fetchCampaignList(page);
    } catch (error) {
      console.error("Error accepting campaign:", error);
    }
  };

  const handleNextPage = () => {
    if (next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previous) {
      setPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  const handleShowModal = (note) => {
    setCurrentNote(note);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <table className="customers job_tab">
          <thead>
            <tr>
              <td>
                <b>Content Type</b>
              </td>
              <td>
                <b>Note</b>
              </td>
              <td>
                <b>Assigned Date and Time</b>
              </td>
              {/* <td>
                <b>Completion Date and Time</b>
              </td> */}
              <td>
                <b>Accepted Date and Time</b>
              </td>
              {/* <td>
                <b>Assigned Date</b>
              </td> */}
              <td>
                <b>Action</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {campaignList?.map((campaign) => (
              <tr key={campaign?.id}>
                <td>{campaign?.content_type}</td>
                <td>
                  {campaign?.note?.length > 40 ? (
                    <>
                      {campaign?.note.slice(0, 40)}...
                      <Button
                        variant="link"
                        onClick={() => handleShowModal(campaign?.note)}
                      >
                        more...
                      </Button>
                    </>
                  ) : (
                    campaign?.note || "N/A"
                  )}
                </td>
                <td>
                  {new Date(campaign.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                  })}
                </td>
                {/* <td>
                  {new Date(campaign.updated_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                  })}
                </td> */}
                <td>
                  {campaign.accepted_date
                    ? new Date(campaign.accepted_date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                      })
                    : "Pending"}
                </td>

                {/* <td>
                  {campaign?.assigned_date ? campaign.assigned_date : "N/A"}
                </td> */}
                <td>
                  {campaign?.accepted_date ? (
                    <Link
                      to={`/os-job-assignment-list/${campaign?.id}/${campaign?.track_campaign}`}
                    >
                      <Button>OS Task Assignment</Button>
                    </Link>
                  ) : (
                    <Button
                      className="btn-success"
                      onClick={() => handleAccept(campaign?.id)}
                    >
                      Accept
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NoteModal
        show={showModal}
        onHide={handleCloseModal}
        note={currentNote}
      />

      <div className="d-flex justify-content-center my-3">
        <Button onClick={handlePreviousPage} disabled={!previous}>
          Previous
        </Button>
        <span className="page-info">&nbsp; </span>
        <Button onClick={handleNextPage} disabled={!next}>
          Next
        </Button>
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default ListCampaignManager;
