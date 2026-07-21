import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomInput from "../../components/ui/CustomInput";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { auth } from "../../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Main");
    } catch (error) {
      Alert.alert("Error", "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#ffffff" />
          </View>
          <Text style={styles.title}>Bienvenido</Text>
        </View>

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
          placeholder="Tu contraseña"
          secureTextEntry={true}
        />

        <PrimaryButton
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
          color="#c4a484"
        />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.bold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5e6d3",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#c4a484",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5c4033",
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  registerText: {
    color: "#5c4033",
    fontSize: 15,
  },
  bold: {
    fontWeight: "700",
  },
});
