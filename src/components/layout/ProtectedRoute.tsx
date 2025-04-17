import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const auth = useAuth();

  // Show loading state while checking auth
  if (auth.loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!auth.user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render the protected content
  return <Outlet />;
};
