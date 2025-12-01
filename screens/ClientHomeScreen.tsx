import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
  Modal,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";
import { AppStackParamList } from "@/navigation/AppStackNavigator";
import { BottomNavigationBar } from "@/components/BottomNavigationBar";

// ============================================================================
// MOCK DATA
// ============================================================================

interface Dish {
  id: string;
  title: string;
  rating: number;
  chefName: string;
  chefPhoto: string;
  dishPhoto: string;
  type: string;
  city: string;
}

interface Chef {
  id: string;
  name: string;
  photo: string;
  rating: number;
  isTopChef: boolean;
}

const mockDishes: Dish[] = [
  {
    id: "1",
    title: "Couscous Royal",
    rating: 4.8,
    chefName: "Chef Mohammed",
    chefPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=M",
    dishPhoto: "https://via.placeholder.com/180/F7C6A3/252525?text=Couscous",
    type: "Couscous",
    city: "Casablanca",
  },
  {
    id: "2",
    title: "Tajine de Poulet",
    rating: 4.6,
    chefName: "Chef Fatima",
    chefPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=F",
    dishPhoto: "https://via.placeholder.com/180/F7C6A3/252525?text=Tajine",
    type: "Tajine",
    city: "Rabat",
  },
  {
    id: "3",
    title: "Rfissa Fes",
    rating: 4.9,
    chefName: "Chef Hassan",
    chefPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=H",
    dishPhoto: "https://via.placeholder.com/180/F7C6A3/252525?text=Rfissa",
    type: "Rfissa",
    city: "Fes",
  },
  {
    id: "4",
    title: "Pastilla aux Amandes",
    rating: 4.7,
    chefName: "Chef Amira",
    chefPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=A",
    dishPhoto: "https://via.placeholder.com/180/F7C6A3/252525?text=Pastilla",
    type: "Pastilla",
    city: "Marrakech",
  },
  {
    id: "5",
    title: "Harira Marocaine",
    rating: 4.5,
    chefName: "Chef Karim",
    chefPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=K",
    dishPhoto: "https://via.placeholder.com/180/F7C6A3/252525?text=Harira",
    type: "Soupe",
    city: "Casablanca",
  },
];

const mockChefs: Chef[] = [
  {
    id: "c1",
    name: "Mohammed",
    photo: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=M",
    rating: 4.8,
    isTopChef: true,
  },
  {
    id: "c2",
    name: "Fatima",
    photo: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=F",
    rating: 4.6,
    isTopChef: false,
  },
  {
    id: "c3",
    name: "Hassan",
    photo: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=H",
    rating: 4.9,
    isTopChef: true,
  },
  {
    id: "c4",
    name: "Amira",
    photo: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=A",
    rating: 4.7,
    isTopChef: false,
  },
];

const DISH_TYPES = ["Couscous", "Tajine", "Rfissa", "Pastilla", "Soupe"];
const CITIES = ["Casablanca", "Rabat", "Fes", "Marrakech"];

// ============================================================================
// RATING STARS COMPONENT
// ============================================================================

interface StarRatingProps {
  rating: number;
  size?: number;
}

function StarRating({ rating, size = 14 }: StarRatingProps) {
  return (
    <View style={styles.starsContainer}>
      {[...Array(5)].map((_, i) => (
        <Feather
          key={i}
          name="star"
          size={size}
          color={i < Math.floor(rating) ? AppColors.primary : AppColors.gray300}
          fill={i < Math.floor(rating) ? AppColors.primary : "none"}
          style={{ marginRight: 2 }}
        />
      ))}
      <ThemedText style={styles.ratingText} type="small">
        {rating.toFixed(1)}
      </ThemedText>
    </View>
  );
}

// ============================================================================
// DISH CARD COMPONENT (Used in Sections 1 & 2)
// ============================================================================

interface DishCardProps {
  dish: Dish;
  onPress: () => void;
}

