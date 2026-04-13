import { Box, Text } from '@/components/primitives';
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
          <Stack.Screen name="request-to-join" />
          <Stack.Screen name="team-detail" />
          <Stack.Screen name="link" />
        </Stack>
      </Box>
      
      {/* Note For Dev — Positioned beside the frame */}
      {Platform.OS === 'web' && (
        <Box
          style={{
            position: 'absolute' as any,
            left: 'calc(50% + 212px)' as any, // 375/2 + 24px gap = 211.5
            top: 100,
            width: 240,
            backgroundColor: '#fbe676',
            borderRadius: 12,
            padding: 16,
            gap: 4,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
          <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18 }}>
            Hide the skills section when no data is available.
          </Text>
        </Box>
      )}
    </View>
  );
}
