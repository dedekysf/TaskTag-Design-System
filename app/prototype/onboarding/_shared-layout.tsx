import { ChatPanelComposite } from '@/components/ChatPanelComposite';
import { ProjectCreatedModal } from '@/components/ProjectCreatedModal';
import { ProjectDetail } from '@/components/ProjectDetail';
import { ProjectCreationPanel } from '@/components/ProjectCreationPanel';
import { ProjectList } from '@/components/ProjectList';
import { SideNav } from '@/components/SideNav';
import { Box } from '@/components/primitives';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable } from 'react-native';

export interface MainLayoutOnboardingProps {
  children?: React.ReactNode;
  showCreateProjectPanel?: boolean;
  onCloseCreateProjectPanel?: () => void;
}

export function MainLayoutOnboarding({
  children,
  showCreateProjectPanel: showCreateProjectPanelProp,
  onCloseCreateProjectPanel,
}: MainLayoutOnboardingProps) {
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showRewardWidget, setShowRewardWidget] = useState(false);
  const [createdProjectName, setCreatedProjectName] = useState('');
  const [showTaskTooltip, setShowTaskTooltip] = useState(false);
  const [renderPanel, setRenderPanel] = useState(
    showCreateProjectPanelProp ?? false
  );
  const panelAnimation = useRef(new Animated.Value(showCreateProjectPanelProp ? 1 : 0)).current;

  useEffect(() => {
    if (showCreateProjectPanelProp) {
      setRenderPanel(true);
      Animated.timing(panelAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [showCreateProjectPanelProp]);

  const openPanel = () => {
    setRenderPanel(true);
    Animated.timing(panelAnimation, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleClosePanel = () => {
    Animated.timing(panelAnimation, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setRenderPanel(false);
      onCloseCreateProjectPanel?.();
    });
  };

  const overlayOpacity = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const panelTranslateX = panelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [580, 0],
  });

  return (
    <Box
      flex={1}
      flexDirection="row"
      backgroundColor="background"
      style={{ height: '100%' as any }}
    >
      {/* ── Left: Side Navigation ── */}
      <SideNav
        defaultExpanded={true}
        activeItemId="projects"
        accountPhotoSrc={require('@/assets/images/sample-three.jpg')}
        accountName="My Account"
      />

      {/* ── Center: ProjectList → ProjectDetail after create ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any, position: 'relative' }}>
        {children ?? (
          showProjectDetail
            ? <ProjectDetail showOnboardingTooltip={showTaskTooltip} />
            : <ProjectList onCreateProject={openPanel} />
        )}

        {/* Project Creation Overlay Panel */}
        {renderPanel && (
          <>
            <Animated.View
              style={{
                position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 40,
                opacity: overlayOpacity,
              }}
            >
              <Pressable style={{ flex: 1 }} onPress={handleClosePanel} />
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute' as any,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                width: 580,
                transform: [{ translateX: panelTranslateX }],
                ...Platform.select({
                  web: { boxShadow: '-10px 0px 40px rgba(0, 0, 0, 0.08)' } as any,
                  default: {
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: -5, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 20,
                  },
                }),
              }}
            >
              <ProjectCreationPanel
                onClose={handleClosePanel}
                onSuccess={(name) => {
                  setCreatedProjectName(name);
                  setShowProjectDetail(true);
                  setShowRewardWidget(true);
                }}
              />
            </Animated.View>
          </>
        )}
      </Box>

      {/* ── Right: Unified Chat Panel (list → room → collapsed) ── */}
      <ChatPanelComposite defaultView="list" variant="without-member" />

      {/* ── Checklist reward widget ── */}
      {showRewardWidget && (
        <ProjectCreatedModal
          projectName={createdProjectName}
          onDismiss={() => {
            setShowRewardWidget(false);
            setShowTaskTooltip(true);
          }}
        />
      )}
    </Box>
  );
}
