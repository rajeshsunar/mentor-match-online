
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { AlertCircle, CheckCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsEmailNotConfirmed(false);
    setResendSuccess(false);
    
    try {
      await onLogin(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to log in. Please try again.";
      setErrorMessage(errorMsg);
      
      // Check if it's an email confirmation error
      if (error instanceof Error && 
         (errorMsg.includes("Email not confirmed") || 
          errorMsg.includes("verify your email"))) {
        setIsEmailNotConfirmed(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    const email = form.getValues("email");
    if (!email) {
      setErrorMessage("Please enter your email address to resend the confirmation");
      return;
    }
    
    setIsResendingEmail(true);
    try {
      await authService.resendConfirmationEmail(email);
      setResendSuccess(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Failed to resend confirmation email. Please try again.");
      console.error("Error resending email:", error);
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  disabled={isLoading}
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
                <Input
                  placeholder="••••••••"
                  type="password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {errorMessage && (
          <div className="text-sm font-medium text-destructive flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {isEmailNotConfirmed && (
          <div className="flex flex-col space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleResendConfirmation}
              disabled={isResendingEmail || resendSuccess}
              className="w-full"
            >
              {isResendingEmail ? "Sending..." : resendSuccess ? "Email Sent" : "Resend Confirmation Email"}
            </Button>
            
            {resendSuccess && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Confirmation email sent! Please check your inbox.</span>
              </div>
            )}
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
