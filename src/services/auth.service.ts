export type Role = "aluno" | "orientador";

export interface User {
  id: string;
  email: string;
  senha?: string;
  tipo: Role;
  nome: string;
}

let mockUsers: User[] = [
  {
    id: "1",
    email: "aluno@tcc.com",
    senha: "123",
    tipo: "aluno",
    nome: "João Aluno",
  },
  {
    id: "2",
    email: "orientador@tcc.com",
    senha: "123",
    tipo: "orientador",
    nome: "Prof. Silva",
  },
];

// Variável que guarda a sessão atual
let currentUser: User | null = null;

export const AuthProvider = {
  login: (email: string, senha: string): User | undefined => {
    const user = mockUsers.find(
      (u) => u.email === email.toLowerCase().trim() && u.senha === senha,
    );
    if (user) currentUser = user; // Salva o usuário na sessão
    return user;
  },

  register: (novoUsuario: Omit<User, "id">): boolean => {
    const exists = mockUsers.some(
      (u) => u.email === novoUsuario.email.toLowerCase().trim(),
    );
    if (exists) return false;

    mockUsers.push({
      ...novoUsuario,
      id: Math.random().toString(36).substring(2, 9),
      email: novoUsuario.email.toLowerCase().trim(),
    });
    return true;
  },

  getCurrentUser: () => currentUser,

  logout: () => {
    currentUser = null; // Limpa a sessão ao sair
  },
};
