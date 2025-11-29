# Tyeb Liya - Mobile Authentication App

## Overview
Tyeb Liya is a mobile authentication app built with Expo and React Native. It features a beautiful Moroccan-inspired design with email/password and social login capabilities.

## Current State
- **Phase**: Frontend Prototype (Authentication Module)
- **Status**: Complete
- **Last Updated**: November 29, 2025

## Tech Stack
- **Framework**: Expo SDK 54 with React Native
- **Navigation**: React Navigation 7+
- **UI**: Custom components with iOS 26 Liquid Glass-inspired design
- **Language**: TypeScript

## Project Structure
```
├── App.tsx                     # Root component with providers
├── context/
│   └── AuthContext.tsx         # Authentication state management
├── navigation/
│   ├── AuthStackNavigator.tsx  # Login/Register navigation
│   ├── AppStackNavigator.tsx   # Authenticated navigation
│   ├── RootNavigator.tsx       # Auth state-based navigation
│   └── screenOptions.ts        # Common screen options
├── screens/
│   ├── LoginScreen.tsx         # Login with email/password + social
│   ├── RegisterScreen.tsx      # Registration with validation
│   └── HomeScreen.tsx          # Protected home screen
├── components/
│   ├── Input.tsx               # Custom text input with icons
│   ├── AuthButton.tsx          # Animated button variants
│   ├── Divider.tsx             # Divider with text
│   ├── GoogleIcon.tsx          # Google logo SVG
│   ├── HeaderTitle.tsx         # App branding header
│   ├── ErrorBoundary.tsx       # Error handling wrapper
│   └── ErrorFallback.tsx       # Error UI with restart
├── constants/
│   └── theme.ts                # Colors, spacing, typography
└── hooks/
    ├── useTheme.ts             # Theme hook
    └── useScreenInsets.ts      # Safe area insets
```

## Design System
### Colors (Moroccan-Inspired)
- Primary: #FF6B35 (Orange)
- Secondary: #F7C6A3 (Light Beige)
- Dark: #252525 (Near Black)
- White: #FFFFFF

### Features
- Email/password authentication
- Google Sign-In button (UI ready)
- Apple Sign-In button on iOS (UI ready)
- Password strength indicator
- Form validation with error messages
- Success feedback on registration
- Protected home screen

## Running the App
- **Development**: `npm run dev`
- **Web**: Access via browser
- **Mobile**: Scan QR code with Expo Go

## Next Steps (Backend Integration)
1. Set up Supabase project
2. Configure Supabase client with environment variables
3. Implement real authentication:
   - `supabase.auth.signInWithPassword()`
   - `supabase.auth.signUp()`
   - Google OAuth
   - Apple Sign-In
4. Create `profiles` table in Supabase
5. Implement session persistence with AsyncStorage

## User Preferences
- Language: French (UI text in French)
- Design: Modern, minimal, Moroccan-inspired colors
- Authentication: Email/password + Google + Apple Sign-In
