export type WorkExperience = {
  company: string;
  title: string;
  start_date: string;
  end_date: string;
  bullets: string[];
};

export type Education = {
  school: string;
  degree: string;
  field: string;
  grad_year: string;
  gpa?: string;
};

export type UserProfile = {
  professional_summary?: string;
  education: Education[];
  work_experience: WorkExperience[];
  skills: string[];
  certifications: string[];
  projects: object[];
  target_roles: string[];
  target_locations: string[];
  salary_min?: number;
  is_auto_apply: boolean;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
};

export type ResumeData = {
  professional_summary?: string;
  work_experience?: WorkExperience[];
  education?: Education[];
  skills?: { technical?: string[]; soft?: string[] };
  certifications?: string[];
};

export type Resume = {
  id: string;
  job_description_id?: string;
  job_title?: string;
  company_name?: string;
  resume_data?: ResumeData;
  pdf_url?: string;
  ats_score?: number;
  template_id: string;
  version: number;
  status: "draft" | "generated" | "submitted";
  created_at: string;
};

export type Application = {
  id: string;
  job_description_id: string;
  resume_id: string;
  status: "pending" | "submitted" | "viewed" | "interview" | "rejected" | "offer";
  submitted_at?: string;
  notes?: string;
  job_title?: string;
  company_name?: string;
};

export type ApplicationStats = {
  pending: number;
  submitted: number;
  viewed: number;
  interview: number;
  rejected: number;
  offer: number;
  total?: number;
};
