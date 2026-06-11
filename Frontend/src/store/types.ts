import type { Action, ThunkAction } from '@reduxjs/toolkit';
import type authReducer from './slices/authSlice';
import type tenantReducer from './slices/tenantSlice';
import type uiReducer from './slices/uiSlice';
import type toastReducer from './slices/toastSlice';

export type RootState = {
  auth: ReturnType<typeof authReducer>;
  tenant: ReturnType<typeof tenantReducer>;
  ui: ReturnType<typeof uiReducer>;
  toast: ReturnType<typeof toastReducer>;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
