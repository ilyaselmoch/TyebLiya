# Tyeb Liya - Mobile Authentication App with Role-Based Routing

## Overview
Tyeb Liya is a mobile authentication app built with Expo and React Native. It features a Moroccan-inspired design with email/password authentication and role-based redirection to client or chef dashboards.

## Current State
- **Phase**: Frontend with Role-Based Authentication
- **Status**: Role-based navigation implemented
- **Last Updated**: November 29, 2025

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
│   └── AuthContext.tsx              # Auth state + role fetching
├── navigation/
│   ├── AuthStackNavigator.tsx       # Login/Register flow
│   ├── AppStackNavigator.tsx        # Role-based navigation (Client/Chef)
│   ├── RootNavigator.tsx            # Auth state switcher
│   └── screenOptions.ts             # Common screen options
├── screens/
│   ├── LoginScreen.tsx              # Email/password login
│   ├── RegisterScreen.tsx           # User registration
│   ├── RoleLoadingScreen.tsx        # Loading indicator while fetching role
│   ├── ClientHomeScreen.tsx         # Dashboard for "client" role
│   └── ChefDashboardScreen.tsx      # Dashboard for "cuisinier" role
├── lib/
│   ├── auth.ts                      # Auth functions + getUserRole()
│   └── supabase.ts                  # Supabase client config
├── components/
│   ├── Input.tsx
│   ├── AuthButton.tsx
│   ├── Divider.tsx
│   ├── HeaderTitle.tsx
│   ├── ErrorBoundary.tsx
│   ├── ScreenScrollView.tsx
│   └── ThemedText.tsx / ThemedView.tsx
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
- **"client" role** → ClientHomeScreen (user dashboard for clients)
- **"cuisinier" role** → ChefDashboardScreen (chef/cook dashboard)
- If role is undefined, stays on RoleLoadingScreen until role is determined

### 4. Feedback & Error Handling
- Loading screen with spinner + "Chargement en cours..." message
- Error handling: gracefully handles missing roles
- Session persistence with AsyncStorage

## Supabase Setup

### Required Tables
```sql
-- Users table (for roles)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  role TEXT (values: 'client' OR 'cuisinier'),
  created_at TIMESTAMP
);

-- Profiles table (for user info)
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  pseudo TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP
);
```

### Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Key Functions

### `getUserRole(userId: string)`
- Fetches user role from Supabase "users" table
- Returns: `"client"` | `"cuisinier"` | `null`
- Called during session initialization in AuthContext
- **Includes comments explaining the flow**

### `AuthContext` Updates
- Added `role` property to `AppUser` interface
- Added `isFetchingRole` state for UI feedback
- Calls `getUserRole()` in `handleUserSession()` after auth
- **Fully commented for maintainability**

## Running the App
- **Development**: `npm run dev`
- **Web**: Access via browser at http://localhost:8081
- **Mobile**: Scan QR code with Expo Go

## User Flow
1. User logs in with email/password
2. App verifies session
3. RoleLoadingScreen shows while fetching role from Supabase
4. User redirected based on their role:
   - Clients → see ClientHomeScreen with client-specific UI
   - Chefs → see ChefDashboardScreen with chef-specific UI
5. Welcome message shows user's name and role
6. User info displayed in card with pseudo, email, and role

## User Preferences
- Language: French (UI text in French)
- Design: Modern, minimal, Moroccan-inspired colors
- Role-based dashboards: Separate screens for clients and chefs
- Clean, responsive layout with clear role indicators
