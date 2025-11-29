import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AuthButton } from "@/components/AuthButton";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";
import { saveUserRole } from "@/lib/auth";

// Role selection screen - shown after login if user doesn't have a role
export default function RoleSelectionScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = async (role: "client" | "cuisinier") => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await saveUserRole(user.id, role);
      if (!success) {
        setError("Erreur lors de l'enregistrement du rôle. Veuillez réessayer.");
        setIsLoading(false);
      }
      // No need to manually update - AuthContext will fetch the role on next render
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={[styles.iconContainer, { backgroundColor: AppColors.secondary }]}>
            <Feather name="user-check" size={48} color={AppColors.primary} />
          </View>
          <ThemedText style={styles.title}>
            Bienvenue, {user?.pseudo}
          </ThemedText>
          <ThemedText style={styles.subtitle} type="small">
            Sélectionnez votre rôle pour continuer
          </ThemedText>
        </View>

        {/* Role Options */}
        <View style={styles.optionsContainer}>
          {/* Client Option */}
          <View style={styles.roleCard}>
            <View style={styles.roleIconBg}>
              <Feather name="briefcase" size={32} color={AppColors.primary} />
            </View>
            <ThemedText style={styles.roleTitle}>Client</ThemedText>
            <ThemedText style={styles.roleDescription} type="small">
              Je cherche des services culinaires
            </ThemedText>
            <AuthButton
              variant="primary"
              onPress={() => handleSelectRole("client")}
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Continuer"}
            </AuthButton>
          </View>

          {/* Chef Option */}
          <View style={styles.roleCard}>
            <View style={styles.roleIconBg}>
              <Feather name="menu" size={32} color={AppColors.primary} />
            </View>
            <ThemedText style={styles.roleTitle}>Cuisinier</ThemedText>
            <ThemedText style={styles.roleDescription} type="small">
              Je propose des services culinaires
            </ThemedText>
            <AuthButton
              variant="primary"
              onPress={() => handleSelectRole("cuisinier")}
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Continuer"}
            </AuthButton>
          </View>
        </View>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={20} color={AppColors.primary} />
            <ThemedText style={styles.errorText} type="small">
              {error}
            </ThemedText>
          </View>
        ) : null}
      </ScreenScrollView>
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
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    opacity: 0.6,
    textAlign: "center",
  },
  optionsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing["2xl"],
  },
  roleCard: {
    backgroundColor: AppColors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  roleIconBg: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    textAlign: "center",
    opacity: 0.6,
    marginBottom: Spacing.md,
  },
  errorContainer: {
    flexDirection: "row",
    backgroundColor: AppColors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.md,
  },
  errorText: {
    flex: 1,
    color: AppColors.primary,
  },
});
