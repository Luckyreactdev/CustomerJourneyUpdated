import React, { useState, useEffect } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Tab,
  Nav,
  Table,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import "./CampaignInitiationPage.css";
import {
  baseURL,
  dashboardCampaigns,
  initiateCampaign,
  dashboardContent,
  requestContent,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router";

function CampaignInitiationPage() {
  const { id } = useParams();
  const [keywordsView, setKeywords] = useState([]);
  const [content, setContent] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedContentCampaign, setSelectedContentCampaign] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${dashboardCampaigns}`, { headers })
      .then((result) => {
        console.log(result.data);
        setCampaigns(result.data);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
      });

    axios
      .get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/extracted-keywords/?keyword_file_id=${id}`,
        { headers }
      )
      .then((response) => {
        console.log("extracted keyword data :", response.data.results);
        setKeywords(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching extracted keywords:", error);
        toast.error("Failed to fetch extracted keywords");
      });

    axios
      .get(`${baseURL}${dashboardContent}`, { headers })
      .then((response) => {
        console.log("dashboard content data :", response.data);
        setContent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard content:", error);
        toast.error("Failed to fetch dashboard content");
      });
  }, []);

  const handleCampaignSelect = (campaignId) => {
    setSelectedCampaign(campaignId);
  };

  const handleInitiateCampaign = () => {
    if (!selectedCampaign) {
      toast.error("Please select a campaign");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      campaign: selectedCampaign,
      keyword_file: id,
    };

    axios
      .post(`${baseURL}${initiateCampaign}`, data, { headers })
      .then((response) => {
        toast.success("Campaign initiated successfully");
        console.log("Campaign initiated:", response.data);
      })
      .catch((error) => {
        console.error("Error initiating campaign:", error);
        toast.error("Failed to initiate campaign");
      });
  };

  const handleRequestContent = () => {
    if (!selectedContentCampaign) {
      toast.error("Please select a campaign to request content");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      track_campaign_id: parseInt(id, 10),
    };
    console.log(data);

    axios
      .post(`${baseURL}${requestContent}`, data, { headers })
      .then((response) => {
        toast.success("Content requested successfully");
        console.log("Content requested:", response.data);
      })
      .catch((error) => {
        console.error("Error requesting content:", error);
        toast.error("Failed to request content");
      });
  };
  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="container_form  container_form">
        <span className="sub_title_form">Campaign Initiation Page</span>
        <div className="form_page">
          <div className="form_page_sub">
            <Container>
              <div className="form-field-TM">
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Name of the Sector:</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col md={4}></Col>
                  <Col md={4}></Col>
                </Row>
                <Row>
                  <Tab.Container
                    id="dashboard-tabs"
                    defaultActiveKey="view-keywords"
                  >
                    <Row>
                      <Nav variant="pills" className="cmd_tabs">
                        <Nav.Item>
                          <Nav.Link eventKey="view-keywords">
                            View Keywords
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="view-content">
                            View Content
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>

                      <Tab.Content>
                        <Tab.Pane eventKey="view-keywords">
                          <Form.Group>
                            <Form.Select
                              aria-label="Select Campaign"
                              value={selectedCampaign}
                              onChange={(e) =>
                                setSelectedCampaign(e.target.value)
                              }
                            >
                              <option value="" disabled>
                                Select a campaign
                              </option>
                              {campaigns.map((campaign) => (
                                <option key={campaign.id} value={campaign.id}>
                                  {campaign.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Average Monthly Searches</th>
                                <th>Competition</th>

                                <th>Keyword File</th>
                              </tr>
                            </thead>
                            <tbody>
                              {keywordsView?.map((keyword) => (
                                <tr key={keyword?.id}>
                                  <td>{keyword?.name}</td>
                                  <td>{keyword?.average_monthly_searches}</td>
                                  <td>{keyword?.competition}</td>
                                  <td>{keyword?.keyword_file}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Tab.Pane>
                        <Tab.Pane eventKey="view-content">
                          <Row>
                            <Col md={4}>
                              <Form.Group>
                                <Form.Select
                                  aria-label="Select Campaign"
                                  value={selectedContentCampaign}
                                  onChange={(e) =>
                                    setSelectedContentCampaign(e.target.value)
                                  }
                                >
                                  <option value="" disabled>
                                    Select a campaign
                                  </option>
                                  {campaigns.map((campaign) => (
                                    <option
                                      key={campaign.id}
                                      value={campaign.id}
                                    >
                                      {campaign.name}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Button
                                variant="outline-primary"
                                className="mx-2"
                                onClick={handleRequestContent}
                              >
                                Request for Content
                              </Button>
                            </Col>
                            <Col md={4}></Col>
                          </Row>
                        </Tab.Pane>
                      </Tab.Content>
                    </Row>
                  </Tab.Container>
                </Row>
              </div>
            </Container>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="outline-primary"
              className="close_form mx-2"
              onClick={handleInitiateCampaign}
            >
              Initiate the Campaign
            </Button>
          </div>
        </div>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CampaignInitiationPage;
