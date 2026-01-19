/**
 * Side Menu Component
 * 
 * Navigation menu untuk foundation styles dan components
 */

import React from 'react';
import { ScrollView, Pressable, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Box, Text } from './primitives';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', route: '/' },
  { id: 'typography', label: 'Typography', route: '/typography' },
  { id: 'colors', label: 'Colors', route: '/colors' },
  { id: 'spacing', label: 'Spacing', route: '/spacing' },
  { id: 'border-radius', label: 'Border Radius', route: '/border-radius' },
  { id: 'elevation', label: 'Elevation', route: '/elevation' },
  { id: 'sizes', label: 'Sizes', route: '/sizes' },
  { id: 'button', label: 'Button', route: '/button' },
];

export function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="grey02"
      width={260}
      borderRightWidth={1}
      borderRightColor="border"
      style={{ height: '100%' }}
    >
      <ScrollView>
        <Box padding="lg">
          <Text variant="h2" marginBottom="xl" color="textPrimary">
            TaskTag DS
          </Text>
          <Box gap="xs">
            {menuItems.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                >
                  <Box
                    paddingVertical="md"
                    paddingHorizontal="md"
                    borderRadius="md"
                    backgroundColor={isActive ? 'lightMint' : 'transparent'}
                  >
                    <Text
                      variant="label"
                      color={isActive ? 'primary' : 'textSecondary'}
                      fontWeight={isActive ? '600' : '400'}
                    >
                      {item.label}
                    </Text>
                  </Box>
                </Pressable>
              );
            })}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
