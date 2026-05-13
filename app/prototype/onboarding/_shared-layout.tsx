import { ChatPanelComposite } from '@/components/ChatPanelComposite';
import { ProjectDetail } from '@/components/ProjectDetail';
import { ProjectCreationPanel } from '@/components/ProjectCreationPanel';
import { ProjectList } from '@/components/ProjectList';
import { SideNav } from '@/components/SideNav';
import { Box } from '@/components/primitives';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable } from 'react-native';

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
  const [showCreateProjectPanel, setShowCreateProjectPanel] = useState(
    showCreateProjectPanelProp ?? false
  );

  useEffect(() => {
    if (showCreateProjectPanelProp) setShowCreateProjectPanel(true);
  }, [showCreateProjectPanelProp]);

  const handleClosePanel = () => {
    setShowCreateProjectPanel(false);
    onCloseCreateProjectPanel?.();
  };

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
            ? <ProjectDetail />
            : <ProjectList onCreateProject={() => setShowCreateProjectPanel(true)} />
        )}

        {/* Project Creation Overlay Panel */}
        {showCreateProjectPanel && (
          <>
            <Pressable
              style={{
                position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 40,
              }}
              onPress={handleClosePanel}
            />
            <Box
              style={{
                position: 'absolute' as any,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                width: 580,
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
                onSuccess={() => setShowProjectDetail(true)}
              />
            </Box>
          </>
        )}
      </Box>

      {/* ── Right: Unified Chat Panel (list → room → collapsed) ── */}
      <ChatPanelComposite defaultView="list" variant="without-member" />
    </Box>
  );
}
