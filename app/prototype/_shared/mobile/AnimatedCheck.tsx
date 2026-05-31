import { theme as TTTheme } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Path length: M 18 36 L 30 48 L 54 24 → √288 + √1152 ≈ 17 + 34 = 51
const TICK_LENGTH = 51;
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  size?: number;
  /** ms to wait before drawing starts (default: 0) */
  delay?: number;
}

export function AnimatedCheck({ size = 72, delay = 0 }: Props) {
  const tickOffset = useRef(new Animated.Value(TICK_LENGTH)).current;

  useEffect(() => {
    Animated.timing(tickOffset, {
      toValue: 0,
      duration: 220,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      <Circle cx={36} cy={36} r={35} fill={TTTheme.colors.secondaryGreen} />
      <AnimatedPath
        d="M 18 36 L 30 48 L 54 24"
        stroke="white"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={TICK_LENGTH}
        strokeDashoffset={tickOffset as any}
      />
    </Svg>
  );
}
