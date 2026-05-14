import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../../src/services/auth.service";
import { ChatService, Mensagem } from "../../src/services/chat.service";
import { Equipe, EquipeProvider } from "../../src/services/equipe.service";

export default function EquipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [equipe, setEquipe] = useState<Equipe | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [meuId, setMeuId] = useState("");
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const user = AuthProvider.getCurrentUser();
    if (user) {
      setMeuId(user.uid);
    }

    async function loadData() {
      if (typeof id === "string") {
        const data = await EquipeProvider.getEquipePorId(id);
        setEquipe(data);
      }
    }
    loadData();

    if (typeof id === "string") {
      const unsubscribe = ChatService.ouvirMensagens(id, (msgs) => {
        setMensagens(msgs);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      });
      return () => unsubscribe();
    }
  }, [id]);

  const handleEnviar = async () => {
    if (!novaMensagem.trim() || typeof id !== "string") return;
    
    const texto = novaMensagem.trim();
    setNovaMensagem(""); // limpa o input imediatamente para melhor UX
    
    const sucesso = await ChatService.enviarMensagem(id, texto);
    if (!sucesso) {
      // Se falhar, poderia restaurar o texto ou mostrar um alerta
      setNovaMensagem(texto);
    }
  };

  const renderMensagem = ({ item }: { item: Mensagem }) => {
    const isMinha = item.idAutor === meuId;

    return (
      <View style={[styles.messageContainer, isMinha ? styles.myMessageContainer : styles.otherMessageContainer]}>
        {!isMinha && <Text style={styles.messageAuthor}>{item.nomeAutor}</Text>}
        <View style={[styles.messageBubble, isMinha ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, isMinha ? styles.myMessageText : styles.otherMessageText]}>
            {item.texto}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {item.criadoEm.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header Microsoft Teams Style */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{equipe?.nome || "Carregando..."}</Text>
            <Text style={styles.headerSubtitle}>{equipe?.tema || "..."}</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <FlatList
          ref={flatListRef}
          data={mensagens}
          keyExtractor={(item) => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add" size={28} color="#5B5FC7" />
          </TouchableOpacity>
          
          <View style={styles.textInputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite uma mensagem"
              placeholderTextColor="#7F8C8D"
              value={novaMensagem}
              onChangeText={setNovaMensagem}
              multiline
            />
          </View>

          <TouchableOpacity 
            style={[styles.sendButton, !novaMensagem.trim() && styles.sendButtonDisabled]} 
            onPress={handleEnviar}
            disabled={!novaMensagem.trim()}
          >
            <Ionicons name="send" size={20} color={novaMensagem.trim() ? "#FFFFFF" : "#A6A6A6"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#464EB8", // Cor estilo Teams (Roxo/Azul escuro)
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F2F1", // Fundo cinza bem claro estilo Teams
  },
  header: {
    backgroundColor: "#464EB8",
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#E0E0E0",
    fontSize: 12,
  },
  headerIcon: {
    padding: 5,
  },
  chatList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: "80%",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  messageAuthor: {
    fontSize: 12,
    color: "#605E5C",
    marginBottom: 4,
    marginLeft: 4,
  },
  messageBubble: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myBubble: {
    backgroundColor: "#E5E5F1", // Fundo suave para mensagens próprias
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#242424",
  },
  otherMessageText: {
    color: "#242424",
  },
  messageTime: {
    fontSize: 10,
    color: "#A19F9D",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EDEBE9",
  },
  attachButton: {
    padding: 10,
    marginBottom: 2,
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: "#F3F2F1",
    borderRadius: 20,
    minHeight: 40,
    maxHeight: 100,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  textInput: {
    fontSize: 15,
    color: "#242424",
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: "#5B5FC7", // Roxo Teams
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  sendButtonDisabled: {
    backgroundColor: "#F3F2F1",
  },
});
