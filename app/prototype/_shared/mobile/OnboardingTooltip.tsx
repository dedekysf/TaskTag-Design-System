import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, View } from 'react-native';

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTooltipAnim(delay = 200) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      delay,
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return anim;
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface OnboardingTooltipProps {
  title?: string;
  description?: string;
  /** "Step X/Y" label — shown bottom-left below description */
  step?: string;
  /** CTA button label — shown bottom-right, paired with step row */
  ctaText?: string;
  onCtaPress?: () => void;
  /** Absolute positioning for the wrapper (bottom, top, left, right, zIndex…) */
  style?: object;
  /** Which card edge the arrow caret appears on (default: 'bottom') */
  arrowEdge?: 'top' | 'bottom';
  /** Which horizontal side the arrow is on (default: 'left') */
  arrowSide?: 'left' | 'right';
  /** Pixel inset from the chosen side (default: 20) */
  arrowInset?: number;
  /** Animated.Value 0→1 driving opacity + slide-in */
  anim: Animated.Value;
}

export function OnboardingTooltip({
  title,
  description,
  step,
  ctaText,
  onCtaPress,
  style,
  arrowEdge = 'bottom',
  arrowSide = 'left',
  arrowInset = 20,
  anim,
}: OnboardingTooltipProps) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  const arrowStyle: any = {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: TTTheme.colors.secondaryGreen,
    // Match TooltipOnboarding: bottom-edge (points down) → borderBottomRightRadius
    //                          top-edge  (points up)   → borderTopLeftRadius
    ...(arrowEdge === 'bottom' ? { borderBottomRightRadius: 4 } : { borderTopLeftRadius: 4 }),
    transform: [{ rotate: '45deg' }],
    ...(arrowEdge === 'bottom' ? { bottom: -12 } : { top: -12 }),
    ...(arrowSide === 'left' ? { left: arrowInset } : { right: arrowInset }),
  };

  return (
    <Animated.View
      style={[
        { position: 'absolute', zIndex: 60, opacity: anim, transform: [{ translateY }] },
        style,
      ] as any}
    >
      <Box
        style={{
          backgroundColor: TTTheme.colors.secondaryGreen,
          borderRadius: 16,
          padding: 16,
          width: 312,
          ...Platform.select({
            web: { boxShadow: '0px 5px 12.5px rgba(0,0,0,0.05)' } as any,
            default: { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 12 },
          }),
        } as any}
      >
        {/* Arrow caret */}
        <View style={arrowStyle} />

        <Box style={{ gap: 16 } as any}>
          {/* Title + description */}
          <Box style={{ gap: 6 } as any}>
            {title && (
              <Text variant="mobileLabelEmphasized" style={{ color: '#fff' }}>
                {title}
              </Text>
            )}
            {description && (
              <Text variant="mobileSecondaryBody" style={{ color: '#fff' }}>
                {description}
              </Text>
            )}
          </Box>

          {/* Step (left) + CTA (right) — only rendered when at least one is present */}
          {(step || ctaText) && (
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ gap: 16 } as any}>
              <Box flex={1}>
                {step && (
                  <Text variant="mobileSecondaryBody" style={{ color: '#F7F8FA' }}>
                    {step}
                  </Text>
                )}
              </Box>
              {ctaText && (
                <Button
                  variant="fill"
                  color="secondary"
                  size="sm"
                  onPress={onCtaPress}
                  style={{ borderRadius: 50, height: 32, minHeight: 0 }}
                >
                  {ctaText}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Animated.View>
  );
}
