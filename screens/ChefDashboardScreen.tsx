import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";

// ============================================================================
// MOCK DATA TYPES AND ARRAYS
// ============================================================================

interface Order {
  id: string;
  clientName: string;
  dishTitle: string;
  quantity: number;
  time: string;
  status: "pending" | "accepted" | "cooking" | "ready";
  dishImage: string;
}

interface Dish {
  id: string;
  name: string;
  price: number;
  image: string;
  status: "available" | "hidden";
}

const mockOrders: Order[] = [
  {
    id: "o1",
    clientName: "Ahmed Ben Ali",
    dishTitle: "Couscous Royal",
    quantity: 2,
    time: "20 min",
    status: "pending",
    dishImage: "https://via.placeholder.com/80/F7C6A3/252525?text=Couscous",
  },
  {
    id: "o2",
    clientName: "Fatima Moradi",
    dishTitle: "Tajine de Poulet",
    quantity: 1,
    time: "15 min",
    status: "accepted",
    dishImage: "https://via.placeholder.com/80/F7C6A3/252525?text=Tajine",
  },
  {
    id: "o3",
    clientName: "Karim Hassan",
    dishTitle: "Pastilla aux Amandes",
    quantity: 3,
    time: "10 min",
    status: "cooking",
    dishImage: "https://via.placeholder.com/80/F7C6A3/252525?text=Pastilla",
  },
  {
    id: "o4",
    clientName: "Amira Zahra",
    dishTitle: "Harira Marocaine",
    quantity: 2,
    time: "5 min",
    status: "ready",
    dishImage: "https://via.placeholder.com/80/F7C6A3/252525?text=Harira",
  },
];

const mockDishes: Dish[] = [
  {
    id: "d1",
    name: "Couscous Royal",
    price: 89,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Couscous",
    status: "available",
  },
  {
    id: "d2",
    name: "Tajine de Poulet",
    price: 75,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Tajine",
    status: "available",
  },
  {
    id: "d3",
    name: "Pastilla aux Amandes",
    price: 65,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Pastilla",
    status: "hidden",
  },
  {
    id: "d4",
    name: "Harira Marocaine",
    price: 35,
    image: "https://via.placeholder.com/150/F7C6A3/252525?text=Harira",
    status: "available",
  },
];

