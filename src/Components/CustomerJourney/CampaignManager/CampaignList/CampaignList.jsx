import React, { useState, useEffect } from "react";
import "./CampaignList.css";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import axios from "axios";
import {
  baseURL,
  trackCampaign,
} from "../../../../helpers/endpoints/api_endpoints";
import KeywordModal from "./KeywordModal";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";

function CampaignList() {
  const [campaignList, setCampaignList] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [showSubSectorModal, setShowSubSectorModal] = useState(false);
  const [selectedSubSectors, setSelectedSubSectors] = useState([]);
  const savedUserInfo = useSelector((state) => state.account.savedUserData);
  console.log(savedUserInfo);

  useEffect(() => {
    fetchCampaignList(
      savedUserInfo?.user_profile?.user?.roles?.find(
        (role) => role?.name === "TRACK_MANAGER"
      )
        ? `https://customer-journey-19042024.uc.r.appspot.com/dashboards/track-campaigns/?limit=10`
        : `https://customer-journey-19042024.uc.r.appspot.com/dashboards/track-campaigns/?campaign_manager=${savedUserInfo?.user_profile?.user?.id}&?limit=10`
    );
  }, []);

  const fetchCampaignList = async (url) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };
    console.log(url);
    try {
      const response = await axios.get(url, { headers });
      console.log(response.data);
      setCampaignList(response.data);
      console.log(response.data);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Error fetching campaign list:", error);
    }
  };

  const handleShowMoreKeywords = (keywords) => {
    setSelectedKeywords(keywords);
    setShowModal(true);
  };

  const handleShowMoreSectors = (sectors) => {
    setSelectedSectors(sectors);
    setShowSectorModal(true);
  };

  const handleShowMoreSubSectors = (subSectors) => {
    setSelectedSubSectors(subSectors);
    setShowSubSectorModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowSectorModal(false);
    setShowSubSectorModal(false);
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <span className="sub_title_form">Campaign List</span>

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
                <b>Campaign Type</b>
              </td>
              <td>
                <b>Campaign Name</b>
              </td>

              <td>
                <b>Keyword File</b>
              </td>
              <td>
                <b>Created By</b>
              </td>
              <td>
                <b>Campaign Manager</b>
              </td>
              <td>
                <b>Selected Keywords</b>
              </td>
              <td>
                <b>Initiated Date and Time</b>
              </td>
              <td>
                <b>Accepted Date and Time</b>
              </td>
              <td>
                <b>End Date and Time</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {campaignList?.results?.map((campaign) => {
              const extractedKeywords = campaign?.extracted_keywords_info || [];

              return (
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
                    {campaign?.campaign_type === "AD_CAMPAIGN"
                      ? "Ad Campaign"
                      : campaign?.campaign_type === "SOCIAL_MEDIA_POST"
                      ? "Social Media Post"
                      : campaign?.campaign_type}
                  </td>{" "}
                  <td>
                    {campaign?.campaign_info?.name ||
                      campaign?.social_media_post_info?.name ||
                      "N/A"}
                  </td>
                  <td>
                    {campaign?.keyword_file_info?.file ? (
                      <a
                        href={campaign?.keyword_file_info?.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Document
                      </a>
                    ) : (
                      "No Document"
                    )}
                  </td>
                  <td>{campaign?.created_by_info?.email}</td>
                  <td>{campaign?.campaign_manager_info?.email}</td>
                  <td>
                    <ul>
                      {extractedKeywords.slice(0, 3).map((keyword, index) => (
                        <li key={index}>{keyword?.name}</li>
                      ))}
                      {extractedKeywords.length > 3 && (
                        <li
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() =>
                            handleShowMoreKeywords(extractedKeywords)
                          }
                        >
                          more...
                        </li>
                      )}
                    </ul>
                  </td>
                  <td>
                    {campaign?.created_at
                      ? new Date(campaign.created_at).toLocaleString("en-GB", {
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
                    {campaign?.started_at
                      ? new Date(campaign.started_at).toLocaleString("en-GB", {
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
                    {campaign?.end_date
                      ? new Date(campaign.end_date).toLocaleString("en-GB", {
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
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="d-flex justify-content-center my-3">
          <Button
            className="mx-2"
            onClick={() => fetchCampaignList(prevPage)}
            disabled={!prevPage}
          >
            Previous
          </Button>
          <Button
            className="mx-2"
            onClick={() => fetchCampaignList(nextPage)}
            disabled={!nextPage}
          >
            Next
          </Button>
        </div>
      </div>

      <KeywordModal
        show={showModal}
        handleClose={handleCloseModal}
        items={selectedKeywords}
        title="Extracted Keywords"
      />

      <KeywordModal
        show={showSectorModal}
        handleClose={handleCloseModal}
        items={selectedSectors}
        title="Sectors"
      />

      <KeywordModal
        show={showSubSectorModal}
        handleClose={handleCloseModal}
        items={selectedSubSectors}
        title="Sub Sectors"
      />

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CampaignList;
