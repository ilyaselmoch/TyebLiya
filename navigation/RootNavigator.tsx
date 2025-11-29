import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import AppStackNavigator from "@/navigation/AppStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import { AppColors } from "@/constants/theme";

export default function RootNavigator() {
  const { user, isInitializing } = useAuth();
  const { theme } = useTheme();

  if (isInitializing) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}
      >
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return user ? <AppStackNavigator /> : <AuthStackNavigator />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
