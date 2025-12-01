import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";

type Props = NativeStackScreenProps<AppStackParamList, "ChefOrderDetails">;

// TYPE DEFINITIONS
type OrderStatus = "Pending" | "Accepted" | "Cooking" | "Ready";

interface Order {
  id: string;
  status: OrderStatus;
  client: {
    name: string;
    avatar: string;
    address: string;
    phone: string;
  };
  items: Array<{
    id: number;
    name: string;
    qty: number;
    price: number;
    img: string;
  }>;
  fees: {
    delivery: number;
    platform: number;
  };
  notes: string;
}

// MOCK DATA
const mockOrder: Order = {
  id: "order-001",
  status: "Cooking",
  client: {
    name: "Sara El Malki",
    avatar: "https://i.pravatar.cc/150?img=12",
    address: "Boulevard Hassan II, Casablanca",
    phone: "0654 123 987",
  },
  items: [
    {
      id: 1,
      name: "Couscous Royal",
      qty: 2,
      price: 45,
      img: "https://picsum.photos/200/200?1",
    },
    { id: 2, name: "Harira", qty: 1, price: 25, img: "https://picsum.photos/200/200?2" },
  ],
  fees: {
    delivery: 10,
    platform: 5,
  },
  notes: "Please no spicy.",
};

export default function ChefOrderDetailsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order>(mockOrder);
  const [chefNote, setChefNote] = useState("");

  // Get status badge background color
  const getStatusBadgeColor = () => {
    switch (order.status) {
      case "Pending":
        return AppColors.lightBeige;
      case "Accepted":
        return AppColors.mintGreen;
      case "Cooking":
        return AppColors.saffron;
      case "Ready":
        return AppColors.mintGreen;
      default:
        return AppColors.sandBeige;
    }
  };

  // Get status badge text color
  const getStatusBadgeTextColor = () => {
    switch (order.status) {
      case "Pending":
        return AppColors.warmBrown;
      case "Cooking":
        return AppColors.warmBrown;
      default:
        return AppColors.white;
    }
  };

  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + order.fees.delivery + order.fees.platform;

  // Handle status actions
  const handleAcceptOrder = () => {
    setOrder({ ...order, status: "Accepted" });
    Alert.alert("Success", "Order accepted!");
  };

  const handleDeclineOrder = () => {
    Alert.alert("Decline", "Order declined", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleStartCooking = () => {
    setOrder({ ...order, status: "Cooking" });
    Alert.alert("Success", "You've started cooking!");
  };

  const handleMarkReady = () => {
    setOrder({ ...order, status: "Ready" });
    Alert.alert("Success", "Order marked as ready!");
  };

  const handleSaveNote = () => {
    Alert.alert("Success", "Note saved!");
    setChefNote("");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: AppColors.lightBeige }]}>
      {/* STICKY HEADER */}
      <View style={styles.stickyHeader}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={AppColors.terracotta} />
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor() }]}>
          <Text style={[styles.statusBadgeText, { color: getStatusBadgeTextColor() }]}>
            {order.status}
          </Text>
        </View>
      </View>

      <ScreenScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        {/* CLIENT INFO CARD */}
        <View style={styles.card}>
          <View style={styles.clientHeader}>
            <Image source={{ uri: order.client.avatar }} style={styles.avatar} />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{order.client.name}</Text>
              <View style={styles.contactRow}>
                <Feather name="phone" size={14} color={AppColors.terracotta} />
                <Text style={styles.contactText}>{order.client.phone}</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={16} color={AppColors.terracotta} />
            <Text style={styles.addressText}>{order.client.address}</Text>
          </View>
        </View>

        {/* ORDER ITEMS SECTION */}
        <Text style={styles.sectionTitle}>Ordered Items</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>x{item.qty}</Text>
              <Text style={styles.itemPrice}>{item.price}DH each</Text>
            </View>
            <View style={styles.itemTotal}>
              <Text style={styles.itemTotalPrice}>{item.price * item.qty}DH</Text>
            </View>
          </View>
        ))}

        {/* ORDER SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{subtotal}DH</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{order.fees.delivery}DH</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee</Text>
            <Text style={styles.summaryValue}>{order.fees.platform}DH</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total}DH</Text>
          </View>
        </View>

        {/* ORDER STATUS TIMELINE */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineRow}>
            {["Pending", "Accepted", "Cooking", "Ready"].map((status, index) => (
              <View key={status} style={styles.timelineStep}>
                <View
                  style={[
                    styles.timelineCircle,
                    {
                      backgroundColor:
                        order.status === status
                          ? AppColors.terracotta
                          : order.status === "Ready"
                            ? AppColors.mintGreen
                            : AppColors.sandBeige,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.timelineLabel,
                    {
                      color:
                        order.status === status ? AppColors.terracotta : AppColors.warmBrown,
                    },
                  ]}
                >
                  {status}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.currentStatus}>Current status: {order.status}</Text>
        </View>

        {/* ACTION BUTTONS - DYNAMIC BASED ON STATUS */}
        <View style={styles.buttonsContainer}>
          {order.status === "Pending" && (
            <>
              <Pressable
                style={[styles.button, styles.buttonAccept]}
                onPress={handleAcceptOrder}
              >
                <Text style={styles.buttonText}>Accept Order</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDecline]}
                onPress={handleDeclineOrder}
              >
                <Text style={styles.buttonTextDecline}>Decline Order</Text>
              </Pressable>
            </>
          )}

          {order.status === "Accepted" && (
            <Pressable
              style={[styles.button, styles.buttonCooking]}
              onPress={handleStartCooking}
            >
              <Text style={styles.buttonText}>Start Cooking</Text>
            </Pressable>
          )}

          {order.status === "Cooking" && (
            <Pressable
              style={[styles.button, styles.buttonReady]}
              onPress={handleMarkReady}
            >
              <Text style={styles.buttonText}>Mark as Ready</Text>
            </Pressable>
          )}

          {order.status === "Ready" && (
            <Pressable style={[styles.button, styles.buttonCompleted]} disabled>
              <Text style={styles.buttonTextCompleted}>Order Completed</Text>
            </Pressable>
          )}
        </View>

        {/* NOTES SECTION */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Notes from Client</Text>
          <Text style={styles.notesContent}>{order.notes}</Text>
          <View style={styles.divider} />

          <Text style={styles.chefNoteTitle}>Your Notes</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add your notes here..."
            placeholderTextColor={AppColors.warmBrown + "80"}
            value={chefNote}
            onChangeText={setChefNote}
            multiline
          />
          <Pressable
            style={[styles.button, styles.buttonSaveNote]}
            onPress={handleSaveNote}
          >
            <Text style={styles.buttonText}>Save Note</Text>
          </Pressable>
        </View>
      </ScreenScrollView>
    </ThemedView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.lightBeige,
  },

  // STICKY HEADER
  stickyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
    zIndex: 100,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.warmBrown,
    flex: 1,
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // CARDS
  card: {
    backgroundColor: AppColors.sandBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    backgroundColor: AppColors.sandBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  notesCard: {
    backgroundColor: AppColors.sandBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },

  // CLIENT INFO
  clientHeader: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  clientInfo: {
    flex: 1,
    justifyContent: "center",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.xs,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  contactText: {
    fontSize: 13,
    color: AppColors.warmBrown,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.warmBrown + "20",
    marginVertical: Spacing.md,
  },
  addressRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  addressText: {
    fontSize: 13,
    color: AppColors.warmBrown,
    flex: 1,
  },

  // ORDER ITEMS
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.terracotta,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: AppColors.sandBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.xs,
  },
  itemQty: {
    fontSize: 12,
    color: AppColors.warmBrown + "80",
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    fontSize: 12,
    color: AppColors.terracotta,
  },
  itemTotal: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.terracotta,
  },

  // ORDER SUMMARY
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 13,
    color: AppColors.warmBrown,
  },
  summaryValue: {
    fontSize: 13,
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
    color: AppColors.terracotta,
  },

  // TIMELINE
  timelineContainer: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
  },
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  timelineStep: {
    alignItems: "center",
    flex: 1,
  },
  timelineCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: Spacing.sm,
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  currentStatus: {
    fontSize: 12,
    color: AppColors.warmBrown,
    textAlign: "center",
  },

  // BUTTONS
  buttonsContainer: {
    gap: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  button: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAccept: {
    backgroundColor: AppColors.mintGreen,
  },
  buttonDecline: {
    backgroundColor: AppColors.terracotta + "20",
    borderWidth: 2,
    borderColor: AppColors.terracotta,
  },
  buttonCooking: {
    backgroundColor: AppColors.saffron,
  },
  buttonReady: {
    backgroundColor: AppColors.mintGreen,
  },
  buttonCompleted: {
    backgroundColor: AppColors.mintGreen + "60",
  },
  buttonSaveNote: {
    backgroundColor: AppColors.mintGreen,
    marginTop: Spacing.md,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.white,
  },
  buttonTextDecline: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.terracotta,
  },
  buttonTextCompleted: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },

  // NOTES
  notesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.sm,
  },
  notesContent: {
    fontSize: 13,
    color: AppColors.warmBrown + "90",
    marginBottom: Spacing.md,
  },
  chefNoteTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.sm,
  },
  noteInput: {
    backgroundColor: AppColors.lightBeige,
    borderWidth: 2,
    borderColor: AppColors.terracotta,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 80,
    color: AppColors.warmBrown,
    fontSize: 13,
    marginBottom: Spacing.md,
    textAlignVertical: "top",
  },
});
