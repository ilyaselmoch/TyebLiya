import { Platform } from "react-native";

export const AppColors = {
  primary: "#FF6B35",
  secondary: "#F7C6A3",
  dark: "#252525",
  white: "#FFFFFF",
  error: "#DC2626",
  success: "#16A34A",
  gray100: "#F5F5F5",
  gray300: "#D4D4D4",
  gray600: "#737373",
  // Moroccan colors
  terracotta: "#D96E48",
  saffron: "#E6A500",
  sandBeige: "#F3E7D3",
  mintGreen: "#7CC9A2",
  warmBrown: "#4A2E1F",
  lightBeige: "#F8F1E7",
};

export const Colors = {
  light: {
    text: AppColors.dark,
    buttonText: AppColors.white,
    tabIconDefault: AppColors.gray600,
    tabIconSelected: AppColors.primary,
    link: AppColors.primary,
    backgroundRoot: AppColors.white,
    backgroundDefault: AppColors.gray100,
    backgroundSecondary: "#E6E6E6",
    backgroundTertiary: "#D9D9D9",
    inputBackground: AppColors.white,
    inputBorder: AppColors.gray300,
    inputBorderFocused: AppColors.primary,
    placeholder: AppColors.gray600,
    error: AppColors.error,
    success: AppColors.success,
  },
  dark: {
    text: "#ECEDEE",
    buttonText: AppColors.white,
    tabIconDefault: "#9BA1A6",
    tabIconSelected: AppColors.primary,
    link: AppColors.primary,
    backgroundRoot: "#1F2123",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    inputBackground: "#2A2C2E",
    inputBorder: "#404244",
    inputBorderFocused: AppColors.primary,
    placeholder: "#9BA1A6",
    error: "#EF4444",
    success: "#22C55E",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  inputHeight: 52,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
