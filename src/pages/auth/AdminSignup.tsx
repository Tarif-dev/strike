import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LucideShield } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";

// Admin registration schema with validation
const adminSignupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    adminCode: z.string().min(6, "Admin code must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;

// Admin code to validate admin registrations
// In a real app, this would be stored securely and potentially be different for each organization
const ADMIN_SECRET_CODE = "STRIKE-ADMIN-2025";

export default function AdminSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      adminCode: "",
    },
  });

  const onSubmit = async (values: AdminSignupFormValues) => {
    // Verify admin code
    if (values.adminCode !== ADMIN_SECRET_CODE) {
      toast({
        variant: "destructive",
        title: "Invalid admin code",
        description: "The admin code you entered is incorrect.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        throw authError;
      }

      // 2. Set admin flag in profile
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          is_admin: true,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Error setting admin status:", profileError);
          // Continue anyway, as the auth account was created
        }
      }

      toast({
        title: "Admin account created",
        description: "Please check your email to confirm your account",
      });

      navigate("/auth/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
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

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-md space-y-6 bg-cricket-medium-green p-6 rounded-xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cricket-lime rounded-full p-3">
                <LucideShield size={28} className="text-cricket-dark-green" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Admin Registration</h1>
            <p className="text-muted-foreground mt-2">
              Create an admin account for the cricket fantasy platform
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
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Create a secure password"
                          type={isPasswordVisible ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm your password"
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adminCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Access Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter admin access code"
                        type="password"
                        {...field}
                      />
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
                    Creating Admin Account
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <p>
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-cricket-lime hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
