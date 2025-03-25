import { Box, Text } from '@gluestack-ui/themed';
import RegisterForm from '@components/auth/RegisterForm';

export default function SignUpScreen() {
  return (
    <Box flex={1} bg="$gray100" p="$5" justifyContent="center">
      <Text fontSize="$2xl" fontWeight="$bold" color="$primary900" textAlign="center" mb="$6">
        Sign Up for Soccer MLS
      </Text>
      <RegisterForm />
    </Box>
  );
}