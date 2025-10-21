import { type AxiosResponse } from 'axios';
import { api } from './api';
import { type Note, type NoteTag } from '../../types/note';
import { type User } from '../../types/user';

// Types and interfaces for requests/responses
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage?: number;
  totalItems?: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface CreateNoteResponse {
  data: Note;
}

export interface DeleteNoteResponse {
  data: Note;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
}

// Notes
export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search, tag } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });

  if (search && search.trim()) {
    queryParams.append('search', search.trim());
  }

  if (tag && tag.trim()) {
    queryParams.append('tag', tag.trim());
  }

  const response: AxiosResponse<FetchNotesResponse> = await api.get(`/notes?${queryParams}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: CreateNoteRequest): Promise<Note> => {
  const response: AxiosResponse<CreateNoteResponse> = await api.post('/notes', noteData);
  return response.data.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const response: AxiosResponse<DeleteNoteResponse> = await api.delete(`/notes/${noteId}`);
  return response.data.data;
};

// Auth
export const register = async (credentials: RegisterRequest): Promise<User> => {
  const response: AxiosResponse<User> = await api.post('/auth/register', credentials);
  return response.data;
};

export const login = async (credentials: LoginRequest): Promise<User> => {
  const response: AxiosResponse<User> = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const sessionResponse: AxiosResponse<{ success: boolean }> = await api.get('/auth/session');
  if (sessionResponse.data.success) {
    const userResponse: AxiosResponse<User> = await api.get('/users/me');
    return userResponse.data;
  }
  return null;
};

// User
export const getMe = async (): Promise<User> => {
  const response: AxiosResponse<User> = await api.get('/users/me');
  return response.data;
};

export const updateMe = async (userData: UpdateUserRequest): Promise<User> => {
  const response: AxiosResponse<User> = await api.patch('/users/me', userData);
  return response.data;
};

