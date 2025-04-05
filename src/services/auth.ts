import { login as apiLogin } from './api';
import { LoginCredentials, Token } from '../types';

export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    const token = await apiLogin(credentials);
    saveToken(token);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_type');
};

export const saveToken = (token: Token): void => {
  localStorage.setItem('access_token', token.access_token);
  localStorage.setItem('refresh_token', token.refresh_token);
  localStorage.setItem('token_type', token.token_type);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};