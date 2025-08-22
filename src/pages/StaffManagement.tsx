import { Layout } from "@/components/Layout";
import { StaffManagement } from "@/components/StaffManagement";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const StaffManagementPage = () => {
  const { canManageStaff, loading } = useRoleAccess();

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!canManageStaff()) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground mt-2">You don't have permission to manage staff.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <StaffManagement />
      </div>
    </Layout>
  );
};

export default StaffManagementPage;