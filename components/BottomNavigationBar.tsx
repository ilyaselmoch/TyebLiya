import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { ThemedText } from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomNavItem {
  name: string;
  icon: string;
  label: string;
  onPress: () => void;
  isActive: boolean;
  badge?: number;
}

interface BottomNavigationBarProps {
  items: BottomNavItem[];
}

export function BottomNavigationBar({ items }: BottomNavigationBarProps) {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: AppColors.white,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      paddingBottom: Platform.OS === "web" ? Spacing.md : bottom + Spacing.md,
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.sm,
      justifyContent: "space-around",
      alignItems: "center",
    },
    item: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: Spacing.sm,
    },
    icon: {
      marginBottom: Spacing.xs,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
    },
    badge: {
      position: "absolute",
      top: -2,
      right: -4,
      backgroundColor: "#EF4444",
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeText: {
      color: "white",
      fontSize: 11,
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Pressable
          key={index}
          style={styles.item}
          onPress={item.onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.icon}>
            <Feather
              name={item.icon as any}
              size={24}
              color={item.isActive ? "#3B82F6" : "#333333"}
            />
            {item.badge && item.badge > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
              </View>
            )}
          </View>
          <ThemedText
            style={[
              styles.label,
              { color: item.isActive ? "#3B82F6" : "#333333" },
            ]}
          >
            {item.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
