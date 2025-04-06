export interface SocialMediaLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

export interface AlumniData {
  alumni_id: number;
  user_id: number;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  bio: string | null;
  contact_number: string | null;
  address: string | null;
  graduation_year: number | null;
  current_location: string | null;
  profile_image: string | null;
  social_media_links: SocialMediaLinks | null;
  availability_for_mentorship: boolean;
  created_at: string;
  updated_at: string;
  email: string;
  username: string;
  department?: string;
  current_company?: string; 
  current_position?: string;
  verification_status?: string;
}

export interface AlumniResponse {
  total: number;
  page: number;
  per_page: number;
  data: AlumniData[];
}

// Add a new interface for filter categories
export interface FilterCategories {
  departments: string[];
  companies: string[];
  positions: string[];
}