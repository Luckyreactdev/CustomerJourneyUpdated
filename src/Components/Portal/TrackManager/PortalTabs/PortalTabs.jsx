import React from "react";
import "./PortalTabs.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { Button, Tab, Nav, Col, Row, Form } from "react-bootstrap";
import Portalsetup from "../Portal-Setup/Portalsetup";
import PortalStatus from "../../Portal-Status/PortalStatus";
import ScreenshotAssessment from "../ScreenshotAssessment/ScreenshotAssessment";
import KeywordPortal from "../KeywordPortal/KeywordPortal";
import KeywordAssessment from "../KeywordAssessment/KeywordAssessment";

const PortalTabs = () => {
  return (
    <>
      <HabotAppBar />
      <Tab.Container id="dashboard-tabs" defaultActiveKey="Portal-Setup">
        <Row>
          <Nav variant="pills" className="cmd_tabs">
            <Nav.Item>
              <Nav.Link eventKey="Portal-Setup">Portal Setup</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Approval-Activity">
                Approval Activity
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Keyword">
              Sector Selection
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Keyword-Assess">
              Keywords Assessment
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="Portal-Setup">
              <Portalsetup />
            </Tab.Pane>
          </Tab.Content>

          
          <Tab.Content>
            <Tab.Pane eventKey="Approval-Activity">
              <ScreenshotAssessment/>
            </Tab.Pane>
          </Tab.Content>

          <Tab.Content>
            <Tab.Pane eventKey="Keyword">
              <KeywordPortal/>
            </Tab.Pane>
          </Tab.Content>

          <Tab.Content>
            <Tab.Pane eventKey="Keyword-Assess">
              <KeywordAssessment/>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    </>
  );
};

export default PortalTabs;
