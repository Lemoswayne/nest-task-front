import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import BoardService from '../services/BoardService';
import TaskService from '../services/TaskService';
import { Board as BoardType } from '../types/Board';
import { Task } from '../types/Task';
import CreateBoardModal from '../components/CreateBoardModal';
import CreateTaskModal from '../components/CreateTaskModal';
import EditBoardModal from '../components/EditBoardModal';
import EditTaskModal from '../components/EditTaskModal';
import TaskComponent from '../components/Task';

const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<BoardType | null>(null);
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditBoardModal, setShowEditBoardModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token no Board:', token);
    
    if (!token) {
      console.log('Token não encontrado, redirecionando para login');
      navigate('/login');
      return;
    }
    
    console.log('Token encontrado, carregando dados');
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [boardsResponse, tasksResponse] = await Promise.all([
        BoardService.findAll(),
        TaskService.findAll(),
      ]);
      console.log('Boards carregados:', boardsResponse.data);
      console.log('Tasks carregadas:', tasksResponse.data);
      setBoards(boardsResponse.data);
      setTasks(tasksResponse.data);
    } catch (error: any) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateBoard = async (title: string, description?: string) => {
    try {
      const response = await BoardService.create(title, description);
      setBoards([...boards, response.data]);
      setShowCreateBoardModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleCreateTask = async (title: string, description?: string, dueDate?: Date) => {
    if (!selectedBoard) return;
    
    try {
      console.log('Criando tarefa:', { title, boardId: selectedBoard.id, status: 'TODO' });
      const response = await TaskService.create(
        title,
        selectedBoard.id,
        description,
        'TODO',
        tasks.filter(t => t.boardId === selectedBoard.id).length,
        dueDate
      );
      console.log('Tarefa criada:', response.data);
      setTasks([...tasks, response.data]);
      setShowCreateTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditBoard = async (id: string, title: string, description?: string) => {
    try {
      const response = await BoardService.update(id, title, description);
      setBoards(boards.map(board => board.id === id ? response.data : board));
      setShowEditBoardModal(false);
      setSelectedBoard(null);
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  const handleEditTask = async (id: string, title: string, description?: string, dueDate?: Date) => {
    try {
      const response = await TaskService.update(id, { title, description, dueDate });
      setTasks(tasks.map(task => task.id === id ? response.data : task));
      setShowEditTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteBoard = async (id: string) => {
    try {
      await BoardService.remove(id);
      setBoards(boards.filter(board => board.id !== id));
      setTasks(tasks.filter(task => task.boardId !== id));
      if (selectedBoard?.id === id) {
        setSelectedBoard(null);
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await TaskService.remove(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Extrair boardId e status dos IDs dos droppables
    // O formato é: {boardId}::{status}
    const sourceParts = source.droppableId.split('::');
    const destParts = destination.droppableId.split('::');
    
    if (sourceParts.length !== 2 || destParts.length !== 2) {
      console.error('Invalid droppable ID format:', { source: source.droppableId, destination: destination.droppableId });
      return;
    }
    
    const sourceBoardId = sourceParts[0];
    const sourceStatus = sourceParts[1];
    const destBoardId = destParts[0];
    const destStatus = destParts[1];
    
    console.log('Drag end:', {
      source: { boardId: sourceBoardId, status: sourceStatus, index: source.index },
      destination: { boardId: destBoardId, status: destStatus, index: destination.index },
      draggableId,
      sourceDroppableId: source.droppableId,
      destDroppableId: destination.droppableId
    });
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const columnTasks = tasks.filter(task => 
        task.boardId === sourceBoardId && task.status === sourceStatus
      );
      const reorderedTasks = Array.from(columnTasks);
      const [removed] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, removed);

      // Update order for all tasks in the column
      const updatedTasks = tasks.map(task => {
        if (task.boardId === sourceBoardId && task.status === sourceStatus) {
          const reorderedTask = reorderedTasks.find(t => t.id === task.id);
          return reorderedTask ? { ...task, order: reorderedTasks.indexOf(reorderedTask) } : task;
        }
        return task;
      });

      setTasks(updatedTasks);

      // Update order in backend
      try {
        await TaskService.updateOrder(draggableId, destination.index);
      } catch (error) {
        console.error('Error updating task order:', error);
      }
    } else {
      // Moving to a different column
      const task = tasks.find(t => t.id === draggableId);
      if (!task) return;

      const updatedTask = { 
        ...task, 
        boardId: destBoardId, 
        status: destStatus,
        order: destination.index
      };
      const updatedTasks = tasks.map(t => t.id === draggableId ? updatedTask : t);
      setTasks(updatedTasks);

      // Update status in backend
      try {
        await TaskService.updateStatus(draggableId, destStatus);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const getTasksByBoard = (boardId: string) => {
    return tasks
      .filter(task => task.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  };

  const getTasksByBoardAndStatus = (boardId: string, status: string) => {
    return tasks
      .filter(task => task.boardId === boardId && task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  const statusColumns = ['TODO', 'IN_PROGRESS', 'DONE'];

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => setShowCreateBoardModal(true)}
              >
                Criar Board
              </button>
              <button className="btn btn-outline-secondary" onClick={handleLogout}>
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {boards.length === 0 ? (
        <div className="text-center mt-5">
          <h3>Nenhum board encontrado</h3>
          <p>Crie seu primeiro board para começar!</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateBoardModal(true)}
          >
            Criar Board
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="row">
            {boards.map((board) => (
              <div key={board.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{board.title}</h5>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => {
                          setSelectedBoard(board);
                          setShowCreateTaskModal(true);
                        }}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => {
                          setSelectedBoard(board);
                          setShowEditBoardModal(true);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBoard(board.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    {board.description && (
                      <p className="text-muted small mb-3">{board.description}</p>
                    )}
                    
                    {statusColumns.map((status) => (
                      <div key={status} className="mb-3">
                        <h6 className="text-muted">{status}</h6>
                        <Droppable droppableId={`${board.id}::${status}`}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="min-height-100"
                            >
                              {getTasksByBoardAndStatus(board.id, status)
                                .map((task, index) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <TaskComponent
                                          task={task}
                                          onEdit={(task) => {
                                            setEditingTask(task);
                                            setShowEditTaskModal(true);
                                          }}
                                          onDelete={() => handleDeleteTask(task.id)}
                                          onToggleComplete={async (completed) => {
                                            try {
                                              // Atualizar o status baseado no completed
                                              const newStatus = completed ? 'DONE' : 'TODO';
                                              await TaskService.updateStatus(task.id, newStatus);
                                              
                                              // Atualizar localmente
                                              setTasks(tasks.map(t => 
                                                t.id === task.id ? { ...t, completed, status: newStatus } : t
                                              ));
                                            } catch (error) {
                                              console.error('Error toggling task completion:', error);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modals */}
      <CreateBoardModal
        show={showCreateBoardModal}
        onHide={() => setShowCreateBoardModal(false)}
        onCreate={handleCreateBoard}
      />

      <CreateTaskModal
        show={showCreateTaskModal}
        onHide={() => setShowCreateTaskModal(false)}
        onCreate={handleCreateTask}
        boardTitle={selectedBoard?.title || ''}
      />

      <EditBoardModal
        show={showEditBoardModal}
        onHide={() => setShowEditBoardModal(false)}
        onEdit={handleEditBoard}
        board={selectedBoard}
      />

      <EditTaskModal
        show={showEditTaskModal}
        onHide={() => setShowEditTaskModal(false)}
        onEdit={handleEditTask}
        task={editingTask}
      />
    </div>
  );
};

export default Board;