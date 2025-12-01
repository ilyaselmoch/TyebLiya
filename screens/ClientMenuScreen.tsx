import React from "react";
import { View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { AppColors, Spacing } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "ClientMenu">;

export default function ClientMenuScreen({ navigation }: Props) {
  const navItems = [
    {
      name: "ClientHome",
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate("ClientHome"),
      isActive: false,
    },
    {
      name: "ClientOrders",
      icon: "clipboard",
      label: "Orders",
      onPress: () => navigation.navigate("ClientOrders"),
      isActive: false,
    },
    {
      name: "ClientMenu",
      icon: "menu",
      label: "Menu",
      onPress: () => navigation.navigate("ClientMenu"),
      isActive: true,
    },
    {
      name: "ClientProfile",
      icon: "user",
      label: "Profile",
      onPress: () => navigation.navigate("ClientProfile"),
      isActive: false,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView>
        <View style={styles.placeholderContainer}>
          <ThemedText style={styles.title}>Menu</ThemedText>
          <ThemedText style={styles.message}>
            Browse available dishes
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
