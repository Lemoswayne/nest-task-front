import axios from 'axios';
import { Board } from '../types/Board';

const API_URL = 'http://localhost:3000/boards/';

class BoardService {
  getBoards() {
    return axios.get<Board[]>(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  createBoard(title: string, description: string, userId: string) {
    return axios.post<Board>(API_URL, { title, description, userId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  updateBoard(board: Board) {
    return axios.patch<Board>(`${API_URL}${board.id}`, board, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  deleteBoard(boardId: string) {
    return axios.delete(`${API_URL}${boardId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }

  // Add other board methods here
}

export default new BoardService();
