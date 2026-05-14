import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, onSnapshot } from "firebase/firestore";
import { AuthProvider } from "./auth.service";

export interface Equipe {
  id: string;
  nome: string;
  tema: string;
  idOrientador: string;
  emailsAlunos: string[]; 
}

export const EquipeProvider = {
  criar: async (nome: string, tema: string, emailsAlunosStr: string): Promise<{ sucesso: boolean; erro?: string }> => {
    try {
      const user = AuthProvider.getCurrentUser();
      if (!user) return { sucesso: false, erro: "Usuário não autenticado." };

      const profile = await AuthProvider.getProfile(user.uid);
      if (!profile || profile.tipo_usuario !== "orientador") return { sucesso: false, erro: "Apenas orientadores podem criar equipes." };

      const emailsArray = emailsAlunosStr
        .split(",")
        .map((email) => email.toLowerCase().trim())
        .filter((email) => email.length > 0);

      // Verificar se algum dos emails inseridos pertence a um orientador
      if (emailsArray.length > 0) {
        // Firestore 'in' limit is 10, but assuming teams are small for now
        const usuariosRef = collection(db, 'usuarios');
        const chunk = emailsArray.slice(0, 10); // Check up to 10 emails
        const q = query(usuariosRef, where('email', 'in', chunk));
        const snapshot = await getDocs(q);
        
        for (const docSnap of snapshot.docs) {
          if (docSnap.data().tipo_usuario === 'orientador') {
            return { sucesso: false, erro: "Não é permitido adicionar outro orientador à equipe. Apenas um orientador por equipe é permitido." };
          }
        }
      }

      const novaEquipe = {
        nome,
        tema,
        idOrientador: user.uid,
        emailsAlunos: emailsArray,
        criado_em: new Date().toISOString(),
      };

      await addDoc(collection(db, 'equipes'), novaEquipe);
      return { sucesso: true };
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      return { sucesso: false, erro: "Erro interno ao conectar ao banco de dados." };
    }
  },

  getMinhasEquipes: async (): Promise<Equipe[]> => {
    try {
      const user = AuthProvider.getCurrentUser();
      if (!user || !user.email) return [];

      const profile = await AuthProvider.getProfile(user.uid);
      if (!profile) return [];

      const equipesRef = collection(db, 'equipes');
      let q;

      if (profile.tipo_usuario === "orientador") {
        q = query(equipesRef, where("idOrientador", "==", user.uid));
      } else {
        q = query(equipesRef, where("emailsAlunos", "array-contains", user.email));
      }

      const querySnapshot = await getDocs(q);
      const equipes: Equipe[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        equipes.push({
          id: docSnap.id,
          nome: data.nome,
          tema: data.tema,
          idOrientador: data.idOrientador,
          emailsAlunos: data.emailsAlunos || [],
        });
      });

      return equipes;
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      return [];
    }
  },

  ouvirMinhasEquipes: async (callback: (equipes: Equipe[]) => void) => {
    const user = AuthProvider.getCurrentUser();
    if (!user || !user.email) return () => {};

    const profile = await AuthProvider.getProfile(user.uid);
    if (!profile) return () => {};
    
    const equipesRef = collection(db, 'equipes');
    let q;

    if (profile.tipo_usuario === "orientador") {
      q = query(equipesRef, where("idOrientador", "==", user.uid));
    } else {
      q = query(equipesRef, where("emailsAlunos", "array-contains", user.email!));
    }

    return onSnapshot(q, (snapshot) => {
      const equipes: Equipe[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        equipes.push({
          id: docSnap.id,
          nome: data.nome,
          tema: data.tema,
          idOrientador: data.idOrientador,
          emailsAlunos: data.emailsAlunos || [],
        });
      });
      callback(equipes);
    });
  },

  getEquipePorId: async (id: string): Promise<Equipe | null> => {
    try {
      const docRef = doc(db, 'equipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          nome: data.nome,
          tema: data.tema,
          idOrientador: data.idOrientador,
          emailsAlunos: data.emailsAlunos || [],
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
      return null;
    }
  }
};
