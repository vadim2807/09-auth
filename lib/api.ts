import axios, { type AxiosResponse } from 'axios';
import { type Note, type NoteTag } from '../types/note';

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

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const API_BASE_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

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
