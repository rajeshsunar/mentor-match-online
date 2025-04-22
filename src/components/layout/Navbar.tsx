
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<"login" | "register">("login");

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      
      // If login failed or no session data
      if (!response || !response.session) {
        throw new Error("Login failed");
      }
      
      // Redirect based on user role
      const userRole = response.user?.user_metadata.role;
      
      if (userRole === 'student') {
        navigate('/student/dashboard');
      } else if (userRole === 'tutor') {
        navigate('/tutor/dashboard');
      }
      
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

  const handleRegister = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await authService.register(name, email, password, role);
      
      if (!response || !response.user) {
        throw new Error("Registration failed");
      }
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        duration: 3000,
      });
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
        duration: 5000,
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const openLoginModal = () => {
    setInitialAuthMode("login");
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setInitialAuthMode("register");
    setAuthModalOpen(true);
  };

  return (
    <div className="bg-white shadow-sm border-b py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="font-bold text-tutor-primary text-xl">TutorFinder</div>
        
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-tutor-primary transition-colors">Home</a>
            <a href="/tutors" className="text-gray-600 hover:text-tutor-primary transition-colors">Find Tutors</a>
            <a href="/how-it-works" className="text-gray-600 hover:text-tutor-primary transition-colors">How It Works</a>
            
            {user && user.user_metadata.role === 'student' && (
              <a href="/student/dashboard" className="text-gray-600 hover:text-tutor-primary transition-colors">Dashboard</a>
            )}
            
            {user && user.user_metadata.role === 'tutor' && (
              <a href="/tutor/dashboard" className="text-gray-600 hover:text-tutor-primary transition-colors">Dashboard</a>
            )}
          </nav>
          
          {/* Auth Buttons or User Info */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span>Welcome, {user.user_metadata.first_name || 'User'}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <button 
                  className="text-gray-600 hover:text-tutor-primary transition-colors"
                  onClick={openLoginModal}
                >
                  Login
                </button>
                <button 
                  className="bg-tutor-primary text-white px-4 py-2 rounded hover:bg-tutor-primary/90 transition-colors"
                  onClick={openRegisterModal}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={initialAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
};

export default Navbar;
