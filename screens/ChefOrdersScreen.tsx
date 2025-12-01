import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "ChefOrders">;

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

export default function ChefOrdersScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

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
      isActive: true,
    },
    {
      name: "ChefMenu",
      icon: "menu",
      label: "Menu",
      onPress: () => navigation.navigate("ChefMenu"),
      isActive: false,
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
      <ScreenScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        {/* INCOMING ORDERS SECTION */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Incoming Orders</ThemedText>

          {orders.length > 0 ? (
            <View style={styles.ordersList}>
              {orders.map((order) => (
                <Pressable
                  key={order.id}
                  onPress={() => navigation.navigate("ChefOrderDetails", { orderId: order.id })}
                >
                  <View style={styles.orderCard}>
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
                          <Feather name="zap" size={16} color={AppColors.white} />
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
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={32} color={AppColors.gray600} />
              <ThemedText style={styles.emptyStateText}>No incoming orders</ThemedText>
            </View>
          )}
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

  // ========== SECTIONS ==========
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.terracotta,
    marginBottom: Spacing.md,
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
});
