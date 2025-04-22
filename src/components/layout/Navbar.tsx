import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { User, LogOut, Settings } from "lucide-react";
import AuthModal from "../auth/AuthModal";
import { authService } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out from your account.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await authService.login(email, password);
      setIsAuthModalOpen(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
        duration: 3000,
      });
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  const handleRegister = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      await authService.register(name, email, password, role);
      setIsAuthModalOpen(false);
      toast({
        title: "Account created!",
        description: `Welcome to Tutor Finder. You're registered as a ${role}.`,
        duration: 3000,
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 md:px-12 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-tutor-primary">
            TutorFinder
          </Link>
          <div className="hidden md:flex ml-10 space-x-8">
            <Link to="/" className="text-gray-700 hover:text-tutor-primary transition-colors">
              Home
            </Link>
            <Link to="/tutors" className="text-gray-700 hover:text-tutor-primary transition-colors">
              Find Tutors
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-tutor-primary transition-colors">
              How It Works
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="" alt={user?.email || ""} />
                    <AvatarFallback className="bg-tutor-primary text-white">
                      {user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">{user?.email}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="hidden md:flex" 
                onClick={() => handleOpenAuthModal('login')}
              >
                Log in
              </Button>
              <Button 
                onClick={() => handleOpenAuthModal('register')}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </nav>
  );
};

export default Navbar;
