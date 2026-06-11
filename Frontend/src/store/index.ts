import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tenantReducer from './slices/tenantSlice';
import uiReducer from './slices/uiSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    ui: uiReducer,
    toast: toastReducer,
  },
});

export type { RootState, AppThunk } from './types';
export type AppDispatch = typeof store.dispatch;
