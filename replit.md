# Tyeb Liya - Mobile Authentication App with Role-Based Routing

## Overview
Tyeb Liya is a mobile authentication app built with Expo and React Native. It features a Moroccan-inspired design with email/password authentication, role-based redirection to client or chef dashboards, and a complete chef post system with dish management and client feed.

## Current State
- **Phase**: Frontend with Chef Post System and Client Feed
- **Status**: Chef post creation, dish management, and client feed implemented
- **Last Updated**: December 1, 2025

## Tech Stack
- **Framework**: Expo SDK 54 with React Native
- **Navigation**: React Navigation 7+
- **UI**: Custom components with iOS 26 Liquid Glass-inspired design
- **Language**: TypeScript
- **Backend**: Supabase (Auth + Database)

## Project Structure
```
├── App.tsx                          # Root component with providers
├── context/
│   ├── AuthContext.tsx              # Auth state + role fetching
│   └── CartContext.tsx              # Cart state for client orders
├── navigation/
│   ├── AuthStackNavigator.tsx       # Login/Register flow
│   ├── AppStackNavigator.tsx        # Role-based navigation (Client/Chef)
│   ├── RootNavigator.tsx            # Auth state switcher
│   └── screenOptions.ts             # Common screen options
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── RoleSelectionScreen.tsx
│   ├── Client/
│   │   ├── ClientHomeScreen.tsx     # Feed with recommended dishes/chefs
│   │   ├── ClientMenuScreen.tsx     # Browse all dishes
│   │   ├── ClientOrdersScreen.tsx   # Client orders history
│   │   ├── ClientProfileScreen.tsx  # Client profile settings
│   │   └── DishDetailScreen.tsx     # Detailed dish view with add to cart
│   └── Chef/
│       ├── ChefDashboardScreen.tsx  # Chef home/stats
│       ├── ChefMenuScreen.tsx       # Chef's menu management
│       ├── ChefPostCreationScreen.tsx # Create new dish form
│       ├── ChefOrdersScreen.tsx     # Incoming orders
│       └── ChefProfileSettingsScreen.tsx
├── lib/
│   ├── auth.ts                      # Auth functions + getUserRole()
│   ├── supabase.ts                  # Supabase client config
│   └── dishesService.ts             # Dishes fetching + mock data
├── components/
│   ├── BottomNavigationBar.tsx      # 4-tab navigation (Home, Orders, Menu, Profile)
│   ├── Input.tsx
│   ├── AuthButton.tsx
│   ├── Divider.tsx
│   ├── HeaderTitle.tsx
│   ├── ErrorBoundary.tsx
│   ├── ScreenScrollView.tsx
│   ├── ScreenKeyboardAwareScrollView.tsx
│   ├── Card.tsx
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── constants/
│   └── theme.ts                     # Colors, spacing, typography
└── hooks/
    ├── useTheme.ts
    └── useScreenInsets.ts
```

## Authentication Flow

### 1. Session Check
- On app load, RootNavigator checks if user has an active session
- If no session → show AuthStackNavigator (Login/Register)
- If session exists → proceed to role fetching

### 2. Role Fetching
- AuthContext calls `getUserRole(userId)` from Supabase "users" table
- Roles: `"client"` or `"cuisinier"`
- If role not found, shows RoleLoadingScreen with loading indicator

### 3. Role-Based Redirection
- **"client" role** → ClientHomeScreen (client dashboard with feed)
- **"cuisinier" role** → ChefDashboardScreen (chef dashboard)
- If role is undefined, stays on RoleLoadingScreen until role is determined

## Chef Post System

### Chef Screens
1. **ChefMenuScreen** - Lists all dishes created by the chef
   - Shows dish image, title, description, price, prep time, and status
   - "Add New Dish" button opens ChefPostCreationScreen
   - Displays available or hidden status
   - Click dish to view details

2. **ChefPostCreationScreen** - Form to create new dishes
   - Input fields: title, description, photo URL, price, prep time
   - Status toggle: available/hidden
   - Form validation for required fields
   - On submit: inserts into Supabase Dishes table
   - Success feedback with back navigation

3. **ChefDashboardScreen** - Chef home dashboard
   - Overview stats and upcoming orders
   - Quick action buttons
   - Recent activity

