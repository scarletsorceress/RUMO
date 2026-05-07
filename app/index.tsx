import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomInput from '../components/CustomInput';
import OutlineButton from '../components/OutlineButton';
import { Colors } from '../constants/Colors';

// Usuário "Hard Coded" como o Bryan pediu
const mockUsers = [
  { nome: 'Aluno Teste', email: 'aluno@tcc.com', senha: '123' }
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de Login: Usando o método find para buscar o usuário
    const usuarioEncontrado = mockUsers.find(
      (u) => u.email === email.toLowerCase() && u.senha === password
    );

    if (usuarioEncontrado) {
      Alert.alert("Sucesso", `Bem-vindo, ${usuarioEncontrado.nome}!`);
      // Redireciona para a home
      router.replace("/home"); 
    } else {
      Alert.alert(
        "Erro",
        "Credenciais inválidas. Tente aluno@tcc.com e senha 123."
      );
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/cadastro');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Conecte-se para acessar</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput 
            label="E-MAIL"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput 
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <View style={styles.buttonContainer}>
            <OutlineButton title="Conecte-se" onPress={handleLogin} />
            <OutlineButton title="Cadastre-se" onPress={handleNavigateToRegister} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 45,
  },
  title: {
    fontSize: 46,
    color: Colors.textWhite,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textWhite,
  },
  formContainer: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 10,
  },
});