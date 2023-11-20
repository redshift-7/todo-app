import http from './../http-common';
import IUser from '../types/UserType';

const API_URL = '/auth/';

interface AuthService {
  login: (username: string, password: string) => Promise<IUser>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<IUser>;
  getCurrentUser: () => IUser | null;
}

export const authService: AuthService = {
  async login(username: string, password: string): Promise<IUser> {
    try {
      const response = await http.post(API_URL + 'signin', {
        username,
        password,
      });
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout(): void {
    localStorage.removeItem('user');
  },
  async register(username: string, email: string, password: string): Promise<IUser> {
    try {
      const response = await http.post(API_URL + 'signup', {
        username,
        email,
        password,
      });

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  getCurrentUser(): IUser | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};







