import { useTenantStore } from '@/store/tenantStore';

export function useTenant() {
  const currentTenant = useTenantStore((state) => state.currentTenant);
  const setTenant = useTenantStore((state) => state.setTenant);
  const applyTenantTheme = useTenantStore((state) => state.applyTenantTheme);

  return {
    tenant: currentTenant,
    setTenant,
    applyTheme: applyTenantTheme,
  };
}
