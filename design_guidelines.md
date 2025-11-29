# Tyeb Liya - Mobile Design Guidelines

## Architecture Decisions

### Authentication
**Auth Required** - The app explicitly requires user accounts with email/password and Google Sign-In.

**Auth Implementation:**
- Primary: Email/Password authentication via Supabase Auth
- Social: Google Sign-In (required)
- Apple Sign-In must be added for iOS App Store compliance
- Supabase Auth handles session management and token refresh
- Store user profile data (pseudo, email) in `profiles` table

**Auth Screens:**
1. **Login** - Default landing screen
2. **Register** - Create new account
3. **Home** - Protected screen (placeholder for future modules)

### Navigation Structure
**Stack-Only Navigation** - This is a linear authentication flow with no tabs or drawer needed at this stage.

**Navigation Flow:**
```
Unauthenticated:
  → Login (default)
  → Register

Authenticated:
  → Home (protected)
```

## Screen Specifications

### 1. Login Screen
**Purpose:** Allow existing users to authenticate via email/password or Google.

**Layout:**
- **Header:** None (full-screen auth page)
- **Main Content:** Scrollable container, vertically centered
- **Safe Area Insets:**
  - Top: `insets.top + 40px`
  - Bottom: `insets.bottom + 40px`
  - Horizontal: `24px`

**Components & Hierarchy:**
1. **App Logo/Branding**
   - Text "Tyeb Liya" in large display font
   - Moroccan-inspired icon or decorative element (optional asset)
   - Centered, top of screen
   
2. **Form Section**
   - Email input field (with icon prefix)
   - Password input field (with icon prefix and toggle visibility)
   - "Se connecter" primary button
   - Error message container (red text, appears on failure)
   - Loading spinner overlay on button during auth

