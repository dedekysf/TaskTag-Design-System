import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Box, Text } from './primitives';

const TICK_LENGTH = 21.5; // approximate stroke length of M5,12 L10,17 L19,7

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ChecklistRewardWidgetProps {
  onDismiss: () => void;
}

export function ChecklistRewardWidget({ onDismiss }: ChecklistRewardWidgetProps) {
  const theme = useTheme<Theme>();

  const slideY      = useRef(new Animated.Value(120)).current;
  const opacity     = useRef(new Animated.Value(0)).current;
  const tickOffset  = useRef(new Animated.Value(TICK_LENGTH)).current;
  const circleFill  = useRef(new Animated.Value(0)).current;
  const counterFlip = useRef(new Animated.Value(0)).current;
  const progressBar = useRef(new Animated.Value(0)).current;
  const counterScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Slide up + fade in
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Circle fill + tick draws
      Animated.parallel([
        Animated.timing(circleFill, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tickOffset, {
          toValue: 0,
          duration: 400,
          delay: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Counter flips at midpoint of tick draw
      Animated.sequence([
        Animated.delay(220),
        Animated.parallel([
          Animated.timing(counterFlip, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.back(1.8)),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(counterScale, {
              toValue: 1.3,
              duration: 90,
              useNativeDriver: true,
            }),
            Animated.timing(counterScale, {
              toValue: 1,
              duration: 150,
              easing: Easing.out(Easing.back(2)),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();

      // 4. Progress bar fills
      Animated.timing(progressBar, {
        toValue: 1,
        duration: 500,
        delay: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // width cannot use native driver
      }).start();

      // 5. Hold then slide down
      Animated.sequence([
        Animated.delay(2200),
        Animated.parallel([
          Animated.timing(slideY, {
            toValue: 120,
            duration: 300,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 220,
            delay: 80,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => onDismiss());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circleOpacity = circleFill.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const counterText   = counterFlip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const progressWidth = progressBar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '20%'] });

  return (
    <Animated.View
      style={{
        position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
        bottom: 28,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999,
        opacity,
        transform: [{ translateY: slideY }],
        pointerEvents: 'none' as any,
      }}
    >
      <Box
        style={{
          width: 340,
          borderRadius: 16,
          paddingHorizontal: 18,
          paddingVertical: 16,
          backgroundColor: theme.colors.grey06,
          ...Platform.select({
            web: {
              boxShadow: '0px 8px 32px rgba(0,0,0,0.22)',
            } as any,
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.22,
              shadowRadius: 16,
              elevation: 12,
            },
          }),
        }}
      >
        {/* Top row: tick icon + label + counter */}
        <Box flexDirection="row" alignItems="center" style={{ gap: 12, marginBottom: 12 }}>
          {/* Animated circle + tick */}
          <Box style={{ width: 36, height: 36 }}>
            <Svg width={36} height={36} viewBox="0 0 36 36">
              {/* Background circle */}
              <Circle cx={18} cy={18} r={17} fill="rgba(255,255,255,0.08)" />
              {/* Animated fill circle */}
              <AnimatedCircle
                cx={18}
                cy={18}
                r={17}
                fill={theme.colors.secondaryGreen}
                opacity={circleOpacity as any}
              />
              {/* Tick path — draws itself */}
              <AnimatedPath
                d="M 9 18 L 15 24 L 27 12"
                stroke="#ffffff"
                strokeWidth={2.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={TICK_LENGTH}
                strokeDashoffset={tickOffset as any}
              />
            </Svg>
          </Box>

          {/* Step label */}
          <Box flex={1}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: '#ffffff',
                lineHeight: 20,
              }}
            >
              Project Creation
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 17 }}>
              Step 1 complete
            </Text>
          </Box>

          {/* Animated counter */}
          <Animated.View style={{ transform: [{ scale: counterScale }] }}>
            <Box
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff', lineHeight: 18 }}>
                <AnimatedCounter value={counterFlip} />
                <Text style={{ fontSize: 13, fontWeight: '400', color: 'rgba(255,255,255,0.55)' }}>
                  /5
                </Text>
              </Text>
            </Box>
          </Animated.View>
        </Box>

        {/* Progress bar */}
        <Box
          style={{
            height: 5,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.14)',
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              width: progressWidth,
              borderRadius: 10,
              backgroundColor: theme.colors.secondaryGreen,
            }}
          />
        </Box>
      </Box>
    </Animated.View>
  );
}

// Small helper: renders "0" or "1" based on animated value
function AnimatedCounter({ value }: { value: Animated.Value }) {
  const [display, setDisplay] = React.useState('0');

  useEffect(() => {
    const id = value.addListener(({ value: v }) => {
      setDisplay(v >= 0.5 ? '1' : '0');
    });
    return () => value.removeListener(id);
  }, [value]);

  return <>{display}</>;
}
