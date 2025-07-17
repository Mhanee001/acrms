import { Layout } from "@/components/Layout";
import { NotificationCenter } from "@/components/NotificationCenter";

const Notifications = () => {
  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <NotificationCenter />
      </div>
    </Layout>
  );
};

export default Notifications;