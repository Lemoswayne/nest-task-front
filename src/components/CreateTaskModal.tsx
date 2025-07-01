import React, { useState } from 'react';

interface CreateTaskModalProps {
  show: boolean;
  onHide: () => void;
  onCreate: (title: string, description?: string, dueDate?: Date) => void;
  boardTitle: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ show, onHide, onCreate, boardTitle }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = () => {
    if (title.trim()) {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      onCreate(title.trim(), description.trim() || undefined, parsedDueDate);
      setTitle('');
      setDescription('');
      setDueDate('');
      onHide();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Criar Tarefa - {boardTitle}</h5>
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
              onClick={handleCreate}
              disabled={!title.trim()}
            >
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
