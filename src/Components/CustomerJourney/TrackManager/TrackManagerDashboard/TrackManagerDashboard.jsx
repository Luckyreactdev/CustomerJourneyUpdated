import React, { useState, useEffect } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import "./TrackManagerDashboard.css";
import { Button, Tab, Nav, Col, Row, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AdminFooter from "../../../Footer/AdminFooter";
import axios from "axios";
import {
  baseURL,
  taskDashboard,
} from "../../../../helpers/endpoints/api_endpoints";
import MasterDashboard from "./MasterDashboard";
import GoogleAnalytcis from "./GoogleAnalytcis";
import TrackSales from "./TrackSales";
import TrackEmail from "./TrackEmail";
import TrackWhatsApp from "./TrackWhatsApp";

function TrackManagerDashboard() {
  return (
    <div className="screen-cont">
      <HabotAppBar />
      <Tab.Container id="dashboard-tabs" defaultActiveKey="job">
        <Row>
          <Nav variant="pills" className="cmd_tabs">
            {/* <Nav.Item>
              <Nav.Link eventKey="master-dashboard">Master Dashboard</Nav.Link>
            </Nav.Item> */}
            <Nav.Item>
              <Nav.Link eventKey="job">Google Analytics</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="task-assignment">Email</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sector-selection">WhatsApp</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sales">Sales</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* <Tab.Pane eventKey="master-dashboard">
            <MasterDashboard/>
            </Tab.Pane> */}
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="job">
             <GoogleAnalytcis/>
            </Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="task-assignment">
              <TrackEmail/>
            </Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="sector-selection">
              <TrackWhatsApp/>
            </Tab.Pane>
          </Tab.Content>

          <Tab.Content>
            <Tab.Pane eventKey="sales">
             <TrackSales/>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default TrackManagerDashboard;
