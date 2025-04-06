// User types
export interface User {
  id: string;
  username: string;
  email: string;
  is_alumni: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Alumni types
export interface Education {
  id?: string;
  degree: string;
  department: string;
  institution: string;
  start_year: number;
  end_year: number;
  achievements?: string;
  cgpa?: number;
}

export interface Job {
  id?: string;
  company_name: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface AlumniBasicInfo {
  full_name: string;
  bio?: string;
  contact_number?: string;
  current_location?: string;
  availability_for_mentorship?: boolean;
  profile_image_url?: string;
}

export interface AlumniProfile {
  id: string;
  basic: AlumniBasicInfo;
  education: Education[];
  jobs: Job[];
  verification_status?: string;
}

// Admin types
export interface AdminInfo {
  department: string;
  designation: string;
}

export interface RegisterAlumniRequest {
  username: string;
  password: string;
  email: string;
  is_alumni: true;
  full_name: string;
  education: Education;
}

export interface RegisterAdminRequest {
  username: string;
  password: string;
  email: string;
  is_alumni: false;
  department: string;
  designation: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Dashboard data interface
export interface DashboardData {
  total_alumni: number;
  new_registrations: number;
  pending_verification: number;
  verified_alumni: number;
  recent_alumni: Array<{
    alumni_id: number;
    full_name: string;
    email: string;
    created_at: string;
    verification_status?: string;
  }>;
  alumni_by_department: Array<{
    department: string;
    count: number;
  }>;
}