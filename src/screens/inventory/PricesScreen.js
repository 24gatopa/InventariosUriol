import { Ionicons } from "@expo/vector-icons";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const productos = [
  { id: "1", nombre: "Aceite", precio: 8.5 },
  { id: "2", nombre: "Gaseosa", precio: 2.5 },
  { id: "3", nombre: "Arroz", precio: 3.8 },
  { id: "4", nombre: "Azúcar", precio: 4.2 },
  { id: "5", nombre: "Leche", precio: 4.5 },
];

export default function PricesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Precios</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nombre}</Text>
            <Text style={styles.price}>S/ {item.precio.toFixed(2)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  list: { padding: 16 },
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
  price: { fontSize: 16, fontWeight: "700", color: "#111827" },
});
