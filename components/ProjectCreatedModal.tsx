import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const BIG_TICK_LEN = 51; // M 18 36 L 30 48 L 54 24 → √288 + √1152 ≈ 17 + 34
const HOLD_MS = 5000;
const CHECK_DRAW_DELAY_MS = 40;
const CHECK_DRAW_MS = 220;

const AnimatedPath   = Animated.createAnimatedComponent(Path);

export interface ProjectCreatedModalProps {
  projectName?: string;
  onDismiss: () => void;
}

export function ProjectCreatedModal({ projectName, onDismiss }: ProjectCreatedModalProps) {
  const theme = useTheme<Theme>();

  // ── Entry ──────────────────────────────────────────────────────────────────
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale       = useRef(new Animated.Value(0.88)).current;
  const cardOpacity     = useRef(new Animated.Value(0)).current;

  // ── Check circle ──────────────────────────────────────────────────────────
  const tickOffset  = useRef(new Animated.Value(BIG_TICK_LEN)).current;

  // ── Next step row ─────────────────────────────────────────────────────────
  const nextOpacity = useRef(new Animated.Value(0)).current;
  const nextY       = useRef(new Animated.Value(10)).current;
  const pulseScale   = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  // ── Pulse ring ────────────────────────────────────────────────────────────
  // ── Progress countdown bar ─────────────────────────────────────────────────
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const enter = Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.spring(cardScale,  { toValue: 1, damping: 20, stiffness: 260, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]);

    enter.start(() => {
      Animated.timing(tickOffset, {
        toValue: 0,
        duration: CHECK_DRAW_MS,
        delay: CHECK_DRAW_DELAY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Next step appears
      Animated.sequence([
        Animated.delay(320),
        Animated.parallel([
          Animated.timing(nextOpacity, { toValue: 1, duration: 240, useNativeDriver: true }),
          Animated.timing(nextY, { toValue: 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]).start(() => {
        // Pulse loop starts once the row is visible
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(pulseScale,   { toValue: 2.2, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
              Animated.timing(pulseOpacity, { toValue: 0,   duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            ]),
            Animated.delay(700),
          ])
        ).start();
      });

      // Progress bar drains
      Animated.timing(progress, {
        toValue: 0,
        duration: HOLD_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      // Exit after hold
      Animated.sequence([
        Animated.delay(HOLD_MS),
        Animated.parallel([
          Animated.timing(backdropOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(cardOpacity,     { toValue: 0, duration: 260, useNativeDriver: true }),
          Animated.spring(cardScale, { toValue: 0.92, damping: 20, stiffness: 300, useNativeDriver: true }),
        ]),
      ]).start(() => onDismiss());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPct   = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const displayName = projectName
    ? (projectName.length > 28 ? projectName.slice(0, 28) + '…' : projectName)
    : null;

  return (
    <Animated.View
      style={{
        position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(10,22,41,0.46)',
        opacity: backdropOpacity,
      }}
    >
      {/* Tap outside = skip */}
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={onDismiss}
      />

      <Animated.View
        style={{
          opacity: cardOpacity,
          transform: [{ scale: cardScale }],
          width: 500,
          maxWidth: '100%' as any,
        }}
      >
        <Box
          backgroundColor="white"
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.08)',
            ...Platform.select({
              web: { boxShadow: '0px 20px 60px rgba(0,0,0,0.18)' } as any,
              default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.18,
                shadowRadius: 40,
                elevation: 20,
              },
            }),
          }}
        >
          {/* ── Body ── */}
          <Box style={{ paddingHorizontal: 32, paddingTop: 40, paddingBottom: 32, gap: 28 }}>

            {/* Check circle + title */}
            <Box alignItems="center" style={{ gap: 20 }}>
              <Box style={{ width: 72, height: 72 }}>
                <Svg width={72} height={72} viewBox="0 0 72 72">
                  <Circle cx={36} cy={36} r={35} fill={theme.colors.secondaryGreen} />
                  <AnimatedPath
                    d="M 18 36 L 30 48 L 54 24"
                    stroke="white"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray={BIG_TICK_LEN}
                    strokeDashoffset={tickOffset as any}
                  />
                </Svg>
              </Box>

              <Box alignItems="center" style={{ gap: 6 }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: theme.colors.textPrimary,
                    lineHeight: 30,
                    textAlign: 'center',
                  }}
                >
                  Project Created!
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '400',
                    color: theme.colors.grey05,
                    lineHeight: 24,
                    textAlign: 'center',
                  }}
                >
                  {"You've successfully set up a project!\nNow, let's explore your next steps."}
                </Text>
              </Box>
            </Box>

            {/* ── Next step row ── */}
            <Animated.View style={{ opacity: nextOpacity, transform: [{ translateY: nextY }] }}>
              <Box
                flexDirection="row"
                alignItems="center"
                style={{
                  gap: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.grey01,
                }}
              >
                {/* Pulse circle */}
                <Box
                  style={{
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Animated.View
                    style={{
                      position: 'absolute',
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: theme.colors.blue,
                      opacity: pulseOpacity,
                      transform: [{ scale: pulseScale }],
                    }}
                  />
                  <Box
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      backgroundColor: theme.colors.blue,
                    }}
                  />
                </Box>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: theme.colors.textPrimary,
                    lineHeight: 24,
                  }}
                >
                  Next: Create your first task
                </Text>
              </Box>
            </Animated.View>

          </Box>

          {/* ── Progress countdown strip ── */}
          <Box
            style={{
              height: 4,
              backgroundColor: `${theme.colors.secondaryGreen}20`,
            }}
          >
            <Animated.View
              style={{
                height: '100%',
                width: progressPct,
                backgroundColor: theme.colors.secondaryGreen,
              }}
            />
          </Box>
        </Box>
      </Animated.View>
    </Animated.View>
  );
}
