import React from "react";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface DividerProps {
  text?: string;
}

export function Divider({ text }: DividerProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[styles.line, { backgroundColor: theme.inputBorder }]}
      />
      {text ? (
        <ThemedText style={styles.text} type="small">
          {text}
        </ThemedText>
      ) : null}
      <View
        style={[styles.line, { backgroundColor: theme.inputBorder }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: Spacing.md,
    opacity: 0.7,
  },
});
