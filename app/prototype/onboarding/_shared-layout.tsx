/**
 * Shared layout for the onboarding prototype flow.
 *
 * Layout:
 *   [SideNav] | [ProjectList (flex)] | [ChatPanelComposite]
 *
 * ChatPanelComposite flow (from CHAT_PANELS_REFERENCE.md):
 *   collapsed (mini 80px) ↔ list (550px) ↔ room (550px + mini strip 80px)
 */

import { ChatPanelComposite } from '@/components/ChatPanelComposite';
import { ProjectDetail } from '@/components/ProjectDetail';
import { SideNav } from '@/components/SideNav';
import { Box } from '@/components/primitives';
import React from 'react';
import { Platform, Pressable } from 'react-native';

// ── MainLayoutOnboarding ──────────────────────────────────────────────────────

export interface MainLayoutOnboardingProps {
  /** Optional override for the center content (defaults to ProjectList) */
  children?: React.ReactNode;
  showCreateProjectPanel?: boolean;
  onCloseCreateProjectPanel?: () => void;
}

import { ProjectCreationPanel } from '@/components/ProjectCreationPanel';

export function MainLayoutOnboarding({ 
  children, 
  showCreateProjectPanel, 
  onCloseCreateProjectPanel 
}: MainLayoutOnboardingProps) {
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

      {/* ── Center: Project List (or custom children) ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any, position: 'relative' }}>
        {children ?? <ProjectDetail />}
        
        {/* Project Creation Overlay Panel */}
        {showCreateProjectPanel && (
          <>
            {/* Dark Overlay behind the drawer */}
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
              onPress={onCloseCreateProjectPanel}
            />
            {/* Drawer */}
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
              <ProjectCreationPanel onClose={onCloseCreateProjectPanel} />
            </Box>
          </>
        )}
      </Box>

      {/* ── Right: Unified Chat Panel (list → room → collapsed) ── */}
      {/* variant="without-member": only Tasktag Helpdesk (no project members yet) */}
      {/* Switch to variant="with-member" once user joins a project with members  */}
      <ChatPanelComposite defaultView="list" variant="without-member" />
    </Box>
  );
}
