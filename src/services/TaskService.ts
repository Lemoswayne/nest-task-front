import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks/';

// Configurar axios para incluir o token de autorização
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

class TaskService {
  async create(
    title: string,
    boardId: string,
    description?: string,
    status: string = 'TODO',
    order: number = 0,
    dueDate?: Date,
    completed: boolean = false
  ) {
    return axios.post(
      API_URL,
      {
        title,
        boardId,
        description,
        status,
        order,
        dueDate,
        completed,
      },
      getAuthHeaders()
    );
  }

  async findAll() {
    return axios.get(API_URL, getAuthHeaders());
  }

  async findOne(id: string) {
    return axios.get(`${API_URL}${id}`, getAuthHeaders());
  }

  async update(
    id: string,
    updates: {
      title?: string;
      description?: string;
      status?: string;
      order?: number;
      dueDate?: Date;
      completed?: boolean;
    }
  ) {
    return axios.patch(`${API_URL}${id}`, updates, getAuthHeaders());
  }

  async remove(id: string) {
    return axios.delete(`${API_URL}${id}`, getAuthHeaders());
  }

  async updateStatus(id: string, status: string) {
    return axios.patch(`${API_URL}${id}/status`, { status }, getAuthHeaders());
  }

  async updateOrder(id: string, order: number) {
    return this.update(id, { order });
  }

  async toggleComplete(id: string, completed: boolean) {
    return this.update(id, { completed });
  }
}

export default new TaskService();
