import React, { useState, useEffect } from "react";
import AdminFooter from "../../../Footer/AdminFooter";
import CustomMenuList from "./CustomMenuList";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import {
  baseURL,
  dashboardCampaigns,
  extractedKeywords,
  accountUsers,
  initiateCampaign,
  socialMediaPost,
  keywordSelectionForm,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import "./CampaignTaskAssignment.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";

function CampaignTaskAssignment() {
  const { id } = useParams();
  console.log(id);
  const [campaignList, setCampaignList] = useState([]);
  const [tcFormData, setTcFormData] = useState({
    results: [],
    next: null,
  });
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [sectorName, setSectorName] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedCampaignManager, setSelectedCampaignManager] = useState("");
  const [userList, setUserList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [selectedCampaignType, setSelectedCampaignType] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaignList();
    fetchKeywords();
    fetchUsers();
    fetchCampaignType();
    fetchKeywordSelectionForm();
  }, []);

  const fetchKeywordSelectionForm = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(
        `${baseURL}${keywordSelectionForm}${id}/`,
        {
          headers,
        }
      );
      setSectorName(response.data);
      console.log("Keyword selection form data:", response.data);
    } catch (error) {
      console.error("Error fetching keyword selection form:", error);
    }
  };

  const fetchCampaignList = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${dashboardCampaigns}`, {
        headers,
      });
      setCampaignList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching campaign list:", error);
    }
  };

  const fetchCampaignType = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${socialMediaPost}`, {
        headers,
      });
      setCampaignList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching campaign type:", error);
    }
  };

  const fetchKeywords = async (
    url = `https://customer-journey-19042024.uc.r.appspot.com/dashboards/extracted-keywords/?keyword_file_id=${id}`,
    isLoadMore = false
  ) => {
    try {
      console.log(id);
      setLoadingMore(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(url, { headers });
      console.log(response.data);
      if (isLoadMore) {
        // Append new results to existing results when loading more
        setTcFormData((prev) => ({
          results: [...prev.results, ...response.data.results],
          next: response.data.next,
        }));
      } else {
        // Set initial results (first 10) without appending
        setTcFormData({
          results: response.data.results,
          next: response.data.next,
        });
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchMoreKeywords = () => {
    if (tcFormData.next) {
      fetchKeywords(tcFormData.next, true);
    }
  };

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const response = await axios.get(`${baseURL}${accountUsers}`, {
        headers,
      });
      setAccountList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleKeywordChange = (selectedOptions) => {
    const selectAllOption = { value: "all", label: "Select All" };

    if (selectedOptions.some((option) => option.value === "all")) {
      if (selectedOptions.length === 1) {
        setSelectedKeywords(
          tcFormData.results.map((keyword) => ({
            value: keyword.id,
            label: keyword.name,
          }))
        );
      } else {
        setSelectedKeywords([]);
      }
    } else {
      setSelectedKeywords(selectedOptions);
    }
  };

  const keywordOptions = [
    { value: "all", label: "Select All" },
    ...tcFormData.results.map((keyword) => ({
      value: keyword.id,
      label: `${keyword.name} (search volume: ${keyword.average_monthly_searches})`,
    })),
  ];

  const handleCampaignTypeChange = async (e) => {
    const selectedType = e.target.value;
    setSelectedCampaignType(selectedType);

    if (selectedType === "adCampaign") {
      fetchCampaignList();
    } else if (selectedType === "socialMediaPost") {
      fetchCampaignType();
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const payload = {
        keyword_file: id,
        campaign_manager: parseInt(selectedCampaignManager, 10),
        extracted_keywords: selectedKeywords.map((keyword) =>
          parseInt(keyword.value, 10)
        ),
        campaign_type:
          selectedCampaignType === "adCampaign"
            ? "AD_CAMPAIGN"
            : "SOCIAL_MEDIA_POST",
      };

      if (selectedCampaignType === "adCampaign") {
        payload.campaign = parseInt(selectedCampaign, 10);
      } else if (selectedCampaignType === "socialMediaPost") {
        payload.social_media_post = parseInt(selectedCampaign, 10);
      }

      console.log(payload);

      const response = await axios.post(
        `${baseURL}${initiateCampaign}`,
        payload,
        {
          headers,
        }
      );
      toast.success("Successfully sent");
      console.log("Campaign initiated successfully:", response.data);
      navigate("/campaign-list");
    } catch (error) {
      console.error("Error initiating campaign:", error);
      toast.error(error.message);
    }
  };

  const calculateTotalSearchVolume = () => {
    return selectedKeywords.reduce((total, keyword) => {
      const keywordData = tcFormData.results.find(
        (k) => k.id === keyword.value
      );
      return total + (keywordData ? keywordData.average_monthly_searches : 0);
    }, 0);
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form  container_form">
        <span className="sub_title_form">Campaign Listing Page</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM"></div>
            </Container>
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        <b>Sector : </b>{" "}
                        {sectorName?.sub_sector_info?.sector_info?.name}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        <b>Sub-Sector : </b> {sectorName?.sub_sector_info?.name}
                      </Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}></Col>
                </Row>
              </div>
            </Container>
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Campaign Type</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          id="adCampaign"
                          label="AD Campaign"
                          name="campaignType"
                          value="adCampaign"
                          checked={selectedCampaignType === "adCampaign"}
                          onChange={handleCampaignTypeChange}
                        />
                        <Form.Check
                          type="radio"
                          id="socialMediaPost"
                          label="Social Media Post"
                          name="campaignType"
                          value="socialMediaPost"
                          checked={selectedCampaignType === "socialMediaPost"}
                          onChange={handleCampaignTypeChange}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Name of the Campaign</Form.Label>
                      <Form.Select
                        name="campaign"
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                      >
                        <option value="">Select Name of the Campaign</option>
                        {campaignList.map((campaign) => (
                          <option key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Campaign Manager</Form.Label>
                      <Form.Select
                        name="campaignManager"
                        value={selectedCampaignManager}
                        onChange={(e) =>
                          setSelectedCampaignManager(e.target.value)
                        }
                      >
                        <option value="">Select Campaign Manager</option>
                        {accountList?.results?.map((user) => (
                          <option key={user?.id} value={user?.id}>
                            {user?.email}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Container>
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>
                        {" "}
                        Keywords{" "}
                        <small className="text-secondary">
                          (Total Search Volume:{" "}
                          <b>{calculateTotalSearchVolume()}</b>)
                        </small>
                      </Form.Label>
                      <Select
                        isMulti
                        options={keywordOptions}
                        onChange={handleKeywordChange}
                        value={selectedKeywords}
                        placeholder="Select Keywords"
                        components={{ MenuList: CustomMenuList }}
                        fetchMoreKeywords={fetchMoreKeywords}
                        tcFormData={tcFormData}
                        loadingMore={loadingMore}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
          <Container>
            <div className="form-button-container d-flex justify-content-center mt-3">
              <Button
                variant="primary"
                className="form-button"
                onClick={handleCreateCampaign}
              >
                Create Campaign
              </Button>
            </div>
          </Container>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}

export default CampaignTaskAssignment;
