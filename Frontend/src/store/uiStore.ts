import { create } from 'zustand';
import i18n from '@/lib/i18n';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface UIState {
  sidebarOpen: boolean;
  language: Language;
  direction: Direction;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLanguage: (lang: Language) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  language: 'ar',
  direction: 'rtl',

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  setLanguage: (lang) => {
    const direction: Direction = lang === 'ar' ? 'rtl' : 'ltr';
    set({ language: lang, direction });

    document.documentElement.lang = lang;
    document.documentElement.dir = direction;

    i18n.changeLanguage(lang);
  },
}));
