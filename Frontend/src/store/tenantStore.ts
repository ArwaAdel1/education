import { create } from 'zustand';
import type { Tenant } from '@/types';

interface TenantState {
  currentTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
  applyTenantTheme: () => void;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: null,

  setTenant: (tenant) => {
    set({ currentTenant: tenant });
  },

  clearTenant: () => {
    set({ currentTenant: null });
  },

  applyTenantTheme: () => {
    const tenant = get().currentTenant;
    if (!tenant) return;

    const root = document.documentElement;
    const { primary, secondary, accent } = tenant.brandColors;
    root.style.setProperty('--tenant-primary', primary);
    root.style.setProperty('--tenant-secondary', secondary);
    root.style.setProperty('--tenant-accent', accent);
  },
}));
