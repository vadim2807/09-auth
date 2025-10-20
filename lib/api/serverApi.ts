import { type AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { api } from './api';
import { type Note } from '../../types/note';
import { type User } from '../../types/user';
import { type FetchNotesParams, type FetchNotesResponse } from './clientApi';

// Notes
export const fetchNotes = async (params: FetchNotesParams = {}): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search, tag } = params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

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

  const response: AxiosResponse<FetchNotesResponse> = await api.get(`/notes?${queryParams}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
};

// User
export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response: AxiosResponse<User> = await api.get('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
};

// Auth
export const checkSession = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response: AxiosResponse<User | null> = await api.get('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });
  return response.data;
};

