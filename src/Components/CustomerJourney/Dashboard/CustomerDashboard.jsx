import React, { useState } from 'react';
import {Col,Nav,Row,Tab} from "react-bootstrap";
import HabotAppBar from "../../Habotech/HabotAppBar/HabotAppBar";
import AccountProfile from "../HabotProfile/AccountProfile";
import SectorSelectionPage from "../TrackManager/SectorSelectionPage/SectorSelectionPage";
import KeywordSelectionForm from "../AssignedTCSelection/KeywordSelectionForm/KeywordSelectionForm";
import CampaignInitiationPage from "../CampaignManager/CampaignInitiationPage/CampaignInitiationPage";
import CampaignManagerDashboard from "../CampaignManager/CampaignManagerDashboard/CampaignManagerDashboard";
import TaskAssignmentPage from "../TrackManager/TaskAssignmentPage/TaskAssignmentPage";
import TrackManagerDashboard from "../TrackManager/TrackManagerDashboard/TrackManagerDashboard";
import TCForm from "../AssignedTCSelection/TCForm/TCForm";
import CampaignTaskAssignment from "../CampaignManager/CampaignTaskAssignment/CampaignTaskAssignment";
import ContentCreationForm from "../ContentManager/ContentCreationForm/ContentCreationForm";
import JobDescriptionForm from "../ContentManager/JobDescriptionForm/JobDescriptionForm";
import TaskMonitoringPage from "../ContentManager/TaskMonitoringPage/TaskMonitoringPage";
import TCContentForm from "../ContentManager/TCContentForm/TCContentForm";
import OutsourcingTeam from "../OutsourcingTeam/OutsourcingTeam";
import AdminFooter from "../../Footer/AdminFooter";
import DataUpdationPage from "../CampaignManager/DataUpdationPage/DataUpdationPage";
import DailyMonitor from '../CampaignManager/DailyMonitor/DailyMonitor';
import "./Dashboard.css"
import Sales from '../TrackManager/SalesPage/Sales';

function CustomerDashboard() {
  const [selectedNavItem, setSelectedNavItem] = useState(null);

  const handleNavItemClick = (eventKey) => {
    setSelectedNavItem(eventKey);
  };
  return (
    <div>
      <HabotAppBar />
      <div className="screen-cont-dash">
      <AccountProfile />
        {/* <Tab.Container
          transition={false}
          id="vertical-tabs-example"
          unmountOnExit={true}
          mountOnEnter={true}
          defaultActiveKey="first"
        >
          {" "}
          <Row className="CD-row">
            <Col sm={3} className="CD-sidebar">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">Account Setting</Nav.Link>
                </Nav.Item>
                <div className="all-dash-track">
                  <Nav.Item>
                    <b>Track Manager UIs</b>
                    <Nav.Link eventKey="second">Sector Selection Page</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Keyword Selection Form</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourth">
                      Campaign Initiation Page
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="twentieth">
                     Sales and Sign-in
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fifth">
                      Track Manager Dashboard
                    </Nav.Link>
                  </Nav.Item>
                </div>

                <div className="all-dash-track">
                  <Nav.Item>
                    <b>Campaign Manager UIs</b>
                    <Nav.Link eventKey="sixth">Task Assignment Page</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="seventh">Daily Monitoring</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="eighth">Data Updation Page</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="ninth">
                      Campaign Manager Dashboard
                    </Nav.Link>
                  </Nav.Item>
                </div>

                <div className="all-dash-track">
                  <Nav.Item>
                    <b>Content Manager UIs</b>
                    <Nav.Link eventKey="tenth">
                      Content Manager Task Monitoring Page
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="eleventh">
                      Content Creation Form
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="twelfth">TC for Content Form</Nav.Link>
                  </Nav.Item>
                </div>

                <div className="all-dash-track">
                  <Nav.Item>
                    <b>Outsourcing Team UIs</b>
                    <Nav.Link eventKey="thirteenth">
                      Job Description Form for Outsourcing
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourteenth">
                      Document Upload Page
                    </Nav.Link>
                  </Nav.Item>
                </div>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <AccountProfile />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <SectorSelectionPage />
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <KeywordSelectionForm />
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                  <CampaignInitiationPage />
                </Tab.Pane>
                <Tab.Pane eventKey="twentieth">
                <Sales/>
                </Tab.Pane>
                <Tab.Pane eventKey="fifth">
                  <TrackManagerDashboard />
                </Tab.Pane>
                <Tab.Pane eventKey="sixth">
                  <TaskAssignmentPage />
                </Tab.Pane>

                <Tab.Pane eventKey="seventh">
                  <DailyMonitor/>
                </Tab.Pane>
                <Tab.Pane eventKey="eighth">
                  <DataUpdationPage/>
                </Tab.Pane>
                <Tab.Pane eventKey="ninth">
                  <CampaignManagerDashboard />
                </Tab.Pane>
                <Tab.Pane eventKey="tenth">
                  <TaskMonitoringPage />
                </Tab.Pane>
                <Tab.Pane eventKey="eleventh">
                  <ContentCreationForm />
                </Tab.Pane>
                <Tab.Pane eventKey="twelfth">
                  <TCContentForm />
                </Tab.Pane>
                <Tab.Pane eventKey="thirteenth">
                  <JobDescriptionForm />
                </Tab.Pane>
                <Tab.Pane eventKey="fourteenth">
                <OutsourcingTeam/>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container> */}
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CustomerDashboard;
