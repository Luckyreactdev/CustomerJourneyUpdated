import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import {
  baseURL,
  accountProfile,
  portalNotifications,
  portaltask,
  tasksubmission,
  sectors,
  csvfileupload,
} from "../../../../helpers/endpoints/api_endpoints";
import { toast } from "react-toastify";
import "./Seomanager.css";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
function Seomanager() {
  const [userId, setUserId] = useState(null);
  const [sectordata, setsectordata] = useState([]);
  const [modal, setmodal] = useState(false);
  const [screenshotvalue, setScreenshotvalue] = useState(null);
  const [buttonstate, setbuttonstate] = useState("");
  const [loader, setloader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPageUrls, setPrevPageUrls] = useState({});
  const [nextPageUrls, setNextPageUrls] = useState({});
  const [tasksubmission, setTaskSubmissions] = useState([]);
  const [payloaddata, setpayloaddata] = useState({
    sectorname: "",
    portalid: null,
    sectorid: null,
  });

  const location = useLocation();
  const savedUserInfo = useSelector((state) => state.account.savedUserData);

  const fetchlistsectors = async (
    url = `${baseURL}${sectors}?assignee=${savedUserInfo.user_profile.user.id}&page=${currentPage}`
  ) => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const sectorsResponse = await axios.get(url, { headers });

      const filesUrl = `${baseURL}/keyword-research/keyword-files/?assignee=${savedUserInfo.user_profile.user.id}&page=${currentPage}`;
      const filesResponse = await axios.get(filesUrl, { headers });

      const sectorFileMap = new Map(
        filesResponse.data.results.map((file) => [file.sector_info.id, file])
      );

      const combinedData = sectorsResponse.data.results.map((sector) => {
        const matchingFile = sectorFileMap.get(sector.id);
        return {
          ...sector,
          submittedFile: matchingFile ? matchingFile.file : null,
          fileStatus: matchingFile ? matchingFile.status : null,
        };
      });

      const sortedData = combinedData.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setloader(false);
      setsectordata(sortedData);
      setNextPageUrls(sectorsResponse.data.next);
      setPrevPageUrls(sectorsResponse.data.previous);

      console.log("Sorted combined data:", sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setloader(false);
    }
  };

  useEffect(() => {
    fetchlistsectors();
  }, []);

  const patchsectorapproval = async (
    approveid,
    portalid,
    assigneedid,
    sectorname
  ) => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };

      const Acknowledegeddateandtime = new Date();

      const patchBody = {
        name: sectorname,
        portal: portalid,
        assignee: assigneedid,
        is_acknowledged: true,
        acknowledged_at: Acknowledegeddateandtime,
      };
      const response = await axios.patch(
        `${baseURL}${sectors}${approveid}/`,
        patchBody,
        {
          headers,
        }
      );
      toast.success("Acknowledged");
      await fetchlistsectors();
      setloader(false);
    } catch (error) {
      console.log(error);
      toast.error("Acknowledgement Failed");
      setloader(false);
    }
  };

  const modalopen = () => {
    setmodal((prev) => !prev);
  };

  const csvupload = async () => {
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${accessToken}`,
        },
      };
      const csvbody = {
        file: screenshotvalue,
        sector: payloaddata.sectorid,
      };
      const response = await axios.post(
        `${baseURL}${csvfileupload}`,
        csvbody,
        config
      );
      setmodal(false);
      toast.success("file Submitted Successfully");
      await fetchlistsectors();
      setloader(false);
    } catch (error) {
      console.log(error);
      toast.error("file Submit failed");
      setloader(false);
    }
    console.log(screenshotvalue);
  };

  return (
    <>
      <HabotAppBar />
      <Modal show={modal}>
        <Modal.Header closeButton={modalopen}>
          <Modal.Title>Upload CSV file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="feedback">
              <Form.Label>Upload CSV file</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setScreenshotvalue(e.target.files[0])}
                placeholder="Enter feedback"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalopen}>
            Close
          </Button>
          <Button variant="primary" onClick={csvupload}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="portalstatusdiv">
        {loader && <div class="loader"></div>}

        <Container>
          <h1>SEO Keyword Managment </h1>
          <Table className="mt-4">
            <thead>
              <tr>
                <th>Sector Name</th>
                <th>Portal id</th>
                <th>Task Created</th>
                <th>Acknowledge Date & Time</th>
                <th>Status</th>
                <th>File</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sectordata.length > 0 ? (
                sectordata.map((sectors) => (
                  <tr key={sectors.id}>
                    <td>{sectors.name}</td>
                    <td>{sectors?.portal}</td>
                    <td>
                      <p>
                        {new Date(sectors?.created_at).toLocaleDateString()}
                      </p>
                      <p>
                        {new Date(sectors?.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td>
                      <p>
                        {sectors.acknowledged_at ? (
                          <>
                            <p>
                              {new Date(
                                sectors.acknowledged_at
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              {new Date(
                                sectors.acknowledged_at
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </>
                        ) : (
                          "-"
                        )}
                      </p>
                    </td>
                    <td>{sectors.fileStatus}</td>
                    <td>
                      <a
                        href={sectors.submittedFile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {sectors.submittedFile ? "view" : "N/A"}
                      </a>
                    </td>
                    <td className="actionbuttons">
                      {sectors.is_acknowledged ? (
                        <Button
                          class="button"
                          variant="outline-primary"
                          disabled={sectors.submittedFile}
                          onClick={() => {
                            {
                              modalopen();
                              setpayloaddata({
                                ...payloaddata,
                                portalid: parseInt(sectors.portal),
                                sectorname: sectors.name,
                                sectorid: parseInt(sectors.id),
                              });
                              console.log(sectors.portal);
                            }
                          }}
                        >
                          {!sectors.submittedFile && "Upload File"}
                          {sectors.submittedFile && " Submitted"}
                        </Button>
                      ) : (
                        <Button
                          class="button"
                          variant="outline-primary"
                          onClick={() =>
                            patchsectorapproval(
                              sectors.id,
                              sectors.portal,
                              savedUserInfo.user_profile.user.id,
                              sectors.name
                            )
                          }
                        >
                          Accept
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="emptyrow">
                  <td colSpan="5">No TASK available</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>

        <div className="paginationdiv">
          {prevPageUrls && (
            <Button
              variant="outline-primary"
              onClick={() => fetchlistsectors(prevPageUrls)}
            >
              Previous
            </Button>
          )}
          {nextPageUrls && (
            <Button
              variant="outline-primary"
              onClick={() => fetchlistsectors(nextPageUrls)}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Seomanager;
