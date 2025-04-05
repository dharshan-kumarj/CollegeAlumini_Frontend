export interface User {
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    id: number;
    is_active: boolean;
    is_alumni: boolean;
    is_college_admin: boolean;
    created_at: string;
    last_login?: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface Token {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
  
  export interface UserCreate {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }
  
  export interface Alumni {
    id: number;
    user_id: number;
    registration_date: string;
    is_active: boolean;
    is_verified: boolean;
    verification_date?: string;
    verified_by_id?: number;
    profile_picture?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    bio?: string;
    linkedin_url?: string;
    user: User;
    education_records: Education[];
    employment_records: Employment[];
    skill_associations: AlumniSkill[];
    achievements: Achievement[];
  }
  
  export interface Education {
    id: number;
    alumni_id: number;
    department_id: number;
    department_name?: string;
    degree: string;
    batch_year_start: number;
    batch_year_end: number;
    major?: string;
    minor?: string;
    gpa?: number;
    achievements?: string;
  }
  
  export interface Employment {
    id: number;
    alumni_id: number;
    company_name: string;
    job_title: string;
    industry?: string;
    employment_type?: string;
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    description?: string;
    location?: string;
  }
  
  export interface AlumniSkill {
    id: number;
    alumni_id: number;
    skill_id: number;
    skill_name?: string;
    skill_category?: string;
    proficiency_level?: string;
  }
  
  export interface Achievement {
    id: number;
    alumni_id: number;
    title: string;
    description?: string;
    achievement_date?: string;
    achievement_type?: string;
    organization?: string;
    reference_link?: string;
  }
  
  export interface AlumniRegistration extends UserCreate {
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    bio?: string;
    linkedin_url?: string;
  }