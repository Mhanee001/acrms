import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RoleDebugger = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-64 z-50 opacity-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Role Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-1">
        <div>User ID: {user?.id || 'Not logged in'}</div>
        <div>Email: {user?.email || 'N/A'}</div>
        <div>Role: {roleLoading ? 'Loading...' : role || 'No role'}</div>
        <div>Auth Loading: {authLoading ? 'Yes' : 'No'}</div>
        <div>Role Loading: {roleLoading ? 'Yes' : 'No'}</div>
      </CardContent>
    </Card>
  );
};