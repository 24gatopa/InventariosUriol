import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import DebtorsScreen from "../screens/debtors/DebtorsScreen";
import HomeScreen from "../screens/home/HomeScreen";
import InventoryScreen from "../screens/inventory/InventoryScreen";
import PricesScreen from "../screens/inventory/PricesScreen";
import SalesRegisterScreen from "../screens/sales/SalesRegisterScreen";
import SalesTotalScreen from "../screens/sales/SalesTotalScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";
          if (route.name === "HomeTab") iconName = "home-outline";
          if (route.name === "InventoryTab") iconName = "list-outline";
          if (route.name === "SalesTab") iconName = "cart-outline";
          if (route.name === "SettingsTab") iconName = "settings-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: "Inicio" }}
      />
      <Tab.Screen
        name="InventoryTab"
        component={InventoryScreen}
        options={{ tabBarLabel: "Inventario" }}
      />
      <Tab.Screen
        name="SalesTab"
        component={SalesTotalScreen}
        options={{ tabBarLabel: "Ventas" }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: "Ajustes" }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="SalesRegister" component={SalesRegisterScreen} />
        <Stack.Screen name="Prices" component={PricesScreen} />
        <Stack.Screen name="DebtorsTab" component={DebtorsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
