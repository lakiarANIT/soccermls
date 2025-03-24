import { View, Text } from 'react-native';
import LoginForm from '@components/auth/LoginForm';

export default function SignInScreen() {
  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' }}>
        Sign In to Soccer MLS
      </Text>
      <LoginForm />
    </View>
  );
}