### Dish Model
```typescript
interface Dish {
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
  chef_name?: string;
  chef_photo?: string;
}
```

## Client Feed & Home

### ClientHomeScreen Features
- **Recommended Dishes Section** - Horizontally scrollable top-rated dishes
- **Top Dishes Today** - Currently popular dishes
- **Recommended Chefs** - Horizontally scrollable chef profiles
- Each dish card shows: photo, title, chef info, rating, price
- "Add to Cart" button on each dish (stored in CartContext)
- Click dish → opens DishDetailScreen
- Click chef → opens chef profile
- Bottom navigation bar always visible

### DishDetailScreen Features
- Sticky header with dish image (70px height)
- Back button in top-left corner
- Dish details: name, chef info, rating, description
- Price and prep time
- "Add to Cart" button
- Sticky bottom navigation

## Navigation Tabs (Bottom Bar)
All screens have a 4-tab bottom navigation:
1. **Home** (home icon) - Dashboard/Feed
2. **Orders** (clipboard icon) - Order history
3. **Menu** (menu icon) - Browse/Manage dishes
4. **Profile** (user icon) - User settings

## Supabase Setup

### Required Tables (TODO - Setup in Supabase)
```sql
-- Chefs table
CREATE TABLE Chefs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  profile_photo TEXT,
  rating NUMERIC,
  availability BOOLEAN,
  created_at TIMESTAMP
);

-- Dishes table
CREATE TABLE Dishes (
  id UUID PRIMARY KEY,
  chef_id UUID NOT NULL (foreign key → Chefs.id),
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  price NUMERIC NOT NULL,
  prep_time TEXT,
  status TEXT (available / hidden),
  rating NUMERIC,
  created_at TIMESTAMP
);

-- Orders table (optional for later)
CREATE TABLE Orders (
  id UUID PRIMARY KEY,
  client_id UUID (auth user),
  dish_id UUID (foreign key → Dishes.id),
  quantity INTEGER,
  status TEXT (Pending / Cooking / Delivered),
  total_price NUMERIC,
  created_at TIMESTAMP
);
```

### Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Key Functions

### `getUserRole(userId: string)` - auth.ts
- Fetches user role from Supabase "users" table
- Returns: `"client"` | `"cuisinier"` | `null`
- Called during session initialization in AuthContext

### `fetchAvailableDishes()` - dishesService.ts
- Fetches all available dishes from Supabase
- Currently returns mock data (ready for live integration)
- Join with chef info for feed display

### `fetchChefs()` - dishesService.ts
- Fetches all available chefs from Supabase
- Currently returns mock data (ready for live integration)

## Mock Data
The app includes mock data for testing:
- 3 mock chefs with profiles and ratings
- 5+ mock dishes with images, prices, and prep times
- All mock data in `lib/dishesService.ts`
- Replace with live Supabase queries when tables are ready

## Running the App
- **Development**: `npm run dev`
- **Web**: Access via browser at http://localhost:8081
- **Mobile**: Scan QR code with Expo Go

## Current Features
✅ Email/password authentication
✅ Role-based navigation (Client/Chef)
✅ Chef post creation system
✅ Dish management interface
✅ Client feed with mock data
✅ Cart context for ordering
✅ Bottom navigation across all screens
✅ Moroccan-inspired design (terracotta, saffron, mint green, warm brown)
✅ Responsive layout with safe area handling
✅ Image display and form validation

## Design Colors
- **Terracotta**: #D96E48 (Primary action, back buttons)
- **Saffron**: #E6A500 (Accent)
- **Mint Green**: #7CC9A2 (Success, available status)
- **Warm Brown**: #4A2E1F (Text)
- **Sand Beige**: #F3E7D3 (Background, headers)

## Next Steps (TODO)
1. Set up Supabase tables (Chefs, Dishes, Orders)
2. Replace mock data with live Supabase queries
3. Implement cart checkout flow
4. Add order management for chefs
5. Implement ratings/reviews system
6. Add search and filtering
7. Set up push notifications for orders

## User Preferences
- Language: French (UI text in French)
- Design: Modern, minimal, Moroccan-inspired
- Role-based dashboards: Separate experiences for clients and chefs
- Clean, responsive layout with clear visual hierarchy
