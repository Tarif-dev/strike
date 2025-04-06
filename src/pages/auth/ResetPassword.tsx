
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidResetLink, setIsValidResetLink] = useState(true);

  useEffect(() => {
    // Check if hash exists in URL
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setIsValidResetLink(false);
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: "The password reset link is invalid or expired",
      });
    }
  }, [toast]);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset",
      });
      
      // Short delay before redirect
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  if (!isValidResetLink) {
    return (
      <PageContainer>
        <Header title="Invalid Link" />
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold">Invalid Reset Link</h1>
            <p className="text-muted-foreground">The password reset link is invalid or has expired.</p>
            <Button 
              className="bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
              onClick={() => navigate("/auth/login")}
            >
              Back to Login
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header title="Reset Password" />
      
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-md space-y-6 bg-cricket-medium-green p-6 rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground mt-2">
              Create a new password for your account
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Enter new password"
                          className="pr-10"
                          {...field}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3"
                          onClick={togglePasswordVisibility}
                          tabIndex={-1}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="pr-10"
                          {...field}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3"
                          onClick={toggleConfirmPasswordVisibility}
                          tabIndex={-1}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
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
                    Updating Password
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
}
