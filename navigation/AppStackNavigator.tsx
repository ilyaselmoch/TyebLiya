import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientHomeScreen from "@/screens/ClientHomeScreen";
import ChefDashboardScreen from "@/screens/ChefDashboardScreen";
import RoleLoadingScreen from "@/screens/RoleLoadingScreen";
import RoleSelectionScreen from "@/screens/RoleSelectionScreen";
import DishDetailScreen from "@/screens/DishDetailScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { useAuth } from "@/context/AuthContext";

export type AppStackParamList = {
  RoleLoading: undefined;
  RoleSelection: undefined;
  ClientHome: undefined;
  ChefDashboard: undefined;
  DishDetail: { dishId: string };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStackNavigator() {
  const { theme, isDark } = useTheme();
  const { user, isFetchingRole } = useAuth();

  // Show loading screen while initially fetching role
  if (isFetchingRole) {
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

  // Show role selection screen if user has no role
  if (!user?.role) {
    return (
      <Stack.Navigator
        screenOptions={{
          ...getCommonScreenOptions({ theme, isDark }),
          headerShown: false,
        }}
      >
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
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

      {/* Dish Detail Screen */}
      <Stack.Screen
        name="DishDetail"
        component={DishDetailScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Dish Details" />,
          headerBackVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
