import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { AuthProvider } from "./auth.service";

export interface Equipe {
  id: string;
  nome: string;
  tema: string;
  idOrientador: string;
  emailsAlunos: string[]; 
}

export const EquipeProvider = {
  criar: async (nome: string, tema: string, emailsAlunosStr: string): Promise<boolean> => {
    try {
      const user = AuthProvider.getCurrentUser();
      if (!user) return false;

      const profile = await AuthProvider.getProfile(user.uid);
      if (!profile || profile.tipo_usuario !== "orientador") return false;

      const emailsArray = emailsAlunosStr
        .split(",")
        .map((email) => email.toLowerCase().trim())
        .filter((email) => email.length > 0);

      const novaEquipe = {
        nome,
        tema,
        idOrientador: user.uid,
        emailsAlunos: emailsArray,
        criado_em: new Date().toISOString(),
      };

      await addDoc(collection(db, 'equipes'), novaEquipe);
      return true;
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      return false;
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
