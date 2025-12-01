import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClientHomeScreen from "@/screens/ClientHomeScreen";
import ChefDashboardScreen from "@/screens/ChefDashboardScreen";
import ChefOrderDetailsScreen from "@/screens/ChefOrderDetailsScreen";
import ChefProfileSettingsScreen from "@/screens/ChefProfileSettingsScreen";
import RoleLoadingScreen from "@/screens/RoleLoadingScreen";
import RoleSelectionScreen from "@/screens/RoleSelectionScreen";
import DishDetailScreen from "@/screens/DishDetailScreen";
import ChefOrdersScreen from "@/screens/ChefOrdersScreen";
import ChefMenuScreen from "@/screens/ChefMenuScreen";
import ClientOrdersScreen from "@/screens/ClientOrdersScreen";
import ClientMenuScreen from "@/screens/ClientMenuScreen";
import ClientProfileScreen from "@/screens/ClientProfileScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { useAuth } from "@/context/AuthContext";

export type AppStackParamList = {
  RoleLoading: undefined;
  RoleSelection: undefined;
  ClientHome: undefined;
  ClientOrders: undefined;
  ClientMenu: undefined;
  ClientProfile: undefined;
  ChefDashboard: undefined;
  ChefOrders: undefined;
  ChefMenu: undefined;
  ChefProfile: undefined;
  ChefOrderDetails: { orderId: string };
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
      key={`stack-${user.role}`}
      initialRouteName={initialRoute}
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
        headerShown: false,
      }}
    >
      {/* Client screens */}
      <Stack.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientOrders"
        component={ClientOrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientMenu"
        component={ClientMenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientProfile"
        component={ClientProfileScreen}
        options={{ headerShown: false }}
      />

      {/* Chef screens */}
      <Stack.Screen
        name="ChefDashboard"
        component={ChefDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChefOrders"
        component={ChefOrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChefMenu"
        component={ChefMenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChefProfile"
        component={ChefProfileSettingsScreen}
        options={{ headerShown: false }}
      />

      {/* Detail screens */}
      <Stack.Screen
        name="ChefOrderDetails"
        component={ChefOrderDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DishDetail"
        component={DishDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
