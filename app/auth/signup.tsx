import { View, Text } from 'react-native';
import RegisterForm from '@components/auth/RegisterForm';

export default function SignUpScreen() {
  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' }}>
        Sign Up for Soccer MLS
      </Text>
      <RegisterForm />
    </View>
  );
}