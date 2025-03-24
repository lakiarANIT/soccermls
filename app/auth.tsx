import { View, Text } from 'react-native';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';

export default function AuthScreen() {
  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Soccer MLS
      </Text>
      <LoginForm />
      <Text style={{ marginVertical: 20, textAlign: 'center', fontSize: 16 }}>OR</Text>
      <RegisterForm />
    </View>
  );
}