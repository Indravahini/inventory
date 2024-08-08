// StockDetailsModal.js

import React from 'react';
import Modal from 'react-modal';

const StockDetailsModal = ({ isOpen, onRequestClose, details }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Stock Details"
    >
      <h2>Stock Details</h2>
      <button onClick={onRequestClose}>Close</button>
      {details ? (
        <div>
          <p><strong>Student ID:</strong> {details.student_id}</p>
          <p><strong>Student Name:</strong> {details.student_name}</p>
          <p><strong>Quantity:</strong> {details.Quantity}</p>
        </div>
      ) : (
        <p>No details available</p>
      )}
    </Modal>
  );
};

export default StockDetailsModal;
