import { auth, db } from "../../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type Role = "aluno" | "orientador";

export interface UserProfile {
  id: string;
  email: string;
  tipo_usuario: Role;
  nome_completo: string;
}

export const AuthProvider = {
  login: async (email: string, senha: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), senha);
    return userCredential.user;
  },

  register: async (nome: string, email: string, senha: string, tipo: Role) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase().trim(),
      senha,
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName: nome });

    await setDoc(doc(db, 'usuarios', user.uid), {
      nome_completo: nome,
      email: email.toLowerCase().trim(),
      tipo_usuario: tipo,
      criado_em: new Date().toISOString(),
    });

    return user;
  },

  logout: async () => {
    await signOut(auth);
  },

  getProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'usuarios', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: uid,
          email: data.email,
          tipo_usuario: data.tipo_usuario as Role,
          nome_completo: data.nome_completo,
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao obter perfil:", error);
      return null;
    }
  },
  
  getCurrentUser: () => {
    return auth.currentUser;
  }
};
