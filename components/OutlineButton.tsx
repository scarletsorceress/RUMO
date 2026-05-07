import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors } from '../constants/Colors';

interface OutlineButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function OutlineButton({ title, ...props }: OutlineButtonProps) {
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.textWhite,
    borderRadius: 20,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  text: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});