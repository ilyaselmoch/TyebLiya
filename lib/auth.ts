import { getSupabase, isSupabaseConfigured } from "./supabase";
import { AuthError, Session, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  pseudo: string;
  email: string;
  created_at: string;
}

export interface UserRole {
  role: "client" | "cuisinier";
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  session?: Session;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return {
      success: false,
      error: "Supabase n'est pas configuré. Veuillez ajouter les clés API.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: translateAuthError(error),
      };
    }

    return {
      success: true,
      user: data.user ?? undefined,
      session: data.session ?? undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: "Une erreur inattendue est survenue. Veuillez réessayer.",
    };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  pseudo: string
): Promise<AuthResult> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return {
      success: false,
      error: "Supabase n'est pas configuré. Veuillez ajouter les clés API.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          pseudo,
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: translateAuthError(error),
      };
    }

    if (data.user) {
      await createProfile(data.user.id, pseudo, email);
    }

    return {
      success: true,
      user: data.user ?? undefined,
      session: data.session ?? undefined,
    };
  } catch (err) {
    return {
      success: false,
      error: "Une erreur inattendue est survenue. Veuillez réessayer.",
    };
  }
}

export async function signOut(): Promise<AuthResult> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: translateAuthError(error),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Erreur lors de la déconnexion.",
    };
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return null;
  }

  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return null;
  }

  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Profile;
  } catch {
    return null;
  }
}

// Fetch user role from the "users" table
// Returns the role ("client" or "cuisinier") if found, null otherwise
export async function getUserRole(userId: string): Promise<"client" | "cuisinier" | null> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.warn("Role not found for user:", userId);
      return null;
    }

    const role = data.role as "client" | "cuisinier" | null;
    return role === "client" || role === "cuisinier" ? role : null;
  } catch (err) {
    console.error("Error fetching user role:", err);
    return null;
  }
}

async function createProfile(
  userId: string,
  pseudo: string,
  email: string
): Promise<void> {
  const supabase = getSupabase();
  
  if (!supabase) {
    return;
  }

  try {
    await supabase.from("profiles").insert({
      id: userId,
      pseudo,
      email,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error creating profile:", err);
  }
}

function translateAuthError(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    "Invalid login credentials": "Email ou mot de passe incorrect",
    "Email not confirmed": "Veuillez confirmer votre email avant de vous connecter",
    "User already registered": "Un compte existe déjà avec cet email",
    "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères",
    "Unable to validate email address: invalid format": "Format d'email invalide",
    "Signup disabled": "Les inscriptions sont temporairement désactivées",
    "Email rate limit exceeded": "Trop de tentatives. Veuillez réessayer plus tard.",
    "Invalid email or password": "Email ou mot de passe incorrect",
  };

  return errorMessages[error.message] || error.message || "Une erreur est survenue";
}

export function onAuthStateChange(
  callback: (session: Session | null) => void
): () => void {
  const supabase = getSupabase();
  
  if (!supabase) {
    return () => {};
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => {
    data.subscription.unsubscribe();
  };
}
