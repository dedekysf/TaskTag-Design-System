/**
 * Sidebar Component
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Box } from './primitives';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarMenuItem } from './SidebarMenuItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const pathname = usePathname();

  // Extract the active section ID from the URL (e.g., /design-system/colors -> colors)
  const activeSection = pathname.split('/').pop() || '';

  const foundationItems = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography-web', label: 'Typography Web' },
    { id: 'typography-mobile', label: 'Typography Mobile' },
    { id: 'radius', label: 'Border Radius' },
    { id: 'elevation', label: 'Elevation' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'sizes', label: 'Sizes' },
    { id: 'icons', label: 'Icons' },
    { id: 'logos', label: 'Logos' },
    { id: 'images', label: 'Images' },
  ];

  const componentItems = [
    { id: 'alert', label: 'Alert' },
    { id: 'assigned-members-button', label: 'Assigned Members Button' },
    { id: 'avatar', label: 'Avatar' },
    { id: 'badge', label: 'Badge' },
    { id: 'button', label: 'Button' },
    { id: 'card', label: 'Card' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'checklist-item', label: 'Checklist Item' },
    { id: 'dropdown', label: 'Dropdown' },
    { id: 'highlight-text', label: 'Highlight Text' },
    { id: 'member-row', label: 'Member Row' },
    { id: 'priority-dropdown', label: 'Priority Dropdown' },
    { id: 'radio-button', label: 'Radio Button' },
    { id: 'search-input', label: 'Search Input' },
    { id: 'side-nav', label: 'Side Navigation' },
    { id: 'status-badge', label: 'Status Badge' },
    { id: 'tab', label: 'Tab' },
    { id: 'tag', label: 'Tag' },
    { id: 'text-input', label: 'Text Input' },
    { id: 'textarea', label: 'Textarea' },
    { id: 'toast', label: 'Toast / Snackbar' },
    { id: 'toggle', label: 'Toggle' },
    { id: 'tooltip', label: 'Tooltip' },
  ];

  const chatItems = [
    { id: 'chat-header', label: 'Chat Header' },
    { id: 'chat-input', label: 'Chat Input' },
    { id: 'chat-message', label: 'Chat Message' },
    { id: 'chat-image-grid', label: 'Image Grid' },
    { id: 'chat-image-selector', label: 'Image Selector' },
    { id: 'chat-image-viewer', label: 'Image Viewer' },
  ];

  const overlayItems = [
    { id: 'bottom-sheet', label: 'Bottom Sheet' },
    { id: 'confirmation-modal', label: 'Confirmation Modal' },
    { id: 'modal', label: 'Modal' },
    { id: 'upgrade-modal', label: 'Upgrade Modal' },
  ];

  const dataItems = [
    { id: 'activity-item', label: 'Activity Item' },
    { id: 'data-table', label: 'Data Table' },
    { id: 'role-dropdown', label: 'Role Dropdown' },
    { id: 'section-header', label: 'Section Header' },
  ];

  const patternItems = [
    { id: 'download-app', label: 'Download App' },
    { id: 'invitation-card', label: 'Invitation Card' },
    { id: 'landing-footer', label: 'Landing Footer' },
    { id: 'skills-tag', label: 'Skills Tag' },
  ];

  const mobileItems = [
    { id: 'banner', label: 'Banner' },
    { id: 'bottom-nav', label: 'Bottom Navigation' },
    { id: 'fab', label: 'FAB' },
    { id: 'hang-tight-banner', label: 'Hang Tight Banner' },
    { id: 'home-bar', label: 'Home Bar' },
    { id: 'mobile-browser-header', label: 'Browser Header' },
    { id: 'mobile-status-bar', label: 'Status Bar' },
  ];

  const pageItems = [
    { id: 'auth-landing', label: 'Auth Landing' },
    { id: 'base-dashboard', label: 'Base Dashboard' },
    { id: 'empty-state', label: 'Empty State' },
    { id: 'list-table', label: 'List Table View' },
  ];

  const allSectionMap: Record<string, string> = {
    ...Object.fromEntries(foundationItems.map(i => [i.id, 'foundation'])),
    ...Object.fromEntries(componentItems.map(i => [i.id, 'components'])),
    ...Object.fromEntries(chatItems.map(i => [i.id, 'chat'])),
    ...Object.fromEntries(overlayItems.map(i => [i.id, 'overlays'])),
    ...Object.fromEntries(dataItems.map(i => [i.id, 'data'])),
    ...Object.fromEntries(patternItems.map(i => [i.id, 'patterns'])),
    ...Object.fromEntries(mobileItems.map(i => [i.id, 'mobile'])),
    ...Object.fromEntries(pageItems.map(i => [i.id, 'pages'])),
  };

  const initialOpenSection = allSectionMap[activeSection] ?? 'foundation';

  const [openSections, setOpenSections] = useState<string[]>([initialOpenSection]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? [] // Collapse if already open
        : [sectionId] // Expand this one, collapse others
    );
  };

  const handleMenuItemClick = (section: string) => {
    router.push(`/design-system/${section}` as any);
    // Close sidebar on mobile after selection
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 1080) {
      setIsSidebarOpen(false);
    }
  };

  const isSectionActive = (sectionId: string, items: Array<{ id: string }>) => {
    return items.some((item) => item.id === activeSection);
  };

  return (
    <>
      {/* Overlay for mobile - Web only */}
      {Platform.OS === 'web' && isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 1080 && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
          }}
          onPress={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Box
        width={256}
        backgroundColor="background"
        borderRightWidth={1}
        borderRightColor="border"
        style={{
          height: '100%',
          ...(Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 1080
            ? {
              position: 'absolute',
              left: isSidebarOpen ? 0 : -256,
              top: 64,
              bottom: 0,
              zIndex: 40,
            }
            : {}),
        }}
      >
        {/* Logo */}
        <Box padding="lg" borderBottomWidth={1} borderBottomColor="border">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 120, height: 32, resizeMode: 'contain' }}
          />
        </Box>

        {/* Navigation */}
        <ScrollView style={{ flex: 1 }}>
          <Box padding="md" paddingTop="lg">
            <Box gap="xs">
              {/* Foundation Dropdown */}
              <SidebarDropdown
                label="Foundation"
                isOpen={openSections.includes('foundation')}
                isActive={isSectionActive('foundation', foundationItems)}
                onToggle={() => toggleSection('foundation')}
              >
                {foundationItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Components Dropdown */}
              <SidebarDropdown
                label="Components"
                isOpen={openSections.includes('components')}
                isActive={isSectionActive('components', componentItems)}
                onToggle={() => toggleSection('components')}
              >
                {componentItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Chat Dropdown */}
              <SidebarDropdown
                label="Chat"
                isOpen={openSections.includes('chat')}
                isActive={isSectionActive('chat', chatItems)}
                onToggle={() => toggleSection('chat')}
              >
                {chatItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Overlays Dropdown */}
              <SidebarDropdown
                label="Overlays"
                isOpen={openSections.includes('overlays')}
                isActive={isSectionActive('overlays', overlayItems)}
                onToggle={() => toggleSection('overlays')}
              >
                {overlayItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Data Display Dropdown */}
              <SidebarDropdown
                label="Data Display"
                isOpen={openSections.includes('data')}
                isActive={isSectionActive('data', dataItems)}
                onToggle={() => toggleSection('data')}
              >
                {dataItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Patterns Dropdown */}
              <SidebarDropdown
                label="Patterns"
                isOpen={openSections.includes('patterns')}
                isActive={isSectionActive('patterns', patternItems)}
                onToggle={() => toggleSection('patterns')}
              >
                {patternItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Mobile Dropdown */}
              <SidebarDropdown
                label="Mobile"
                isOpen={openSections.includes('mobile')}
                isActive={isSectionActive('mobile', mobileItems)}
                onToggle={() => toggleSection('mobile')}
              >
                {mobileItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown>

              {/* Pages Dropdown - Temporarily Hidden */}
              {/* <SidebarDropdown
                label="Pages"
                isOpen={openSections.includes('pages')}
                isActive={isSectionActive('pages', pageItems)}
                onToggle={() => toggleSection('pages')}
              >
                {pageItems.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    label={item.label}
                    isActive={activeSection === item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                  />
                ))}
              </SidebarDropdown> */}
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </>
  );
}
