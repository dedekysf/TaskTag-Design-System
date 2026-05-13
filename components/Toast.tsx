import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Check, X, AlertCircle, Info, ArrowRight, ListChecks } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';

export interface ToastProps {
  visible?: boolean;
  variant?: "title-only" | "title-caption" | "title-arrow" | "title-caption-arrow";
  type?: "success" | "error" | "warning" | "info" | "checklist";
  title: string;
  caption?: string;
  duration?: number;
  onDismiss?: () => void;
  style?: any;
}

export function Toast({
  visible = true,
  variant = "title-only",
  type = "success",
  title,
  caption,
  duration = 3000,
  onDismiss,
  style,
}: ToastProps) {
  const theme = useTheme<Theme>();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(80);
      opacity.setValue(0);
      progressAnim.setValue(100);

      // Entry animation
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

      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      const timer = setTimeout(() => {
        // Exit animation
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
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  if (!visible) return null;

  const typeConfig = {
    success: { icon: Check, color: theme.colors.secondaryGreen },
    error: { icon: X, color: theme.colors.alertRed },
    warning: { icon: AlertCircle, color: '#FFB020' },
    info: { icon: Info, color: '#4A9EFF' },
    checklist: { icon: ListChecks, color: theme.colors.secondaryGreen },
  };

  const { icon: Icon, color } = typeConfig[type];
  const showCaption = variant === "title-caption" || variant === "title-caption-arrow";
  const showArrow = variant === "title-arrow" || variant === "title-caption-arrow";

  return (
    <Animated.View
      style={[
        {
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
        },
        style
      ]}
    >
      <Box
        style={{
          backgroundColor: '#0F172A', // Using a dark primary text color
          borderRadius: 8,
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
        {/* Content */}
        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 12 }}>
          {/* Icon */}
          <Box style={{ flexShrink: 0 }}>
            <Icon size={20} color="white" strokeWidth={2} />
          </Box>

          {/* Text */}
          <Box style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white', lineHeight: 21 }}>
              {title}
            </Text>
            {showCaption && caption && (
              <Text style={{ fontSize: 12, color: theme.colors.grey04, lineHeight: 17, marginTop: 2 }}>
                {caption}
              </Text>
            )}
          </Box>

          {/* Arrow Icon */}
          {showArrow && (
            <Box style={{ flexShrink: 0 }}>
              <ArrowRight size={20} color="white" strokeWidth={2} />
            </Box>
          )}
        </Box>

        {/* Progress bar at bottom */}
        <Box style={{ height: 4, width: '100%', backgroundColor: theme.colors.lightMint }}>
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: theme.colors.secondaryGreen,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              }),
            }}
          />
        </Box>
      </Box>
    </Animated.View>
  );
}
