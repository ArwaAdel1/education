import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTenantStore } from '@/store/tenantStore';
import { mockTenant } from '@/mocks/tenant';

export function TenantGuard() {
  const currentTenant = useTenantStore((state) => state.currentTenant);
  const setTenant = useTenantStore((state) => state.setTenant);
  const applyTenantTheme = useTenantStore((state) => state.applyTenantTheme);

  useEffect(() => {
    if (!currentTenant) {
      // TODO: resolve the real tenant from the subdomain/path; mock for now.
      setTenant(mockTenant);
      applyTenantTheme();
    }
  }, [currentTenant, setTenant, applyTenantTheme]);

  return <Outlet />;
}
