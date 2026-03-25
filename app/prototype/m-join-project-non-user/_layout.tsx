import { Box } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';

export default function MobileLayout() {
  const theme = useTheme<Theme>();

  if (Platform.OS !== 'web') {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.grey02,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    }}>
      <Box
        width={375}
        height={812}
        backgroundColor="background"
        style={{
          borderRadius: 40,
          overflow: 'hidden',
          borderWidth: 10,
          borderColor: '#111',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 20 },
          shadowOpacity: 0.25,
          shadowRadius: 40,
          elevation: 20,
        }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </Box>
    </View>
  );
}
