import axios from 'axios';

const AUTH_API_URL = 'http://localhost:3000/auth/';
const USER_API_URL = 'http://localhost:3000/users/';

class AuthService {
  login(email: string, password: string) {
    return axios.post(AUTH_API_URL, {
      email,
      password,
    });
  }

  register(name: string, email: string, password: string) {
    return axios.post(USER_API_URL, {
      name,
      email,
      password,
    });
  }
}

export default new AuthService();
