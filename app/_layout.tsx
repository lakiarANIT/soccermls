import { Stack, Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@redux/redux';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@api/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { setUser, clearUser } from '@redux/slices/authSlice';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { GluestackUIProvider, Box, Text, Pressable, HStack } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui.config';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        <AppNavigator />
      </GluestackUIProvider>
    </Provider>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user.uid));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return !isAuthenticated ? (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          header: () => <AuthHeader />,
        }}
      />
      <Stack.Screen name="auth/signin" />
      <Stack.Screen name="auth/signup" />
    </Stack>
  ) : (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <LoggedInHeader />,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '$primary700', // Vibrant purple
        tabBarInactiveTintColor: '$primary300', // Soft purple
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="auth/signin" options={{ href: null }} />
      <Tabs.Screen name="auth/signup" options={{ href: null }} />
    </Tabs>
  );
}

function AuthHeader() {
  const router = useRouter();
  return (
    <Box
      bg="$primary900" // Deep purple
      px="$4"
      py="$3"
      pt="$10" // Extra padding for status bar
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.2}
      shadowRadius={4}
      elevation={5}
    >
      <Text fontSize="$xl" fontWeight="$bold" color="$white">
        Soccer MLS
      </Text>
      <HStack space="md">
        <Pressable
          bg="$primary500" // Lighter purple
          px="$4"
          py="$2"
          borderRadius="$md"
          onPress={() => router.push('/auth/signin')}
          sx={{
            ':pressed': { opacity: 0.8 }, // Correct GlueStack syntax for pressed state
          }}
        >
          <Text fontSize="$sm" fontWeight="$semibold" color="$white">
            Sign In
          </Text>
        </Pressable>
        <Pressable
          bg="$primary500"
          px="$4"
          py="$2"
          borderRadius="$md"
          onPress={() => router.push('/auth/signup')}
          sx={{
            ':pressed': { opacity: 0.8 }, // Correct GlueStack syntax
          }}
        >
          <Text fontSize="$sm" fontWeight="$semibold" color="$white">
            Sign Up
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
}

function LoggedInHeader() {
  const { userId } = useSelector((state: RootState) => state.auth);
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    if (userId) {
      auth.currentUser?.displayName && setDisplayName(auth.currentUser.displayName);
    }
  }, [userId]);

  return (
    <Box
      bg="$primary900" // Deep purple
      px="$4"
      py="$3"
      pt="$10"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.2}
      shadowRadius={4}
      elevation={5}
    >
      <Text fontSize="$xl" fontWeight="$bold" color="$white">
        Soccer MLS
      </Text>
      <Text fontSize="$md" fontWeight="$semibold" color="$primary100">
        Welcome, {displayName}
      </Text>
    </Box>
  );
}