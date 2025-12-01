import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Switch,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";

type Props = NativeStackScreenProps<AppStackParamList, "ChefProfile">;

// MOCK DATA
const mockProfile = {
  name: "Youssef Benali",
  phone: "0650 987 321",
  city: "Casablanca",
  experience: 4,
  kitchenName: "Dar Youssef",
  prepTime: "20-40 min",
  deliveryRadius: "5 km",
  isAvailable: true,
  avatar: "https://i.pravatar.cc/150?img=33",
  specialities: ["Tajine", "Harira", "Rfissa"],
  payment: {
    bank: "Attijariwafa Bank",
    owner: "Youssef Benali",
    rib: "1234 5678 9012 3456 7890 123",
  },
};

const allSpecialities = ["Couscous", "Tajine", "Harira", "Pastilla", "Briouates", "Rfissa", "Grillades", "Salades marocaines"];
const cityOptions = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier"];
const prepTimeOptions = ["10-20 min", "20-40 min", "40-60 min"];

export default function ChefProfileSettingsScreen({ navigation }: Props) {
  // STATE MANAGEMENT
  const [profile, setProfile] = useState(mockProfile);
  const [selectedSpecialities, setSelectedSpecialities] = useState(mockProfile.specialities);
  const [isAvailable, setIsAvailable] = useState(mockProfile.isAvailable);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showPrepTimeDropdown, setShowPrepTimeDropdown] = useState(false);

  // HANDLERS
  const handleSaveProfile = () => {
    setProfile({ ...profile, isAvailable });
    Alert.alert("Success", "Profile saved successfully!");
  };

  const handleChangePhoto = () => {
    Alert.alert("Change Photo", "Opening image picker...");
  };

  const toggleSpeciality = (speciality: string) => {
    if (selectedSpecialities.includes(speciality)) {
      setSelectedSpecialities(selectedSpecialities.filter((s) => s !== speciality));
    } else {
      setSelectedSpecialities([...selectedSpecialities, speciality]);
    }
  };

  const handleUpdatePayment = () => {
    Alert.alert("Success", "Payment information updated!");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters!");
      return;
    }
    Alert.alert("Success", "Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          Alert.alert("Logged out", "You have been logged out successfully.");
          navigation.navigate("RoleSelection");
        },
      },
    ]);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: AppColors.lightBeige }]}>
      {/* STICKY HEADER */}
      <View style={styles.stickyHeader}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={AppColors.terracotta} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <Pressable onPress={handleSaveProfile} style={styles.saveButton}>
          <Feather name="check" size={20} color={AppColors.white} />
        </Pressable>
      </View>

      <ScreenScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        {/* PROFILE PHOTO SECTION */}
        <View style={styles.photoSection}>
          <Image source={{ uri: profile.avatar }} style={styles.profilePhoto} />
          <Pressable onPress={handleChangePhoto}>
            <Text style={styles.changePhotoButton}>Change Photo</Text>
          </Pressable>
        </View>

        {/* PERSONAL INFORMATION CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* City Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowCityDropdown(!showCityDropdown)}
            >
              <Text style={styles.dropdownText}>{profile.city}</Text>
              <Feather
                name={showCityDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color={AppColors.terracotta}
              />
            </Pressable>
            {showCityDropdown && (
              <View style={styles.dropdownMenu}>
                {cityOptions.map((city) => (
                  <Pressable
                    key={city}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setProfile({ ...profile, city });
                      setShowCityDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{city}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Years of Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter years of experience"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.experience.toString()}
              onChangeText={(text) =>
                setProfile({ ...profile, experience: parseInt(text) || 0 })
              }
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* SPECIALITIES SECTION */}
        <View style={styles.specialitiesSection}>
          <Text style={styles.sectionTitle}>Your Specialities</Text>
          <View style={styles.pillsContainer}>
            {allSpecialities.map((speciality) => (
              <Pressable
                key={speciality}
                style={[
                  styles.pill,
                  selectedSpecialities.includes(speciality)
                    ? styles.pillActive
                    : styles.pillInactive,
                ]}
                onPress={() => toggleSpeciality(speciality)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedSpecialities.includes(speciality)
                      ? styles.pillTextActive
                      : styles.pillTextInactive,
                  ]}
                >
                  {speciality}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* KITCHEN DETAILS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kitchen Details</Text>

          {/* Kitchen Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kitchen Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter kitchen name"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.kitchenName}
              onChangeText={(text) => setProfile({ ...profile, kitchenName: text })}
            />
          </View>

          {/* Preparation Time Range */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preparation Time Range</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowPrepTimeDropdown(!showPrepTimeDropdown)}
            >
              <Text style={styles.dropdownText}>{profile.prepTime}</Text>
              <Feather
                name={showPrepTimeDropdown ? "chevron-up" : "chevron-down"}
                size={18}
                color={AppColors.terracotta}
              />
            </Pressable>
            {showPrepTimeDropdown && (
              <View style={styles.dropdownMenu}>
                {prepTimeOptions.map((time) => (
                  <Pressable
                    key={time}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setProfile({ ...profile, prepTime: time });
                      setShowPrepTimeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{time}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Delivery Radius */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Radius</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5 km"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.deliveryRadius}
              onChangeText={(text) => setProfile({ ...profile, deliveryRadius: text })}
            />
          </View>

          {/* Availability Toggle */}
          <View style={styles.availabilityRow}>
            <Text style={styles.label}>Availability</Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{
                false: AppColors.gray300,
                true: AppColors.mintGreen,
              }}
              thumbColor={AppColors.white}
            />
          </View>
        </View>

        {/* PAYMENT SETTINGS SECTION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Settings</Text>

          {/* Bank Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter bank name"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.payment.bank}
              onChangeText={(text) =>
                setProfile({
                  ...profile,
                  payment: { ...profile.payment, bank: text },
                })
              }
            />
          </View>

          {/* Account Owner Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Owner Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter account owner name"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.payment.owner}
              onChangeText={(text) =>
                setProfile({
                  ...profile,
                  payment: { ...profile.payment, owner: text },
                })
              }
            />
          </View>

          {/* RIB */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>RIB (Account Number)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter RIB"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={profile.payment.rib}
              onChangeText={(text) =>
                setProfile({
                  ...profile,
                  payment: { ...profile.payment, rib: text },
                })
              }
            />
          </View>

          {/* Update Payment Button */}
          <Pressable
            style={[styles.button, styles.buttonMint]}
            onPress={handleUpdatePayment}
          >
            <Text style={styles.buttonText}>Add / Update Payment Info</Text>
          </Pressable>
        </View>

        {/* SECURITY SETTINGS SECTION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Security</Text>

          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor={AppColors.warmBrown + "70"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Save Password Button */}
          <Pressable
            style={[styles.button, styles.buttonTerracotta]}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Save Password</Text>
          </Pressable>
        </View>

        {/* LOGOUT BUTTON */}
        <Pressable
          style={[styles.button, styles.buttonLogout]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonLogoutText}>Log Out</Text>
        </Pressable>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.mintGreen,
    justifyContent: "center",
    alignItems: "center",
  },

  // PROFILE PHOTO SECTION
  photoSection: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: Spacing.md,
  },
  changePhotoButton: {
    fontSize: 13,
    color: AppColors.terracotta,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // CARDS
  card: {
    backgroundColor: AppColors.sandBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.md,
  },

  // INPUT GROUP
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.warmBrown,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.terracotta,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 13,
    color: AppColors.warmBrown,
  },

  // DROPDOWN
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.terracotta,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dropdownText: {
    fontSize: 13,
    color: AppColors.warmBrown,
    flex: 1,
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: AppColors.terracotta,
    marginTop: Spacing.sm,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.sandBeige,
  },
  dropdownItemText: {
    fontSize: 13,
    color: AppColors.warmBrown,
  },

  // AVAILABILITY
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },

  // SPECIALITIES SECTION
  specialitiesSection: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.terracotta,
    marginBottom: Spacing.md,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  pillActive: {
    backgroundColor: AppColors.terracotta,
    borderColor: AppColors.terracotta,
  },
  pillInactive: {
    backgroundColor: AppColors.white,
    borderColor: AppColors.terracotta,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  pillTextActive: {
    color: AppColors.white,
  },
  pillTextInactive: {
    color: AppColors.terracotta,
  },

  // BUTTONS
  button: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonMint: {
    backgroundColor: AppColors.mintGreen,
  },
  buttonTerracotta: {
    backgroundColor: AppColors.terracotta,
  },
  buttonLogout: {
    backgroundColor: AppColors.terracotta,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.white,
  },
  buttonLogoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.white,
  },
});
