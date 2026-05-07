import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo ao RUMO!</Text>
      <Text style={styles.subtext}>A Sprint 1 foi um sucesso.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textWhite,
  },
  subtext: {
    fontSize: 16,
    color: Colors.textWhite,
    marginTop: 10,
  }
});