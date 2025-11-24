import { Feather } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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
import * as yup from 'yup';
import {
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
  getColors,
} from '../../constants/Theme';
import { useTheme } from '../../context/ThemeContext';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const RegisterScreen = () => {
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log('Register Data:', data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/(auth)/login');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to get started with GoMate
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <Controller
                control={control}
                name="firstName"
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
                      placeholder="Enter your first name"
                      placeholderTextColor={COLORS.mediumGray}
                    />
                  </View>
                )}
              />
              {errors.firstName && (
                <Text style={styles.error}>{errors.firstName.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <Controller
                control={control}
                name="lastName"
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
                      placeholder="Enter your last name"
                      placeholderTextColor={COLORS.mediumGray}
                    />
                  </View>
                )}
              />
              {errors.lastName && (
                <Text style={styles.error}>{errors.lastName.message}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="mail"
                      size={20}
                      color={COLORS.mediumGray}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your email"
                      placeholderTextColor={COLORS.mediumGray}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
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
                      secureTextEntry
                    />
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                isSubmitting && { backgroundColor: COLORS.primary },
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.linkText}>
                Already have an account?{' '}
                <Text style={styles.linkTextBold}>Sign In</Text>
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
      paddingHorizontal: SPACING.md,
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

export default RegisterScreen;
