import { Layout } from "@/components/Layout";
import { ServiceRequestsList } from "@/components/ServiceRequestsList";

const JobRequests = () => {
  return (
    <Layout showSidebar={true}>
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Available Job Requests</h1>
          <p className="text-muted-foreground text-lg">
            View and accept service requests from customers
          </p>
        </div>
        <ServiceRequestsList />
      </div>
    </Layout>
  );
};

export default JobRequests;