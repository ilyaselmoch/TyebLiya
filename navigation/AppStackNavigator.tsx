import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientHomeScreen from "@/screens/ClientHomeScreen";
import ChefDashboardScreen from "@/screens/ChefDashboardScreen";
import RoleLoadingScreen from "@/screens/RoleLoadingScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { useAuth } from "@/context/AuthContext";

export type AppStackParamList = {
  RoleLoading: undefined;
  ClientHome: undefined;
  ChefDashboard: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStackNavigator() {
  const { theme, isDark } = useTheme();
  const { user, isFetchingRole } = useAuth();

  // Show loading screen while fetching role
  if (isFetchingRole || !user?.role) {
    return (
      <Stack.Navigator
        screenOptions={{
          ...getCommonScreenOptions({ theme, isDark }),
          headerShown: false,
        }}
      >
        <Stack.Screen name="RoleLoading" component={RoleLoadingScreen} />
      </Stack.Navigator>
    );
  }

  // Route to appropriate dashboard based on user role
  const initialRoute = user.role === "client" ? "ClientHome" : "ChefDashboard";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      {/* Client dashboard */}
      <Stack.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Tyeb Liya - Client" />,
        }}
      />

      {/* Chef/Cuisinier dashboard */}
      <Stack.Screen
        name="ChefDashboard"
        component={ChefDashboardScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Tyeb Liya - Cuisinier" />,
        }}
      />
    </Stack.Navigator>
  );
}
