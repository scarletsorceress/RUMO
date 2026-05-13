import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Role } from "../src/services/auth.service";
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<Role>("aluno");

  const handleAutenticacao = async () => {
    // LÓGICA DE LOGIN
    if (isLogin) {
      if (!email || !senha) {
        Alert.alert("Erro", "Preencha e-mail e senha!");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: senha,
      });

      if (error) {
        Alert.alert("Acesso Negado", "E-mail ou senha incorretos.");
        return;
      }

      Alert.alert("Sucesso", "Acesso liberado!", [
        { text: "OK", onPress: () => router.replace("/home") }
      ]);
    }
    // LÓGICA DE CADASTRO
    else {
      if (!nome || !email || !senha) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: senha,
        options: {
          data: {
            nome_completo: nome,
            tipo_usuario: tipo, // Salva se é aluno ou orientador
          }
        }
      });

      if (error) {
        Alert.alert("Erro no Cadastro", error.message);
        return;
      }

      Alert.alert("Sucesso", "Conta criada com sucesso! Agora você pode entrar.");
      setIsLogin(true); // Retorna automaticamente para a tela de login
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>RUMO</Text>
      <Text style={styles.tagline}>Gestão de TCC & Equipes</Text>

      <View style={styles.card}>
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#7F8C8D"
              value={nome}
              onChangeText={setNome}
            />
            <View style={styles.roleBox}>
              {(["aluno", "orientador"] as Role[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, tipo === r && styles.roleBtnActive]}
                  onPress={() => setTipo(r)}
                >
                  <Text
                    style={[styles.roleBtnText, tipo === r && styles.textWhite]}
                  >
                    {r.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#7F8C8D"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#7F8C8D"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {/* Botão atualizado para chamar a nova função */}
        <TouchableOpacity style={styles.btnPrimary} onPress={handleAutenticacao}>
          <Text style={styles.btnPrimaryText}>
            {isLogin ? "ENTRAR" : "CADASTRAR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchBtn}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Criar nova conta" : "Já possuo acesso"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
    justifyContent: "center",
    padding: 20,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },
  tagline: {
    color: "#BDC3C7",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    elevation: 10,
  },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  roleBox: { flexDirection: "row", gap: 10, marginBottom: 15 },
  roleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#003366",
    alignItems: "center",
  },
  roleBtnActive: { backgroundColor: "#003366" },
  roleBtnText: { color: "#003366", fontWeight: "bold", fontSize: 12 },
  textWhite: { color: "#FFF" },
  btnPrimary: {
    backgroundColor: "#27AE60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  btnPrimaryText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  switchBtn: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#7F8C8D", fontSize: 14 },
});