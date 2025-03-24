import { useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { signUp, auth } from '@api/firebase';
import { setUser } from '@redux/slices/authSlice';
import { updateProfile } from 'firebase/auth';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { useRouter } from 'expo-router';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await signUp(email, password);
      await updateProfile(userCredential.user, { displayName: name });
      dispatch(setUser(userCredential.user.uid));
      router.replace('/'); // Redirect to home
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <View>
      <Input value={name} onChangeText={setName} placeholder="Full Name" />
      <Input value={email} onChangeText={setEmail} placeholder="Email" />
      <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      <Button title="Sign Up" onPress={handleRegister} />
    </View>
  );
}