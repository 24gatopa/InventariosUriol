import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../../components/ui/CustomInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { db } from "../../config/firebase";

export default function SalesRegisterScreen({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState("1");
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, "inventarioUriol"));
        const lista = [];
        snap.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
        setProductos(lista);
      } catch (e) {
        console.log(e);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    const cant = parseInt(cantidad) || 0;
    setTotal(cant * precioUnitario);
  }, [cantidad, precioUnitario]);

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);
    setPrecioUnitario(prod.precio || 0);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!productoSeleccionado) {
      Alert.alert("Error", "Selecciona un producto");
      return;
    }
    if (!cantidad || parseInt(cantidad) <= 0) {
      Alert.alert("Error", "Cantidad inválida");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "ventasUriol"), {
        productoId: productoSeleccionado.id,
        productoNombre: productoSeleccionado.nombre,
        cantidad: parseInt(cantidad),
        precioUnitario,
        total,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Éxito", "Venta registrada");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "No se pudo registrar la venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Registrar Venta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Producto</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={
              productoSeleccionado ? styles.selectorText : styles.placeholder
            }
          >
            {productoSeleccionado
              ? productoSeleccionado.nombre
              : "Selecciona un producto"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6b7280" />
        </TouchableOpacity>

        <CustomInput
          label="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          placeholder="1"
          keyboardType="numeric"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Precio unitario:</Text>
          <Text style={styles.infoValue}>S/ {precioUnitario.toFixed(2)}</Text>
        </View>

        <View style={[styles.infoBox, styles.totalBox]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>S/ {total.toFixed(2)}</Text>
        </View>

        <PrimaryButton title="Comprar" onPress={handleSave} loading={loading} />
      </ScrollView>

      {/* Modal de productos */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Producto</Text>

            {productos.length === 0 ? (
              <Text style={styles.empty}>
                No hay productos en el inventario
              </Text>
            ) : (
              <FlatList
                data={productos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productItem}
                    onPress={() => seleccionarProducto(item)}
                  >
                    <Text style={styles.productName}>{item.nombre}</Text>
                    <Text style={styles.productPrice}>
                      S/ {item.precio?.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Cerrar</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  content: { padding: 20 },
  label: { fontSize: 14, color: "#111827", marginBottom: 6, fontWeight: "500" },
  selector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  selectorText: { fontSize: 16, color: "#111827" },
  placeholder: { fontSize: 16, color: "#9ca3af" },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  infoLabel: { color: "#6b7280" },
  infoValue: { fontWeight: "600", color: "#111827" },
  totalBox: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  totalLabel: { fontSize: 16, fontWeight: "600" },
  totalValue: { fontSize: 18, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  productName: { fontSize: 16, color: "#111827" },
  productPrice: { fontWeight: "600" },
  empty: { textAlign: "center", color: "#9ca3af", marginVertical: 30 },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#ffffff", fontWeight: "600" },
});