function DishCard({ dish, onPress }: DishCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.dishCardContainer}>
      {/* Dish Photo */}
      <View style={styles.dishPhotoWrapper}>
        <Image
          source={{ uri: dish.dishPhoto }}
          style={styles.dishPhoto}
          defaultSource={{ uri: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F7C6A3' width='100' height='100'/%3E%3C/svg%3E" }}
        />
      </View>

      {/* Card content */}
      <View style={styles.dishCardContent}>
        <ThemedText
          style={styles.dishCardTitle}
          numberOfLines={2}
          type="small"
        >
          {dish.title}
        </ThemedText>

        {/* Chef info row */}
        <View style={styles.chefRow}>
          <Image
            source={{ uri: dish.chefPhoto }}
            style={styles.chefPhotoSmall}
          />
          <ThemedText style={styles.chefName} numberOfLines={1} type="small">
            {dish.chefName}
          </ThemedText>
        </View>

        {/* Rating */}
        <StarRating rating={dish.rating} size={12} />
      </View>
    </Pressable>
  );
}

// ============================================================================
// CHEF CARD COMPONENT (Used in Section 3)
// ============================================================================

interface ChefCardProps {
  chef: Chef;
  onPress: () => void;
}

function ChefCard({ chef, onPress }: ChefCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.chefCardContainer}>
      {/* Chef Photo */}
      <View style={styles.chefPhotoWrapper}>
        <Image
          source={{ uri: chef.photo }}
          style={styles.chefPhoto}
          defaultSource={{ uri: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23F7C6A3' width='80' height='80'/%3E%3C/svg%3E" }}
        />
      </View>

      {/* Chef badge if Top Chef */}
      {chef.isTopChef && (
        <View style={styles.topChefBadge}>
          <Feather name="award" size={12} color={AppColors.white} />
          <ThemedText style={styles.topChefText} type="small">
            Top
          </ThemedText>
        </View>
      )}

      {/* Chef info */}
      <View style={styles.chefCardContent}>
        <ThemedText
          style={styles.chefCardName}
          numberOfLines={1}
          type="small"
        >
          {chef.name}
        </ThemedText>
        <StarRating rating={chef.rating} size={12} />
      </View>
    </Pressable>
  );
}

// ============================================================================
// MAIN SCREEN COMPONENT
// ============================================================================

