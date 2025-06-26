"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const userData = localStorage.getItem("user");
          const token = localStorage.getItem("token");

          if (userData && token) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@example.com" && password === "password123") {
        const userData: User = {
          id: "1",
          name: "Petrus Handika",
          email: email,
          role: "Admin",
        };

        const token = "mock-jwt-token-" + Date.now();

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", token);
        }
        setUser(userData);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
