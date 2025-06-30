import axios from 'axios';

const API_URL = 'http://localhost:3000/auth/';

class AuthService {
  login(email: string, pass: string) {
    return axios.post(API_URL + 'login', {
      email,
      pass,
    });
  }
}

export default new AuthService();
