import axios from 'axios';
import { 
  AuthResponse, 
  LoginRequest, 
  AlumniProfile, 
  RegisterAlumniRequest, 
  RegisterAdminRequest, 
  PaginatedResponse,
  Education,
  Job,
  DashboardData
} from '../types';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const auth = {
  register: {
    alumni: (data: RegisterAlumniRequest) => api.post<AuthResponse>('/auth/register', data),
    admin: (data: RegisterAdminRequest) => api.post<AuthResponse>('/auth/register', data),
  },
  login: (data: LoginRequest) => {
    // Create URLSearchParams for form-urlencoded data
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    return axios.post<AuthResponse>(`${API_URL}/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
};

// Alumni APIs
export const alumni = {
  getProfile: () => api.get<AlumniProfile>('/alumni/profile'),
  updateProfile: (data: Partial<AlumniProfile>) => api.put('/alumni/profile', data),
  
  // Education APIs
  addEducation: (data: Omit<Education, 'id'>) => 
    api.post('/alumni/profile', { type: 'education', ...data }),
  deleteEducation: (id: string) => api.delete(`/alumni/profile/education/${id}`),
  
  // Job APIs
  addJob: (data: Omit<Job, 'id'>) => api.post('/alumni/profile', { type: 'job', ...data }),
  deleteJob: (id: string) => api.delete(`/alumni/profile/job/${id}`),
  
  // Profile Image
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/alumni/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Admin APIs
export const admin = {
  getAllAlumni: (page = 1, perPage = 10) => 
    api.get<PaginatedResponse<AlumniProfile>>(`/admin/alumni?page=${page}&per_page=${perPage}`),
  
  getAlumniById: (id: string) => api.get<AlumniProfile>(`/admin/alumni/${id}`),
  
  updateAlumni: (id: string, data: Partial<AlumniProfile>) => 
    api.put(`/admin/alumni/${id}`, data),
  
  deleteAlumni: (id: string) => api.delete(`/admin/alumni/${id}`),
  
  getFilterCategories: () => api.get('/admin/filter-categories'),
  
  filterAlumni: (params: Record<string, string>) => {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to the query
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return api.get<PaginatedResponse<AlumniProfile>>(`/admin/alumni/filter?${queryParams}`);
  },
  
  // Education APIs for admin
  addEducation: (alumniId: string, data: Omit<Education, 'id'>) => 
    api.post(`/admin/alumni/${alumniId}/education`, data),
  
  deleteEducation: (alumniId: string, educationId: string) => 
    api.delete(`/admin/alumni/${alumniId}/education/${educationId}`),
  
  // Job APIs for admin
  addJob: (alumniId: string, data: Omit<Job, 'id'>) => 
    api.post(`/admin/alumni/${alumniId}/job`, data),
  
  deleteJob: (alumniId: string, jobId: string) => 
    api.delete(`/admin/alumni/${alumniId}/job/${jobId}`),
  
  getDashboardData: () => {
    return axios.get<{data: DashboardData}>(`${API_URL}/admin/dashboard`);
  },
};

export default api;