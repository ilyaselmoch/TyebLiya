import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Pressable, Image, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { mockDishes, Dish } from "@/lib/dishesService";

type Props = NativeStackScreenProps<AppStackParamList, "ChefMenu">;

export default function ChefMenuScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load chef's dishes on mount
  useEffect(() => {
    loadChefDishes();
  }, []);

  const loadChefDishes = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with real Supabase query when tables are set up
      // For now, show mock dishes
      const chefDishes = mockDishes.filter((d) => d.chef_id === user?.id);
      setDishes(chefDishes.length > 0 ? chefDishes : mockDishes.slice(0, 3));
    } catch (error) {
      console.error("Error loading dishes:", error);
      setDishes(mockDishes.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  };

  const renderDishCard = ({ item }: { item: Dish }) => (
    <Pressable
      style={styles.dishCard}
      onPress={() => navigation.navigate("DishDetail", { dishId: item.id })}
    >
      {item.photo_url && (
        <Image
          source={{ uri: item.photo_url }}
          style={styles.dishImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.dishContent}>
        <ThemedText style={styles.dishTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.dishDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
        <View style={styles.dishFooter}>
          <View>
            <ThemedText style={styles.priceLabel}>Price</ThemedText>
            <ThemedText style={styles.price}>{item.price} MAD</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.prepLabel}>Prep Time</ThemedText>
            <ThemedText style={styles.prepTime}>{item.prep_time}</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.statusLabel}>Status</ThemedText>
            <View
              style={[
                styles.statusBadge,
                item.status === "available"
                  ? styles.statusAvailable
                  : styles.statusHidden,
              ]}
            >
              <ThemedText
                style={[
                  styles.statusText,
                  item.status === "available"
                    ? styles.statusTextAvailable
                    : styles.statusTextHidden,
                ]}
              >
                {item.status === "available" ? "Live" : "Hidden"}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

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
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Menu</ThemedText>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("ChefPostCreation")}
        >
          <Feather name="plus" size={24} color={AppColors.white} />
        </Pressable>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.terracotta} />
        </View>
      ) : dishes.length === 0 ? (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.emptyTitle}>No dishes yet</ThemedText>
          <ThemedText style={styles.emptyText}>
            Add your first dish to get started
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={dishes}
          renderItem={renderDishCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigationBar items={navItems} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.terracotta + "20",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.terracotta,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.warmBrown,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.gray600,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  dishCard: {
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dishImage: {
    width: "100%",
    height: 150,
    backgroundColor: AppColors.sandBeige,
  },
  dishContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  dishTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  dishDescription: {
    fontSize: 12,
    color: AppColors.gray600,
    lineHeight: 16,
  },
  dishFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray200,
  },
  priceLabel: {
    fontSize: 10,
    color: AppColors.gray600,
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.terracotta,
  },
  prepLabel: {
    fontSize: 10,
    color: AppColors.gray600,
    marginBottom: 2,
  },
  prepTime: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.warmBrown,
  },
  statusLabel: {
    fontSize: 10,
    color: AppColors.gray600,
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusAvailable: {
    backgroundColor: AppColors.mintGreen + "20",
  },
  statusHidden: {
    backgroundColor: AppColors.gray300 + "40",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextAvailable: {
    color: AppColors.mintGreen,
  },
  statusTextHidden: {
    color: AppColors.gray600,
  },
});
