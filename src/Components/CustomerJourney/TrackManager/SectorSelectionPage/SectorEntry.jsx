import React, { useState, useEffect } from "react";
import { Button, FormControl, Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import HabotAppBar from "../../../Habotech/HabotAppBar/HabotAppBar";
import AdminFooter from "../../../Footer/AdminFooter";
import {
  baseURL,
  sectorSelection,
  subSector,
} from "../../../../helpers/endpoints/api_endpoints";
import "./SectorSelectionPage.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ConfirmDelete from "./ConfirmDelete";

function SectorEntry() {
  const [showModal, setShowModal] = useState(false);
  const [showSubSectorModal, setShowSubSectorModal] = useState(false);
  const [sectors, setSectors] = useState([{ name: "" }]);
  const [subSectors, setSubSectors] = useState([""]);
  const [selectedSector, setSelectedSector] = useState("");
  const [getSectors, setGetSectors] = useState([]);
  const [selectedSubSectors, setSelectedSubSectors] = useState([]);
  const [selectedSectorName, setSelectedSectorName] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [sectorToUpdate, setSectorToUpdate] = useState(null);
  const [updatedSectorName, setUpdatedSectorName] = useState("");
  const [subSectorToUpdate, setSubSectorToUpdate] = useState(null);
  const [updatedSubSectorName, setUpdatedSubSectorName] = useState("");
  const [selectedSectorId, setSelectedSectorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editSubSectorId, setEditSubSectorId] = useState(null);
  const [editSubSectorName, setEditSubSectorName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubSectors([""]);
    setSelectedSector("");
  };

  const handleCloseSubSectorModal = () => {
    setShowSubSectorModal(false);
    setSelectedSubSectors([]);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSectorToUpdate(null);
    setUpdatedSectorName("");
  };

  const handleAddSector = () => {
    setSectors([...sectors, { name: "" }]);
  };

  const handleSectorChange = (index, event) => {
    const newSectors = [...sectors];
    newSectors[index] = { ...newSectors[index], name: event.target.value };
    setSectors(newSectors);
  };

  const handleAddSubSector = () => {
    setSubSectors([...subSectors, ""]);
  };

  const handleSubSectorChange = (index, event) => {
    const newSubSectors = [...subSectors];
    newSubSectors[index] = event.target.value;
    setSubSectors(newSubSectors);
  };

  const handleSelectSectorChange = (event) => {
    setSelectedSector(parseInt(event.target.value, 10));
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const sectorRequests = [];

    for (const sector of sectors) {
      const data = { name: sector.name };
      sectorRequests.push(
        axios.post(`${baseURL}${sectorSelection}`, data, { headers })
      );
    }

    try {
      const responses = await Promise.all(sectorRequests);
      toast.success("Sector submitted successfully");
      responses.forEach((response, index) => {
        console.log(`Sector ${index + 1} Response:`, response.data);
      });
      handleCloseModal();
      fetchSectors();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.name &&
        error.response.data.name[0] === "sector with this name already exists."
      ) {
        toast.error("Sector with this name already exists.");
      } else {
        toast.error("Submission Failed");
      }
      console.error("Error adding sector:", error);
    }
  };

  const fetchSectors = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(`${baseURL}${sectorSelection}`, {
        headers,
      });
      setGetSectors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  const handleSubmitSubSector = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const subSectorRequests = [];
    for (const subSectorName of subSectors) {
      const data = {
        sector: selectedSector,
        name: subSectorName,
      };
      subSectorRequests.push(
        axios.post(`${baseURL}${subSector}`, data, { headers })
      );
    }

    try {
      const responses = await Promise.all(subSectorRequests);
      toast.success("All sub-sectors submitted successfully");
      responses.forEach((response, index) => {
        console.log(`Sub Sector ${index + 1} Response:`, response.data);
      });

      setSubSectors([""]);
      handleCloseModal();
    } catch (error) {
      toast.error("Submission Failed");
      console.error("Error adding sub-sectors:", error);
    }
  };

  const handleViewSubSectors = (subSectors, sectorId, sectorName) => {
    console.log("Sub Sectors:", subSectors);
    setSelectedSubSectors(subSectors);
    setSelectedSectorId(sectorId);
    setSelectedSectorName(sectorName);
    setShowSubSectorModal(true);
  };

  const confirmDeleteSector = (sectorId) => {
    setConfirmAction(() => () => handleDeleteSector(sectorId));
    setShowConfirmModal(true);
  };

  const handleDeleteSector = async (sectorId) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.delete(`${baseURL}${sectorSelection}${sectorId}/`, {
        headers,
      });
      toast.success("Sector deleted successfully");
      fetchSectors();
    } catch (error) {
      toast.error("Deletion Failed");
      console.error("Error deleting sector:", error);
    }
  };

  const handleUpdateSector = (sector) => {
    setSectorToUpdate(sector);
    setUpdatedSectorName(sector.name);
    setShowUpdateModal(true);
  };

  const handleSubmitUpdateSector = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = { name: updatedSectorName };

    try {
      await axios.put(
        `${baseURL}${sectorSelection}${sectorToUpdate.id}/`,
        data,
        { headers }
      );
      toast.success("Sector updated successfully");
      handleCloseUpdateModal();
      fetchSectors();
    } catch (error) {
      toast.error("Update Failed");
      console.error("Error updating sector:", error);
    }
  };

  const confirmDeleteSubSector = (subSectorId) => {
    setConfirmAction(() => () => handleDeleteSubSector(subSectorId));
    setShowConfirmModal(true);
  };

  const handleUpdateSubSector = (subSector) => {
    setSubSectorToUpdate(subSector);
    setUpdatedSubSectorName(subSector.name);
    setShowUpdateModal(true);
  };

  const handleSubmitUpdateSubSector = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      name: updatedSubSectorName,
      sector: selectedSectorId,
    };

    console.log("Updating sub-sector:", {
      name: updatedSubSectorName,
      sector: selectedSectorId,
    });

    try {
      await axios.put(`${baseURL}${subSector}${subSectorToUpdate.id}/`, data, {
        headers,
      });
      toast.success("Sub-sector updated successfully");
      handleCloseUpdateModal();
      fetchSectors();
    } catch (error) {
      toast.error("Update Failed");
      console.error("Error updating sub-sector:", error);
    }
  };

  const handleDeleteSubSector = async (subSectorId) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.delete(`${baseURL}${subSector}${subSectorId}/`, { headers });
      toast.success("Sub-sector deleted successfully");
      fetchSectors();
    } catch (error) {
      toast.error("Deletion Failed");
      console.error("Error deleting sub-sector:", error);
    }
  };

  const filterSectors = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.get(
        `https://customer-journey-19042024.uc.r.appspot.com/dashboards/sectors/?search=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers,
        }
      );
      setGetSectors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error filtering sectors:", error);
    }
  };

  useEffect(() => {
    filterSectors();
  }, [searchQuery]);

  const handleEditSubSector = (subSector) => {
    setEditSubSectorId(subSector.id);
    setEditSubSectorName(subSector.name);
  };

  const handleSaveSubSector = async (subSectorId) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Token ${accessToken}`,
      "Content-Type": "application/json",
    };

    const data = {
      name: editSubSectorName,
      sector: selectedSectorId,
    };

    try {
      await axios.put(`${baseURL}${subSector}${subSectorId}/`, data, {
        headers,
      });
      toast.success("Sub-sector updated successfully");
      setEditSubSectorId(null);
      setEditSubSectorName("");
      fetchSectors();
    } catch (error) {
      toast.error("Update Failed");
      console.error("Error updating sub-sector:", error);
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    handleCloseConfirmModal();
  };

  return (
    <div className="screen-cont">
      <HabotAppBar />
      <div className="mt-3 job-cont">
        <div>
          <Row>
            <Col md={4} className="mx-3">
              <span className="sub_title_form">Add Sector and Sub-Sectors</span>

              <FormControl
                type="text"
                placeholder="Search Sectors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="my-3"
              />
            </Col>
            <Col md={3}></Col>
            <Col md={4} className="d-flex justify-content-end">
              <Button
                className="mt-2 btn-sect"
                variant="primary"
                onClick={handleShowModal}
              >
                ADD{" "}
              </Button>
            </Col>
          </Row>
        </div>

        <table className="customers job_tab">
          <thead>
            <tr>
              <td>
                <b>Id</b>
              </td>
              <td>
                <b>Sector List</b>
              </td>
              <td>
                <b>Action</b>
              </td>
            </tr>
          </thead>
          <tbody>
            {getSectors.map((sector, index) => (
              <tr key={index}>
                <td>{sector.id}</td>
                <td>{sector.name}</td>
                <td>
                  <Button
                    className="job_accept mx-2 status-btn"
                    onClick={() =>
                      handleViewSubSectors(
                        sector.sub_sectors,
                        sector.id,
                        sector.name
                      )
                    }
                  >
                    View Sub Sector
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => handleUpdateSector(sector)}
                  >
                    Update
                  </Button>{" "}
                  &nbsp;
                  <Button
                    variant="danger"
                    onClick={() => confirmDeleteSector(sector.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="footer-ad">
        <AdminFooter />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Sectors and Sub Sectors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Add Sectors</h5>
          {sectors.map((sector, index) => (
            <div key={index} className="d-flex align-items-center my-2">
              <FormControl
                type="text"
                value={sector.name}
                onChange={(event) => handleSectorChange(index, event)}
                placeholder={`Sector ${index + 1}`}
              />
              {index === sectors.length - 1 && (
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleAddSector}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </Button>
              )}
            </div>
          ))}
          <Button variant="primary" onClick={handleSubmit}>
            Add Sector
          </Button>
          <div className="d-flex justify-content-center align-items-center fs-6 text">
            Or
          </div>
          <h5>Add Sub Sectors</h5>
          <Form.Group>
            <select
              className="form-select action-dropdown-sector"
              value={selectedSector}
              onChange={handleSelectSectorChange}
            >
              <option value="">Select Sector</option>
              {getSectors.map((sector, index) => (
                <option key={index} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
          </Form.Group>
          {subSectors.map((subSector, index) => (
            <div key={index} className="d-flex align-items-center my-2">
              <FormControl
                type="text"
                value={subSector}
                onChange={(event) => handleSubSectorChange(index, event)}
                placeholder={`Sub Sector ${index + 1}`}
              />
              {index === subSectors.length - 1 && (
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={handleAddSubSector}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </Button>
              )}
            </div>
          ))}
          <Button variant="primary" onClick={handleSubmitSubSector}>
            Add Sub-Sector
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSubSectorModal} onHide={handleCloseSubSectorModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Sub Sectors for <b>{selectedSectorName}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubSectors.length > 0 ? (
            <table className="customers job_tab">
              <thead>
                <tr>
                  <th>Sub Sector Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedSubSectors.map((subSector) => (
                  <tr key={subSector.id}>
                    <td>
                      {editSubSectorId === subSector.id ? (
                        <FormControl
                          type="text"
                          value={editSubSectorName}
                          onChange={(e) => setEditSubSectorName(e.target.value)}
                        />
                      ) : (
                        subSector.name
                      )}
                    </td>
                    <td>
                      {editSubSectorId === subSector.id ? (
                        <>
                          <Button
                            variant="success"
                            onClick={() => handleSaveSubSector(subSector.id)}
                          >
                            Save
                          </Button>{" "}
                          &nbsp;
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEditSubSectorId(null);
                              setEditSubSectorName("");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => handleEditSubSector(subSector)}
                          >
                            Edit
                          </Button>{" "}
                          &nbsp;
                          <Button
                            variant="danger"
                            onClick={() => confirmDeleteSubSector(subSector.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No sub sectors available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSubSectorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {subSectorToUpdate ? "Update Sub Sector" : "Update Sector"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            type="text"
            placeholder={
              subSectorToUpdate ? "New Sub Sector Name" : "New Sector Name"
            }
            value={subSectorToUpdate ? updatedSubSectorName : updatedSectorName}
            onChange={(e) =>
              subSectorToUpdate
                ? setUpdatedSubSectorName(e.target.value)
                : setUpdatedSectorName(e.target.value)
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              subSectorToUpdate
                ? handleSubmitUpdateSubSector
                : handleSubmitUpdateSector
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDelete
        show={showConfirmModal}
        handleClose={handleCloseConfirmModal}
        handleConfirm={handleConfirmAction}
        message="Are you sure you want to delete this item?"
      />
    </div>
  );
}

export default SectorEntry;
