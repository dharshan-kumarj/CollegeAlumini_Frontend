import axios from 'axios';
import { 
  LoginCredentials, 
  Token, 
  UserCreate, 
  AlumniRegistration, 
  User, 
  Alumni 
} from '../types';

const API_URL = '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const login = async (credentials: LoginCredentials): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);
  
  const response = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  return response.data;
};

export const register = async (userData: UserCreate): Promise<User> => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const registerAlumni = async (alumniData: AlumniRegistration): Promise<Alumni> => {
  const response = await api.post('/alumni/register', alumniData);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getAlumniProfile = async (): Promise<Alumni> => {
  const response = await api.get('/alumni/me');
  return response.data;
};

export const getAllAlumni = async (params?: any): Promise<Alumni[]> => {
  const response = await api.get('/alumni/', { params });
  return response.data;
};