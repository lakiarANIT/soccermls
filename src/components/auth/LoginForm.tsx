import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '@api/firebase';
import { setUser } from '@redux/slices/authSlice';
import { useRouter } from 'expo-router';
import { Box, Input, InputField, Pressable, Text, VStack } from '@gluestack-ui/themed';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    setError(null); // Clear previous errors
    try {
      const userCredential = await signIn(email, password);
      dispatch(setUser(userCredential.user.uid));
      router.replace('/');
    } catch (error: any) {
      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Check your email or password');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Try again later');
          break;
        default:
          setError('An error occurred. Please try again');
          console.error('Login error:', error);
      }
    }
  };

  return (
    <VStack space="md">
      <Input borderRadius="$lg" bg="$white" borderColor="$gray300">
        <InputField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          fontSize="$md"
          color="$gray800"
        />
      </Input>
      <Input borderRadius="$lg" bg="$white" borderColor="$gray300">
        <InputField
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          fontSize="$md"
          color="$gray800"
        />
      </Input>
      {error && (
        <Text fontSize="$sm" color="$red500" textAlign="center">
          {error}
        </Text>
      )}
      <Pressable
        bg="$primary500"
        py="$3"
        borderRadius="$lg"
        onPress={handleLogin}
        sx={{ ':pressed': { opacity: 0.8 } }}
      >
        <Text fontSize="$md" fontWeight="$semibold" color="$white" textAlign="center">
          Sign In
        </Text>
      </Pressable>
    </VStack>
  );
}