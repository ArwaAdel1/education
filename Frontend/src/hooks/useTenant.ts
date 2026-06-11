import { applyTenantTheme, setTenant } from '@/store/slices/tenantSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function useTenant() {
  const dispatch = useAppDispatch();
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant);

  return {
    tenant: currentTenant,
    setTenant: (tenant: Parameters<typeof setTenant>[0]) => dispatch(setTenant(tenant)),
    applyTheme: () => applyTenantTheme(currentTenant),
  };
}
