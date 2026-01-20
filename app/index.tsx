/**
 * Admin Panel Layout
 */

import BorderRadiusContent from '@/app/border-radius';
import ButtonContent from '@/app/button';
import CardContent from '@/app/card';
import CheckboxContent from '@/app/checkbox';
import ColorsContent from '@/app/colors';
import ElevationContent from '@/app/elevation';
import IconsContent from '@/app/icons';
import InputsContent from '@/app/inputs';
import SizesContent from '@/app/sizes';
import SpacingContent from '@/app/spacing';
import TypographyMobileContent from '@/app/typography-mobile';
import TypographyWebContent from '@/app/typography-web';
import { Box, Text } from '@/components/primitives';
import { Sidebar } from '@/components/Sidebar';
import { Theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

export default function AdminPanel() {
  const theme = useTheme<Theme>();
  const [activeSection, setActiveSection] = useState('colors');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeSection) {
      case 'colors':
        return <ColorsContent />;
      case 'typography-web':
        return <TypographyWebContent />;
      case 'typography-mobile':
        return <TypographyMobileContent />;
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
      case 'checkbox':
        return <CheckboxContent />;
      case 'card':
        return <CardContent />;
      case 'inputs':
        return <InputsContent />;
      case 'icons':
        return <IconsContent />;
      default:
        return <ColorsContent />;
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
