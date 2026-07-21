import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../config/firebase";

export default function SettingsScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  const handleHelp = () => {
    Alert.alert(
      "Ayuda",
      "Para soporte o dudas sobre la aplicación, contacta al administrador.",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleHelp}>
          <Ionicons name="help-circle-outline" size={22} color="#111827" />
          <Text style={styles.buttonText}>AYUDA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#111827" />
          <Text style={styles.buttonText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111827" },
  content: { padding: 24, paddingTop: 40 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  buttonText: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
