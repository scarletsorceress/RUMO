import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../src/services/auth.service";
import { Equipe, EquipeProvider } from "../src/services/equipe.service";

export default function HomeScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("Carregando...");
  const [perfil, setPerfil] = useState("ALUNO");
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [loadingEquipes, setLoadingEquipes] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const user = AuthProvider.getCurrentUser();

      if (!user) {
        setNomeUsuario("Usuário");
        return;
      }

      // Pega o nome do displayName ou do email
      let nome = user.displayName || user.email?.split('@')[0] || "Usuário";

      nome = nome
        .split(' ')
        .map((palavra: string) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
        .join(' ');

      setNomeUsuario(nome);

      // Busca o tipo de usuário no perfil
      try {
        const profile = await AuthProvider.getProfile(user.uid);
        if (profile) {
          setPerfil((profile.tipo_usuario || "aluno").toUpperCase());
        }
      } catch (error) {
        setPerfil("ALUNO");
      }
    }

    getProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function fetchEquipes() {
        setLoadingEquipes(true);
        const minhasEquipes = await EquipeProvider.getMinhasEquipes();
        setEquipes(minhasEquipes);
        setLoadingEquipes(false);
      }

      fetchEquipes();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AuthProvider.logout();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {nomeUsuario}! 👋</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{perfil}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Minhas Equipes</Text>

        {loadingEquipes ? (
          <Text style={styles.loadingText}>Carregando equipes...</Text>
        ) : equipes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>
              Você ainda não possui equipes vinculadas ao seu perfil de {perfil.toLowerCase()}.
            </Text>
          </View>
        ) : (
          equipes.map((equipe) => (
            <TouchableOpacity
              key={equipe.id}
              style={styles.equipeCard}
              onPress={() => router.push(`/equipe/${equipe.id}`)} // Preparado para a tela de equipe
            >
              <Text style={styles.equipeNome}>{equipe.nome}</Text>
              <Text style={styles.equipeTema} numberOfLines={2}>{equipe.tema}</Text>
            </TouchableOpacity>
          ))
        )}

        {perfil === "ORIENTADOR" && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/criar-equipe")}
          >
            <Text style={styles.actionButtonText}>+ Criar Nova Equipe</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair do Sistema</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: "#27AE60",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  roleText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 15,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    color: "#7F8C8D",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
  },
  loadingText: {
    textAlign: "center",
    color: "#7F8C8D",
    marginTop: 20,
    fontSize: 16,
  },
  equipeCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#27AE60",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  equipeNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 5,
  },
  equipeTema: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  actionButton: {
    backgroundColor: "#003366",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: "#E74C3C",
    fontWeight: "bold",
    fontSize: 16,
  },
});