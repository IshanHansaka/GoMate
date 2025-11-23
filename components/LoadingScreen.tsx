import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getColors } from '../constants/Theme';
import { useTheme } from '../context/ThemeContext';

export default function LoadingScreen() {
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.background,
    },
  });
