import { ApiError } from '@/types/api';
import { LoginFormData } from '@/types/auth';
import { Feather } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useLoginMutation } from '../../api/apiSlice';
import {
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
  getColors,
} from '../../constants/Theme';
import { useTheme } from '../../context/ThemeContext';
import { setCredentials } from '../../features/auth/authSlice';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const LoginScreen = () => {
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);

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

  const [passwordVisible, setPasswordVisible] = useState(false);

  // 5. Setup the hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation(); // Hook gives us a trigger and loading state

  // 6. Update the submit handler
  const onSubmit = async (data: LoginFormData) => {
    try {
      const userData = await login(data).unwrap();

      // Update Redux
      dispatch(
        setCredentials({
          user: {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
          tokens: {
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
          },
          expiresInMins: data.expiresInMins || 60,
        })
      );

      router.replace('/(tabs)/home');
    } catch (err) {
      const error = err as ApiError;
      console.error('Login Failed:', error);
      Alert.alert('Login Failed', error.data?.message || 'Invalid credentials');
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Section */}
          <View style={styles.hero}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue to GoMate</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="user"
                      size={20}
                      color={COLORS.mediumGray}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your username"
                      placeholderTextColor={COLORS.mediumGray}
                      keyboardType="default"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
              {errors.username && (
                <Text style={styles.error}>{errors.username.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="lock"
                      size={20}
                      color={COLORS.mediumGray}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.mediumGray}
                      secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      <Feather
                        name={passwordVisible ? 'eye-off' : 'eye'}
                        size={20}
                        color={COLORS.mediumGray}
                        style={styles.inputIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.linkText}>
                Don't have an account?{' '}
                <Text style={styles.linkTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
    },
    hero: {
      alignItems: 'center',
      marginBottom: SPACING.xxl,
    },
    title: {
      ...TYPOGRAPHY.h1,
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      ...TYPOGRAPHY.body,
      color: COLORS.mediumGray,
      textAlign: 'center',
    },
    form: {
      backgroundColor: COLORS.white,
      padding: SPACING.xl,
      borderRadius: BORDER_RADIUS.xl,
      width: '100%',
      maxWidth: 420,
      ...SHADOWS.medium,
    },
    inputGroup: {
      marginBottom: SPACING.lg,
    },
    label: {
      ...TYPOGRAPHY.body,
      fontWeight: '600',
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.inputBackground,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    inputIcon: {
      marginHorizontal: SPACING.md,
    },
    input: {
      flex: 1,
      height: 50,
      ...TYPOGRAPHY.body,
      color: COLORS.text,
    },
    error: {
      ...TYPOGRAPHY.small,
      color: COLORS.error,
      marginTop: SPACING.xs,
    },
    button: {
      backgroundColor: COLORS.primary,
      height: 50,
      borderRadius: BORDER_RADIUS.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.md,
      ...SHADOWS.light,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      ...TYPOGRAPHY.body,
      fontWeight: '700',
      color: '#ffffff',
    },
    linkButton: {
      marginTop: SPACING.lg,
      alignItems: 'center',
    },
    linkText: {
      ...TYPOGRAPHY.body,
      color: COLORS.mediumGray,
    },
    linkTextBold: {
      color: COLORS.primary,
      fontWeight: '700',
    },
  });

export default LoginScreen;
