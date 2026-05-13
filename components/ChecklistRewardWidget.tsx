import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Box, Text } from './primitives';

const TICK_LENGTH = 21.5;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ChecklistRewardWidgetProps {
  onDismiss: () => void;
  projectName?: string;
}

export function ChecklistRewardWidget({ onDismiss, projectName }: ChecklistRewardWidgetProps) {
  const theme = useTheme<Theme>();

  const slideY     = useRef(new Animated.Value(120)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const tickOffset = useRef(new Animated.Value(TICK_LENGTH)).current;
  const circleFill = useRef(new Animated.Value(0)).current;
  // Subtle scale-in for the text block after the check animates
  const textScale  = useRef(new Animated.Value(0.94)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Slide up + fade in
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Circle fills + tick draws simultaneously
      Animated.parallel([
        Animated.timing(circleFill, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tickOffset, {
          toValue: 0,
          duration: 420,
          delay: 100,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Text fades + scales in just after circle starts filling
      Animated.sequence([
        Animated.delay(160),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.spring(textScale, {
            toValue: 1,
            damping: 16,
            stiffness: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // 4. Hold then slide down
      Animated.sequence([
        Animated.delay(8000),
        Animated.parallel([
          Animated.timing(slideY, {
            toValue: 120,
            duration: 320,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 240,
            delay: 60,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => onDismiss());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circleOpacity = circleFill.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  const displayName = projectName
    ? (projectName.length > 22 ? projectName.slice(0, 22) + '…' : projectName)
    : 'Project';

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
          width: 360,
          borderRadius: 18,
          backgroundColor: theme.colors.grey06,
          overflow: 'hidden',
          ...Platform.select({
            web: { boxShadow: '0px 10px 36px rgba(0,0,0,0.28)' } as any,
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.28,
              shadowRadius: 20,
              elevation: 14,
            },
          }),
        }}
      >
        {/* Main content row */}
        <Box
          flexDirection="row"
          alignItems="center"
          style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16, gap: 14 }}
        >
          {/* Animated check circle */}
          <Box style={{ width: 42, height: 42, flexShrink: 0 }}>
            <Svg width={42} height={42} viewBox="0 0 42 42">
              <Circle cx={21} cy={21} r={20} fill="rgba(255,255,255,0.07)" />
              <AnimatedCircle
                cx={21} cy={21} r={20}
                fill={theme.colors.secondaryGreen}
                opacity={circleOpacity as any}
              />
              <AnimatedPath
                d="M 11 21 L 18 28 L 31 14"
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

          {/* Two-line text block — animates in slightly after check */}
          <Animated.View
            style={{
              flex: 1,
              opacity: textOpacity,
              transform: [{ scale: textScale }],
            }}
          >
            {/* Line 1: What succeeded */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#ffffff',
                lineHeight: 22,
              }}
              numberOfLines={1}
            >
              {`"${displayName}" created`}
            </Text>

            {/* Line 2: What to do next */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: '400',
                color: 'rgba(255,255,255,0.62)',
                lineHeight: 19,
                marginTop: 3,
              }}
            >
              Next: add your first task in this project
            </Text>
          </Animated.View>
        </Box>

        {/* Bottom green accent strip */}
        <Box
          style={{
            height: 3,
            backgroundColor: theme.colors.secondaryGreen,
          }}
        />
      </Box>
    </Animated.View>
  );
}
