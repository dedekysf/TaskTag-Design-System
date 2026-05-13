import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';

export interface FirstTaskSuccessToastProps {
  visible?: boolean;
  projectName?: string;
  onDismiss?: () => void;
}

export function FirstTaskSuccessToast({ visible = true, onDismiss }: FirstTaskSuccessToastProps) {
  const theme = useTheme<Theme>();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(80);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 40,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss?.());
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 9999,
        opacity,
        transform: [{ translateY }],
        ...Platform.select({
          web: { pointerEvents: 'none' } as any,
        }),
      }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        style={{
          backgroundColor: '#1A1A1A',
          borderRadius: 12,
          overflow: 'hidden',
          ...Platform.select({
            web: { boxShadow: '0px 8px 24px rgba(0,0,0,0.24)' } as any,
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.24,
              shadowRadius: 16,
              elevation: 12,
            },
          }),
        }}
      >
        {/* Left green accent bar */}
        <Box
          style={{
            width: 4,
            alignSelf: 'stretch',
            backgroundColor: theme.colors.secondaryGreen,
          }}
        />

        <Box
          flexDirection="row"
          alignItems="center"
          style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 14, gap: 12 }}
        >
          <CheckCircle2 size={22} color={theme.colors.secondaryGreen} />
          <Box style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', lineHeight: 20 }}>
              Task created!
            </Text>
            <Text style={{ fontSize: 12, color: '#A0A0A0', lineHeight: 18, marginTop: 1 }}>
              Tap the circle to mark it complete when done.
            </Text>
          </Box>
        </Box>
      </Box>
    </Animated.View>
  );
}
