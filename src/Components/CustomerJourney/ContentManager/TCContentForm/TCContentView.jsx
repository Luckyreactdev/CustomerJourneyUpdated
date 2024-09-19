import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function TCContentView({ showKeywordModal, handleCloseModal, selectedCampaign }) {
  return (
    <Modal show={showKeywordModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Extracted Keywords</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedCampaign && selectedCampaign.extracted_keywords_info && selectedCampaign.extracted_keywords_info.length > 0 ? (
          <ul>
            {selectedCampaign.extracted_keywords_info.map((keyword) => (
              <li key={keyword.id}>
                {keyword.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No keywords available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TCContentView;
