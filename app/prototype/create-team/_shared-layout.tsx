/**
 * Shared layout components for the create-team prototype flow.
 * Used by both index.tsx (My Account) and team-detail.tsx.
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  Folder,
  Hash,
  HelpCircle,
  MessageSquarePlus,
  MoreVertical,
  Search,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView } from 'react-native';

// ── Shared nav items ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'projects', label: 'Projects', Icon: Folder, active: false },
  { key: 'tasks', label: 'My Tasks', Icon: Hash, active: false },
  { key: 'activity', label: 'Global Activity', Icon: Activity, active: false },
  { key: 'contacts', label: 'Contacts', Icon: Users, active: false },
];

// ── AppSidebar ────────────────────────────────────────────────────────────────

export interface AppSidebarProps {
  /** Controlled collapsed state */
  collapsed: boolean;
  /** Callback to toggle collapsed state */
  onToggleCollapsed: () => void;
}

export function AppSidebar({ collapsed, onToggleCollapsed }: AppSidebarProps) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="grey01"
      borderRightWidth={1}
      borderColor="border"
      style={{
        width: collapsed ? 72 : 256,
        height: '100%' as any,
        paddingHorizontal: 16,
        paddingVertical: 24,
        gap: 30,
        flexShrink: 0,
      }}
    >
      {/* Logo row */}
      {collapsed ? (
        <Box alignItems="center" gap="8">
          <Image
            source={require('@/assets/images/tt-favicon.png')}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
          <Pressable onPress={onToggleCollapsed} hitSlop={8}>
            <ChevronsRight size={20} color={theme.colors.grey04} />
          </Pressable>
        </Box>
      ) : (
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 96, height: 24 }}
            resizeMode="contain"
          />
          <Pressable onPress={onToggleCollapsed} hitSlop={8}>
            <ChevronsLeft size={24} color={theme.colors.grey04} />
          </Pressable>
        </Box>
      )}

      <Box flex={1} style={{ paddingTop: 16 }}>
        <Box flex={1} justifyContent="space-between">
          {/* Top nav items */}
          <Box gap="8">
            {NAV_ITEMS.map(({ key, label, Icon, active }) =>
              collapsed ? (
                <Box key={key} alignItems="center" justifyContent="center" style={{ height: 54 }}>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: active ? theme.colors.lightMint : theme.colors.card,
                    }}
                  >
                    <Icon size={22} color={active ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                  </Box>
                </Box>
              ) : (
                <Box
                  key={key}
                  flexDirection="row"
                  alignItems="center"
                  gap="16"
                  style={{
                    height: 54,
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 15,
                    backgroundColor: active ? theme.colors.lightMint : 'transparent',
                  }}
                >
                  <Icon size={24} color={active ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                  <Text
                    variant="labelMedium"
                    style={{ color: active ? theme.colors.secondaryGreen : theme.colors.textSecondary }}
                  >
                    {label}
                  </Text>
                </Box>
              )
            )}
          </Box>

          {/* Bottom nav */}
          <Box gap="8">
            {/* Product guides card — only when expanded */}
            {!collapsed && (
              <Box style={{ paddingBottom: 40 }}>
                <Box
                  backgroundColor="card"
                  style={{
                    borderRadius: 8,
                    padding: 16,
                    overflow: 'hidden' as any,
                    position: 'relative' as any,
                  }}
                >
                  <Box
                    style={{
                      position: 'absolute' as any,
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: 'rgba(0,217,165,0.25)',
                      top: -36,
                      left: -36,
                      ...Platform.select({ web: { filter: 'blur(18px)' } as any }),
                    }}
                  />
                  <Box
                    style={{
                      position: 'absolute' as any,
                      width: 140,
                      height: 140,
                      borderRadius: 70,
                      backgroundColor: 'rgba(0,217,165,0.2)',
                      bottom: -60,
                      right: -30,
                      ...Platform.select({ web: { filter: 'blur(22px)' } as any }),
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: theme.colors.textSecondary,
                      lineHeight: 24,
                      marginBottom: 16,
                    }}
                  >
                    Find All Product Guides Here
                  </Text>
                  <Box flexDirection="row" alignItems="center" gap="4">
                    <Text
                      style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen, lineHeight: 24 }}
                    >
                      Explore
                    </Text>
                    <ChevronRight size={18} color={theme.colors.secondaryGreen} />
                  </Box>
                </Box>
              </Box>
            )}

            <Box height={1} backgroundColor="border" />

            {/* Help */}
            {collapsed ? (
              <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                <Box
                  alignItems="center"
                  justifyContent="center"
                  style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.card }}
                >
                  <HelpCircle size={22} color={theme.colors.textSecondary} />
                </Box>
              </Box>
            ) : (
              <Box
                flexDirection="row"
                alignItems="center"
                gap="16"
                style={{ height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}
              >
                <HelpCircle size={24} color={theme.colors.textSecondary} />
                <Text variant="labelMedium" style={{ color: theme.colors.textSecondary }}>
                  Help
                </Text>
              </Box>
            )}

            {/* My Account */}
            {collapsed ? (
              <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                <Box
                  width={44}
                  height={44}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="pastelMagenta"
                >
                  <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                    LS
                  </Text>
                </Box>
              </Box>
            ) : (
              <Box
                flexDirection="row"
                alignItems="center"
                gap="8"
                style={{
                  height: 54,
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 15,
                  backgroundColor: theme.colors.lightMint,
                }}
              >
                <Box
                  width={40}
                  height={40}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="pastelMagenta"
                >
                  <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>
                    LS
                  </Text>
                </Box>
                <Text variant="labelMedium" style={{ color: theme.colors.secondaryGreen }}>
                  My Account
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── AppChatPanel ──────────────────────────────────────────────────────────────

export function AppChatPanel() {
  const theme = useTheme<Theme>();

  return (
    <Box
      flex={1}
      backgroundColor="background"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, maxWidth: 550, position: 'relative' as any }}
    >
      {/* Chat Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="background"
        style={{ height: 74, paddingHorizontal: 24, paddingVertical: 12 }}
      >
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 32 }}>
          Chat
        </Text>
        <Box flexDirection="row" alignItems="center">
          <Pressable style={{ padding: 4 }}>
            <Search size={24} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={{ padding: 4 }}>
            <MoreVertical size={24} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={{ padding: 4 }}>
            <ChevronsRight size={24} color={theme.colors.textSecondary} />
          </Pressable>
        </Box>
      </Box>

      {/* Chat List */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Box
          flexDirection="row"
          alignItems="center"
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 16 }}
        >
          <Box
            width={48}
            height={48}
            borderRadius="full"
            alignItems="center"
            justifyContent="center"
            backgroundColor="pastelOrange"
            style={{ flexShrink: 0 } as any}
          >
            <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: 22 }}>TH</Text>
          </Box>
          <Box flex={1} style={{ minWidth: 0, gap: 4 }}>
            <Text variant="webSecondaryBody" color="foreground">
              Tasktag Helpdesk
            </Text>
            <Text variant="webMetadataPrimary" color="grey04" numberOfLines={1}>
              Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might
              have.
            </Text>
          </Box>
          <Text variant="webMetadataPrimary" color="grey04">
            Yesterday
          </Text>
        </Box>
      </ScrollView>

      {/* New Message FAB */}
      <Pressable
        style={{
          position: 'absolute' as any,
          bottom: 16,
          right: 16,
          backgroundColor: theme.colors.foreground,
          borderRadius: 156,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        <MessageSquarePlus size={24} color={theme.colors.white} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white }}>New Message</Text>
      </Pressable>
    </Box>
  );
}

// ── useAppSidebar hook ────────────────────────────────────────────────────────

/** Convenience hook to manage sidebar collapsed state. */
export function useAppSidebar(initialCollapsed = false) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  return {
    collapsed,
    onToggleCollapsed: () => setCollapsed((v) => !v),
  };
}
