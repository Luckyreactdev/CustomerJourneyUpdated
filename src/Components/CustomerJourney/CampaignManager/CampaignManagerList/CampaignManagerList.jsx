import React, { useState, useEffect } from "react";
import "./CampaignManagerList.css";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import axios from "axios";
import {
  baseURL,
  trackCampaign,
} from "../../../../helpers/endpoints/api_endpoints";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import EndCampaignModal from "./EndCampaignModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function CampaignManagerList() {
  const [campaignList, setCampaignList] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [acceptingCampaignId, setAcceptingCampaignId] = useState(null);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);
  const itemsPerPage = 10;

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
          `https://customer-journey-19042024.uc.r.appspot.com/dashboards/track-campaigns/?page=${page}`,
          {
            headers,
          }
        );
        console.log(response.data);
        setCampaignList(response.data);
      } else {
        const response = await axios.get(
          `https://customer-journey-19042024.uc.r.appspot.com/dashboards/track-campaigns/?campaign_manager=${savedUserInfo?.user_profile?.user?.id}&?page=${page}`,
          {
            headers,
          }
        );
        console.log(response.data);
        setCampaignList(response.data);
      }
    } catch (error) {
      console.error("Error fetching campaign list:", error);
    }
  };

  useEffect(() => {
    fetchCampaignList(currentPage);
  }, [currentPage]);

  const handleOpenModal = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCampaignId(null);
  };

  const handleEndCampaign = (documentLink, screenshotFile) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const currentDate = new Date().toISOString();

    const formData = new FormData();
    formData.append("end_date", currentDate);
    if (documentLink) formData.append("document_link", documentLink);
    if (screenshotFile) formData.append("screenshot_file", screenshotFile);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    axios
      .patch(`${baseURL}${trackCampaign}${selectedCampaignId}/`, formData, {
        headers,
      })
      .then(() => {
        toast.success("Campaign ended successfully!");
        fetchCampaignList(currentPage);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error ending campaign:", error);
        toast.error("Failed to end the campaign. Please try again.");
      });
  };

  const handleAcceptCampaign = async (campaignId) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };
    const currentDate = new Date().toISOString();

    try {
      await axios.patch(
        `${baseURL}${trackCampaign}${campaignId}/`,
        { started_at: currentDate },
        { headers }
      );
      toast.success("Campaign accepted successfully!");
      fetchCampaignList(currentPage);
      setAcceptingCampaignId(null);
    } catch (error) {
      console.error("Error accepting campaign:", error);
      toast.error("Failed to accept the campaign. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <span className="sub_title_form">Campaign Jobs Assigned</span>

        <table className="customers job_tab">
          <thead>
            <tr>
              <td>
                <b>Id</b>
              </td>
              <td>
                <b>Sector</b>
              </td>
              <td>
                <b>Sub Sector</b>
              </td>
              <td>
                <b>Campaign Name</b>
              </td>
              <td>
                <b>Campaign Type</b>
              </td>
              <td>
                <b>Created Date</b>
              </td>
              <td>
                <b>End Document</b>
              </td>
              <td>
                <b>Started Date</b>
              </td>
              <td>
                <b>Campaign/Posting Live Date</b>
              </td>
              <td>
                <b>Action</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {campaignList?.results?.map((campaign) => (
              <tr key={campaign?.id}>
                <td>{campaign?.id}</td>
                <td>
                  {
                    campaign?.keyword_file_info?.sub_sector_info?.sector_info
                      ?.name
                  }
                </td>
                <td>{campaign?.keyword_file_info?.sub_sector_info?.name}</td>
                <td>
                  {campaign?.campaign_info?.name ||
                    campaign?.social_media_post_info?.name ||
                    "N/A"}
                </td>
                <td>
                  {campaign?.campaign_type === "AD_CAMPAIGN"
                    ? "Ad Campaign"
                    : campaign?.campaign_type === "SOCIAL_MEDIA_POST"
                    ? "Social Media Post"
                    : campaign?.campaign_type}
                </td>{" "}
                <td>
                  {campaign?.created_at
                    ? new Date(campaign.created_at).toLocaleString("en-GB", {
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
                  {campaign.document_link && (
                    <div>
                      <a
                        href={campaign.document_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {campaign.document_link}
                      </a>
                    </div>
                  )}
                  {campaign.screenshot_file && (
                    <div className="mt-2">
                      <a
                        href={campaign.screenshot_file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Screenshot File
                      </a>
                    </div>
                  )}
                  {!campaign.document_link &&
                    !campaign.screenshot_file &&
                    "No end document"}
                </td>
                <td>
                  {campaign?.started_at
                    ? new Date(campaign.started_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                      })
                    : "Not Accepted"}
                </td>
                <td>
                  {campaign.end_date ? (
                    new Date(campaign.end_date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true, // Use 24-hour format; set to true for 12-hour with AM/PM
                    })
                  ) : (
                    <Button
                      className="btn-danger"
                      onClick={() => handleOpenModal(campaign.id)}
                    >
                      {campaign.campaign_type === "AD_CAMPAIGN"
                        ? "End Campaign"
                        : campaign.campaign_type === "SOCIAL_MEDIA_POST"
                        ? "Posting Completed"
                        : "End Campaign"}
                    </Button>
                  )}
                </td>
                <td>
                  {campaign.started_at ? (
                    <Link to={`/campaign-jobs-assigned/${campaign.id}`}>
                      <Button>Assigned list</Button>
                    </Link>
                  ) : (
                    <Button
                      className="btn-success"
                      onClick={() => handleAcceptCampaign(campaign.id)}
                    >
                      Accept
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-center my-3">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!campaignList.previous}
          >
            Previous
          </Button>
          &nbsp;
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!campaignList.next}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>

      <EndCampaignModal
        show={showModal}
        handleClose={handleCloseModal}
        handleEndCampaign={handleEndCampaign}
      />
    </div>
  );
}

export default CampaignManagerList;
