import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/redux';
import { auth, storage } from '@api/firebase';
import { updateProfile, deleteUser } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Box, Text, Input, InputField, Pressable, VStack, Image } from '@gluestack-ui/themed';
import { clearUser } from '@redux/slices/authSlice';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const { userId } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      setName(auth.currentUser.displayName || '');
      setProfilePic(auth.currentUser.photoURL || null);
    }
  }, [userId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access photos was denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      await uploadProfilePic(uri);
    }
  };

  const uploadProfilePic = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profile_pics/${userId}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePic(downloadURL);
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });
      setSuccess('Profile picture updated!');
      setError(null);
    } catch (error) {
      setError('Failed to upload profile picture');
      console.error('Upload error:', error);
    }
  };

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);
    try {
      await updateProfile(auth.currentUser!, { displayName: name });
      setSuccess('Profile updated successfully!');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/requires-recent-login':
          setError('Please log in again to update your profile');
          break;
        default:
          setError('Failed to update profile');
          console.error('Update error:', error);
      }
    }
  };

  const handleDelete = async () => {
    setError(null);
    setSuccess(null);
    try {
      await deleteUser(auth.currentUser!);
      dispatch(clearUser());
      router.replace('/auth/signin');
      setSuccess('Account deleted successfully');
    } catch (error: any) {
      switch (error.code) {
        case 'auth/requires-recent-login':
          setError('Please log in again to delete your account');
          break;
        default:
          setError('Failed to delete account');
          console.error('Delete error:', error);
      }
    }
  };

  return (
    <Box flex={1} bg="$gray100" p="$5">
      <Text fontSize="$2xl" fontWeight="$bold" color="$primary900" textAlign="center" mb="$6">
        Profile
      </Text>
      <VStack space="md" alignItems="center">
        {/* Profile Picture */}
        <Pressable onPress={pickImage} sx={{ ':pressed': { opacity: 0.8 } }}>
          <Image
            source={{ uri: profilePic || 'https://via.placeholder.com/100' }}
            size="xl" // 96px
            borderRadius={100} // Numeric value for circular effect
            alt="Profile Picture"
            mb="$4"
          />
          <Text fontSize="$sm" color="$primary700" textAlign="center">
            Tap to change picture
          </Text>
        </Pressable>

        {/* Name Input */}
        <Input borderRadius="$lg" bg="$white" borderColor="$gray300" w="100%">
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            fontSize="$md"
            color="$gray800"
          />
        </Input>

        {/* Favorite Team Input */}
        <Input borderRadius="$lg" bg="$white" borderColor="$gray300" w="100%">
          <InputField
            value={favoriteTeam}
            onChangeText={setFavoriteTeam}
            placeholder="Favorite Team"
            fontSize="$md"
            color="$gray800"
          />
        </Input>

        {/* Success/Error Messages */}
        {success && (
          <Text fontSize="$sm" color="$green500" textAlign="center">
            {success}
          </Text>
        )}
        {error && (
          <Text fontSize="$sm" color="$red500" textAlign="center">
            {error}
          </Text>
        )}

        {/* Update Button */}
        <Pressable
          bg="$primary500"
          py="$3"
          borderRadius="$lg"
          onPress={handleUpdate}
          sx={{ ':pressed': { opacity: 0.8 } }}
          w="100%"
          mb="$4"
        >
          <Text fontSize="$md" fontWeight="$semibold" color="$white" textAlign="center">
            Update Profile
          </Text>
        </Pressable>

        {/* Delete Button */}
        <Pressable
          bg="$red500"
          py="$3"
          borderRadius="$lg"
          onPress={handleDelete}
          sx={{ ':pressed': { opacity: 0.8 } }}
          w="100%"
        >
          <Text fontSize="$md" fontWeight="$semibold" color="$white" textAlign="center">
            Delete Account
          </Text>
        </Pressable>
      </VStack>
    </Box>
  );
}