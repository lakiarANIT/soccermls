import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/redux';
import { auth } from '@api/firebase';
import { updateProfile, deleteUser } from 'firebase/auth';
import Input from '@components/common/Input';
import Button from '@components/common/Button';

export default function Profile() {
  const { userId } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      setName(auth.currentUser.displayName || '');
    }
  }, [userId]);

  const handleUpdate = async () => {
    try {
      await updateProfile(auth.currentUser!, { displayName: name });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(auth.currentUser!);
      alert('Account deleted.');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Input value={name} onChangeText={setName} placeholder="Full Name" />
      <Input value={favoriteTeam} onChangeText={setFavoriteTeam} placeholder="Favorite Team" />
      <Button title="Update Profile" onPress={handleUpdate} />
      <Button title="Delete Account" onPress={handleDelete} style={styles.deleteButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  deleteButton: { backgroundColor: '#FF3B30' }, // Red for delete
});