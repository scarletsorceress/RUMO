import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthProvider, User } from "../src/services/auth.service";
import { Equipe, EquipeProvider } from "../src/services/equipe.service";

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [equipes, setEquipes] = useState<Equipe[]>([]);

  // useFocusEffect atualiza a tela toda vez que voltamos para ela
  useFocusEffect(
    useCallback(() => {
      const currentUser = AuthProvider.getCurrentUser();
      if (!currentUser) {
        router.replace("/");
        return;
      }
      setUser(currentUser);
      setEquipes(EquipeProvider.getMinhasEquipes());
    }, []),
  );

  const handleLogout = () => {
    AuthProvider.logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Olá, {user?.nome.split(" ")[0]}!</Text>
        <Text style={styles.status}>Perfil: {user?.tipo.toUpperCase()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Minhas Equipes</Text>

      {equipes.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Você ainda não possui equipes vinculadas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={equipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.teamCard}>
              <Text style={styles.teamName}>{item.nome}</Text>
              <Text style={styles.teamTheme}>{item.tema}</Text>
            </View>
          )}
        />
      )}

      {/* Botão visível APENAS para Orientadores */}
      {user?.tipo === "orientador" && (
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push("/criar-equipe")}
        >
          <Text style={styles.createBtnText}>+ Criar Nova Equipe</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair do Sistema</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F7F6", padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  welcome: { fontSize: 26, fontWeight: "bold", color: "#2C3E50" },
  status: { color: "#7F8C8D", fontSize: 14, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 15,
  },
  emptyBox: {
    padding: 20,
    backgroundColor: "#EAECEE",
    borderRadius: 10,
    alignItems: "center",
  },
  emptyText: { color: "#7F8C8D", fontStyle: "italic" },
  teamCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#003366",
    elevation: 2,
    marginBottom: 15,
  },
  teamName: { fontSize: 18, fontWeight: "bold", color: "#003366" },
  teamTheme: { color: "#7F8C8D", marginTop: 5, fontSize: 14 },
  createBtn: {
    backgroundColor: "#27AE60",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  createBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  logout: { padding: 20, alignItems: "center", marginTop: "auto" },
  logoutText: { color: "#E74C3C", fontWeight: "600" },
});
