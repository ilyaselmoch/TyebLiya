import React, { useState } from "react";
import { View, StyleSheet, Pressable, useWindowDimensions, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";
import { saveUserRole, getUserRole } from "@/lib/auth";

// Spring animation configuration for smooth button interactions
const springConfig: WithSpringConfig = {
  damping: 12,
  mass: 0.8,
  stiffness: 100,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Role selection screen - shown after login if user doesn't have a role
// Centered layout with two role buttons, responsive to screen size
export default function RoleSelectionScreen() {
  const { user, setUserRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  // Determine if we're on a desktop-like screen (wider than 600px)
  const isDesktop = width > 600;

  // Handle role selection: update context immediately, save to Supabase in background
  const handleSelectRole = async (role: "client" | "cuisinier") => {
    if (!user?.id || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update context immediately so UI responds instantly
      if (setUserRole) {
        setUserRole(role);
      }

      // Try to save to Supabase in background (non-blocking)
      // This handles the case where the users table doesn't exist yet
      saveUserRole(user.id, role).catch((err) => {
        console.warn("Failed to save role to Supabase (non-blocking):", err);
      });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: AppColors.lightBeige }]}>
      {/* Centered content container */}
      <View style={styles.centerContainer}>
        {/* Welcome section */}
        <View style={styles.welcomeSection}>
          {/* Welcome icon */}
          <View style={[styles.welcomeIcon, { backgroundColor: AppColors.primary }]}>
            <Feather name="smile" size={40} color={AppColors.white} />
          </View>

          {/* Welcome text */}
          <ThemedText style={styles.welcomeTitle}>
            Bienvenue, {user?.pseudo}
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Sélectionnez votre rôle pour commencer
          </ThemedText>
        </View>

        {/* Buttons container - responsive layout */}
        {/* On desktop: horizontal flex, on mobile: vertical stack */}
        <View
          style={[
            styles.buttonsContainer,
            {
              flexDirection: isDesktop ? "row" : "column",
              gap: isDesktop ? Spacing.xl : Spacing.lg,
            },
          ]}
        >
          {/* Client Button */}
          <RoleButton
            role="client"
            title="Client"
            description="Je cherche des services culinaires"
            iconName="briefcase"
            onPress={() => handleSelectRole("client")}
            disabled={isLoading}
            isLoading={isLoading}
            isDesktop={isDesktop}
          />

          {/* Cuisinier Button */}
          <RoleButton
            role="cuisinier"
            title="Cuisinier"
            description="Je propose des services culinaires"
            iconName="menu"
            onPress={() => handleSelectRole("cuisinier")}
            disabled={isLoading}
            isLoading={isLoading}
            isDesktop={isDesktop}
          />
        </View>

        {/* Error message display */}
        {error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={18} color={AppColors.primary} />
            <ThemedText style={styles.errorText} type="small">
              {error}
            </ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

// Individual role button component with animation and styling
interface RoleButtonProps {
  role: "client" | "cuisinier";
  title: string;
  description: string;
  iconName: string;
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
  isDesktop: boolean;
}

function RoleButton({
  role,
  title,
  description,
  iconName,
  onPress,
  disabled,
  isLoading,
  isDesktop,
}: RoleButtonProps) {
  // Animation state for button press effect
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Handle button press animation
  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, springConfig);
    }
  };

  // Determine button width: full width on mobile, equal share on desktop
  const buttonStyle = {
    flex: isDesktop ? 1 : undefined,
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[styles.roleButton, buttonStyle, animatedStyle]}
    >
      {/* Button background with primary color */}
      <View
        style={[styles.buttonGradient, { backgroundColor: AppColors.primary }]}
      >
        {/* Loading spinner or content */}
        {isLoading ? (
          <ActivityIndicator size="small" color={AppColors.white} />
        ) : (
          <>
            {/* Icon section */}
            <View style={styles.buttonIconContainer}>
              <View style={styles.buttonIcon}>
                <Feather
                  name={iconName as any}
                  size={28}
                  color={AppColors.white}
                />
              </View>
            </View>

            {/* Text section */}
            <View style={styles.buttonTextContainer}>
              <ThemedText style={styles.buttonTitle}>{title}</ThemedText>
              <ThemedText style={styles.buttonDescription}>{description}</ThemedText>
            </View>
          </>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  // Main gradient background container
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },

  // Center container for all content
  centerContainer: {
    width: "100%",
    maxWidth: 800, // Limit width on very large screens
    alignItems: "center",
    gap: Spacing["3xl"],
  },

  // Welcome section styling
  welcomeSection: {
    alignItems: "center",
    gap: Spacing.md,
  },

  // Welcome icon styling with background
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },

  // Welcome title text
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: AppColors.warmBrown,
  },

  // Welcome subtitle text with reduced opacity
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    opacity: 0.8,
    color: AppColors.warmBrown,
  },

  // Buttons container - flex layout changes based on screen size
  buttonsContainer: {
    width: "100%",
    alignItems: "stretch",
  },

  // Role button wrapper with animation
  roleButton: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    minHeight: 200,
  },

  // Button gradient background
  buttonGradient: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.terracotta,
  },

  // Button icon container
  buttonIconContainer: {
    marginBottom: Spacing.md,
  },

  // Icon styling with white background
  buttonIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Button text container
  buttonTextContainer: {
    alignItems: "center",
    gap: Spacing.xs,
  },

  // Button title text
  buttonTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.white,
  },

  // Button description text
  buttonDescription: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },

  // Error message container
  errorContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.md,
    width: "100%",
  },

  // Error text styling
  errorText: {
    flex: 1,
    color: AppColors.primary,
  },
});
