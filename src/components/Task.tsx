import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task as TaskType } from '../types/Task';

interface TaskProps {
  task: TaskType;
  index: number;
  onEdit: (task: TaskType) => void;
  onDelete: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="card mb-2"
        >
          <div className="card-body">
            <h5 className="card-title d-flex justify-content-between">{task.title}
              <div>
                <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(task)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
              </div>
            </h5>
            <p className="card-text">{task.description}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
