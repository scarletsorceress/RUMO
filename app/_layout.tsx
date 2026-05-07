import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Define a tela inicial padrão */}
      <Stack.Screen name="index" />

      {/* Define a Home. A opção gestureEnabled: false impede que no iOS o usuário arraste para voltar ao login */}
      <Stack.Screen name="home" options={{ gestureEnabled: false }} />

      {/* Define a tela de Criar Equipe */}
      <Stack.Screen name="criar-equipe" />
    </Stack>
  );
}
