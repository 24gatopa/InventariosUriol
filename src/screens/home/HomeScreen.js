import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase";

export default function HomeScreen({ navigation }) {
  const [valorInventario, setValorInventario] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcular = async () => {
      try {
        const snap = await getDocs(collection(db, "inventarioUriol"));
        let total = 0;
        snap.forEach((doc) => {
          const data = doc.data();
          total += (data.cantidad || 0) * (data.precio || 0);
        });
        setValorInventario(total);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    calcular();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenidos a</Text>
        <Text style={styles.subtitle}>Inventarios Uriol</Text>

        <View style={styles.valueCard}>
          <Text style={styles.valueLabel}>VALOR DE INVENTARIO</Text>
          {loading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.valueAmount}>
              S/ {valorInventario.toFixed(2)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SalesRegister")}
        >
          <Ionicons name="cart-outline" size={28} color="#111827" />
          <Text style={styles.buttonText}>Registrar Venta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DebtorsTab")}
        >
          <Ionicons name="people-outline" size={28} color="#111827" />
          <Text style={styles.buttonText}>Deudores</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { flex: 1, padding: 24, paddingTop: 40 },
  title: { fontSize: 18, color: "#6b7280", textAlign: "center" },
  subtitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 30,
  },
  valueCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  valueLabel: { fontSize: 13, color: "#6b7280", marginBottom: 6 },
  valueAmount: { fontSize: 32, fontWeight: "700", color: "#111827" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  buttonText: {
    marginLeft: 14,
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
});
