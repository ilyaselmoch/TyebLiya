import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AuthButton } from "@/components/AuthButton";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";

// Client home screen - displayed for users with "client" role
export default function ClientHomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome section with role indicator */}
        <View style={styles.welcomeContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: AppColors.secondary },
            ]}
          >
            <Feather name="user" size={48} color={AppColors.primary} />
          </View>
          <ThemedText style={styles.welcomeTitle}>
            Bienvenue, {user?.pseudo}
          </ThemedText>
          <ThemedText style={styles.roleLabel}>
            Rôle: Client
          </ThemedText>
        </View>

        {/* User information card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="user" size={20} color={AppColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText type="small" style={styles.infoLabel}>
                Pseudo
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.pseudo || "Non défini"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="mail" size={20} color={AppColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText type="small" style={styles.infoLabel}>
                Email
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.email || "Non défini"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="shield" size={20} color={AppColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText type="small" style={styles.infoLabel}>
                Rôle
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.role === "client" ? "Client" : "Non attribué"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Placeholder for future client features */}
        <View style={styles.placeholderContainer}>
          <Feather name="briefcase" size={32} color={AppColors.gray600} />
          <ThemedText style={styles.placeholderText} type="small">
            Fonctionnalités client en développement...
          </ThemedText>
        </View>

        {/* Logout button */}
        <View style={styles.logoutContainer}>
          <AuthButton
            variant="outline"
            onPress={signOut}
            icon={<Feather name="log-out" size={18} color={AppColors.primary} />}
          >
            Se déconnecter
          </AuthButton>
        </View>
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
  welcomeContainer: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  roleLabel: {
    fontSize: 14,
    opacity: 0.6,
    color: AppColors.primary,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: AppColors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xs,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    opacity: 0.6,
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray300,
    marginVertical: Spacing.sm,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    opacity: 0.5,
  },
  placeholderText: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
  logoutContainer: {
    paddingTop: Spacing.lg,
  },
});
