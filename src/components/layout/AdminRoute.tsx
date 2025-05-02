import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AdminRoute = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        // Check if user is admin in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error(
            "Error checking admin status from profiles:",
            profileError
          );
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(profileData?.is_admin));
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (user && !loading) {
      checkAdminStatus();
    } else if (!loading) {
      setCheckingAdmin(false);
    }
  }, [user, loading]);

  // Show loading state while checking auth and admin status
  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="h-8 w-8 text-cricket-lime animate-spin mr-2" />
        <span>Verifying admin access...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // Render the admin content
  return <Outlet />;
};

export default AdminRoute;