// ============================================================================
// COMPONENT HELPER: STATUS BADGE
// ============================================================================

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case "pending":
        return AppColors.saffron;
      case "accepted":
        return AppColors.mintGreen;
      case "cooking":
        return AppColors.terracotta;
      case "ready":
        return "#16A34A";
      case "available":
        return AppColors.mintGreen;
      case "hidden":
        return AppColors.gray600;
      default:
        return AppColors.gray600;
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Accepté";
      case "cooking":
        return "Cuisson";
      case "ready":
        return "Prêt";
      case "available":
        return "Disponible";
      case "hidden":
        return "Caché";
      default:
        return s;
    }
  };

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: getStatusColor(status) + "20" },
      ]}
    >
      <ThemedText
        style={[styles.statusBadgeText, { color: getStatusColor(status) }]}
      >
        {getStatusLabel(status)}
      </ThemedText>
    </View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ChefDashboardScreen() {
  const { user, signOut } = useAuth();
  const { width } = useWindowDimensions();

  // State management
  const [isOpen, setIsOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [ordersToday] = useState(5);
  const [earningsToday] = useState(240);
  const [rating] = useState(4.9);

  // Order action handlers
  const handleAcceptOrder = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: "accepted" as const } : o
      )
    );
  };

  const handleDeclineOrder = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  const handleStartCooking = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: "cooking" as const } : o
      )
    );
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: "ready" as const } : o
      )
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER WITH LOGO AND APP NAME */}
      <View style={styles.headerTop}>
        <View style={styles.logoSmallHeader}>
          <ThemedText style={styles.logoTextHeader}>TL</ThemedText>
        </View>
        <ThemedText style={styles.appNameTopHeader}>Tyeb Liya</ThemedText>
        <Pressable
          onPress={() => setIsOpen(!isOpen)}
          style={[
            styles.availabilityToggle,
            { backgroundColor: isOpen ? AppColors.mintGreen : AppColors.terracotta },
          ]}
        >
          <Feather
            name={isOpen ? "check-circle" : "x-circle"}
            size={14}
            color={AppColors.white}
          />
        </Pressable>
      </View>

      {/* MAIN CONTENT */}
      <ScreenScrollView>
        {/* TODAY'S SUMMARY - 3 stat cards in a row */}
        <View style={styles.summaryContainer}>
          {/* Orders Today */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardTop}>
              <ThemedText style={styles.summaryLabel}>Orders</ThemedText>
              <Feather name="shopping-cart" size={18} color={AppColors.terracotta} />
            </View>
            <ThemedText style={styles.summaryValue}>{ordersToday}</ThemedText>
          </View>

          {/* Earnings Today */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardTop}>
              <ThemedText style={styles.summaryLabel}>Earnings</ThemedText>
              <Feather name="trending-up" size={18} color={AppColors.saffron} />
            </View>
            <ThemedText style={styles.summaryValue}>{earningsToday}</ThemedText>
          </View>

          {/* Rating */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardTop}>
              <ThemedText style={styles.summaryLabel}>Rating</ThemedText>
              <Feather name="star" size={18} color={AppColors.saffron} fill={AppColors.saffron} />
            </View>
            <ThemedText style={styles.summaryValue}>{rating}</ThemedText>
          </View>
        </View>

        {/* INCOMING ORDERS SECTION */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Incoming Orders</ThemedText>

          {orders.length > 0 ? (
            <View style={styles.ordersList}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  {/* Left: Dish Image */}
                  <Image source={{ uri: order.dishImage }} style={styles.orderDishImage} />

                  {/* Center: Order Info */}
                  <View style={styles.orderInfo}>
                    <ThemedText style={styles.orderClientName}>
                      {order.clientName}
                    </ThemedText>
                    <ThemedText style={styles.orderDishTitle}>{order.dishTitle}</ThemedText>
                    <View style={styles.orderMeta}>
                      <ThemedText style={styles.orderMetaText}>
                        {order.quantity}x • {order.time}
                      </ThemedText>
                    </View>
                    <StatusBadge status={order.status} />
                  </View>

                  {/* Right: Action Buttons */}
                  <View style={styles.orderButtons}>
                    {order.status === "pending" && (
                      <>
                        <Pressable
                          style={[styles.orderButton, styles.acceptButton]}
                          onPress={() => handleAcceptOrder(order.id)}
                        >
                          <Feather name="check" size={16} color={AppColors.white} />
                        </Pressable>
                        <Pressable
                          style={[styles.orderButton, styles.declineButton]}
                          onPress={() => handleDeclineOrder(order.id)}
                        >
                          <Feather name="x" size={16} color={AppColors.white} />
                        </Pressable>
                      </>
                    )}

                    {order.status === "accepted" && (
                      <Pressable
                        style={[styles.orderButton, styles.cookingButton]}
                        onPress={() => handleStartCooking(order.id)}
                      >
                        <Feather name="fire" size={16} color={AppColors.white} />
                      </Pressable>
                    )}

                    {order.status === "cooking" && (
                      <Pressable
                        style={[styles.orderButton, styles.readyButton]}
                        onPress={() => handleMarkReady(order.id)}
                      >
                        <Feather name="check-circle" size={16} color={AppColors.white} />
                      </Pressable>
                    )}

                    {order.status === "ready" && (
                      <View style={[styles.orderButton, styles.readyButton]}>
                        <Feather name="check-circle" size={16} color={AppColors.white} />
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={32} color={AppColors.gray600} />
              <ThemedText style={styles.emptyStateText}>No incoming orders</ThemedText>
            </View>
          )}
        </View>

        {/* YOUR DISHES SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Your Dishes</ThemedText>
            <Pressable
              style={styles.addDishButton}
              onPress={() => Alert.alert("Add New Dish", "Modal to add dish coming soon!")}
            >
              <Feather name="plus" size={16} color={AppColors.white} />
            </Pressable>
          </View>

          <View style={styles.dishesGrid}>
            {mockDishes.map((dish) => (
              <View key={dish.id} style={styles.dishCard}>
                <Image source={{ uri: dish.image }} style={styles.dishCardImage} />
                <View style={styles.dishCardContent}>
                  <ThemedText style={styles.dishCardName} numberOfLines={1}>
                    {dish.name}
                  </ThemedText>
                  <ThemedText style={styles.dishCardPrice}>{dish.price} MAD</ThemedText>
                  <View style={styles.dishCardFooter}>
                    <StatusBadge status={dish.status} />
                    <Pressable style={styles.editButton}>
                      <Feather name="edit-2" size={13} color={AppColors.white} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* EARNINGS STATISTICS */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Earnings</ThemedText>
          <View style={styles.earningsRow}>
            <View style={styles.earningsCard}>
              <ThemedText style={styles.earningsLabel}>This Week</ThemedText>
              <ThemedText style={styles.earningsAmount}>920 MAD</ThemedText>
            </View>
            <View style={styles.earningsCard}>
              <ThemedText style={styles.earningsLabel}>This Month</ThemedText>
              <ThemedText style={styles.earningsAmount}>3,750 MAD</ThemedText>
            </View>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={signOut}>
            <Feather name="log-out" size={18} color={AppColors.terracotta} />
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </Pressable>
        </View>
      </ScreenScrollView>
    </ThemedView>
  );
}

// ============================================================================
// STYLES - CLEAN, MODERN, MOROCCAN DESIGN
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ========== HEADER ==========
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
    gap: Spacing.md,
  },
  logoSmallHeader: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.terracotta,
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.white,
  },
  appNameTopHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
    flex: 1,
  },
  availabilityToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },

  // ========== SUMMARY CARDS ==========
  summaryContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },

  // ========== SECTIONS ==========
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.terracotta,
  },

  // ========== ORDERS LIST ==========
  ordersList: {
    gap: Spacing.md,
  },
  orderCard: {
    flexDirection: "row",
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  orderDishImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
  },
  orderInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  orderClientName: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  orderDishTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.dark,
  },
  orderMeta: {
    marginBottom: Spacing.xs,
  },
  orderMetaText: {
    fontSize: 11,
    fontWeight: "500",
    color: AppColors.gray600,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  orderButtons: {
    gap: Spacing.xs,
  },
  orderButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: AppColors.mintGreen,
  },
  declineButton: {
    backgroundColor: AppColors.terracotta,
  },
  cookingButton: {
    backgroundColor: AppColors.saffron,
  },
  readyButton: {
    backgroundColor: "#16A34A",
  },

  // ========== EMPTY STATE ==========
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["2xl"],
    gap: Spacing.md,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: "500",
    color: AppColors.gray600,
  },

  // ========== DISHES GRID ==========
  dishesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "space-between",
  },
  dishCard: {
    width: "48%",
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dishCardImage: {
    width: "100%",
    height: 120,
  },
  dishCardContent: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  dishCardName: {
    fontSize: 13,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  dishCardPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.terracotta,
  },
  dishCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.mintGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  addDishButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: AppColors.terracotta,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  // ========== EARNINGS ==========
  earningsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  earningsCard: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.terracotta,
  },

  // ========== LOGOUT ==========
  logoutSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1.5,
    borderColor: AppColors.terracotta,
    borderRadius: BorderRadius.lg,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.terracotta,
  },
});
