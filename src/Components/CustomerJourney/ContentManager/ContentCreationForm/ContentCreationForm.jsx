import React, { useState, useEffect } from "react";
import axios from "axios";
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
import "./ContentCreationForm.css";
import { Link } from "react-router-dom";
import {
  dashboardContent,
  baseURL,accountProfile,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import { useParams } from "react-router";


function ContentCreationForm() {
  const { id } = useParams();
console.log(id)
  const [file, setFile] = useState(null);
  const [userList, setUserList] = useState(null);  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${accountProfile}`, { headers });
        setUserList(response.data);
          setUserId(response.data.id);
          console.log(response.data.id)
        console.log("User List:", response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUserList();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAssignTask = async () => {
    if (!file) {
      toast.error("Please upload a file before submitting");
      return;
    }

    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "multipart/form-data",
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("created_by", userId); 
      formData.append("track_campaign_task", id); 
      
      const formDataObject = {};

      formData.forEach((value, key) => {
          formDataObject[key] = value;
      });
      
      console.log(file)
      console.log(JSON.stringify(formDataObject, null, 2));

      console.log(id)
      const response = await axios.post(
        `${baseURL}${dashboardContent}`,
        formData,
        { headers }
      );

      toast.success("Submitted Successfully");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Error submitting the form. Please try again.");
    }
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="job-cont cmd_cont">
        <span>Content Creation Form</span>

        <table className="customers job_tab">
          <thead>
            <tr>
              <th>Name of the Sector</th>
              <th>Name of the Station</th>
              <th>Station ID</th>
              <th>Description</th>
              <th>Compliance Checks</th>
              <th>View Keywords</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>
                <Link to="#">View</Link>
              </td>
            </tr>
            <tr>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>data</td>
              <td>
                <Link to="#">View</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="Track_MD_btn">
        <input type="file" onChange={handleFileChange} />
        <Button
          variant="outline-primary"
          className="close_form mx-2"
          onClick={handleAssignTask}
        >
          Submit
        </Button>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default ContentCreationForm;