export default function ClientHomeScreen() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter modal state
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter states
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDishType, setSelectedDishType] = useState<string | null>(null);

  // Filter dishes based on search and filters
  const filteredDishes = useMemo(() => {
    return mockDishes.filter((dish) => {
      const matchesSearch =
        !searchQuery ||
        dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.chefName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity = !selectedCity || dish.city === selectedCity;
      const matchesDishType =
        !selectedDishType || dish.type === selectedDishType;

      return matchesSearch && matchesCity && matchesDishType;
    });
  }, [searchQuery, selectedCity, selectedDishType]);

  const topDishesOfDay = useMemo(() => {
    return [...filteredDishes].sort((a, b) => b.rating - a.rating);
  }, [filteredDishes]);

  // Navigation handlers
  // When a dish card is clicked, navigate to DishDetail screen passing the dishId
  const handleDishPress = (dish: Dish) => {
    navigation.navigate("DishDetail", { dishId: dish.id });
  };

  const handleChefPress = (chef: Chef) => {
    console.log("Navigate to chef profile:", chef.id);
  };

  const navItems = [
    {
      name: "ClientHome",
      icon: "home",
      label: "Home",
      onPress: () => navigation.navigate("ClientHome"),
      isActive: true,
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
      isActive: false,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* HEADER WITH LOGO AND APP NAME */}
      <View style={styles.headerTop}>
        <View style={styles.logoSmall}>
          <ThemedText style={styles.logoText}>TL</ThemedText>
        </View>
        <ThemedText style={styles.appNameTop}>Tyeb Liya</ThemedText>
        <View style={styles.spacer} />
      </View>

      <ScreenScrollView>
        {/* SEARCH BAR WITH FILTER BUTTON */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            {/* Search Input */}
            <View style={styles.searchInputWrapper}>
              <Feather
                name="search"
                size={16}
                color={AppColors.gray600}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a dish..."
                placeholderTextColor={AppColors.gray600}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Feather name="x" size={16} color={AppColors.gray600} />
                </Pressable>
              ) : null}
            </View>

            {/* Filter Button */}
            <Pressable
              style={[
                styles.filterIconButton,
                (selectedCity || selectedDishType) && styles.filterIconButtonActive,
              ]}
              onPress={() => setShowFilterModal(true)}
            >
              <Feather
                name="sliders"
                size={18}
                color={
                  selectedCity || selectedDishType
                    ? AppColors.white
                    : AppColors.gray600
                }
              />
            </Pressable>
          </View>
        </View>

        {/* FILTER MODAL */}
        <Modal
          visible={showFilterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowFilterModal(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Filtres</ThemedText>
                <Pressable onPress={() => setShowFilterModal(false)}>
                  <Feather name="x" size={24} color={AppColors.dark} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* City Filter */}
                <View style={styles.filterSection}>
                  <ThemedText style={styles.filterSectionTitle}>
                    Ville
                  </ThemedText>
                  <View style={styles.filterOptionsWrapper}>
                    {CITIES.map((city) => (
                      <Pressable
                        key={city}
                        onPress={() =>
                          setSelectedCity(selectedCity === city ? null : city)
                        }
                        style={[
                          styles.filterPill,
                          selectedCity === city && styles.filterPillActive,
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.filterPillText,
                            selectedCity === city && styles.filterPillTextActive,
                          ]}
                        >
                          {city}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Dish Type Filter */}
                <View style={styles.filterSection}>
                  <ThemedText style={styles.filterSectionTitle}>
                    Type de plat
                  </ThemedText>
                  <View style={styles.filterOptionsWrapper}>
                    {DISH_TYPES.map((type) => (
                      <Pressable
                        key={type}
                        onPress={() =>
                          setSelectedDishType(
                            selectedDishType === type ? null : type
                          )
                        }
                        style={[
                          styles.filterPill,
                          selectedDishType === type && styles.filterPillActive,
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.filterPillText,
                            selectedDishType === type &&
                              styles.filterPillTextActive,
                          ]}
                        >
                          {type}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </ScrollView>

              {/* Modal Footer - Clear All */}
              <View style={styles.modalFooter}>
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    setSelectedCity(null);
                    setSelectedDishType(null);
                  }}
                >
                  <ThemedText style={styles.clearButtonText}>
                    Réinitialiser les filtres
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>

        {/* SECTION 1: RECOMMENDED FOR YOU */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Recommandé pour vous
            </ThemedText>
            {filteredDishes.length > 3 && (
              <Pressable onPress={() => console.log("See all recommended")}>
                <View style={styles.seeAllLink}>
                  <ThemedText type="small" style={styles.seeAllText}>
                    Voir tout
                  </ThemedText>
                  <Feather name="arrow-right" size={14} color={AppColors.primary} />
                </View>
              </Pressable>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onPress={() => handleDishPress(dish)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={32} color={AppColors.gray600} />
                <ThemedText style={styles.emptyStateText} type="small">
                  Aucun plat trouvé
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </View>

        {/* SECTION 2: TOP DISH OF THE DAY */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Plats populaires du jour
            </ThemedText>
            {topDishesOfDay.length > 3 && (
              <Pressable onPress={() => console.log("See all popular")}>
                <View style={styles.seeAllLink}>
                  <ThemedText type="small" style={styles.seeAllText}>
                    Voir tout
                  </ThemedText>
                  <Feather name="arrow-right" size={14} color={AppColors.primary} />
                </View>
              </Pressable>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {topDishesOfDay.length > 0 ? (
              topDishesOfDay.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onPress={() => handleDishPress(dish)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={32} color={AppColors.gray600} />
                <ThemedText style={styles.emptyStateText} type="small">
                  Aucun plat trouvé
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </View>

        {/* SECTION 3: TOP CHEF RECOMMENDATIONS */}
        <View style={[styles.section, styles.sectionLast]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Chefs recommandés
            </ThemedText>
            <Pressable onPress={() => console.log("See all chefs")}>
              <View style={styles.seeAllLink}>
                <ThemedText type="small" style={styles.seeAllText}>
                  Voir tout
                </ThemedText>
                <Feather name="arrow-right" size={14} color={AppColors.primary} />
              </View>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {mockChefs.map((chef) => (
              <ChefCard
                key={chef.id}
                chef={chef}
                onPress={() => handleChefPress(chef)}
              />
            ))}
          </ScrollView>
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
    backgroundColor: AppColors.lightBeige,
  },

  // HEADER TOP
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.sandBeige,
    gap: Spacing.md,
  },
  logoSmall: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.terracotta,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.white,
  },
  appNameTop: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  spacer: {
    flex: 1,
  },

  // SEARCH BAR
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.lg,
    backgroundColor: AppColors.sandBeige,
  },
  searchBarWrapper: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: AppColors.terracotta + "20",
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: AppColors.warmBrown,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: AppColors.gray300,
  },
  filterIconButtonActive: {
    backgroundColor: AppColors.terracotta,
    borderColor: AppColors.terracotta,
  },

  // FILTER MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: "85%",
    paddingBottom: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.dark,
  },
  modalBody: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  filterSection: {
    marginBottom: Spacing.xl,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.dark,
    marginBottom: Spacing.md,
  },
  filterOptionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: AppColors.gray300,
    backgroundColor: AppColors.white,
  },
  filterPillActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterPillText: {
    color: AppColors.dark,
    fontSize: 13,
    fontWeight: "600",
  },
  filterPillTextActive: {
    color: AppColors.white,
    fontWeight: "700",
  },
  modalFooter: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  clearButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.gray100,
    alignItems: "center",
  },
  clearButtonText: {
    color: AppColors.dark,
    fontWeight: "600",
    fontSize: 14,
  },

  // SECTIONS
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xl,
    backgroundColor: AppColors.lightBeige,
  },
  sectionLast: {
    borderBottomWidth: 0,
    paddingBottom: Spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.terracotta,
    letterSpacing: 0.2,
  },
  seeAllLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  seeAllText: {
    color: AppColors.primary,
    fontWeight: "700",
    fontSize: 13,
  },

  // HORIZONTAL SCROLL
  horizontalScroll: {
    paddingBottom: Spacing.sm,
  },
  horizontalScrollContent: {
    paddingHorizontal: 0,
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },

  // DISH CARD
  dishCardContainer: {
    width: 165,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  dishPhotoWrapper: {
    width: "100%",
    height: 130,
    backgroundColor: AppColors.sandBeige,
  },
  dishPhoto: {
    width: "100%",
    height: "100%",
  },
  dishCardContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  dishCardTitle: {
    fontWeight: "700",
    color: AppColors.warmBrown,
    height: 40,
    fontSize: 14,
    lineHeight: 18,
  },
  chefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  chefPhotoSmall: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: AppColors.terracotta,
  },
  chefName: {
    flex: 1,
    color: AppColors.warmBrown,
    fontWeight: "600",
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    marginLeft: Spacing.xs,
    color: AppColors.saffron,
    fontSize: 12,
    fontWeight: "600",
  },

  // CHEF CARD
  chefCardContainer: {
    width: 130,
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  chefPhotoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.sandBeige,
    overflow: "hidden",
    position: "relative",
    borderWidth: 3,
    borderColor: AppColors.terracotta,
  },
  chefPhoto: {
    width: "100%",
    height: "100%",
  },
  topChefBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: AppColors.saffron,
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 2,
    borderColor: AppColors.white,
    shadowColor: AppColors.saffron,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  topChefText: {
    color: AppColors.white,
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  chefCardContent: {
    alignItems: "center",
    width: "100%",
    gap: Spacing.sm,
  },
  chefCardName: {
    fontWeight: "700",
    color: AppColors.warmBrown,
    textAlign: "center",
    fontSize: 14,
  },

  // EMPTY STATE
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing["2xl"],
  },
  emptyStateText: {
    color: AppColors.gray600,
    marginTop: Spacing.md,
    fontWeight: "500",
  },
});
