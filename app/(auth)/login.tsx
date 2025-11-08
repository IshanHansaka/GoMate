import { ApiError } from '@/types/api';
import { LoginFormData } from '@/types/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux'; // <-- 2. Import useDispatch
import * as yup from 'yup';
import { useLoginMutation } from '../../api/apiSlice';
import { setCredentials } from '../../features/auth/authSlice'; // <-- 3. Import our action

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    // For easy testing with dummyjson
    defaultValues: {
      username: 'emilys',
      password: 'emilyspass',
    },
  });

  // 5. Setup the hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation(); // Hook gives us a trigger and loading state

  // 6. Update the submit handler
  const onSubmit = async (data: LoginFormData) => {
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

      router.replace('/(tabs)/home');
    } catch (err) {
      const error = err as ApiError;
      console.error('Login Failed:', error);
      Alert.alert('Login Failed', error.data?.message || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="default"
              autoCapitalize="none"
            />
          )}
        />
        {errors.username && (
          <Text style={styles.error}>{errors.username.message}</Text>
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
