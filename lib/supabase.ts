import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, value);
      } catch {
        console.warn("localStorage not available");
      }
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch {
        console.warn("localStorage not available");
      }
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
