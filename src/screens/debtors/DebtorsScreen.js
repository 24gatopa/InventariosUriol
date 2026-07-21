import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
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

export default function DebtorsScreen({ navigation }) {
  const [deudores, setDeudores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [deuda, setDeuda] = useState("");
  const [loading, setLoading] = useState(false);

  const cargarDeudores = async () => {
    try {
      const snap = await getDocs(collection(db, "deudoresUriol"));
      const lista = [];
      snap.forEach((doc) => lista.push({ id: doc.id, ...doc.data() }));
      setDeudores(lista);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    cargarDeudores();
  }, []);

  const handleAgregar = async () => {
    if (!nombre || !deuda) {
      Alert.alert("Error", "Completa los campos");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "deudoresUriol"), {
        nombre,
        deuda: parseFloat(deuda) || 0,
        pagado: false,
        createdAt: new Date().toISOString(),
      });
      setNombre("");
      setDeuda("");
      setModalVisible(false);
      cargarDeudores();
    } catch (e) {
      Alert.alert("Error", "No se pudo agregar");
    } finally {
      setLoading(false);
    }
  };

  const togglePagado = async (item) => {
    try {
      await updateDoc(doc(db, "deudoresUriol", item.id), {
        pagado: !item.pagado,
      });
      cargarDeudores();
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Deudores</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={deudores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay deudores registrados</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.deuda}>
                Debe: S/ {item.deuda?.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.payButton,
                { backgroundColor: item.pagado ? "#16a34a" : "#9ca3af" },
              ]}
              onPress={() => togglePagado(item)}
            >
              <Text style={styles.payText}>
                {item.pagado ? "Pagó" : "Pendiente"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal agregar deudor */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Deudor</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la persona"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Monto que debe"
              value={deuda}
              onChangeText={setDeuda}
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
  addButton: {
    backgroundColor: "#111827",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
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
  deuda: { fontSize: 14, color: "#dc2626", marginTop: 4 },
  payButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payText: { color: "#ffffff", fontWeight: "600", fontSize: 13 },
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
    textAlign: "center",
    marginBottom: 20,
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
