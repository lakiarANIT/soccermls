import { Stack, Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@redux/redux';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@api/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { setUser, clearUser } from '@redux/slices/authSlice';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppNavigator />
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
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Tabs>
  );
}

function AuthHeader() {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Soccer MLS</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/auth/signin')}>
          <Text style={styles.headerButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/auth/signup')}>
          <Text style={styles.headerButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Soccer MLS</Text>
      <Text style={styles.userName}>Welcome, {displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});