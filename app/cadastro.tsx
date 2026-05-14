import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomInput from '../components/CustomInput';
import OutlineButton from '../components/OutlineButton';
import { Colors } from '../constants/Colors';
import { AuthProvider, Role } from '../src/services/auth.service';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<Role>('aluno');

  const handleCadastro = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      await AuthProvider.register(name, email, password, tipoUsuario);

      Alert.alert("Sucesso", "Conta criada com sucesso! Faça seu login.", [
        { text: "OK", onPress: () => router.replace("/") }
      ]);
    } catch (error: any) {
      let mensagem = error.message;
      if (error.code === 'auth/email-already-in-use') {
        mensagem = "Este e-mail já está cadastrado. Tente fazer login.";
      } else if (error.code === 'auth/weak-password') {
        mensagem = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === 'auth/invalid-email') {
        mensagem = "O e-mail informado é inválido.";
      }
      Alert.alert("Erro no Cadastro", mensagem);
    }
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

          {/* Seletor de tipo de usuário */}
          <View style={styles.tipoContainer}>
            <Text style={styles.tipoLabel}>TIPO DE USUÁRIO</Text>
            <View style={styles.tipoButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipoUsuario === 'aluno' && styles.tipoButtonSelected,
                ]}
                onPress={() => setTipoUsuario('aluno')}
              >
                <Text
                  style={[
                    styles.tipoButtonText,
                    tipoUsuario === 'aluno' && styles.tipoButtonTextSelected,
                  ]}
                >
                  Aluno
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tipoButton,
                  tipoUsuario === 'orientador' && styles.tipoButtonSelected,
                ]}
                onPress={() => setTipoUsuario('orientador')}
              >
                <Text
                  style={[
                    styles.tipoButtonText,
                    tipoUsuario === 'orientador' && styles.tipoButtonTextSelected,
                  ]}
                >
                  Orientador
                </Text>
              </TouchableOpacity>
            </View>
          </View>

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
  tipoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tipoLabel: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 15,
    letterSpacing: 1,
  },
  tipoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tipoButton: {
    flex: 1,
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tipoButtonSelected: {
    backgroundColor: Colors.textWhite,
    borderColor: Colors.textWhite,
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textBlack,
    opacity: 0.5,
  },
  tipoButtonTextSelected: {
    color: Colors.background,
    opacity: 1,
  },
  buttonContainer: {
    marginTop: 10,
  },
});