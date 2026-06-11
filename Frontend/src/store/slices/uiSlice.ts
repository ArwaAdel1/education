import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import i18n from '@/lib/i18n';
import type { AppThunk } from '../types';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface UIState {
  sidebarOpen: boolean;
  language: Language;
  direction: Direction;
}

const initialState: UIState = {
  sidebarOpen: true,
  language: 'ar',
  direction: 'rtl',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLanguageState: (
      state,
      action: PayloadAction<{ language: Language; direction: Direction }>,
    ) => {
      state.language = action.payload.language;
      state.direction = action.payload.direction;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setLanguageState } = uiSlice.actions;

export const setLanguage =
  (lang: Language): AppThunk =>
  (dispatch) => {
    const direction: Direction = lang === 'ar' ? 'rtl' : 'ltr';
    dispatch(setLanguageState({ language: lang, direction }));

    document.documentElement.lang = lang;
    document.documentElement.dir = direction;

    i18n.changeLanguage(lang);
  };

export default uiSlice.reducer;
