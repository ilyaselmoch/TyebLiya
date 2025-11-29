import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  getCurrentSession,
  getProfile,
  getUserRole,
  onAuthStateChange,
  Profile,
} from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

interface AppUser {
  id: string;
  email: string;
  pseudo: string;
  role: "client" | "cuisinier" | null;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isInitializing: boolean;
  isFetchingRole: boolean;
  error: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (pseudo: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFetchingRole, setIsFetchingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isConfigured) {
      setIsInitializing(false);
      return;
    }

    const initializeAuth = async () => {
      try {
        const session = await getCurrentSession();
        if (session?.user) {
          await handleUserSession(session.user);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const unsubscribe = onAuthStateChange(async (session) => {
      if (session?.user) {
        await handleUserSession(session.user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [isConfigured]);

  // Fetch user role from Supabase "users" table
  const handleUserSession = async (supabaseUser: User) => {
    try {
      setIsFetchingRole(true);
      const profile = await getProfile(supabaseUser.id);
      
      // Fetch the user's role from the "users" table
      const role = await getUserRole(supabaseUser.id);
      
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        pseudo: profile?.pseudo || supabaseUser.user_metadata?.pseudo || supabaseUser.email?.split("@")[0] || "",
        role: role,
      });
    } catch (err) {
      console.error("Error fetching user session:", err);
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        pseudo: "",
        role: null,
      });
    } finally {
      setIsFetchingRole(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!isConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!email || !password) {
        setError("Veuillez remplir tous les champs");
        setIsLoading(false);
        return false;
      }

      if (!email.includes("@")) {
        setError("Adresse email invalide");
        setIsLoading(false);
        return false;
      }

      if (password.length < 6) {
        setError("Mot de passe incorrect");
        setIsLoading(false);
        return false;
      }

      setUser({
        id: "demo-user-" + Date.now(),
        email,
        pseudo: email.split("@")[0],
        role: null,
      });
      setIsLoading(false);
      return true;
    }

    try {
      const result = await signInWithEmail(email, password);
      
      if (!result.success) {
        setError(result.error || "Erreur de connexion");
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (
    pseudo: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    if (!isConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!pseudo || !email || !password) {
        setError("Veuillez remplir tous les champs");
        setIsLoading(false);
        return false;
      }

      if (pseudo.length < 3) {
        setError("Le pseudo doit contenir au moins 3 caractères");
        setIsLoading(false);
        return false;
      }

      if (!email.includes("@")) {
        setError("Adresse email invalide");
        setIsLoading(false);
        return false;
      }

      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères");
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    }

    try {
      const result = await signUpWithEmail(email, password, pseudo);
      
      if (!result.success) {
        setError(result.error || "Erreur lors de l'inscription");
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      setUser(null);
      setError(null);
      return;
    }

    const result = await authSignOut();
    if (!result.success) {
      setError(result.error || "Erreur lors de la déconnexion");
    }
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitializing,
        isFetchingRole,
        error,
        isConfigured,
        signIn,
        signUp,
        signOut,
        clearError,
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
