import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../config/firebase";

export default function SalesTotalScreen() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "ventasUriol"));
        const lista = [];
        snap.forEach((doc) => {
          lista.push({ id: doc.id, ...doc.data() });
        });
        // Ordenar por más reciente
        lista.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVentas(lista);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#111827"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ventas Totales</Text>
      </View>

      <FlatList
        data={ventas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aún no hay ventas registradas</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.productoNombre}</Text>
              <Text style={styles.qty}>Cantidad: {item.cantidad}</Text>
            </View>
            <Text style={styles.total}>S/ {item.total?.toFixed(2)}</Text>
          </View>
        )}
      />
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
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  list: { padding: 16 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  qty: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  total: { fontSize: 16, fontWeight: "700", color: "#111827" },
});
