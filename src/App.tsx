import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ServiceRequest from "./pages/ServiceRequest";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyRequests from "./pages/MyRequests";
import MyAssets from "./pages/MyAssets";
import Notifications from "./pages/Notifications";
import ActivityPage from "./pages/ActivityPage";
import JobRequests from "./pages/JobRequests";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/service-request" element={<ServiceRequest />} />
            <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/my-assets" element={<MyAssets />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/job-requests" element={<JobRequests />} />
            <Route path="/admin-requests" element={<MyRequests />} />
            <Route path="/user-management" element={<UserManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
