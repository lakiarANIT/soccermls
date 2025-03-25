import { Box, Text } from '@gluestack-ui/themed';
import LoginForm from '@components/auth/LoginForm';

export default function SignInScreen() {
  return (
    <Box flex={1} bg="$gray100" p="$5" justifyContent="center">
      <Text fontSize="$2xl" fontWeight="$bold" color="$primary900" textAlign="center" mb="$6">
        Sign In to Soccer MLS
      </Text>
      <LoginForm />
    </Box>
  );
}