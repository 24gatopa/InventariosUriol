import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { db } from "../../config/firebase";

export default function InventoryScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [loading, setLoading] = useState(false);

  const cargarProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventarioUriol"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setProductos(lista);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleAgregar = async () => {
    if (!nombre || !cantidad || !precio) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "inventarioUriol"), {
        nombre: nombre,
        cantidad: parseInt(cantidad) || 0,
        precio: parseFloat(precio) || 0,
        createdAt: new Date().toISOString(),
      });

      setNombre("");
      setCantidad("");
      setPrecio("");
      setModalVisible(false);
      cargarProductos();
      Alert.alert("Éxito", "Producto agregado");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventario</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color="#111827" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay productos. Agrega uno.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="cube-outline" size={28} color="#111827" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.qty}>Cantidad: {item.cantidad}</Text>
              <Text style={styles.price}>S/ {item.precio?.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />

      {/* Modal para agregar producto */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Producto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad"
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Precio de venta"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
            />

            <PrimaryButton
              title="Guardar"
              onPress={handleAgregar}
              loading={loading}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  list: { padding: 16 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  info: { marginLeft: 14 },
  name: { fontSize: 16, fontWeight: "600", color: "#111827" },
  qty: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  price: { fontSize: 14, fontWeight: "600", color: "#111827", marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  cancelButton: { marginTop: 12, alignItems: "center" },
  cancelText: { color: "#6b7280", fontSize: 16 },
});
