import { Box } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { Platform, useWindowDimensions, View } from 'react-native';

export default function MobileLayout() {
  const theme = useTheme<Theme>();
  const { height: windowHeight } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  const frameHeight = windowHeight < 800 ? Math.floor(windowHeight * 0.94) : 812;
  const paddingV = windowHeight < 800 ? Math.floor(windowHeight * 0.03) : 20;

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.grey02,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: paddingV,
    }}>
      <Box
        width={375}
        height={frameHeight}
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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="join-tasktag" />
          <Stack.Screen name="email-approval" />
          <Stack.Screen name="task-overview-app" />
          <Stack.Screen name="team-overview-app" />
          <Stack.Screen name="team-overview-browser" />
          <Stack.Screen
            name="join-tasktag-signup"
            options={{ presentation: 'transparentModal', contentStyle: { backgroundColor: 'transparent' } }}
          />
        </Stack>
      </Box>
    </View>
  );
}
