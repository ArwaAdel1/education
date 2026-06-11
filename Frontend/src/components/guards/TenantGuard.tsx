import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { applyTenantTheme, setTenant } from '@/store/slices/tenantSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { mockTenant } from '@/mocks/tenant';

export function TenantGuard() {
  const dispatch = useAppDispatch();
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant);

  useEffect(() => {
    if (!currentTenant) {
      // TODO: resolve the real tenant from the subdomain/path; mock for now.
      dispatch(setTenant(mockTenant));
      applyTenantTheme(mockTenant);
    }
  }, [currentTenant, dispatch]);

  return <Outlet />;
}
