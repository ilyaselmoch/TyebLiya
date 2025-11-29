import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { Spacing, AppColors, BorderRadius } from "@/constants/theme";

// ============================================================================
// MOCK DATA - Same as in ClientHomeScreen
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
  price?: number;
  prepTime?: number;
  description?: string;
  reviews?: Review[];
}

interface Chef {
  id: string;
  name: string;
  photo: string;
  rating: number;
  isTopChef: boolean;
  location?: string;
}

interface Review {
  id: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  date: string;
}

const mockDishes: Dish[] = [
  {
    id: "1",
    title: "Couscous Royal",
    rating: 4.8,
    chefName: "Chef Mohammed",
    chefPhoto: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=M",
    dishPhoto: "https://via.placeholder.com/400/F7C6A3/252525?text=Couscous",
    type: "Couscous",
    city: "Casablanca",
    price: 89,
    prepTime: 45,
    description:
      "A traditional Moroccan royal couscous with tender lamb, fresh vegetables, chickpeas, and a rich aromatic broth. Served with preserved lemon and olives.",
    reviews: [
      {
        id: "r1",
        userName: "Amina H.",
        userPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=A",
        rating: 5,
        comment: "Absolutely delicious! Perfect flavor and presentation.",
        date: "2 days ago",
      },
      {
        id: "r2",
        userName: "Hassan M.",
        userPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=H",
        rating: 4,
        comment: "Great taste, generous portions. Will order again!",
        date: "1 week ago",
      },
      {
        id: "r3",
        userName: "Fatima K.",
        userPhoto: "https://via.placeholder.com/40/FF6B35/FFFFFF?text=F",
        rating: 5,
        comment: "The best couscous I've had in years. Highly recommended.",
        date: "2 weeks ago",
      },
    ],
  },
  {
    id: "2",
    title: "Tajine de Poulet",
    rating: 4.6,
    chefName: "Chef Fatima",
    chefPhoto: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=F",
    dishPhoto: "https://via.placeholder.com/400/F7C6A3/252525?text=Tajine",
    type: "Tajine",
    city: "Rabat",
    price: 75,
    prepTime: 50,
    description:
      "Slow-cooked chicken tajine with apricots, almonds, and warming spices. A harmonious blend of sweet and savory flavors.",
  },
];

const mockChefs: Chef[] = [
  {
    id: "c1",
    name: "Mohammed",
    photo: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=M",
    rating: 4.8,
    isTopChef: true,
    location: "Casablanca",
  },
  {
    id: "c2",
    name: "Fatima",
    photo: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=F",
    rating: 4.6,
    isTopChef: false,
    location: "Rabat",
  },
];

// ============================================================================
// SIMPLE SQUARE IMAGE COMPONENT
// ============================================================================

