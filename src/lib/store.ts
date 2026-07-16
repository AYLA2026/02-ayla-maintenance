import { create } from 'zustand';
import type { AppSettings, Project } from '@/types';

interface AppState {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  settings: {
    whatsapp_enabled: true,
    ai_analysis_enabled: true,
    auto_assign_enabled: false,
    notification_enabled: true,
    language: 'ar',
    currency: 'SAR',
    date_format: 'yyyy-MM-dd',
  },
  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
