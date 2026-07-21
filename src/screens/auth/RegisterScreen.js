import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../../components/ui/CustomInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { auth, db } from "../../config/firebase";

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        nombre,
        email,
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Éxito", "Cuenta creada correctamente");
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#5c4033" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#ffffff" />
            </View>
            <Text style={styles.title}>Regístrate</Text>
          </View>

          <CustomInput
            label="Nombre de usuario"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
          />
          <CustomInput
            label="Gmail"
            value={email}
            onChangeText={setEmail}
            placeholder="tucorreo@gmail.com"
            keyboardType="email-address"
          />
          <CustomInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="8 dígitos mínimo"
            secureTextEntry
          />
          <CustomInput
            label="Repite contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirma tu contraseña"
            secureTextEntry
          />

          <PrimaryButton
            title="Registrarse"
            onPress={handleRegister}
            loading={loading}
            color="#c4a484"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { padding: 24, paddingTop: 20 },
  backButton: { marginBottom: 10 },
  header: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#c4a484",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#111827" },
});

export default RegisterScreen;
