import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/task/';

class TaskService {
  getTasks(boardId: string) {
    return axios.get<Task[]>(`${API_URL}${boardId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  // Add other task methods here
}

export default new TaskService();
