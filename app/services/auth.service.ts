import { apiClient, TokenManager } from "./api-client";
import { API_ENDPOINTS } from "../lib/api-config";

// Auth service interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  role: "creator" | "predictor";
}

export interface GoogleAuthRequest {
  googleToken: string;
  role: "creator" | "predictor";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "creator" | "predictor" | "admin";
  walletBalance: number;
  googleId?: string;
  youtubeChannelId?: string;
  youtubeAccessToken?: string;
  youtubeRefreshToken?: string;
  youtubeTokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth service class
export class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store tokens
    TokenManager.setTokens(response.accessToken, response.refreshToken);

    return response;
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );

    // Store tokens
    TokenManager.setTokens(response.accessToken, response.refreshToken);

    return response;
  }

  // Google OAuth login
  async googleAuth(authData: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.GOOGLE,
      authData
    );

    // Store tokens
    TokenManager.setTokens(response.accessToken, response.refreshToken);

    return response;
  }

  // Refresh access token
  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<RefreshResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    // Update stored tokens
    TokenManager.setTokens(response.accessToken, response.refreshToken);

    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear tokens locally
      TokenManager.clearTokens();
    }
  }

  // Get current user from token
  getCurrentUser(): User | null {
    const token = TokenManager.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user || null;
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = TokenManager.getAccessToken();
    if (!token) {
      return false;
    }

    return !TokenManager.isTokenExpired(token);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return TokenManager.getRefreshToken();
  }

  // Check if user has specific role
  hasRole(role: "creator" | "predictor" | "admin"): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Get user ID
  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  // Validate password strength
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create singleton instance
export const authService = new AuthService();
