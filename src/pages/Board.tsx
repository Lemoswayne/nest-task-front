import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import BoardService from '../services/BoardService';
import TaskService from '../services/TaskService';
import { Board as BoardType } from '../types/Board';
import { Task as TaskType } from '../types/Task';
import Task from '../components/Task';
import CreateBoardModal from '../components/CreateBoardModal';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import EditBoardModal from '../components/EditBoardModal';

const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<BoardType | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    const boardsResponse = await BoardService.getBoards();
    const allTasksResponse = await TaskService.getTasks(); // Fetch all tasks
    const boardsWithTasks = boardsResponse.data.map(board => {
      board.tasks = allTasksResponse.data.filter(task => task.boardId === board.id); // Filter tasks by boardId
      return board;
    });
    setBoards(boardsWithTasks);
  }

  const handleCreateBoard = (title: string, description: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: { sub: string } = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.sub;
      BoardService.createBoard(title, description, userId).then(() => {
        loadBoards();
      });
    }
  };

  const handleEditBoard = (board: BoardType) => {
    BoardService.updateBoard(board).then(() => {
      loadBoards();
    });
  };

  const handleDeleteBoard = (boardId: string) => {
    BoardService.deleteBoard(boardId).then(() => {
      loadBoards();
    });
  };

  const handleCreateTask = (title: string, description: string) => {
    if (selectedBoardId) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: { sub: string } = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.sub;
        TaskService.createTask(selectedBoardId, title, description, userId).then(() => {
          loadBoards();
        });
      }
    }
  };

  const handleEditTask = (task: TaskType) => {
    TaskService.updateTask(task).then(() => {
      loadBoards();
    });
  };

  const handleDeleteTask = (taskId: string) => {
    TaskService.deleteTask(taskId).then(() => {
      loadBoards();
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startBoard = boards.find(board => board.id === source.droppableId);
    const finishBoard = boards.find(board => board.id === destination.droppableId);

    if (startBoard && finishBoard) {
      const startTasks = Array.from(startBoard.tasks);
      const [removed] = startTasks.splice(source.index, 1);

      if (startBoard === finishBoard) {
        startTasks.splice(destination.index, 0, removed);
        const newBoard = { ...startBoard, tasks: startTasks };
        TaskService.updateTask({ ...removed, order: destination.index });
        setBoards(boards.map(board => board.id === newBoard.id ? newBoard : board));
      } else {
        const finishTasks = Array.from(finishBoard.tasks);
        finishTasks.splice(destination.index, 0, removed);
        const newStartBoard = { ...startBoard, tasks: startTasks };
        const newFinishBoard = { ...finishBoard, tasks: finishTasks };
        TaskService.updateTask({ ...removed, boardId: finishBoard.id, order: destination.index });
        setBoards(boards.map(board => {
          if (board.id === newStartBoard.id) {
            return newStartBoard;
          }
          if (board.id === newFinishBoard.id) {
            return newFinishBoard;
          }
          return board;
        }));
      }
    }
  };

  const openCreateTaskModal = (boardId: string) => {
    setSelectedBoardId(boardId);
    setIsTaskModalOpen(true);
  }

  const openEditTaskModal = (task: TaskType) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  }

  const openEditBoardModal = (board: BoardType) => {
    setSelectedBoard(board);
    setIsEditBoardModalOpen(true);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Kanban Board</h2>
          <button className="btn btn-primary" onClick={() => setIsBoardModalOpen(true)}>Create Board</button>
        </div>
        <div className="row">
          {boards.map(board => (
            <div key={board.id} className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-between">{board.title} 
                    <div>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => openEditBoardModal(board)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBoard(board.id)}>Delete</button>
                      <button className="btn btn-primary btn-sm ms-2" onClick={() => openCreateTaskModal(board.id)}>+</button>
                    </div>
                  </h5>
                  <Droppable droppableId={board.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {board.tasks && board.tasks.map((task, index) => (
                          <Task key={task.id} task={task} index={index} onEdit={openEditTaskModal} onDelete={handleDeleteTask} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CreateBoardModal
          isOpen={isBoardModalOpen}
          onClose={() => setIsBoardModalOpen(false)}
          onCreate={handleCreateBoard}
        />
        <EditBoardModal
          isOpen={isEditBoardModalOpen}
          onClose={() => setIsEditBoardModalOpen(false)}
          onSave={handleEditBoard}
          board={selectedBoard}
        />
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onCreate={handleCreateTask}
        />
        <EditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={() => setIsEditTaskModalOpen(false)}
          onSave={handleEditTask}
          task={selectedTask}
        />
      </div>
    </DragDropContext>
  );
};

export default Board;