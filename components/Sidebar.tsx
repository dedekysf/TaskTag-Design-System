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
  ];

  const componentItems = [
    { id: 'alert', label: 'Alert' },
    { id: 'avatar', label: 'Avatar' },
    { id: 'badge', label: 'Badge' },
    { id: 'button', label: 'Button' },
    { id: 'card', label: 'Card' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'highlight-text', label: 'Highlight Text' },
    { id: 'search-input', label: 'Search Input' },
    { id: 'status-badge', label: 'Status Badge' },
    { id: 'tab', label: 'Tab' },
    { id: 'text-input', label: 'Text Input' },
    { id: 'textarea', label: 'Textarea' },
    { id: 'tooltip', label: 'Tooltip' },
  ];

  const pageItems = [
    { id: 'auth-landing', label: 'Auth Landing' },
    { id: 'base-dashboard', label: 'Base Dashboard' },
    { id: 'empty-state', label: 'Empty State' },
    { id: 'list-table', label: 'List Table View' },
  ];

  const initialOpenSection = foundationItems.some(i => i.id === activeSection) ? 'foundation' :
                             componentItems.some(i => i.id === activeSection) ? 'components' :
                             pageItems.some(i => i.id === activeSection) ? 'pages' : 'foundation';

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
