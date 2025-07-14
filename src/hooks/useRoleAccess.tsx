import { useUserRole } from './useUserRole';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

export const useRoleAccess = () => {
  const { role, loading } = useUserRole();

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const isAdmin = (): boolean => {
    return role === 'admin';
  };

  const isTechnician = (): boolean => {
    return role === 'technician';
  };

  const isUser = (): boolean => {
    return role === 'user';
  };

  const isSales = (): boolean => {
    return role === 'sales';
  };

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    return hasRole(allowedRoles);
  };

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isTechnician,
    isUser,
    isSales,
    canAccess
  };
};