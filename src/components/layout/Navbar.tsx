import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await authService.login(email, password);
      
      if (error) throw error;
      
      // Redirect based on user role
      const userRole = data.user?.user_metadata.role;
      
      if (userRole === 'student') {
        navigate('/student/dashboard');
      } else if (userRole === 'tutor') {
        navigate('/tutor/dashboard');
      }
      
      // This would be handled by the AuthModal component
      // We'll keep this comment as a reference
      // setIsAuthModalOpen(false);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        duration: 3000,
      });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  return (
    <div>
      {/* Navbar content */}
    </div>
  );
};

export default Navbar;
