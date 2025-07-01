import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';

interface EditTaskModalProps {
  show: boolean;
  onHide: () => void;
  onEdit: (id: string, title: string, description?: string, dueDate?: Date) => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ show, onHide, onEdit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
    }
  }, [task]);

  const handleEdit = () => {
    if (task && title.trim()) {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      onEdit(task.id, title.trim(), description.trim() || undefined, parsedDueDate);
      onHide();
    }
  };

  if (!show || !task) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Tarefa</h5>
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
                placeholder="Digite o título da tarefa"
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
            <div className="mb-3">
              <label className="form-label">Data de Vencimento</label>
              <input 
                type="datetime-local" 
                className="form-control" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)}
              />
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

export default EditTaskModal;
