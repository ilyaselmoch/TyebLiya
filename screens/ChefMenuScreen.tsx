import React from "react";
import { View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { AppColors, Spacing } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "ChefMenu">;

export default function ChefMenuScreen({ navigation }: Props) {
  const navItems = [
    {
      name: "ChefDashboard",
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate("ChefDashboard"),
      isActive: false,
    },
    {
      name: "ChefOrders",
      icon: "clipboard",
      label: "Orders",
      onPress: () => navigation.navigate("ChefOrders"),
      isActive: false,
    },
    {
      name: "ChefMenu",
      icon: "menu",
      label: "Menu",
      onPress: () => navigation.navigate("ChefMenu"),
      isActive: true,
    },
    {
      name: "ChefProfile",
      icon: "user",
      label: "Profile",
      onPress: () => navigation.navigate("ChefProfile"),
      isActive: false,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView>
        <View style={styles.placeholderContainer}>
          <ThemedText style={styles.title}>Menu</ThemedText>
          <ThemedText style={styles.message}>
            Manage your menu and dishes here
          </ThemedText>
        </View>
      </ScreenScrollView>
      <BottomNavigationBar items={navItems} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.md,
  },
  message: {
    fontSize: 16,
    color: AppColors.gray600,
    textAlign: "center",
  },
});
