import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageContainer from "@/components/layout/PageContainer";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function OtpLogin() {
  const navigate = useNavigate();
  const { signInWithOtp, verifyOtp, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate("/");
  }

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSendOtp = async (values: EmailFormValues) => {
    setIsSubmitting(true);
    const { error } = await signInWithOtp(values.email);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: error.message,
      });
      return;
    }

    setEmail(values.email);
    setOtpSent(true);
    toast({
      title: "OTP sent",
      description: "Please check your email for the verification code",
    });
  };

  const onVerifyOtp = async (values: OtpFormValues) => {
    setIsSubmitting(true);
    const { error } = await verifyOtp(email, values.otp);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Logged in successfully",
      description: "Welcome back!",
    });

    navigate("/");
  };

  const handleResendOtp = async () => {
    if (!email) return;

    setIsSubmitting(true);
    const { error } = await signInWithOtp(email);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend OTP",
        description: error.message,
      });
      return;
    }

    toast({
      title: "OTP resent",
      description: "Please check your email for the new verification code",
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-md space-y-6 bg-cricket-medium-green p-6 rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">OTP Login</h1>
            <p className="text-muted-foreground mt-2">
              {otpSent
                ? "Enter the verification code sent to your email"
                : "Enter your email to receive a verification code"}
            </p>
          </div>

          {!otpSent ? (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onSendOtp)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
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
                      Sending OTP
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onVerifyOtp)}
                className="space-y-6"
              >
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormLabel className="text-center">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="link"
                      className="text-cricket-lime hover:text-cricket-lime/90 p-0"
                      onClick={() => setOtpSent(false)}
                      disabled={isSubmitting}
                    >
                      Change email
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      className="text-cricket-lime hover:text-cricket-lime/90 p-0"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          )}

          <div className="mt-4 text-center text-sm">
            <Link
              to="/auth/login"
              className="text-cricket-lime hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
