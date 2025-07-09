import { Layout } from "@/components/Layout";
import { ActivityLog } from "@/components/ActivityLog";

const ActivityPage = () => {
  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <ActivityLog />
      </div>
    </Layout>
  );
};

export default ActivityPage;