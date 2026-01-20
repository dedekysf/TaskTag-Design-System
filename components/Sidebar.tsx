/**
 * Sidebar Component
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView } from 'react-native';
import { Box, Text } from './primitives';
import { SidebarDropdown } from './SidebarDropdown';
import { SidebarMenuItem } from './SidebarMenuItem';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ activeSection, onSectionChange, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const theme = useTheme<Theme>();
  const [openSections, setOpenSections] = useState<string[]>(['foundation', 'components']);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleMenuItemClick = (section: string) => {
    onSectionChange(section);
    // Close sidebar on mobile after selection
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 1080) {
      setIsSidebarOpen(false);
    }
  };

  const foundationItems = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'radius', label: 'Border Radius' },
    { id: 'elevation', label: 'Elevation' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'sizes', label: 'Sizes' },
  ];

  const componentItems = [
    { id: 'button', label: 'Button' },
  ];

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
          <Text variant="h2" color="textPrimary">
            TaskTag DS
          </Text>
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
            </Box>
          </Box>
        </ScrollView>
      </Box>
    </>
  );
}
