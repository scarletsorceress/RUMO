import { db } from "../../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { AuthProvider } from "./auth.service";

export interface Mensagem {
  id: string;
  texto: string;
  idAutor: string;
  nomeAutor: string;
  criadoEm: any;
}

export const ChatService = {
  enviarMensagem: async (equipeId: string, texto: string) => {
    try {
      const user = AuthProvider.getCurrentUser();
      if (!user) return false;

      const profile = await AuthProvider.getProfile(user.uid);
      if (!profile) return false;

      const mensagensRef = collection(db, `equipes/${equipeId}/mensagens`);
      await addDoc(mensagensRef, {
        texto,
        idAutor: user.uid,
        nomeAutor: profile.nome_completo,
        criadoEm: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return false;
    }
  },

  // Retorna uma função para cancelar a inscrição do listener
  ouvirMensagens: (equipeId: string, callback: (mensagens: Mensagem[]) => void) => {
    const mensagensRef = collection(db, `equipes/${equipeId}/mensagens`);
    const q = query(mensagensRef, orderBy("criadoEm", "asc"));

    return onSnapshot(q, (snapshot) => {
      const mensagens: Mensagem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        mensagens.push({
          id: doc.id,
          texto: data.texto,
          idAutor: data.idAutor,
          nomeAutor: data.nomeAutor,
          criadoEm: data.criadoEm?.toDate() || new Date(),
        });
      });
      callback(mensagens);
    });
  }
};
