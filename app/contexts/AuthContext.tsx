import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router";
import { authService } from "../services/auth.service";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
} from "../types/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  googleAuth: (authData: GoogleAuthRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: "creator" | "predictor" | "admin") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Check if user is authenticated
      const isAuthenticated = authService.isAuthenticated();
      const user = authService.getCurrentUser();

      if (isAuthenticated && user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Try to refresh token if refresh token exists
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          try {
            await authService.refreshToken();
            const refreshedUser = authService.getCurrentUser();
            if (refreshedUser) {
              setState({
                user: refreshedUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              return;
            }
          } catch (error) {
            console.error("Token refresh failed:", error);
            authService.logout();
          }
        }

        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Failed to initialize authentication",
      });
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.login(credentials);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.register(userData);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const googleAuth = async (authData: GoogleAuthRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authService.googleAuth(authData);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Google authentication failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      await authService.logout();

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      const user = authService.getCurrentUser();

      if (user) {
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: true,
          error: null,
        }));
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout user
      await logout();
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const hasRole = (role: "creator" | "predictor" | "admin"): boolean => {
    return state.user?.role === role;
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    googleAuth,
    logout,
    refreshToken,
    clearError,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
}

// Hook for role-based access
export function useRequireRole(
  requiredRole: "creator" | "predictor" | "admin"
) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole(requiredRole)) {
      // Route to appropriate dashboard based on user role
      if (user?.role === "creator") {
        navigate("/creator");
      } else if (user?.role === "predictor") {
        navigate("/predictor");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, hasRole, requiredRole, user, navigate]);

  return { isAuthenticated, isLoading, hasAccess: hasRole(requiredRole) };
}
