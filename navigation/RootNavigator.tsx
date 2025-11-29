import React from "react";
import { useAuth } from "@/context/AuthContext";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import AppStackNavigator from "@/navigation/AppStackNavigator";

export default function RootNavigator() {
  const { user } = useAuth();

  return user ? <AppStackNavigator /> : <AuthStackNavigator />;
}
