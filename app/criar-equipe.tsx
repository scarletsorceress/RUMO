import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { EquipeProvider } from "../src/services/equipe.service";

export default function CriarEquipeScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [tema, setTema] = useState("");
  const [alunosStr, setAlunosStr] = useState("");

  const handleSalvar = () => {
    if (!nome || !tema || !alunosStr) {
      return Alert.alert(
        "Atenção",
        "Preencha todos os campos, incluindo os alunos.",
      );
    }

    const sucesso = EquipeProvider.criar(nome, tema, alunosStr);

    if (sucesso) {
      Alert.alert("Sucesso", "Equipe registrada no sistema!");
      router.back();
    } else {
      Alert.alert("Erro", "Apenas orientadores podem criar equipes.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Nova Equipe</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Nome da Equipe</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Grupo Alpha"
        />

        <Text style={styles.label}>Tema do TCC</Text>
        <TextInput
          style={[styles.input, styles.area]}
          value={tema}
          onChangeText={setTema}
          placeholder="Descreva o problema de pesquisa..."
          multiline
        />

        <Text style={styles.label}>
          E-mails dos Alunos (separados por vírgula)
        </Text>
        <TextInput
          style={styles.input}
          value={alunosStr}
          onChangeText={setAlunosStr}
          placeholder="aluno1@tcc.com, aluno2@tcc.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
          <Text style={styles.saveBtnText}>SALVAR EQUIPE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F6",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  box: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, elevation: 5 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#7F8C8D",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  area: { height: 80, textAlignVertical: "top" },
  saveBtn: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold" },
  cancelBtn: { padding: 15, alignItems: "center", marginTop: 5 },
  cancelBtnText: { color: "#95A5A6", fontWeight: "bold" },
});
