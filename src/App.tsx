import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Opportunities from "./pages/Opportunities";
import SalesPipeline from "./pages/SalesPipeline";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import EmailCampaigns from "./pages/EmailCampaigns";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";

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
            <Route path="/auth" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>} />
            
            {/* Protected Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user-dashboard" element={
              <ProtectedRoute allowedRoles={['user', 'technician', 'sales']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* CRM Routes - Sales team access */}
            <Route path="/contacts" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <Contacts />
              </ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <Leads />
              </ProtectedRoute>
            } />
            <Route path="/opportunities" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <Opportunities />
              </ProtectedRoute>
            } />
            <Route path="/sales-pipeline" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <SalesPipeline />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/email-campaigns" element={
              <ProtectedRoute allowedRoles={['admin', 'sales']}>
                <EmailCampaigns />
              </ProtectedRoute>
            } />
            
            {/* Service Management Routes */}
            <Route path="/service-request" element={
              <ProtectedRoute allowedRoles={['user']}>
                <ServiceRequest />
              </ProtectedRoute>
            } />
            <Route path="/technician-dashboard" element={
              <ProtectedRoute allowedRoles={['technician', 'admin']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-requests" element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <MyRequests />
              </ProtectedRoute>
            } />
            <Route path="/my-assets" element={
              <ProtectedRoute>
                <MyAssets />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute allowedRoles={['admin', 'technician']}>
                <MyAssets />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/activity" element={
              <ProtectedRoute>
                <ActivityPage />
              </ProtectedRoute>
            } />
            <Route path="/job-requests" element={
              <ProtectedRoute allowedRoles={['technician', 'admin']}>
                <JobRequests />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={['technician', 'admin', 'sales']}>
                <Calendar />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