3. **Divider**
   - Horizontal line with centered text "ou"
   - Subtle gray color (#E0E0E0)

4. **Social Login**
   - Google Sign-In button (white background, Google logo, black text)
   - Apple Sign-In button (black background, Apple logo, white text) - iOS only

5. **Secondary Action**
   - Text button: "Créer un compte"
   - Placed at bottom, center-aligned

**Interaction States:**
- Button press: Slight scale down (0.98) + opacity (0.9)
- Input focus: Border color changes to primary orange
- Loading: Button disabled, spinner shows, inputs disabled

---

### 2. Register Screen
**Purpose:** Allow new users to create an account with pseudo, email, and password.

**Layout:**
- **Header:** Custom header with back button (left)
  - Title: "Créer un compte"
  - Transparent background
- **Main Content:** Scrollable form
- **Safe Area Insets:**
  - Top: `headerHeight + 24px`
  - Bottom: `insets.bottom + 24px`
  - Horizontal: `24px`

**Components & Hierarchy:**
1. **Form Section**
   - Pseudo/Username input (with user icon prefix)
   - Email input (with email icon prefix)
   - Password input (with lock icon prefix and toggle visibility)
   - Password strength indicator (optional, beneath password field)
   
2. **Submit Button**
   - "Créer mon compte" primary button
   - Full width, positioned below form
   - Loading state with spinner

3. **Error Container**
   - Red text for validation/server errors
   - Positioned below submit button

4. **Secondary Action**
   - Text button: "Déjà un compte ? Se connecter"
   - Links back to Login
   - Positioned at bottom center

**Validation:**
- Pseudo: Min 3 characters, no special symbols
- Email: Valid email format
- Password: Min 8 characters (display requirements below input)
- Show inline validation errors on blur

---

### 3. Home Screen (Placeholder)
**Purpose:** Protected landing page post-authentication.

**Layout:**
- **Header:** Default navigation header
  - Title: "Accueil"
  - Right button: Settings/Profile icon (future)
- **Main Content:** Empty state message
  - "Bienvenue sur Tyeb Liya"
  - Logout button for testing

---

## Design System

### Color Palette
**Primary Colors (Moroccan-Inspired):**
- `primary`: #FF6B35 (Orange - main brand color)
- `secondary`: #F7C6A3 (Light Beige - accents, backgrounds)
- `dark`: #252525 (Near Black - text, headers)
- `white`: #FFFFFF (Backgrounds, light text)

**Functional Colors:**
- `error`: #DC2626 (Red for errors)
- `success`: #16A34A (Green for success messages)
- `gray-100`: #F5F5F5 (Light backgrounds)
- `gray-300`: #D4D4D4 (Borders, dividers)
- `gray-600`: #737373 (Secondary text)

### Typography
**Font Family:**
- iOS: System (San Francisco)
- Android: Roboto

**Text Styles:**
- **Display:** 32px, bold, dark - for "Tyeb Liya" logo
- **Heading:** 24px, semi-bold, dark - for screen titles
- **Body:** 16px, regular, dark - for labels, inputs
- **Button:** 16px, semi-bold, white/dark
- **Caption:** 14px, regular, gray-600 - for hints, secondary text
- **Error:** 14px, regular, error - for validation messages

### Spacing Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 40px

### Border Radius
- **Input fields:** 12px (rounded-xl equivalent)
- **Buttons:** 12px
- **Cards:** 16px
- **Chips/Tags:** 20px (fully rounded)

### Component Specifications

#### Input Fields
- Height: 52px
- Background: white
- Border: 1.5px solid gray-300
- Border Radius: 12px
- Padding: 0 16px (0 48px if icon prefix)
- Font: Body
- Icon color: gray-600 (left-aligned, 20px size)
- Focus state: Border color → primary orange
- Error state: Border color → error red

#### Primary Button
- Height: 52px
- Background: primary orange (#FF6B35)
- Border Radius: 12px
- Text: Button style, white color
- Shadow: None (keep flat for modern look)
- Press feedback: Scale 0.98 + opacity 0.9
- Loading: Spinner centered, button disabled

#### Text Button (Secondary Actions)
- No background
- Text color: primary orange
- Font: Body, semi-bold
- Underline on press (optional)
- Press feedback: Opacity 0.7

#### Google/Apple Sign-In Buttons
- Height: 52px
- Border Radius: 12px
- **Google:**
  - Background: white
  - Border: 1.5px solid gray-300
  - Text: dark
  - Logo: Google icon (left-aligned)
- **Apple:**
  - Background: dark (#000000)
  - Text: white
  - Logo: Apple icon (left-aligned)

### Visual Design Principles
1. **Moroccan Modern Aesthetic:**
   - Use orange (#FF6B35) sparingly as primary action color
   - Beige (#F7C6A3) for subtle background accents (e.g., behind logo)
   - Clean, minimal UI with generous white space
   - Rounded corners throughout (12-16px)

2. **No Drop Shadows:**
   - Keep UI flat and modern
   - Use subtle borders instead of shadows for elevation

3. **Centered Layouts:**
   - Auth screens have centered content with max-width constraints
   - Forms should never exceed 400px width on larger devices

4. **Mobile-First:**
   - All touch targets minimum 44x44px (iOS HIG)
   - Form inputs take full width (minus horizontal padding)
   - Generous spacing between interactive elements (min 16px)

### Assets Required
**Essential Icons (use @expo/vector-icons - Feather set):**
- `mail` - Email input prefix
- `lock` - Password input prefix
- `user` - Pseudo input prefix
- `eye` / `eye-off` - Password visibility toggle
- `chevron-left` - Back navigation
- `log-out` - Logout action

**Custom Asset:**
- **App Logo/Icon:** Moroccan-inspired geometric pattern or Arabic calligraphy element incorporating "TL" or full name
  - Format: SVG or PNG (300x300px minimum)
  - Colors: Use primary orange and dark
  - Style: Modern, minimal, culturally respectful

### Accessibility
- All inputs have accessible labels (using `accessibilityLabel`)
- Error messages announced via screen readers
- Touch targets meet 44x44px minimum
- Color contrast ratios: 4.5:1 for body text, 3:1 for large text
- Support dynamic font sizing (respect user's font scale settings)