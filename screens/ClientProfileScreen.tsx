import React, { useState } from "react";
import {
  View,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { useAuth } from "@/context/AuthContext";

type Props = NativeStackScreenProps<AppStackParamList, "ClientProfile">;

export default function ClientProfileScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({
    name: "Ahmed Bennani",
    email: user?.email || "ahmed@example.com",
    phone: "0612345678",
    address: "123 Rue de la Paix, Casablanca",
    city: "Casablanca",
    postalCode: "20000",
    preferredPayment: "Credit Card",
    avatar: "https://i.pravatar.cc/150?img=42",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = () => {
    setIsEditing(false);
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
      isActive: true,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView>
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <Image
            source={{ uri: profile.avatar }}
            style={styles.avatar}
          />
          <ThemedText style={styles.name}>{profile.name}</ThemedText>
          <ThemedText style={styles.role}>Client</ThemedText>
          <Pressable
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Feather name="edit-2" size={16} color={AppColors.white} />
            <ThemedText style={styles.editButtonText}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </ThemedText>
          </Pressable>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Feather name="user" size={18} color={AppColors.terracotta} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Full Name</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={profile.name}
                    onChangeText={(text) =>
                      setProfile({ ...profile, name: text })
                    }
                    placeholder="Enter your name"
                  />
                ) : (
                  <ThemedText style={styles.infoValue}>{profile.name}</ThemedText>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Feather name="mail" size={18} color={AppColors.saffron} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Email</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.email}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={signOut}>
            <Feather name="log-out" size={18} color={AppColors.terracotta} />
            <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
          </Pressable>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScreenScrollView>

      <BottomNavigationBar items={navItems} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: AppColors.sandBeige,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: AppColors.terracotta,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  role: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.saffron,
    marginBottom: Spacing.md,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.terracotta,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  editButtonText: {
    color: AppColors.white,
    fontWeight: "600",
  },
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
  infoBox: {
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.warmBrown,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.gray300,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: AppColors.warmBrown,
    marginTop: Spacing.xs,
  },
  logoutSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: AppColors.terracotta,
  },
  logoutButtonText: {
    color: AppColors.terracotta,
    fontWeight: "700",
    fontSize: 16,
  },
});
