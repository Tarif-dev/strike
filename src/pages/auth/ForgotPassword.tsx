
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <PageContainer>
      <Header title="Reset Password" />
      
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-md space-y-6 bg-cricket-medium-green p-6 rounded-xl">
          {!emailSent ? (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground mt-2">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter your email"
                              className="pl-10"
                              type="email"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Email
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Email Sent</h1>
                <p className="text-muted-foreground mt-2">
                  Check your email for a link to reset your password
                </p>
              </div>
              <Button 
                className="w-full bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm">
            <Link to="/auth/login" className="text-cricket-lime hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
