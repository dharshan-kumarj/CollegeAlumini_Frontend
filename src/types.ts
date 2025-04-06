// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterAlumniRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface RegisterAdminRequest {
  username: string;
  email: string;
  password: string;
  admin_code: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface User {
  id: string;
  username: string;
  is_alumni: boolean;
}

// Alumni Profile types
export interface Education {
  education_id: number;
  alumni_id: number;
  degree: string;
  department: string;
  institution: string;
  start_year: number;
  end_year: number;
  achievements?: string;
  cgpa?: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  job_id?: number;
  alumni_id?: number;
  company_name: string;
  position: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AlumniProfile {
  alumni_id: number;
  user_id: number;
  full_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  bio?: string | null;
  contact_number?: string | null;
  address?: string | null;
  graduation_year?: number | null;
  current_location?: string | null;
  profile_image?: string | null;
  social_media_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    other?: string;
  } | null;
  availability_for_mentorship: boolean;
  created_at: string;
  updated_at: string;
  email: string;
  username: string;
  education: Education[];
  jobs: Job[];
  verification_status?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}