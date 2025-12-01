import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";
import { AppColors, Spacing, BorderRadius } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Props = NativeStackScreenProps<AppStackParamList, "ChefPostCreation">;

export default function ChefPostCreationScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDish = async () => {
    if (!title.trim() || !description.trim() || !price.trim() || !prepTime.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "You must be logged in as a chef");
      return;
    }

    setIsLoading(true);

    try {
      // Insert new dish into Supabase Dishes table
      const { data, error } = await supabase.from("Dishes").insert([
        {
          chef_id: user.id,
          title: title.trim(),
          description: description.trim(),
          photo_url: photoUrl || "https://via.placeholder.com/400/F7C6A3/252525?text=Dish",
          price: parseFloat(price),
          prep_time: prepTime.trim(),
          status: isAvailable ? "available" : "hidden",
          rating: 4.5,
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Dish added successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setTitle("");
            setDescription("");
            setPhotoUrl("");
            setPrice("");
            setPrepTime("");
            setIsAvailable(true);
            // Go back to dashboard
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      console.error("Error creating dish:", err);
      Alert.alert("Error", "Failed to create dish. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      <ScreenKeyboardAwareScrollView contentContainerStyle={{ paddingBottom: Spacing.xl }}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Feather name="arrow-left" size={24} color={AppColors.terracotta} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Add New Dish</ThemedText>
        </View>

        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Dish Title *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., Couscous Royal"
              placeholderTextColor={AppColors.gray600}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Description *</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your dish..."
              placeholderTextColor={AppColors.gray600}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Photo URL Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Photo URL</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/photo.jpg"
              placeholderTextColor={AppColors.gray600}
              value={photoUrl}
              onChangeText={setPhotoUrl}
            />
            {photoUrl && (
              <Image
                source={{ uri: photoUrl }}
                style={styles.photoPreview}
                onError={() => console.log("Error loading image")}
              />
            )}
          </View>

          {/* Price Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Price (MAD) *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="89"
              placeholderTextColor={AppColors.gray600}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Prep Time Input */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Prep Time *</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="45 min"
              placeholderTextColor={AppColors.gray600}
              value={prepTime}
              onChangeText={setPrepTime}
            />
          </View>

          {/* Availability Toggle */}
          <View style={styles.formGroup}>
            <View style={styles.toggleRow}>
              <ThemedText style={styles.label}>Available</ThemedText>
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
            <ThemedText style={styles.toggleHelp}>
              {isAvailable ? "Visible to clients" : "Hidden from clients"}
            </ThemedText>
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleCreateDish}
            disabled={isLoading}
          >
            <ThemedText style={styles.submitButtonText}>
              {isLoading ? "Creating..." : "Create Dish"}
            </ThemedText>
          </Pressable>
        </View>
      </ScreenKeyboardAwareScrollView>

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
  form: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.warmBrown,
  },
  input: {
    borderWidth: 1.5,
    borderColor: AppColors.terracotta,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: AppColors.warmBrown,
    backgroundColor: AppColors.white,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  photoPreview: {
    width: "100%",
    height: 150,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleHelp: {
    fontSize: 12,
    color: AppColors.gray600,
  },
  submitButton: {
    backgroundColor: AppColors.terracotta,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
