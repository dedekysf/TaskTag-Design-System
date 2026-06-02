import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { ChatsScreen } from '../_shared/mobile/ChatsScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, View } from 'react-native';
import { Activity, Folder, Hash, MessageSquare } from 'lucide-react-native';

function useBounceIn(delay = 0) {
  const translateY = useRef(new Animated.Value(32)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, damping: 14, stiffness: 180, mass: 0.9, useNativeDriver: true }),
        Animated.spring(scale,     { toValue: 1, damping: 14, stiffness: 180, mass: 0.9, useNativeDriver: true }),
        Animated.timing(opacity,   { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { translateY, opacity, scale };
}

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
    </View>
  );
}

interface Props {
  onComplete: () => void;
}

export function Case1Screen({ onComplete }: Props) {
  const modalProgress = useRef(new Animated.Value(0)).current;

  const modalTranslateY = modalProgress.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const modalScale     = modalProgress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });

  const illus   = useBounceIn(60);
  const content = useBounceIn(180);

  useEffect(() => {
    modalProgress.setValue(0);
    Animated.timing(modalProgress, {
      toValue: 1, duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetStarted = () => {
    Animated.timing(modalProgress, {
      toValue: 0, duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onComplete());
  };

  return (
    <Box flex={1} backgroundColor="white" style={{ position: 'relative' } as any}>

      <StatusBarRow />
      <ChatsScreen />

      {/* Bottom nav */}
      <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 4, gap: 24 } as any}>
          <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
            <MessageSquare size={24} color={TTTheme.colors.secondaryGreen} />
            <Text variant="mobileLabelSmall" color="secondaryGreen">Chats</Text>
          </View>
          <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
            <Folder size={24} color={TTTheme.colors.textPrimary} />
            <Text variant="mobileLabelSmall" color="foreground">Projects</Text>
          </View>
          <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
            <Hash size={24} color={TTTheme.colors.textPrimary} />
            <Text variant="mobileLabelSmall" color="foreground">My Tasks</Text>
          </View>
          <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
            <Activity size={24} color={TTTheme.colors.textPrimary} />
            <Text variant="mobileLabelSmall" color="foreground">Activity</Text>
          </View>
        </View>
        <HomeIndicator />
      </View>

      {/* ── Welcome modal — outer = opacity+backdrop, inner = transform only ── */}
      <Animated.View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10,22,41,0.42)', zIndex: 40,
        opacity: modalProgress,
      } as any}>
        <Animated.View style={{
          position: 'absolute', bottom: 40, left: 16, right: 16,
          transform: [{ translateY: modalTranslateY }, { scale: modalScale }],
        } as any}>
          <Box
            backgroundColor="card"
            style={{
              borderRadius: 24, overflow: 'hidden',
              borderWidth: 1, borderColor: 'rgba(232,232,232,0.72)',
            } as any}
          >
            {/* Grid background — curved bottom */}
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 248,
              backgroundColor: '#EAFBF6', overflow: 'hidden',
            } as any}>
              {Array.from({ length: 13 }, (_, i) => (
                <View key={`v-${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: i * 32, width: 1, backgroundColor: 'rgba(24,168,125,0.2)' } as any} />
              ))}
              {Array.from({ length: 8 }, (_, i) => (
                <View key={`h-${i}`} style={{ position: 'absolute', left: 0, right: 0, top: i * 32, height: 1, backgroundColor: 'rgba(24,168,125,0.2)' } as any} />
              ))}
              <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                ...Platform.select({
                  web: { backgroundImage: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.6) 72%, #ffffff 100%)' } as any,
                  default: { backgroundColor: 'rgba(255,255,255,0.35)' },
                }),
              } as any} />
            </View>
            {/* Flow content */}
            <View style={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 16 }}>
              {/* Illustration — bounces in first (60ms delay) */}
              <Animated.View style={{ alignItems: 'center', opacity: illus.opacity, transform: [{ translateY: illus.translateY }, { scale: illus.scale }] } as any}>
                <Image source={require('@/assets/images/il_hot_air_ballon.png')} style={{ width: 210, height: 200 }} resizeMode="contain" />
              </Animated.View>
              {/* Text + button — bounces in second (180ms delay) */}
              <Animated.View style={{ opacity: content.opacity, transform: [{ translateY: content.translateY }, { scale: content.scale }], gap: 16 } as any}>
                <View style={{ alignItems: 'center', gap: 4 } as any}>
                  <Text variant="mobileLabelEmphasized" color="secondaryGreen" style={{ textAlign: 'center', fontSize: 16 }}>You're in, Maria</Text>
                  <Text variant="mobileLabelEmphasized" color="foreground" style={{ textAlign: 'center', fontSize: 14 }}>Everything you need to run your jobs</Text>
                </View>
                <Button variant="fill" color="secondary" size="lg" onPress={handleGetStarted}>
                  Set Up Your First Job
                </Button>
              </Animated.View>
            </View>
          </Box>
          </Animated.View>
        </Animated.View>

    </Box>
  );
}
