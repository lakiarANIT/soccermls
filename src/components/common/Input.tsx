import { Input as GlueInput, InputField } from '@gluestack-ui/themed';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
}

export default function Input({ value, onChangeText, placeholder, secureTextEntry }: InputProps) {
  return (
    <GlueInput borderRadius="$lg" bg="$white" borderColor="$gray300" my="$2">
      <InputField
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        fontSize="$md"
        color="$gray800"
      />
    </GlueInput>
  );
}