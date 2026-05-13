import { ProjectChecklist } from '@/components/ProjectChecklist';
import { Box } from '@/components/primitives';
import { WelcomeModalScreen } from '@/components/WelcomeModalScreen';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet } from 'react-native';
import ProjectDashboardBase from '../_shared/ProjectDashboardBase';

export default function OnboardingScreen() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const modalProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showWelcomeModal) return;

    modalProgress.setValue(0);
    Animated.timing(modalProgress, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [modalProgress, showWelcomeModal]);

  const modalTranslateY = modalProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });

  const modalScale = modalProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });

  return (
    <Box flex={1} style={{ position: 'relative' }}>
      <ProjectDashboardBase hideDefaultModal profileVariant="photo">
        <ProjectChecklist />
      </ProjectDashboardBase>

      {showWelcomeModal && (
        <Animated.View
          style={{
            position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 100000,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: 'rgba(10, 22, 41, 0.42)',
            opacity: modalProgress,
          }}
        >
          <Pressable
            onPress={() => setShowWelcomeModal(false)}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            style={{
              transform: [
                { translateY: modalTranslateY },
                { scale: modalScale },
              ],
            }}
          >
            <Pressable onPress={(event) => event.stopPropagation()}>
              <WelcomeModalScreen
                name="Oscar"
                onGetStarted={() => setShowWelcomeModal(false)}
                style={{
                  maxHeight: Platform.OS === 'web' ? 'calc(100vh - 48px)' as any : undefined,
                }}
              />
            </Pressable>
          </Animated.View>
        </Animated.View>
      )}
    </Box>
  );
}
