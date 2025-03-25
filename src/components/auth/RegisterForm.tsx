import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signUp, auth } from '@api/firebase';
import { setUser } from '@redux/slices/authSlice';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Box, Input, InputField, Pressable, Text, VStack } from '@gluestack-ui/themed';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegister = async () => {
    setError(null); // Clear previous errors
    try {
      const userCredential = await signUp(email, password);
      await updateProfile(userCredential.user, { displayName: name });
      dispatch(setUser(userCredential.user.uid));
      router.replace('/');
    } catch (error: any) {
      // Map Firebase error codes to user-friendly messages
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email already registered');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters');
          break;
        case 'auth/operation-not-allowed':
          setError('Sign-up is currently disabled');
          break;
        default:
          setError('An error occurred. Please try again');
          console.error('Register error:', error);
      }
    }
  };

  return (
    <VStack space="md">
      <Input borderRadius="$lg" bg="$white" borderColor="$gray300">
        <InputField
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          fontSize="$md"
          color="$gray800"
        />
      </Input>
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
        onPress={handleRegister}
        sx={{ ':pressed': { opacity: 0.8 } }}
      >
        <Text fontSize="$md" fontWeight="$semibold" color="$white" textAlign="center">
          Sign Up
        </Text>
      </Pressable>
    </VStack>
  );
}