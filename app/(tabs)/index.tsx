/**
 * Admin Panel Layout
 */

import React, { useState } from 'react';
import { View, Platform, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Box, Text } from '@/components/primitives';
import { Sidebar } from '@/components/Sidebar';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';
import ColorsContent from '@/app/(tabs)/colors';
import TypographyContent from '@/app/(tabs)/typography';
import SpacingContent from '@/app/(tabs)/spacing';
import BorderRadiusContent from '@/app/(tabs)/border-radius';
import ElevationContent from '@/app/(tabs)/elevation';
import SizesContent from '@/app/(tabs)/sizes';
import ButtonContent from '@/app/(tabs)/button';
import HomeContent from '@/app/(tabs)/index';

export default function AdminPanel() {
  const theme = useTheme<Theme>();
  const [activeSection, setActiveSection] = useState('colors');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'colors':
        return <ColorsContent />;
      case 'typography':
        return <TypographyContent />;
      case 'radius':
        return <BorderRadiusContent />;
      case 'elevation':
        return <ElevationContent />;
      case 'spacing':
        return <SpacingContent />;
      case 'sizes':
        return <SizesContent />;
      case 'button':
        return <ButtonContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    <Box flex={1} flexDirection="row" backgroundColor="grey02" style={{ height: '100%' }}>
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <Box flex={1} style={{ height: '100%' }}>
        {/* Mobile Header */}
        {Platform.OS === 'web' && (
          <View
            style={{
              display: typeof window !== 'undefined' && window.innerWidth < 1080 ? 'flex' : 'none',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 64,
              backgroundColor: theme.colors.background,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
              zIndex: 50,
            }}
          >
            <Pressable
              style={{ position: 'absolute', left: 16, padding: 8 }}
              onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MaterialIcons
                name={isSidebarOpen ? 'close' : 'menu'}
                size={24}
                color={theme.colors.textPrimary}
              />
            </Pressable>
            <Text variant="h3" color="textPrimary">
              TaskTag DS
            </Text>
          </View>
        )}

        {/* Content */}
        <Box
          flex={1}
          style={{
            height: '100%',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}
