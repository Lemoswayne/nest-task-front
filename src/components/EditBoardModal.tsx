import React, { useState, useEffect } from 'react';
import { Board } from '../types/Board';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (board: Board) => void;
  board: Board | null;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({ isOpen, onClose, onSave, board }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description);
    }
  }, [board]);

  const handleSave = () => {
    if (board) {
      onSave({ ...board, title, description });
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Board</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;
