import axios from 'axios';
import { AlumniResponse } from '../types/alumni';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const alumniService = {
  // Get all alumni (paginated)
  getAllAlumni: async (page: number = 1, per_page: number = 10): Promise<AlumniResponse> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.get(`${API_URL}/admin/alumni`, {
      params: { page, per_page },
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    });
    
    return response.data;
  },
  
  // Get alumni by ID
  getAlumniById: async (alumniId: number): Promise<any> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.get(`${API_URL}/alumni/${alumniId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    });
    
    return response.data;
  }
};