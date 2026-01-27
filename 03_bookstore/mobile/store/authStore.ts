import { API_URL } from "@/constants/api";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";

type AuthResponse = { success: true } | { success: false; error: string };

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,
  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message || "Registration failed");
      await AsyncStorage.multiSet([
        ["token", data.token],
        ["user", JSON.stringify(data.user)],
      ]);
      set({ token: data.token, user: data.user });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      await AsyncStorage.multiSet([
        ["token", data.token],
        ["user", JSON.stringify(data.user)],
      ]);
      set({ token: data.token, user: data.user });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      set({ isLoading: false });
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const [[, token], [, userJson]] = await AsyncStorage.multiGet([
        "token",
        "user",
      ]);
      const user = userJson ? JSON.parse(userJson) : null;
      if (token && user) {
        set({ token, user });
      }
    } catch (error) {
      console.log("Auth check failed", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      set({ user: null, token: null });
    } catch (e) {
      console.error("Logout storage error", e);
    }
  },
}));