const DishImageSquare: React.FC<{ imageUrl: string; width: number }> = ({
  imageUrl,
  width,
}) => {
  const imageSize = width - Spacing.md * 2;

  return (
    <View style={[styles.imageSquareContainer, { width: imageSize, height: imageSize }]}>
      <Image
        source={{ uri: imageUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
    </View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DishDetailScreen({
  route,
}: {
  route: { params?: { dishId?: string } };
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const dishId = route.params?.dishId || "1";

  // Find dish from mock data
  const dish = mockDishes.find((d) => d.id === dishId) || mockDishes[0];
  const chef = mockChefs.find(
    (c) => c.name === dish.chefName.split(" ")[1]
  ) || mockChefs[0];

  // State for ordering
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const totalPrice = (dish.price || 75) * quantity;

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView>
        {/* DISH IMAGE SQUARE */}
        <View style={styles.imageSection}>
          <DishImageSquare
            imageUrl={dish.dishPhoto}
            width={width}
          />
        </View>

        {/* TITLE & RATING SECTION */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.dishTitle}>{dish.title}</ThemedText>
              <ThemedText style={styles.dishType}>{dish.type}</ThemedText>
            </View>
            <Pressable
              onPress={() => setIsFavorite(!isFavorite)}
              style={styles.favoriteButton}
            >
              <Feather
                name={isFavorite ? "heart" : "heart"}
                size={24}
                color={isFavorite ? AppColors.terracotta : AppColors.gray300}
                fill={isFavorite ? AppColors.terracotta : "none"}
              />
            </Pressable>
          </View>

          {/* Price */}
          <ThemedText style={styles.price}>{dish.price || 75} MAD</ThemedText>

          {/* Rating & Time */}
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Feather
                  key={i}
                  name="star"
                  size={14}
                  color={
                    i < Math.floor(dish.rating)
                      ? AppColors.saffron
                      : AppColors.gray300
                  }
                  fill={
                    i < Math.floor(dish.rating) ? AppColors.saffron : "none"
                  }
                />
              ))}
              <ThemedText style={styles.ratingText}>
                {dish.rating} ({dish.reviews?.length || 48} reviews)
              </ThemedText>
            </View>
            <ThemedText style={styles.prepTime}>
              ⏱ {dish.prepTime || 45} min
            </ThemedText>
          </View>
        </View>

        {/* CHEF CARD */}
        <View style={styles.chefCardContainer}>
          <View style={styles.chefCard}>
            <Image
              source={{ uri: chef.photo }}
              style={styles.chefPhoto}
            />
            <View style={styles.chefInfo}>
              <ThemedText style={styles.chefName}>
                {chef.name}
                {chef.isTopChef && (
                  <ThemedText style={styles.topChefBadge}> ✓</ThemedText>
                )}
              </ThemedText>
              <View style={styles.chefRating}>
                {[...Array(5)].map((_, i) => (
                  <Feather
                    key={i}
                    name="star"
                    size={12}
                    color={
                      i < Math.floor(chef.rating)
                        ? AppColors.saffron
                        : AppColors.gray300
                    }
                    fill={
                      i < Math.floor(chef.rating)
                        ? AppColors.saffron
                        : "none"
                    }
                  />
                ))}
                <ThemedText style={styles.chefRatingText}>
                  {chef.rating}
                </ThemedText>
              </View>
              <ThemedText style={styles.chefLocation}>
                {chef.location || "Casablanca"}
              </ThemedText>
            </View>
          </View>
          <Pressable style={styles.viewProfileButton}>
            <ThemedText style={styles.viewProfileText}>
              View Chef Profile
            </ThemedText>
          </Pressable>
        </View>

        {/* DESCRIPTION SECTION */}
        <View style={styles.descriptionSection}>
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <View style={styles.divider} />
          <ThemedText style={styles.descriptionText}>
            {dish.description ||
              "A delicious traditional Moroccan dish prepared with care and authentic spices."}
          </ThemedText>
        </View>

        {/* REVIEWS SECTION */}
        <View style={styles.reviewsSection}>
          <ThemedText style={styles.sectionTitle}>
            Reviews ({dish.reviews?.length || 48})
          </ThemedText>
          <View style={styles.reviewsList}>
            {dish.reviews?.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: review.userPhoto }}
                    style={styles.reviewUserPhoto}
                  />
                  <View style={styles.reviewUserInfo}>
                    <ThemedText style={styles.reviewUserName}>
                      {review.userName}
                    </ThemedText>
                    <View style={styles.reviewStars}>
                      {[...Array(5)].map((_, i) => (
                        <Feather
                          key={i}
                          name="star"
                          size={12}
                          color={
                            i < review.rating
                              ? AppColors.saffron
                              : AppColors.gray300
                          }
                          fill={
                            i < review.rating
                              ? AppColors.saffron
                              : "none"
                          }
                        />
                      ))}
                    </View>
                  </View>
                  <ThemedText style={styles.reviewDate}>
                    {review.date}
                  </ThemedText>
                </View>
                <ThemedText style={styles.reviewComment}>
                  {review.comment}
                </ThemedText>
              </View>
            ))}
          </View>
          <Pressable style={styles.seeAllReviewsButton}>
            <ThemedText style={styles.seeAllReviewsText}>
              See All Reviews
            </ThemedText>
          </Pressable>
        </View>

        {/* Bottom padding for sticky section */}
        <View style={{ height: 200 }} />
      </ScreenScrollView>

      {/* STICKY ORDERING SECTION */}
      <View style={[styles.stickyOrderSection, { paddingBottom: insets.bottom }]}>
        {/* Quantity Selector */}
        <View style={styles.quantityRow}>
          <ThemedText style={styles.quantityLabel}>Quantity</ThemedText>
          <View style={styles.quantitySelector}>
            <Pressable
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <ThemedText style={styles.quantityButtonText}>−</ThemedText>
            </Pressable>
            <ThemedText style={styles.quantityValue}>{quantity}</ThemedText>
            <Pressable
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <ThemedText style={styles.quantityButtonText}>+</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Notes Textarea */}
        <TextInput
          style={styles.notesInput}
          placeholder="Add cooking notes (optional)…"
          placeholderTextColor={AppColors.gray600}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
        />

        {/* Add to Cart Button */}
        <Pressable style={styles.addToCartButton}>
          <ThemedText style={styles.addToCartText}>
            Add to Cart — {totalPrice} MAD
          </ThemedText>
        </Pressable>
      </View>
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

  // Dish Image Square
  imageSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  imageSquareContainer: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  // Title Section
  titleSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  dishTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: AppColors.warmBrown,
    marginBottom: Spacing.xs,
  },
  dishType: {
    fontSize: 14,
    fontWeight: "400",
    color: AppColors.gray600,
  },
  favoriteButton: {
    padding: Spacing.sm,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.terracotta,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
    marginLeft: Spacing.xs,
  },
  prepTime: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.dark,
  },

  // Chef Card
  chefCardContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  chefCard: {
    flexDirection: "row",
    backgroundColor: AppColors.lightBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chefPhoto: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: AppColors.terracotta,
  },
  chefInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  chefName: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.warmBrown,
  },
  topChefBadge: {
    color: AppColors.saffron,
  },
  chefRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  chefRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.gray600,
    marginLeft: Spacing.xs,
  },
  chefLocation: {
    fontSize: 12,
    fontWeight: "400",
    color: AppColors.gray600,
  },
  viewProfileButton: {
    backgroundColor: AppColors.mintGreen,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.white,
  },

  // Description
  descriptionSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.terracotta,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.saffron,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "400",
    color: AppColors.warmBrown,
    lineHeight: 20,
  },

  // Reviews
  reviewsSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  reviewsList: {
    gap: Spacing.md,
  },
  reviewCard: {
    backgroundColor: AppColors.gray100,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  reviewUserPhoto: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
  },
  reviewUserInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  reviewUserName: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.dark,
  },
  reviewStars: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  reviewDate: {
    fontSize: 11,
    fontWeight: "400",
    color: AppColors.gray600,
  },
  reviewComment: {
    fontSize: 13,
    fontWeight: "400",
    color: AppColors.warmBrown,
    lineHeight: 18,
  },
  seeAllReviewsButton: {
    borderWidth: 1.5,
    borderColor: AppColors.saffron,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.md,
  },
  seeAllReviewsText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.saffron,
  },

  // Sticky Order Section
  stickyOrderSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppColors.lightBeige,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppColors.sandBeige,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.dark,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: AppColors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: AppColors.sandBeige,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: AppColors.mintGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.white,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.dark,
    minWidth: 30,
    textAlign: "center",
  },
  notesInput: {
    backgroundColor: AppColors.white,
    borderWidth: 1.5,
    borderColor: AppColors.terracotta,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: AppColors.dark,
    minHeight: 60,
  },
  addToCartButton: {
    backgroundColor: AppColors.terracotta,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    shadowColor: AppColors.terracotta,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.white,
  },
});
