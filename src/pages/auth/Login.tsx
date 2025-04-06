
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Apple, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, signInWithApple, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate("/");
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const { error } = await signInWithEmail(values.email, values.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      return;
    }

    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Failed to sign in with Google",
      });
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Failed to sign in with Apple",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <PageContainer>
      <Header title="Login" />
      
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-md space-y-6 bg-cricket-medium-green p-6 rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Login to continue where you left off</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex gap-2 items-center justify-center bg-white"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
            >
              <GoogleLogo className="h-4 w-4" />
              <span>Continue with Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex gap-2 items-center justify-center bg-black text-white hover:bg-gray-800"
              onClick={handleAppleSignIn}
              disabled={authLoading}
            >
              <Apple className="h-4 w-4" />
              <span>Continue with Apple</span>
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cricket-medium-green px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
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
                          {...field}
                          disabled={isSubmitting}
                        />
                      </div>
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
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Enter your password"
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
              
              <div className="flex items-center justify-between">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-cricket-lime hover:underline"
                >
                  Forgot password?
                </Link>
                <Link
                  to="/auth/otp-login"
                  className="text-sm text-cricket-lime hover:underline"
                >
                  Login with OTP
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="text-cricket-lime hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
