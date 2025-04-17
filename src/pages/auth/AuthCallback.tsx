import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get session from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });

          // Redirect to home dashboard instead of landing page
          navigate("/home", { replace: true });
        } else {
          throw new Error("No session found");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");

        toast({
          variant: "destructive",
          title: "Authentication failed",
          description:
            err instanceof Error
              ? err.message
              : "Failed to complete authentication",
        });

        // Redirect to login page after error
        setTimeout(() => {
          navigate("/auth/login", { replace: true });
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center h-screen">
        {error ? (
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold">Authentication Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <h1 className="text-xl font-semibold">Completing Sign In</h1>
            <p className="text-muted-foreground">Just a moment...</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
