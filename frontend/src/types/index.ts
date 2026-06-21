// Types derived from backend Prisma schema and API responses

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Resume {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  parseSkills: string[] | null;
  userId: number;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: number | null;
  createdAt: string;
}

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  REJECTED = "REJECTED",
  OFFER = "OFFER",
  GHOSTED = "GHOSTED",
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  notes: string | null;
  appliedAt: string;
  userId: number;
  jobId: number;
  resumeId: number;
}

export interface LoginResponse {
  token: string;
  refreshtoken: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export interface ParsedResume {
  skills: string[];
  position: string[];
  preferred_roles: string[];
}

export interface JobMatch {
  jobId: number;
  title: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface SemanticJobMatch {
  id: number;
  title: string;
  company: string;
  location: string;
  similarity: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  salary?: string;
  jobType?: string;
  page?: number;
  limit?: number;
}

