import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useAuth } from "@/context/AuthContext";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";

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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

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

  // Navigation handlers (placeholder)
  const handleDishPress = (dish: Dish) => {
    console.log("Navigate to dish detail:", dish.id);
  };

  const handleChefPress = (chef: Chef) => {
    console.log("Navigate to chef profile:", chef.id);
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView>
        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Feather
              name="search"
              size={18}
              color={AppColors.gray600}
              style={styles.searchIcon}
            />
            <ThemedText
              style={styles.searchInput}
              placeholder="Rechercher un plat..."
              placeholderTextColor={AppColors.gray600}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {}}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={18} color={AppColors.gray600} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* FILTERS SECTION */}
        <View style={styles.filtersSection}>
          {/* City Filter */}
          <View style={styles.filterGroup}>
            <ThemedText style={styles.filterLabel} type="small">
              Ville
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {CITIES.map((city) => (
                <Pressable
                  key={city}
                  onPress={() =>
                    setSelectedCity(selectedCity === city ? null : city)
                  }
                  style={[
                    styles.filterButton,
                    selectedCity === city && styles.filterButtonActive,
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={[
                      styles.filterButtonText,
                      selectedCity === city && styles.filterButtonTextActive,
                    ]}
                  >
                    {city}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Dish Type Filter */}
          <View style={styles.filterGroup}>
            <ThemedText style={styles.filterLabel} type="small">
              Type de plat
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {DISH_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() =>
                    setSelectedDishType(
                      selectedDishType === type ? null : type
                    )
                  }
                  style={[
                    styles.filterButton,
                    selectedDishType === type && styles.filterButtonActive,
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={[
                      styles.filterButtonText,
                      selectedDishType === type && styles.filterButtonTextActive,
                    ]}
                  >
                    {type}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

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

  // SEARCH BAR
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: AppColors.white,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.gray100,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.dark,
  },

  // FILTERS
  filtersSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  filterGroup: {
    gap: Spacing.sm,
  },
  filterLabel: {
    fontWeight: "600",
    color: AppColors.dark,
    paddingHorizontal: Spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: AppColors.gray300,
    marginRight: Spacing.sm,
    backgroundColor: AppColors.white,
  },
  filterButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterButtonText: {
    color: AppColors.dark,
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: AppColors.white,
  },

  // SECTIONS
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray100,
  },
  sectionLast: {
    borderBottomWidth: 0,
    paddingBottom: Spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.dark,
  },
  seeAllLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    color: AppColors.primary,
    fontWeight: "500",
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
    width: 160,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AppColors.gray100,
  },
  dishPhotoWrapper: {
    width: "100%",
    height: 120,
    backgroundColor: AppColors.gray100,
  },
  dishPhoto: {
    width: "100%",
    height: "100%",
  },
  dishCardContent: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  dishCardTitle: {
    fontWeight: "600",
    color: AppColors.dark,
    height: 32,
  },
  chefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  chefPhotoSmall: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
  },
  chefName: {
    flex: 1,
    color: AppColors.gray600,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    marginLeft: Spacing.xs,
    color: AppColors.gray600,
    fontSize: 12,
  },

  // CHEF CARD
  chefCardContainer: {
    width: 120,
    alignItems: "center",
    gap: Spacing.sm,
  },
  chefPhotoWrapper: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.lg,
    backgroundColor: AppColors.gray100,
    overflow: "hidden",
    position: "relative",
  },
  chefPhoto: {
    width: "100%",
    height: "100%",
  },
  topChefBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: AppColors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  topChefText: {
    color: AppColors.white,
    fontWeight: "600",
    fontSize: 10,
  },
  chefCardContent: {
    alignItems: "center",
    width: "100%",
    gap: Spacing.xs,
  },
  chefCardName: {
    fontWeight: "600",
    color: AppColors.dark,
    textAlign: "center",
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
  },
});
