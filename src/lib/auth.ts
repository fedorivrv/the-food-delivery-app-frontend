import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    email: string;
  };
}

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data);

  const { accessToken } = res.data;

  localStorage.setItem('token', accessToken);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};