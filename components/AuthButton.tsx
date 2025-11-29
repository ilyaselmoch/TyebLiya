import React, { ReactNode } from "react";
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, AppColors } from "@/constants/theme";

interface AuthButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "google" | "apple";
  icon?: ReactNode;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AuthButton({
  onPress,
  children,
  style,
  disabled = false,
  loading = false,
  variant = "primary",
  icon,
}: AuthButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.98, springConfig);
      opacity.value = withSpring(0.9, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, springConfig);
      opacity.value = withSpring(1, springConfig);
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return AppColors.primary;
      case "secondary":
        return "transparent";
      case "outline":
        return "transparent";
      case "google":
        return AppColors.white;
      case "apple":
        return AppColors.dark;
      default:
        return AppColors.primary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return AppColors.white;
      case "secondary":
        return AppColors.primary;
      case "outline":
        return theme.text;
      case "google":
        return AppColors.dark;
      case "apple":
        return AppColors.white;
      default:
        return AppColors.white;
    }
  };

  const getBorderStyle = () => {
    if (variant === "outline" || variant === "google") {
      return {
        borderWidth: 1.5,
        borderColor: theme.inputBorder,
      };
    }
    return {};
  };

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={isDisabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: isDisabled ? 0.6 : 1,
        },
        getBorderStyle(),
        style,
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <ThemedText
            type="body"
            style={[styles.buttonText, { color: getTextColor() }]}
          >
            {children}
          </ThemedText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontWeight: "600",
  },
});
