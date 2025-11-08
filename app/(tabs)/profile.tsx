import { useRouter } from 'expo-router';
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { apiSlice } from '../../api/apiSlice';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const router = useRouter();

  const handleLogout = () => {
    // Dispatch the logout action
    dispatch(logout());

    // Optional: Clear the API cache on logout
    dispatch(apiSlice.util.resetApiState());

    // The RootLayoutNav effect will automatically redirect to '/(auth)/login'
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome,</Text>
        {/* Display the user's name from the Redux store */}
        <Text style={styles.username}>{user ? user.name : 'Guest'}</Text>

        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default ProfileScreen;
