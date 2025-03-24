import { Input as GlueInput, InputField } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function Input({ value, onChangeText, placeholder, secureTextEntry }: InputProps) {
  return (
    <GlueInput style={styles.input}>
      <InputField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
      />
    </GlueInput>
  );
}

const styles = StyleSheet.create({
  input: { marginVertical: 10, borderRadius: 8 },
});