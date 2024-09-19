import React, { useState, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import AdminFooter from "../../../Footer/AdminFooter";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { Container, Table, Button } from "react-bootstrap";
import {
  baseURL,
  campaignKeywordFile,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";

function CampaignKeywordFile() {
  const [keywordFiles, setKeywordFiles] = useState([]);
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState([]);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseURL}${campaignKeywordFile}`, { headers })
      .then((response) => {
        const files = response.data.results;
        setKeywordFiles(files);
        // Extract file names
        const names = files.map((file) => {
          const url = new URL(file.file);
          return url.pathname.split('/').pop();
        });
        setFileNames(names);
      })
      .catch((error) => {
        console.error("Error fetching task details:", error);
        toast.error("Failed to fetch task details");
      });
  }, []);

  const handleButtonClick = (id) => {
    navigate(`/campaign-initiation/${id}`);
  };

  const handleDownloadFile = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div>
      <HabotAppBar />
      <div>
        <Container>
          <div className="job-cont cmd_table">
            <Table className="customers job_tab mt-4">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {keywordFiles.map((file, index) => (
                  <tr key={file.id}>
                    <td>
                      <Link
                        variant="outline-primary"
                        className="close_form mx-2"
                        onClick={() => handleDownloadFile(file.file)}
                      >
                        {fileNames[index]}
                      </Link>
                    </td>
                    <td>
                      <Button variant="outline-primary" className="close_form mx-2" onClick={() => handleButtonClick(file.id)}>
                      Initiate the Campaign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>

      <div className="footer-ad">
        <AdminFooter />
      </div>
    </div>
  );
}

export default CampaignKeywordFile;
