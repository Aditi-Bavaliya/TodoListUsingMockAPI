// Modal.js
import React,{useState} from 'react';
import './Modal.css';

export default function Modal({ isOpen, task, onClose, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
  if (!isOpen) {
    return null;
  }
  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const confirmDeletion = () => {
    onDelete(task.id);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Details<hr/></h2>
        
        {confirmDelete ? (
          <>
            <p>Are you sure you want to delete "{task.task}"?</p>
            <div className="modal-buttons">
              <button className="modal-delete-button" onClick={confirmDeletion}>Yes</button>
              <button className="modal-cancel-button" onClick={() => {setConfirmDelete(false); onClose();}}>No</button>
            </div>
          </>
        ) : (
            <>
            <p>Task: {task.task}</p>
          <div className="modal-buttons">
            <button className="modal-delete-button" onClick={handleDeleteClick}>Delete</button>
            <button className="modal-cancel-button" onClick={onClose}>Cancel</button>
          </div></>
        )}
      </div>
    </div>
  );
}
