import { Layout } from "@/components/Layout";
import { MyRequestsList } from "@/components/MyRequestsList";

const MyRequests = () => {
  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">My Service Requests</h1>
          <p className="text-muted-foreground text-lg">
            Track and manage your service requests
          </p>
        </div>
        <MyRequestsList />
      </div>
    </Layout>
  );
};

export default MyRequests;