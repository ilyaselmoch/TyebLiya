import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Pressable,
  Linking,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/Input";
import { AuthButton } from "@/components/AuthButton";
import { Divider } from "@/components/Divider";
import { GoogleIcon } from "@/components/GoogleIcon";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { signIn, isLoading, error, clearError, isConfigured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Veuillez entrer votre email");
      return;
    }

    if (!password) {
      setLocalError("Veuillez entrer votre mot de passe");
      return;
    }

    await signIn(email.trim(), password);
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS === "web") {
      setLocalError(
        "Connexion Google disponible uniquement sur l'application mobile"
      );
      return;
    }
    setLocalError("Connexion Google en cours de configuration...");
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== "ios") {
      return;
    }
    setLocalError("Connexion Apple en cours de configuration...");
  };

  const displayError = localError || error;

  return (
    <ThemedView style={[styles.container, { backgroundColor: AppColors.lightBeige }]}>
      <ScreenKeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing["2xl"],
            paddingBottom: insets.bottom + Spacing["2xl"],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View
            style={[
              styles.logoBackground,
              { backgroundColor: AppColors.secondary },
            ]}
          >
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ThemedText style={styles.appName}>Tyeb Liya</ThemedText>
          <ThemedText style={styles.tagline} type="small">
            Bienvenue
          </ThemedText>
          {!isConfigured ? (
            <View
              style={[
                styles.demoBadge,
                { backgroundColor: AppColors.secondary },
              ]}
            >
              <Feather name="info" size={12} color={AppColors.primary} />
              <ThemedText style={styles.demoText} type="small">
                Mode démo
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.formContainer}>
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
            }}
            error={!!displayError}
          />

          <View style={styles.inputSpacer} />

          <Input
            icon="lock"
            placeholder="Mot de passe"
            isPassword
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setLocalError(null);
            }}
            error={!!displayError}
          />

          {displayError ? (
            <View style={styles.errorContainer}>
              <Feather name="alert-circle" size={16} color={theme.error} />
              <ThemedText style={[styles.errorText, { color: theme.error }]}>
                {displayError}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.buttonSpacer} />

          <AuthButton
            variant="primary"
            onPress={handleLogin}
            loading={isLoading}
          >
            Se connecter
          </AuthButton>

          <Divider text="ou" />

          <AuthButton
            variant="google"
            onPress={handleGoogleLogin}
            icon={<GoogleIcon size={20} />}
          >
            Continuer avec Google
          </AuthButton>

          {Platform.OS === "ios" ? (
            <>
              <View style={styles.socialSpacer} />
              <AuthButton
                variant="apple"
                onPress={handleAppleLogin}
                icon={
                  <Feather name="smartphone" size={20} color={AppColors.white} />
                }
              >
                Continuer avec Apple
              </AuthButton>
            </>
          ) : null}
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" style={styles.footerText}>
            Pas encore de compte ?
          </ThemedText>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={({ pressed }) => [
              styles.linkButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText
              type="small"
              style={[styles.linkText, { color: AppColors.primary }]}
            >
              Créer un compte
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
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    backgroundColor: AppColors.terracotta,
  },
  logo: {
    width: 70,
    height: 70,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: Spacing.xs,
    color: AppColors.warmBrown,
  },
  tagline: {
    opacity: 0.9,
    color: AppColors.terracotta,
  },
  demoBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
    gap: 4,
    backgroundColor: AppColors.saffron + "20",
  },
  demoText: {
    fontSize: 12,
    color: AppColors.terracotta,
    fontWeight: "500",
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
  socialSpacer: {
    height: Spacing.md,
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
    color: AppColors.terracotta,
  },
});
