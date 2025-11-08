import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux'; // <-- 2. Import useDispatch
import * as yup from 'yup';
import { useLoginMutation } from '../../api/apiSlice'; // <-- 4. Import the API hook
import { setCredentials } from '../../features/auth/authSlice'; // <-- 3. Import our action

// ... (schema remains the same)
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  // Note: dummyjson login uses 'kminchelle' and '0lelplR'
  // Or 'atuny0' and '9uQFF1Lh'
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // For easy testing with dummyjson [cite: 41]
    defaultValues: {
      email: 'kminchelle', // You can use this for testing
      password: '0lelplR', // You can use this for testing
    },
  });

  // 5. Setup the hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation(); // Hook gives us a trigger and loading state

  // 6. Update the submit handler
  const onSubmit = async (data) => {
    try {
      // .unwrap() will throw an error if the request fails
      const userData = await login(data).unwrap();

      // On success, dispatch the credentials to the Redux store [cite: 14]
      dispatch(
        setCredentials({
          user: { name: userData.username, email: userData.email }, // [cite: 13]
          token: userData.token,
        })
      );

      // Navigate to the home screen on success [cite: 12]
      router.replace('/(tabs)/home');
    } catch (err) {
      // If .unwrap() throws, we catch it here
      console.error('Login Failed:', err);
      Alert.alert('Login Failed', err.data?.message || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}

        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}

        {/* 7. Disable button while loading */}
        <Button
          title={isLoading ? 'Logging in...' : 'Login'}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />

        {/* TODO: Add a "Go to Register" button */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  form: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
