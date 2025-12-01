import { supabase } from "@/lib/supabase";

// ============================================================================
// TYPES
// ============================================================================

export interface Dish {
  id: string;
  chef_id: string;
  title: string;
  description: string;
  photo_url: string;
  price: number;
  prep_time: string;
  status: "available" | "hidden";
  rating: number;
  created_at: string;
  // Chef info (from join)
  chef_name?: string;
  chef_photo?: string;
}

export interface Chef {
  id: string;
  name: string;
  profile_photo: string;
  rating: number;
  availability: boolean;
}

// ============================================================================
// MOCK DATA - Replace with real Supabase queries
// ============================================================================

export const mockChefs: Chef[] = [
  {
    id: "chef-1",
    name: "Youssef Benali",
    profile_photo: "https://via.placeholder.com/80/D96E48/FFFFFF?text=Y",
    rating: 4.9,
    availability: true,
  },
  {
    id: "chef-2",
    name: "Sara El Malki",
    profile_photo: "https://via.placeholder.com/80/E6A500/FFFFFF?text=S",
    rating: 4.8,
    availability: true,
  },
  {
    id: "chef-3",
    name: "Mohammed Hassan",
    profile_photo: "https://via.placeholder.com/80/7CC9A2/FFFFFF?text=M",
    rating: 4.7,
    availability: true,
  },
];

export const mockDishes: Dish[] = [
  {
    id: "dish-1",
    chef_id: "chef-1",
    title: "Couscous Royal",
    description: "Traditional Moroccan couscous with seven vegetables",
    photo_url: "https://via.placeholder.com/400/F7C6A3/252525?text=Couscous",
    price: 89,
    prep_time: "45 min",
    status: "available",
    rating: 4.9,
    created_at: new Date().toISOString(),
    chef_name: "Youssef Benali",
    chef_photo: "https://via.placeholder.com/80/D96E48/FFFFFF?text=Y",
  },
  {
    id: "dish-2",
    chef_id: "chef-2",
    title: "Tajine de Poulet",
    description: "Slow-cooked chicken with apricots and almonds",
    photo_url: "https://via.placeholder.com/400/F7C6A3/252525?text=Tajine",
    price: 75,
    prep_time: "50 min",
    status: "available",
    rating: 4.8,
    created_at: new Date().toISOString(),
    chef_name: "Sara El Malki",
    chef_photo: "https://via.placeholder.com/80/E6A500/FFFFFF?text=S",
  },
  {
    id: "dish-3",
    chef_id: "chef-1",
    title: "Pastilla aux Amandes",
    description: "Crispy phyllo pastry with almond filling",
    photo_url: "https://via.placeholder.com/400/F7C6A3/252525?text=Pastilla",
    price: 65,
    prep_time: "30 min",
    status: "available",
    rating: 4.7,
    created_at: new Date().toISOString(),
    chef_name: "Youssef Benali",
    chef_photo: "https://via.placeholder.com/80/D96E48/FFFFFF?text=Y",
  },
  {
    id: "dish-4",
    chef_id: "chef-3",
    title: "Harira Marocaine",
    description: "Rich tomato-based soup with chickpeas",
    photo_url: "https://via.placeholder.com/400/F7C6A3/252525?text=Harira",
    price: 35,
    prep_time: "25 min",
    status: "available",
    rating: 4.6,
    created_at: new Date().toISOString(),
    chef_name: "Mohammed Hassan",
    chef_photo: "https://via.placeholder.com/80/7CC9A2/FFFFFF?text=M",
  },
  {
    id: "dish-5",
    chef_id: "chef-2",
    title: "Grilled Brochettes",
    description: "Seasoned meat skewers with herbs",
    photo_url: "https://via.placeholder.com/400/F7C6A3/252525?text=Brochettes",
    price: 55,
    prep_time: "35 min",
    status: "available",
    rating: 4.8,
    created_at: new Date().toISOString(),
    chef_name: "Sara El Malki",
    chef_photo: "https://via.placeholder.com/80/E6A500/FFFFFF?text=S",
  },
];

// ============================================================================
// FETCH FUNCTIONS - Replace mock data with real Supabase queries
// ============================================================================

/**
 * Fetch all available dishes from Supabase
 * TODO: Replace mock data with real query when Supabase is set up
 */
export async function fetchAvailableDishes(): Promise<Dish[]> {
  try {
    // TODO: Uncomment when Supabase tables are created
    /*
    const { data, error } = await supabase
      .from("Dishes")
      .select("*, Chefs(name, profile_photo)")
      .eq("status", "available");

    if (error) throw error;
    return data || [];
    */

    // For now, return mock data
    return mockDishes.filter((d) => d.status === "available");
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return mockDishes.filter((d) => d.status === "available");
  }
}

/**
 * Fetch all chefs from Supabase
 * TODO: Replace mock data with real query when Supabase is set up
 */
export async function fetchChefs(): Promise<Chef[]> {
  try {
    // TODO: Uncomment when Supabase tables are created
    /*
    const { data, error } = await supabase
      .from("Chefs")
      .select("*")
      .eq("availability", true);

    if (error) throw error;
    return data || [];
    */

    // For now, return mock data
    return mockChefs;
  } catch (error) {
    console.error("Error fetching chefs:", error);
    return mockChefs;
  }
}

/**
 * Fetch single dish by ID
 */
export async function fetchDishById(dishId: string): Promise<Dish | null> {
  try {
    // For now, return mock data
    return mockDishes.find((d) => d.id === dishId) || null;
  } catch (error) {
    console.error("Error fetching dish:", error);
    return null;
  }
}
