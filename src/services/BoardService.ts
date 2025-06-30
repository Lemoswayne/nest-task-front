import axios from 'axios';
import { Board } from '../types/Board';

const API_URL = 'http://localhost:3000/board/';

class BoardService {
  getBoards() {
    return axios.get<Board[]>(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  createBoard(title: string, description: string) {
    return axios.post<Board>(API_URL, { title, description }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  // Add other board methods here
}

export default new BoardService();
