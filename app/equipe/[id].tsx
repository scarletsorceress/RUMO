import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EquipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes da Equipe</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.info}>ID da equipe selecionada:</Text>
        <Text style={styles.idText}>{id}</Text>
        
        <Text style={styles.wip}>
          Esta tela será desenvolvida em breve!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  header: {
    backgroundColor: "#003366",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 10,
  },
  idText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27AE60",
    marginBottom: 40,
  },
  wip: {
    fontSize: 16,
    color: "#E74C3C",
    textAlign: "center",
    fontWeight: "bold",
  }
});
