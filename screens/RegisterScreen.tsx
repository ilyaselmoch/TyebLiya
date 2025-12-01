import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/Input";
import { AuthButton } from "@/components/AuthButton";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme } = useTheme();
  const { signUp, isLoading, error, clearError } = useAuth();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    if (!pseudo.trim()) {
      setLocalError("Veuillez entrer un pseudo");
      return;
    }

    if (pseudo.trim().length < 3) {
      setLocalError("Le pseudo doit contenir au moins 3 caractères");
      return;
    }

    if (!email.trim()) {
      setLocalError("Veuillez entrer votre email");
      return;
    }

    if (!email.includes("@")) {
      setLocalError("Adresse email invalide");
      return;
    }

    if (!password) {
      setLocalError("Veuillez entrer un mot de passe");
      return;
    }

    if (password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    const success = await signUp(pseudo.trim(), email.trim(), password);

    if (success) {
      setSuccessMessage("Compte créé avec succès ! Redirection...");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1500);
    }
  };

  const displayError = localError || error;

  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 8) return { text: "Faible", color: theme.error };
    if (password.length < 12)
      return { text: "Moyen", color: AppColors.primary };
    return { text: "Fort", color: theme.success };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <ThemedView style={[styles.container, { backgroundColor: AppColors.lightBeige }]}>
      <ScreenKeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <ThemedText style={[styles.title, { color: AppColors.warmBrown }]}>Rejoignez Tyeb Liya</ThemedText>
          <ThemedText style={[styles.subtitle, { color: AppColors.terracotta }]} type="small">
            Créez votre compte en quelques secondes
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <Input
            icon="user"
            placeholder="Pseudo (min. 3 caractères)"
            autoCapitalize="none"
            autoComplete="username"
            value={pseudo}
            onChangeText={(text) => {
              setPseudo(text);
              setLocalError(null);
              setSuccessMessage(null);
            }}
            error={!!displayError && displayError.includes("pseudo")}
          />

          <View style={styles.inputSpacer} />

          <Input
            icon="mail"
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setLocalError(null);
              setSuccessMessage(null);
            }}
            error={!!displayError && displayError.includes("email")}
          />

          <View style={styles.inputSpacer} />

          <Input
            icon="lock"
            placeholder="Mot de passe (min. 8 caractères)"
            isPassword
            autoCapitalize="none"
            autoComplete="new-password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setLocalError(null);
              setSuccessMessage(null);
            }}
            error={!!displayError && displayError.includes("mot de passe")}
          />

          {passwordStrength ? (
            <View style={styles.strengthContainer}>
              <View
                style={[
                  styles.strengthIndicator,
                  { backgroundColor: passwordStrength.color },
                ]}
              />
              <ThemedText
                type="small"
                style={[styles.strengthText, { color: passwordStrength.color }]}
              >
                {passwordStrength.text}
              </ThemedText>
            </View>
          ) : null}

          {displayError ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color={theme.error} />
              <ThemedText style={[styles.errorText, { color: theme.error }]}>
                {displayError}
              </ThemedText>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successContainer}>
              <Feather name="check-circle" size={16} color={theme.success} />
              <ThemedText
                style={[styles.successText, { color: theme.success }]}
              >
                {successMessage}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.buttonSpacer} />

          <AuthButton
            variant="primary"
            onPress={handleRegister}
            loading={isLoading}
            disabled={!!successMessage}
          >
            Créer mon compte
          </AuthButton>
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" style={styles.footerText}>
            Déjà un compte ?
          </ThemedText>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={({ pressed }) => [
              styles.linkButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText
              type="small"
              style={[styles.linkText, { color: AppColors.primary }]}
            >
              Se connecter
            </ThemedText>
          </Pressable>
        </View>
      </ScreenKeyboardAwareScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  headerContainer: {
    marginBottom: Spacing["2xl"],
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    opacity: 0.7,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputSpacer: {
    height: Spacing.md,
  },
  buttonSpacer: {
    height: Spacing.lg,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  strengthIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  strengthText: {
    fontSize: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  errorText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  successText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
  footerText: {
    opacity: 0.7,
  },
  linkButton: {
    marginLeft: Spacing.xs,
    padding: Spacing.xs,
  },
  linkText: {
    fontWeight: "600",
  },
});
