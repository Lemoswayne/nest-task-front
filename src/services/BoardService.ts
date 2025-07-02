import axios from "axios";

const API_URL = "https://nest-task-back.onrender.com/boards/";

// Configurar axios para incluir o token de autorização
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

class BoardService {
  async create(title: string, description?: string) {
    const token = localStorage.getItem("token");
    const userId = this.getUserIdFromToken(token);

    return axios.post(
      API_URL,
      {
        title,
        description,
        userId,
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

  async update(id: string, title: string, description?: string) {
    return axios.patch(
      `${API_URL}${id}`,
      {
        title,
        description,
      },
      getAuthHeaders()
    );
  }

  async remove(id: string) {
    return axios.delete(`${API_URL}${id}`, getAuthHeaders());
  }

  private getUserIdFromToken(token: string | null): string {
    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || "";
    } catch (error) {
      console.error("Error parsing token:", error);
      return "";
    }
  }
}

export default new BoardService();
