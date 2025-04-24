
import React, { createContext, useState, useContext, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

type AdminUser = {
  username: string;
  isAuthenticated: boolean;
};

type AuthContextType = {
  adminUser: AdminUser;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials - in a real app, this would be authenticated against a backend
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser>({
    username: "",
    isAuthenticated: false,
  });
  const { toast } = useToast();

  const login = async (username: string, password: string): Promise<boolean> => {
    // This is a mock authentication - in a real application, this would be a backend call
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminUser({
        username,
        isAuthenticated: true,
      });
      toast({
        title: "Logged in successfully",
        description: "Welcome to the admin dashboard.",
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setAdminUser({
      username: "",
      isAuthenticated: false,
    });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const isAdmin = () => {
    return adminUser.isAuthenticated;
  };

  return (
    <AuthContext.Provider value={{ adminUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
