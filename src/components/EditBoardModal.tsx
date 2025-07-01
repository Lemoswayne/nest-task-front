import React, { useState, useEffect } from 'react';
import { Board } from '../types/Board';

interface EditBoardModalProps {
  show: boolean;
  onHide: () => void;
  onEdit: (id: string, title: string, description?: string) => void;
  board: Board | null;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({ show, onHide, onEdit, board }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description || '');
    }
  }, [board]);

  const handleEdit = () => {
    if (board && title.trim()) {
      onEdit(board.id, title.trim(), description.trim() || undefined);
      onHide();
    }
  };

  if (!show || !board) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Board</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Título *</label>
              <input 
                type="text" 
                className="form-control" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Digite o título do board"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea 
                className="form-control" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Digite uma descrição (opcional)"
                rows={3}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Cancelar</button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleEdit}
              disabled={!title.trim()}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;
