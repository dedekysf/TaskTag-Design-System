import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';

const PROJECT_NAME = 'Raintree Hollow Court Renovation';

export default function DownloadApp() {
  const theme = useTheme<Theme>();
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <Box
      flex={1}
      backgroundColor="background"
      alignItems="center"
      justifyContent="center"
      padding="xl"
      style={{ overflow: 'hidden' }}
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      {/* Confetti Animation */}
      {size.width > 0 && (
        <View
          pointerEvents="none"
          style={{ position: 'absolute', top: 0, left: 0, width: size.width, height: size.height, zIndex: 999 }}
        >
          <LottieView
            source={require('@/assets/images/confetti.json')}
            autoPlay
            loop={true}
            style={{ width: size.width, height: size.height, transform: [{ scaleY: -1 }] }}
            resizeMode="cover"
          />
        </View>
      )}

      <Box alignItems="center" gap="12" marginBottom="40" paddingHorizontal="16" style={{ zIndex: 10 }}>
        <Check size={64} color={theme.colors.secondaryGreen} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <Text variant="webHeading22" textAlign="center" color="foreground">
          You're all set!
        </Text>
        <Text variant="webBody" color="textSecondary" textAlign="center" style={{ lineHeight: 24 }}>
          Open <Text variant="webBody" fontWeight="700" color="foreground">{PROJECT_NAME}</Text> in the app, it's already waiting for you.
        </Text>
      </Box>

      <Box width="100%" style={{ zIndex: 10 }}>
        <Button
          variant="fill"
          color="primary"
          size="lg"
          style={{ width: '100%', backgroundColor: theme.colors.foreground, borderRadius: 40 }}
          onPress={() => router.push('/')}
        >
          <Text variant="labelMedium" color="white">
            Open The App
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
