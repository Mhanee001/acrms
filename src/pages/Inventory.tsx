import { Layout } from "@/components/Layout";
import { InventoryManagement } from "@/components/InventoryManagement";
import { useRoleAccess } from "@/hooks/useRoleAccess";

const Inventory = () => {
  const { canManageInventory, loading } = useRoleAccess();

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!canManageInventory()) {
    return (
      <Layout showSidebar={true}>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground mt-2">You don't have permission to access inventory.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <InventoryManagement />
      </div>
    </Layout>
  );
};

export default Inventory;