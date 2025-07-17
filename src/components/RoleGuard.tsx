import { ReactNode } from 'react';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
  const { canAccess, loading } = useRoleAccess();

  if (loading) {
    return null;
  }

  if (!canAccess(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};