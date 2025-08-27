import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import Landing from "./Landing";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading && !roleLoading && role) {
      // Role-based routing
      switch (role) {
        case 'user':
          navigate("/service-request");
          break;
        case 'technician':
          navigate("/technician-dashboard");
          break;
        case 'admin':
          navigate("/dashboard");
          break;
        case 'manager':
        case 'ceo':
          navigate("/executive-dashboard");
          break;
        case 'sales':
          navigate("/user-dashboard");
          break;
        default:
          navigate("/user-dashboard");
      }
    }
  }, [user, authLoading, roleLoading, role, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <Landing />;
};

export default Index;
