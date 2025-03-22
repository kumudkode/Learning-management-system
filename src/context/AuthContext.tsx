// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "instructor" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "student" | "instructor" | "admin";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check for saved auth state on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Invalid token
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("Failed to check authentication status."); // Provide user feedback
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Login failed");
        }

        const data = await response.json();

        // Save token and user data
        localStorage.setItem("token", data.token);
        setUser(data.user);

        toast.success("Login successful!");
        router.push("/dashboard");
      } catch (error: unknown) {
        let message = "An unexpected error occurred."; // Default message

        if (error instanceof Error) {
          message = error.message || message; // Use error message if available
        }

        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser, setIsLoading]
  );

  const register = useCallback(
    async (userData: RegisterData) => {
      setIsLoading(true);
      try {
        // Make sure we're using the correct API path
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData), // Send the userData object directly
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }

        const data = await response.json();

        // Save token if provided, and user data
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setUser(data.user);

        toast.success("Registration successful!");
        router.push("/dashboard");
      } catch (error: unknown) {
        let message = "An unexpected error occurred."; // Default message

        if (error instanceof Error) {
          message = error.message || message; // Use error message if available
        }

        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser, setIsLoading]
  );

  const logout = useCallback((): void => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
    toast.info("You have been logged out");
  }, [router, setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
