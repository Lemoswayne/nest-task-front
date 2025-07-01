import React from 'react';
import { Task as TaskType } from '../types/Task';

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: () => void;
  onToggleComplete: (completed: boolean) => void;
}

const TaskComponent: React.FC<TaskProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <h6 className="card-title mb-1">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={(e) => onToggleComplete(e.target.checked)}
              />
              <span className={task.completed ? 'text-decoration-line-through' : ''}>
                {task.title}
              </span>
            </h6>
            {task.description && (
              <p className="card-text small text-muted mb-1">{task.description}</p>
            )}
            {task.dueDate && (
              <small className="text-muted">
                Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
              </small>
            )}
          </div>
          <div className="btn-group btn-group-sm">
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => onEdit(task)}
              title="Editar"
            >
              ✏️
            </button>
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={onDelete}
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;
