import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface CustomInputProps extends TextInputProps {
  label: string;
}

export default function CustomInput({ label, ...props }: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: Colors.textWhite,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    marginLeft: 15,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 20,
    height: 65,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.textBlack,
  },
});