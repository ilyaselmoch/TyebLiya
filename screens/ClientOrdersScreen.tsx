import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { useCart } from "@/context/CartContext";

type Props = NativeStackScreenProps<AppStackParamList, "ClientOrders">;

// ============================================================================
// STATUS BADGE HELPER
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
      case "completed":
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
      case "completed":
        return "Complété";
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

export default function ClientOrdersScreen({ navigation }: Props) {
  const { cart, orders, submitOrder, cartCount } = useCart();
  const [clientName, setClientName] = useState("Ahmed Bennani");
  const [clientEmail, setClientEmail] = useState("ahmed@example.com");

  // ========== HANDLE CHECKOUT ==========
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Empty Cart", "Add items to your cart before checking out");
      return;
    }

    if (!clientName.trim() || !clientEmail.trim()) {
      Alert.alert("Missing Info", "Please enter your name and email");
      return;
    }

    // Submit order - moves cart items to orders
    submitOrder(clientName, clientEmail);
    Alert.alert("Order Submitted!", "Your order has been placed successfully");
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      isActive: true,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      name: "ClientMenu",
      icon: "menu",
      label: "Menu",
      onPress: () => navigation.navigate("ClientMenu"),
      isActive: false,
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
          onPress={() => navigation.navigate("ClientHome")}
        >
          <Feather name="arrow-left" size={24} color={AppColors.terracotta} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>
          {cart.length > 0 ? "Cart & Orders" : "Your Orders"}
        </ThemedText>
      </View>

      <ScreenKeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        {/* CART SECTION */}
        {cart.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Your Cart</ThemedText>

            <View style={styles.cartItems}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItemCard}>
                  <Image source={{ uri: item.img }} style={styles.cartItemImage} />

                  <View style={styles.cartItemInfo}>
                    <ThemedText style={styles.cartItemName}>
                      {item.dishName}
                    </ThemedText>
                    <ThemedText style={styles.cartItemChef}>
                      by {item.chefName}
                    </ThemedText>
                    <ThemedText style={styles.cartItemPrice}>
                      {item.price} MAD × {item.quantity}
                    </ThemedText>
                  </View>

                  <ThemedText style={styles.cartItemTotal}>
                    {item.price * item.quantity} MAD
                  </ThemedText>
                </View>
              ))}
            </View>

            {/* CART SUMMARY */}
            <View style={styles.cartSummary}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
                <ThemedText style={styles.summaryValue}>{cartTotal} MAD</ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Delivery</ThemedText>
                <ThemedText style={styles.summaryValue}>Free</ThemedText>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <ThemedText style={styles.totalLabel}>Total</ThemedText>
                <ThemedText style={styles.totalValue}>{cartTotal} MAD</ThemedText>
              </View>
            </View>

            {/* CHECKOUT INFO */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Delivery Info</ThemedText>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Name</ThemedText>
                <TextInput
                  style={styles.input}
                  value={clientName}
                  onChangeText={setClientName}
                  placeholder="Your name"
                  placeholderTextColor={AppColors.gray600}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
                <TextInput
                  style={styles.input}
                  value={clientEmail}
                  onChangeText={setClientEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={AppColors.gray600}
                  keyboardType="email-address"
                />
              </View>

              {/* CHECKOUT BUTTON */}
              <Pressable
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <ThemedText style={styles.checkoutButtonText}>
                  Complete Order
                </ThemedText>
              </Pressable>
            </View>
          </View>
        )}

        {/* ORDERS HISTORY SECTION */}
        {orders.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Order History</ThemedText>

            <View style={styles.ordersList}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  {/* ORDER HEADER */}
                  <View style={styles.orderHeader}>
                    <View>
                      <ThemedText style={styles.orderId}>{order.id}</ThemedText>
                      <ThemedText style={styles.orderDate}>
                        {new Date(order.timestamp).toLocaleDateString()} at{" "}
                        {new Date(order.timestamp).toLocaleTimeString()}
                      </ThemedText>
                    </View>
                    <StatusBadge status={order.status} />
                  </View>

                  {/* ORDER ITEMS */}
                  <View style={styles.divider} />
                  <View style={styles.orderItems}>
                    {order.items.map((item) => (
                      <View key={item.id} style={styles.orderItem}>
                        <ThemedText style={styles.orderItemText}>
                          {item.dishName} × {item.quantity}
                        </ThemedText>
                        <ThemedText style={styles.orderItemPrice}>
                          {item.price * item.quantity} MAD
                        </ThemedText>
                      </View>
                    ))}
                  </View>

                  {/* ORDER TOTAL */}
                  <View style={styles.divider} />
                  <View style={styles.orderTotal}>
                    <ThemedText style={styles.orderTotalLabel}>Total</ThemedText>
                    <ThemedText style={styles.orderTotalValue}>
                      {order.totalPrice} MAD
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* EMPTY STATE */}
        {cart.length === 0 && orders.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={AppColors.gray600} />
            <ThemedText style={styles.emptyStateTitle}>No Orders Yet</ThemedText>
            <ThemedText style={styles.emptyStateMessage}>
              Browse the menu and add dishes to your cart
            </ThemedText>
            <Pressable
              style={styles.browseButton}
              onPress={() => navigation.navigate("ClientMenu")}
            >
              <ThemedText style={styles.browseButtonText}>Browse Menu</ThemedText>
            </Pressable>
          </View>
        )}
      </ScreenKeyboardAwareScrollView>

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

  // ========== HEADER ==========
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },

  // ========== SECTIONS ==========
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.md,
  },

  // ========== CART ITEMS ==========
  cartItems: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cartItemCard: {
    flexDirection: "row",
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
  },
  cartItemInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  cartItemChef: {
    fontSize: 12,
    color: AppColors.terracotta,
    fontWeight: "600",
  },
  cartItemPrice: {
    fontSize: 12,
    color: AppColors.gray600,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.saffron,
  },

  // ========== CART SUMMARY ==========
  cartSummary: {
    backgroundColor: AppColors.sandBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: AppColors.gray600,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.warmBrown,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.saffron,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray300,
  },

  // ========== INPUTS ==========
  inputGroup: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.gray300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: AppColors.warmBrown,
    backgroundColor: AppColors.white,
  },

  // ========== CHECKOUT BUTTON ==========
  checkoutButton: {
    backgroundColor: AppColors.mintGreen,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  // ========== ORDERS LIST ==========
  ordersList: {
    gap: Spacing.md,
  },
  orderCard: {
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  orderDate: {
    fontSize: 12,
    color: AppColors.gray600,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  orderItems: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderItemText: {
    fontSize: 12,
    color: AppColors.warmBrown,
  },
  orderItemPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.saffron,
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.md,
  },
  orderTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  orderTotalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.saffron,
  },

  // ========== EMPTY STATE ==========
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.lg,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: AppColors.gray600,
    textAlign: "center",
  },
  browseButton: {
    backgroundColor: AppColors.terracotta,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  browseButtonText: {
    color: AppColors.white,
    fontWeight: "700",
  },
});
