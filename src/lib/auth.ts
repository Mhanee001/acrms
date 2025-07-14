import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Get the current authenticated user with their role
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return null;
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    if (roleError || !roleData) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      role: roleData.role
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if user has required role
 */
export const hasRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === 'admin';
};

/**
 * Check if user can access resource
 */
export const canAccessResource = async (
  allowedRoles: UserRole[],
  resourceUserId?: string
): Promise<{ allowed: boolean; user: AuthUser | null }> => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { allowed: false, user: null };
  }

  // Admins can access everything
  if (isAdmin(user.role)) {
    return { allowed: true, user };
  }

  // Check role permissions
  if (!hasRole(user.role, allowedRoles)) {
    return { allowed: false, user };
  }

  // If resource is user-specific, check ownership
  if (resourceUserId && user.id !== resourceUserId) {
    return { allowed: false, user };
  }

  return { allowed: true, user };
};