import { AuthProvider } from "./auth.service";

export interface Equipe {
  id: string;
  nome: string;
  tema: string;
  idOrientador: string;
  emailsAlunos: string[]; // vinculando os alunos pelo email
}

let mockEquipes: Equipe[] = [];

export const EquipeProvider = {
  criar: (nome: string, tema: string, emailsAlunosStr: string): boolean => {
    const user = AuthProvider.getCurrentUser();

    // apenas orientador cria as equipes
    if (!user || user.tipo !== "orientador") return false;

    // transformando a string de emails em um array
    const emailsArray = emailsAlunosStr
      .split(",")
      .map((email) => email.toLowerCase().trim())
      .filter((email) => email.length > 0);

    const novaEquipe: Equipe = {
      id: Math.random().toString(36).substring(2, 9),
      nome,
      tema,
      idOrientador: user.id,
      emailsAlunos: emailsArray,
    };

    mockEquipes.push(novaEquipe);
    return true;
  },

  getMinhasEquipes: (): Equipe[] => {
    const user = AuthProvider.getCurrentUser();
    if (!user) return [];

    // Se for orientador, retorna as equipes que ele criou
    if (user.tipo === "orientador") {
      return mockEquipes.filter((equipe) => equipe.idOrientador === user.id);
    }

    // Se for aluno, retorna as equipes onde o email dele está na lista
    if (user.tipo === "aluno") {
      return mockEquipes.filter((equipe) =>
        equipe.emailsAlunos.includes(user.email),
      );
    }

    return [];
  },
};
