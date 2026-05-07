import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomInput from '../components/CustomInput';
import OutlineButton from '../components/OutlineButton';
import { Colors } from '../constants/Colors';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCadastro = () => {
    // Lógica de Cadastro (Mock) - Validação de campos vazios
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    
    // Se passou pela validação, simula o sucesso
    Alert.alert("Sucesso", "Conta criada com sucesso! Faça seu login.");
    router.replace("/"); // Manda de volta para a tela de login
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Crie sua nova</Text>
          <Text style={styles.title}>conta</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput 
            label="NOME"
            value={name}
            onChangeText={setName}
          />

          <CustomInput 
            label="EMAIL"
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
            <OutlineButton title="Cadastrar" onPress={handleCadastro} />
            <OutlineButton title="Voltar ao Login" onPress={() => router.back()} />
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
    marginBottom: 45,
  },
  title: {
    fontSize: 40,
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: 10,
  },
});