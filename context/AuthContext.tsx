import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  pseudo: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!email || !password) {
        setError("Veuillez remplir tous les champs");
        return false;
      }

      if (!email.includes("@")) {
        setError("Adresse email invalide");
        return false;
      }

      if (password.length < 6) {
        setError("Mot de passe incorrect");
        return false;
      }

      setUser({
        id: "user-" + Date.now(),
        email,
        pseudo: email.split("@")[0],
      });
      return true;
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    pseudo: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!pseudo || !email || !password) {
        setError("Veuillez remplir tous les champs");
        return false;
      }

      if (pseudo.length < 3) {
        setError("Le pseudo doit contenir au moins 3 caractères");
        return false;
      }

      if (!email.includes("@")) {
        setError("Adresse email invalide");
        return false;
      }

      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères");
        return false;
      }

      return true;
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
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
        error,
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
