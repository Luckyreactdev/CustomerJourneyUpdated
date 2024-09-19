import React from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import {
  Button,
  Container,
  Form,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import "./JobDescriptionForm.css";
import { Link } from "react-router-dom";

function JobDescriptionForm() {
  return (
    <div className="screen-cont">
      {/* <HabotAppBar /> */}
      <div className="job-cont cmd_cont">
        <span>Job Description form for Outsourcing</span>
        <table className="customers job_tab">
          <tr>
            <th>Job Title </th>
            <th>Job description</th>
            <th>Required Deliverables</th>
            <th>Skills Required </th>
            <th>Scope of the work</th>
            <th>Budget</th>
            <th>Due Date</th>
          </tr>

          <tr>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
          </tr>
          <tr>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
            <td>data</td>
          </tr>
        </table>
      </div>

      <div className="Track_MD_btn">
        <Button variant="outline-primary" className="close_form mx-2">
          Upload Document
        </Button>
        <Button variant="outline-primary" className="close_form mx-2">
          Submit
        </Button>
      </div>
      {/* <div className="footer-ad">
        <AdminFooter />
      </div> */}
    </div>
  );
}

export default JobDescriptionForm;
