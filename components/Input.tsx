import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Typography, AppColors } from "@/constants/theme";

interface InputProps extends TextInputProps {
  icon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  error?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Input({
  icon,
  isPassword = false,
  error = false,
  onFocus,
  onBlur,
  style,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const borderScale = useSharedValue(0);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + borderScale.value * 0.01 }],
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderScale.value = withSpring(1, { damping: 15 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderScale.value = withSpring(0, { damping: 15 });
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return theme.error;
    if (isFocused) return theme.inputBorderFocused;
    return theme.inputBorder;
  };

  return (
    <AnimatedView
      style={[
        styles.container,
        {
          backgroundColor: theme.inputBackground,
          borderColor: getBorderColor(),
        },
        animatedBorderStyle,
      ]}
    >
      {icon ? (
        <View style={styles.iconContainer}>
          <Feather
            name={icon}
            size={20}
            color={isFocused ? AppColors.primary : theme.placeholder}
          />
        </View>
      ) : null}
      <TextInput
        style={[
          styles.input,
          { color: theme.text, paddingLeft: icon ? 0 : Spacing.md },
          style,
        ]}
        placeholderTextColor={theme.placeholder}
        secureTextEntry={isPassword && !showPassword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {isPassword ? (
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color={theme.placeholder}
          />
        </Pressable>
      ) : null}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Spacing.inputHeight,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 48,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: Typography.body.fontSize,
    paddingRight: Spacing.md,
  },
  eyeButton: {
    width: 48,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
