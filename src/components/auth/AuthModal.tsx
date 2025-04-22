
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "register";
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, password: string, role: string) => Promise<boolean>;
}

const AuthModal = ({
  isOpen,
  onClose,
  initialMode,
  onLogin,
  onRegister,
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<string>(initialMode);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={initialMode} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onLogin={onLogin} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onRegister={onRegister} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
