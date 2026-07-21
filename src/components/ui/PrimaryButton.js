import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const PrimaryButton = ({
  title,
  onPress,
  loading = false,
  color = "#111827",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PrimaryButton;
