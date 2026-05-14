import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, Pressable, ViewStyle } from 'react-native';

export interface WelcomeModalScreenProps {
  name?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  onGetStarted?: () => void;
  style?: ViewStyle;
}

const ILLUSTRATION = require('@/assets/images/il_hot_air_ballon.png');
const GRID_SIZE = 32;
const GRID_COLUMNS = Array.from({ length: 17 }, (_, index) => index);
const GRID_ROWS = Array.from({ length: 10 }, (_, index) => index);

// ─── Bounce spring config ─────────────────────────────────────────────────────
// Simulates a spring: enters from below with overshoot, settles naturally.

function useBounceIn(delay = 0) {
  const translateY = useRef(new Animated.Value(32)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 14,
          stiffness: 180,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 14,
          stiffness: 180,
          mass: 0.9,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay, opacity, scale, translateY]);

  return { translateY, opacity, scale };
}

export function WelcomeModalScreen({
  name = 'Oscar',
  title = "We're glad you're here",
  description = "Let's set up your first job, it only takes a few minutes.",
  buttonLabel = 'Get Started',
  onGetStarted,
  style,
}: WelcomeModalScreenProps) {
  const theme = useTheme<Theme>();

  // Staggered bounce: illustration first, then text section
  const illus  = useBounceIn(60);
  const content = useBounceIn(180);

  return (
    <Box
      backgroundColor="card"
      alignItems="center"
      style={[
        {
          width: 500,
          maxWidth: '100%',
          borderRadius: 24,
          padding: 40,
          overflow: 'hidden',
          position: 'relative',
          borderWidth: 1,
          borderColor: 'rgba(232, 232, 232, 0.72)',
          ...Platform.select({
            web: {
              boxShadow: '0 16px 36px rgba(10, 22, 41, 0.18)',
            } as any,
            default: {
              elevation: 10,
              shadowColor: '#0A1629',
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.18,
              shadowRadius: 36,
            },
          }),
        },
        style,
      ]}
    >
      {/* ── Background grid ── */}
      <Box
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: 284,
          backgroundColor: '#EAFBF6',
          overflow: 'hidden',
          ...Platform.select({
            web: {
              backgroundImage:
                'linear-gradient(to bottom, rgba(234,251,246,0.92) 0%, rgba(234,251,246,0.88) 62%, rgba(255,255,255,0.98) 100%)',
            } as any,
          }),
        }}
      >
        {GRID_COLUMNS.map((line) => (
          <Box
            key={`v-${line}`}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: line * GRID_SIZE,
              width: 1,
              backgroundColor: 'rgba(24, 168, 125, 0.2)',
            }}
          />
        ))}
        {GRID_ROWS.map((line) => (
          <Box
            key={`h-${line}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: line * GRID_SIZE,
              height: 1,
              backgroundColor: 'rgba(24, 168, 125, 0.2)',
            }}
          />
        ))}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            ...Platform.select({
              web: {
                backgroundImage:
                  'linear-gradient(to bottom, rgba(234,251,246,0) 0%, rgba(234,251,246,0.08) 58%, rgba(255,255,255,0.96) 100%)',
              } as any,
              default: {
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
              },
            }),
          }}
        />
      </Box>

      {/* ── Illustration — bounces in first ── */}
      <Animated.View
        style={{
          width: '100%',
          alignItems: 'center',
          height: 200,
          position: 'relative',
          zIndex: 1,
          opacity: illus.opacity,
          transform: [
            { translateY: illus.translateY },
            { scale: illus.scale },
          ],
        }}
      >
        <Image
          source={ILLUSTRATION}
          resizeMode="contain"
          style={{ width: 210, height: 200 }}
        />
      </Animated.View>

      {/* ── Text + button — bounces in second ── */}
      <Animated.View
        style={{
          width: '100%',
          alignItems: 'center',
          paddingTop: 20,
          zIndex: 1,
          opacity: content.opacity,
          transform: [
            { translateY: content.translateY },
            { scale: content.scale },
          ],
        }}
      >
        {/* "You're in" line */}
        <Text
          style={{
            fontSize: 20,
            lineHeight: 28,
            fontWeight: '600',
            color: theme.colors.secondaryGreen,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {`You're in, ${name}`}
        </Text>

        <Text
          style={{
            fontSize: 28,
            lineHeight: 36,
            fontWeight: '700',
            color: theme.colors.foreground,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '400',
            color: theme.colors.grey05,
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          {description}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={onGetStarted}
          style={({ pressed, hovered }: any) => ({
            width: '100%',
            minHeight: 64,
            borderRadius: 12,
            backgroundColor: theme.colors.black,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.82 : hovered ? 0.9 : 1,
            cursor: 'pointer' as any,
          })}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 26,
              fontWeight: '700',
              color: theme.colors.white,
              textAlign: 'center',
            }}
          >
            {buttonLabel}
          </Text>
        </Pressable>
      </Animated.View>
    </Box>
  );
}
