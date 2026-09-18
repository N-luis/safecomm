import { create } from 'zustand';

interface DashboardStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleDarkMode: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  darkMode: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
