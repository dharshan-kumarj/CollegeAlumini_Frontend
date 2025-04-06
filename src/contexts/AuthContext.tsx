import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth } from '../services/api';
import { LoginRequest, RegisterAlumniRequest, RegisterAdminRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  registerAlumni: (data: RegisterAlumniRequest) => Promise<void>;
  registerAdmin: (data: RegisterAdminRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        // Handle invalid JSON in localStorage
        console.error('Failed to parse user data from localStorage');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await auth.login(credentials);
      console.log('Login response:', response.data);
      
      // Extract token from response
      const { access_token } = response.data;
      
      // Create user object based on JWT payload
      // Extract user info from JWT token (typically contains user ID, username, roles, etc.)
      const tokenPayload = parseJwt(access_token);
      console.log('Token payload:', tokenPayload);
      
      const userData: User = {
        id: tokenPayload.sub,
        username: tokenPayload.username,
        email: tokenPayload.email, // Extract email from the token payload
        is_alumni: tokenPayload.is_alumni,
        // Add other fields as needed based on what's in your JWT payload
      };
      
      // Store token and user data in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Saved token:', localStorage.getItem('token'));
      console.log('Saved user:', localStorage.getItem('user'));
      
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to parse JWT token', e);
      return {};
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const registerAlumni = async (data: RegisterAlumniRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await auth.register.alumni(data);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
    } catch (error) {
      setError('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerAdmin = async (data: RegisterAdminRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await auth.register.admin(data);
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
    } catch (error) {
      setError('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        registerAlumni,
        registerAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};