import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { useCart, CartItem } from "@/context/CartContext";

type Props = NativeStackScreenProps<AppStackParamList, "ClientMenu">;

// ============================================================================
// MOCK DISHES DATA
// ============================================================================

interface Dish {
  id: string;
  name: string;
  chefName: string;
  chefId: string;
  price: number;
  image: string;
  description: string;
  rating: number;
}

const mockDishes: Dish[] = [
  {
    id: "d1",
    name: "Couscous Royal",
    chefName: "Chef Youssef",
    chefId: "chef-1",
    price: 89,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Couscous",
    description: "Traditional Moroccan couscous with seven vegetables",
    rating: 4.8,
  },
  {
    id: "d2",
    name: "Tajine de Poulet",
    chefName: "Chef Amira",
    chefId: "chef-2",
    price: 75,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Tajine",
    description: "Tender chicken tagine with preserved lemons",
    rating: 4.9,
  },
  {
    id: "d3",
    name: "Pastilla aux Amandes",
    chefName: "Chef Youssef",
    chefId: "chef-1",
    price: 65,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Pastilla",
    description: "Crispy phyllo pastry with almond filling",
    rating: 4.7,
  },
  {
    id: "d4",
    name: "Harira Marocaine",
    chefName: "Chef Fatima",
    chefId: "chef-3",
    price: 35,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Harira",
    description: "Rich tomato-based soup with chickpeas",
    rating: 4.6,
  },
  {
    id: "d5",
    name: "Grilled Brochettes",
    chefName: "Chef Karim",
    chefId: "chef-4",
    price: 55,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Brochettes",
    description: "Seasoned meat skewers with herbs",
    rating: 4.8,
  },
  {
    id: "d6",
    name: "Zaalouk",
    chefName: "Chef Amira",
    chefId: "chef-2",
    price: 28,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Zaalouk",
    description: "Roasted eggplant and tomato salad",
    rating: 4.5,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ClientMenuScreen({ navigation }: Props) {
  const { addToCart, cartCount } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>(
    {}
  );
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  // ========== HANDLE ADD TO CART ==========
  const handleAddToCart = (dish: Dish) => {
    const quantity = selectedQuantities[dish.id] || 1;

    // Create cart item
    const cartItem: CartItem = {
      id: dish.id,
      dishName: dish.name,
      chefName: dish.chefName,
      chefId: dish.chefId,
      price: dish.price,
      quantity,
      img: dish.image,
    };

    // Add to cart
    addToCart(cartItem);

    // Show feedback
    setAddingItemId(dish.id);
    Alert.alert("Added to Cart!", `${dish.name} added (x${quantity})`);

    // Reset after feedback
    setTimeout(() => {
      setAddingItemId(null);
      setSelectedQuantities({ ...selectedQuantities, [dish.id]: 1 });
    }, 1000);
  };

  // ========== UPDATE QUANTITY ==========
  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity > 0) {
      setSelectedQuantities({
        ...selectedQuantities,
        [dishId]: quantity,
      });
    }
  };

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
      badge: cartCount > 0 ? cartCount : undefined,
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
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Feather name="arrow-left" size={28} color={AppColors.terracotta} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Menu</ThemedText>
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <ThemedText style={styles.cartBadgeText}>{cartCount}</ThemedText>
          </View>
        )}
      </View>

      <ScreenScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        {/* DISHES GRID */}
        <View style={styles.dishesContainer}>
          {mockDishes.map((dish) => (
            <View key={dish.id} style={styles.dishCard}>
              {/* DISH IMAGE */}
              <Image source={{ uri: dish.image }} style={styles.dishImage} />

              {/* DISH INFO */}
              <View style={styles.dishContent}>
                <ThemedText style={styles.dishName} numberOfLines={1}>
                  {dish.name}
                </ThemedText>

                <ThemedText style={styles.chefName} numberOfLines={1}>
                  by {dish.chefName}
                </ThemedText>

                <View style={styles.ratingRow}>
                  <Feather name="star" size={14} color={AppColors.saffron} fill={AppColors.saffron} />
                  <ThemedText style={styles.rating}>{dish.rating}</ThemedText>
                </View>

                <ThemedText style={styles.dishDescription} numberOfLines={2}>
                  {dish.description}
                </ThemedText>

                <ThemedText style={styles.dishPrice}>{dish.price} MAD</ThemedText>
              </View>

              {/* QUANTITY SELECTOR & ADD BUTTON */}
              <View style={styles.actionSection}>
                <View style={styles.quantitySelector}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(
                        dish.id,
                        (selectedQuantities[dish.id] || 1) - 1
                      )
                    }
                  >
                    <ThemedText style={styles.quantityButtonText}>−</ThemedText>
                  </Pressable>

                  <ThemedText style={styles.quantityValue}>
                    {selectedQuantities[dish.id] || 1}
                  </ThemedText>

                  <Pressable
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(
                        dish.id,
                        (selectedQuantities[dish.id] || 1) + 1
                      )
                    }
                  >
                    <ThemedText style={styles.quantityButtonText}>+</ThemedText>
                  </Pressable>
                </View>

                <Pressable
                  style={[
                    styles.addButton,
                    addingItemId === dish.id && styles.addButtonActive,
                  ]}
                  onPress={() => handleAddToCart(dish)}
                >
                  <Feather
                    name={addingItemId === dish.id ? "check" : "shopping-cart"}
                    size={16}
                    color={AppColors.white}
                  />
                  <ThemedText style={styles.addButtonText}>
                    {addingItemId === dish.id ? "Added" : "Add"}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScreenScrollView>

      <BottomNavigationBar items={navItems} />
    </ThemedView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
    gap: Spacing.md,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: AppColors.terracotta,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  cartBadge: {
    backgroundColor: AppColors.terracotta,
    borderRadius: BorderRadius.full,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: AppColors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  dishesContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  dishCard: {
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dishImage: {
    width: "100%",
    height: 140,
  },
  dishContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  chefName: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.terracotta,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
  },
  dishDescription: {
    fontSize: 12,
    color: AppColors.gray600,
    marginVertical: Spacing.xs,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.saffron,
    marginVertical: Spacing.sm,
  },
  actionSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.sandBeige,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.warmBrown,
    marginHorizontal: Spacing.xs,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: AppColors.mintGreen,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
  },
  addButtonActive: {
    backgroundColor: AppColors.saffron,
  },
  addButtonText: {
    color: AppColors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
