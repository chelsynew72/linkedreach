import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  company?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('lr_token') : null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('lr_token', data.token);
    set({ user: data.user, token: data.token, isLoading: false });
  },

  register: async (email, name, password) => {
    set({ isLoading: true });
    const { data } = await api.post('/auth/register', { email, name, password });
    localStorage.setItem('lr_token', data.token);
    set({ user: data.user, token: data.token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('lr_token');
    set({ user: null, token: null });
    window.location.href = '/login';
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/users/me');
      set({ user: data });
    } catch {
      localStorage.removeItem('lr_token');
      set({ user: null, token: null });
    }
  },
}));
