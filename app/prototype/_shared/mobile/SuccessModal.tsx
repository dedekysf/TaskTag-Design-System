import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { AnimatedCheck } from './AnimatedCheck';
import { Mail } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

export interface SuccessModalProps {
  title: string;
  description: string;
  pill?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function SuccessModal({
  title,
  description,
  pill,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: SuccessModalProps) {
  const backdropOpacity   = useRef(new Animated.Value(0)).current;
  const cardScale         = useRef(new Animated.Value(0.88)).current;
  const cardOpacity       = useRef(new Animated.Value(0)).current;
  const actionsAnim       = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = actionsAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(cardScale,       { toValue: 1, damping: 20, stiffness: 260, useNativeDriver: true }),
      Animated.timing(cardOpacity,     { toValue: 1, duration: 200, useNativeDriver: true }),
      // CTA appears shortly after checkmark finishes (40ms delay + 220ms draw = 260ms)
      Animated.timing(actionsAnim, {
        toValue: 1,
        duration: 150,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0.45)',
          opacity: backdropOpacity,
        } as any}
      />

      {/* Card */}
      <Animated.View
        style={{
          position: 'absolute', bottom: 40, left: 16, right: 16,
          backgroundColor: '#fff',
          borderRadius: 20,
          paddingTop: 28,
          paddingBottom: 28,
          overflow: 'hidden',
          zIndex: 60,
          opacity: cardOpacity,
          transform: [{ scale: cardScale }],
        } as any}
      >
        {/* Animated SVG checkmark */}
        <View style={{ alignItems: 'center' }}>
          <AnimatedCheck size={96} delay={40} />
        </View>

        {/* Title + description */}
        <View style={{ paddingHorizontal: 24, marginTop: 24, gap: 12, alignItems: 'center' } as any}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: TTTheme.colors.textPrimary, textAlign: 'center' }}>
            {title}
          </Text>
          {pill && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: TTTheme.colors.grey02, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignSelf: 'stretch' } as any}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={18} color={TTTheme.colors.grey05} />
              </View>
              <Text variant="mobileLabelSmall" color="foreground">{pill}</Text>
            </View>
          )}
          <Text variant="mobileBody" color="grey05" style={{ textAlign: 'center' }}>
            {description}
          </Text>
        </View>

        {/* CTA buttons — fade + slide up after checkmark */}
        <Animated.View
          style={{ marginHorizontal: 24, marginTop: 24, gap: 8, opacity: actionsAnim, transform: [{ translateY: actionsTranslateY }] } as any}
        >
          <Pressable onPress={onPrimary} style={{ backgroundColor: '#000', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>{primaryLabel}</Text>
          </Pressable>
          {secondaryLabel && onSecondary && (
            <Pressable onPress={onSecondary} style={{ paddingVertical: 10, alignItems: 'center' }}>
              <Text variant="mobileLabelSmall" color="secondaryGreen">{secondaryLabel}</Text>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </>
  );
}
