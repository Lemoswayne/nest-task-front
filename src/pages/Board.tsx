import React, { useEffect, useState } from 'react';
import BoardService from '../services/BoardService';
import TaskService from '../services/TaskService';
import { Board as BoardType } from '../types/Board';
import { Task as TaskType } from '../types/Task';
import Task from '../components/Task';
import CreateBoardModal from '../components/CreateBoardModal';

const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = () => {
    BoardService.getBoards().then(response => {
      const boardsWithTasks = response.data.map(board => {
        TaskService.getTasks(board.id).then(taskResponse => {
          board.tasks = taskResponse.data;
        });
        return board;
      });
      setBoards(boardsWithTasks);
    });
  }

  const handleCreateBoard = (title: string, description: string) => {
    BoardService.createBoard(title, description).then(() => {
      loadBoards();
    });
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kanban Board</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Board</button>
      </div>
      <div className="row">
        {boards.map(board => (
          <div key={board.id} className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{board.title}</h5>
                <div>
                  {board.tasks && board.tasks.map(task => (
                    <Task key={task.id} task={task} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBoard}
      />
    </div>
  );
};

export default Board;