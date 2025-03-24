import { useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn } from '@api/firebase';
import { setUser } from '@redux/slices/authSlice';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { useRouter } from 'expo-router';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(email, password);
      dispatch(setUser(userCredential.user.uid));
      router.replace('/'); // Redirect to home
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View>
      <Input value={email} onChangeText={setEmail} placeholder="Email" />
      <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button title="Sign In" onPress={handleLogin} />
    </View>
  );
}