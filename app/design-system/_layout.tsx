import { Box } from '@/components/primitives';
import { Sidebar } from '@/components/Sidebar';
import { Theme } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Slot } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

export default function DesignSystemLayout() {
  const theme = useTheme<Theme>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box flex={1} backgroundColor="background" flexDirection="row">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content Area */}
      <Box flex={1} style={{ position: 'relative' }}>
        {/* Header - Fixed */}
        <Box
          height={64}
          backgroundColor="background"
          borderBottomWidth={1}
          borderBottomColor="border"
          flexDirection="row"
          alignItems="center"
          paddingHorizontal="xl"
          justifyContent="space-between"
          style={{ zIndex: 10 }}
        >
          {/* Hamburger Menu (Mobile/Tablet only) */}
          <Box flexDirection="row" alignItems="center">
            {Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth < 1080 && (
              <Pressable
                onPress={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                  marginRight: 16,
                  padding: 8,
                }}
              >
                <MaterialIcons name="menu" size={24} color={theme.colors.foreground} />
              </Pressable>
            )}
          </Box>
        </Box>

        {/* Content Area - Scrollable */}
        <Box flex={1} backgroundColor="grey01">
          <View style={{ flex: 1, /* overflowY on web will be handled by ScrollViews inside components */ }}>
             <Slot />
          </View>
        </Box>
      </Box>
    </Box>
  );
}
