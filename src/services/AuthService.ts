import axios from "axios";

const AUTH_API_URL = "https://nest-task-back.onrender.com/auth/";
const USER_API_URL = "https://nest-task-back.onrender.com/users/";

// Configurar interceptors para debug
axios.interceptors.request.use(
  (config) => {
    console.log("Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("Response error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });
    return Promise.reject(error);
  }
);

class AuthService {
  async login(email: string, password: string) {
    try {
      console.log("Tentando fazer login:", { email });
      const response = await axios.post(AUTH_API_URL, {
        email,
        password,
      });
      console.log("Login bem-sucedido:", response.data);
      return response;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  }

  async register(name: string, email: string, password: string) {
    try {
      console.log("Tentando registrar usuário:", { name, email });
      const requestData = { name, email, password };
      console.log("Dados da requisição:", requestData);

      const response = await axios.post(USER_API_URL, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registro bem-sucedido:", response.data);
      return response;
    } catch (error: any) {
      console.error("Register error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      });

      // Tratar erros específicos
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Dados inválidos";
        throw new Error(errorMessage);
      }

      if (error.response?.status === 409) {
        throw new Error("Email já está em uso");
      }

      if (error.response?.status === 500) {
        throw new Error("Erro interno do servidor");
      }

      if (error.code === "ECONNREFUSED") {
        throw new Error(
          "Servidor não está disponível. Verifique se o backend está rodando."
        );
      }

      if (error.message) {
        throw new Error(error.message);
      }

      throw new Error("Erro ao criar conta. Tente novamente.");
    }
  }
}

export default new AuthService();
