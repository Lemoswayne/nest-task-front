import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/tasks/';

class TaskService {
  getTasks() {
    return axios.get<Task[]>(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  createTask(boardId: string, title: string, description: string, userId: string) {
    return axios.post<Task>(API_URL, { boardId, title, description, userId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  updateTask(task: Task) {
    return axios.patch<Task>(`${API_URL}${task.id}`, task, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  deleteTask(taskId: string) {
    return axios.delete(`${API_URL}${taskId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  // Add other task methods here
}

export default new TaskService();
