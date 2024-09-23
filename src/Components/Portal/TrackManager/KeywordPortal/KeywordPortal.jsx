import React, { useEffect, useState } from "react";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import "./KeywordPortal.css";
import { Button, Tab, Nav, Col, Row, Form, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../helpers/axios/axios";
import {
  activityexecutors,
  baseURL,
  contentmanager,
  portallist,
  sectors,
  seomanagers,
} from "../../../../helpers/endpoints/api_endpoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useTrackmanager } from "../../../../Hooks/TrackManager";

const KeywordPortal = () => {
  const [sectorname, setsectorname] = useState("");
  const navigate = useNavigate();
  const [executorsname, setExecutors] = useState([]);
  const [formData, setFormData] = useState({
    Assigneeemail: "",
    Assigneeid: null,
    AssigneeName: "",
    portavalue: null,
  });
  const [portalid, setportalid] = useState([]);
  const [loader, setloader] = useState(false);

  const trackmanager = useTrackmanager();

  useEffect(() => {
    const fetchactivityexecutor = async () => {
      try {
        setloader(true);
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${seomanagers}`, {
          headers,
        });
        setExecutors(response.data.results);
        setloader(false);
        console.log("contentmanager", response);
      } catch (error) {
        console.log(error);
        setloader(false);
      }
    };

    const fetchportal = async () => {
      try {
        setloader(true);
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Token ${accessToken}`,
          "Content-Type": "application/json",
        };
        const response = await axios.get(`${baseURL}${portallist}`, {
          headers,
        });
        setportalid(response.data.results);
        setloader(false);
        console.log("list of portals", portalid);
      } catch (error) {
        console.log(error);
        setloader(false);
      }
    };
    fetchactivityexecutor();
    fetchportal();
  }, [trackmanager]);

  const handlesectorcreation = async (e) => {
    e.preventDefault();
    try {
      setloader(true);
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Token ${accessToken}`,
        "Content-Type": "application/json",
      };
      const sectorbody = {
        name: sectorname,
        portal: formData.portavalue,
        assignee: formData.Assigneeid,
      };
      const response = await axios.post(`${baseURL}${sectors}`, sectorbody, {
        headers,
      });
      console.log("seectorresponse", response);
      setloader(false);

      toast.success("Created sector successfully ");
    } catch (error) {
      console.log(error);
      setloader(false);
      toast.error("Error creating sector");
    }
  };

  return (
    <>
      <div className="container_form  container_form">
        <span className="sub_title_form">Sector Selection</span>
        <div className="form_page">
          <div className="form_page_sub">
            {loader && <div class="loader"></div>}
            <Container>
              <Form onSubmit={handlesectorcreation}>
                <Row className="form-field-TM mt-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Sector name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter sector name"
                        name="portalName"
                        value={sectorname}
                        onChange={(e) => setsectorname(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Group>
                        <Form.Label>Select Portal</Form.Label>
                        <Form.Select
                          className="action_drop"
                          value={formData.portavalue || ""}
                          name="sub_sector"
                          onChange={(e) => {
                            const selectedOption =
                              e.target.options[e.target.selectedIndex];
                            const selectedId = parseInt(selectedOption.value);
                            const selectedExecutor = portalid.find(
                              (portal) => portal.id === selectedId
                            );

                            if (selectedExecutor) {
                              setFormData({
                                ...formData,
                                portavalue: selectedId,
                              });
                            }
                          }}
                        >
                          <option value="">Select Portal</option>
                          {portalid.map((names) => (
                            <option key={names.id} value={names.id}>
                              {names.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Label>Content Manager</Form.Label>
                      <Form.Select
                        className="action_drop"
                        value={formData.Assigneeid || ""}
                        name="sub_sector"
                        onChange={(e) => {
                          const selectedOption =
                            e.target.options[e.target.selectedIndex];
                          const selectedId = parseInt(selectedOption.value);
                          const selectedExecutor = executorsname.find(
                            (executor) => executor.id === selectedId
                          );

                          if (selectedExecutor) {
                            setFormData({
                              ...formData,
                              Assigneeemail: selectedExecutor.email,
                              Assigneeid: selectedId,
                              AssigneeName:
                                selectedExecutor.profile_info.full_name,
                            });
                          }
                        }}
                      >
                        <option value="">Select SEO manager</option>
                        {executorsname.map((names) => (
                          <option key={names.id} value={names.id}>
                            {names.email}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Button variant="primary" type="submit" className="mt-3">
                        Submit
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordPortal;
