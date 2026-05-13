/**
 * SideNav Component
 *
 * Application side navigation panel.
 * Based on Figma design node 25181-26514.
 *
 * States:
 *   - Expanded: 256px wide, shows logo + labels
 *   - Collapsed: 80px wide, shows icons only
 *
 * Features:
 *   - Hover on menu items uses grey02 background
 *   - Active item uses lightMint background + secondaryGreen text/icon
 *   - No right border (removed per design spec)
 *   - Product guides card at bottom when expanded
 *   - Help + My Account at very bottom
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  Folder,
  Hash,
  HelpCircle,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SideNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

export interface SideNavProps {
  /** Initially expanded or collapsed */
  defaultExpanded?: boolean;
  /** Controlled active item id */
  activeItemId?: string;
  /** Callback when a nav item is pressed */
  onItemPress?: (id: string) => void;
  /** User display name shown in My Account */
  accountName?: string;
  /** User photo source for My Account avatar */
  accountPhotoSrc?: any;
  /** Initials fallback if no photo */
  accountInitials?: string;
}

// ─── Default nav items ────────────────────────────────────────────────────────

export const DEFAULT_NAV_ITEMS: SideNavItem[] = [
  { id: 'projects',        label: 'Projects',       icon: Folder   },
  { id: 'my-tasks',        label: 'My Tasks',        icon: Hash     },
  { id: 'global-activity', label: 'Global Activity', icon: Activity },
  { id: 'contacts',        label: 'Contacts',        icon: Users    },
];

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
  isExpanded,
  onPress,
}: {
  item: SideNavItem;
  isActive: boolean;
  isExpanded: boolean;
  onPress: () => void;
}) {
  const theme = useTheme<Theme>();
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: isExpanded ? 16 : 0,
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 8,
        height: 54,
        backgroundColor: isActive
          ? theme.colors.lightMint
          : hovered ? theme.colors.grey02 : 'transparent',
        justifyContent: isExpanded ? 'flex-start' : 'center',
      }}
    >
      <Icon
        size={24}
        color={isActive ? theme.colors.secondaryGreen : theme.colors.foreground}
        strokeWidth={2}
      />
      {isExpanded && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: isActive ? theme.colors.secondaryGreen : theme.colors.foreground,
            lineHeight: 16,
          }}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  );
}

// ─── BottomItem (Help row) ────────────────────────────────────────────────────

function BottomNavItem({
  Icon,
  label,
  isExpanded,
}: {
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
  isExpanded: boolean;
}) {
  const theme = useTheme<Theme>();
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: isExpanded ? 16 : 0,
        paddingHorizontal: 16,
        paddingVertical: 15,
        height: 54,
        borderRadius: 8,
        backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
        justifyContent: isExpanded ? 'flex-start' : 'center',
      }}
    >
      <Icon size={24} color={theme.colors.foreground} strokeWidth={2} />
      {isExpanded && (
        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SideNav({
  defaultExpanded = true,
  activeItemId,
  onItemPress,
  accountName = 'My Account',
  accountPhotoSrc,
  accountInitials = 'JH',
}: SideNavProps) {
  const theme = useTheme<Theme>();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [internalActive, setInternalActive] = useState('projects');

  const activeId = activeItemId ?? internalActive;

  const handleItemPress = (id: string) => {
    setInternalActive(id);
    onItemPress?.(id);
  };

  return (
    <Box
      // No borderRightWidth — removed per design spec
      style={{
        width: isExpanded ? 256 : 80,
        height: '100%' as any,
        flexShrink: 0,
        backgroundColor: theme.colors.grey01,
      }}
    >
      {/* ── Logo + Collapse toggle ── */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent={isExpanded ? 'space-between' : 'center'}
        style={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {isExpanded ? (
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 80, height: 24 }}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('@/assets/images/tt-favicon.png')}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
        )}
        <Pressable
          onPress={() => setIsExpanded((v) => !v)}
          hitSlop={8}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          {isExpanded
            ? <ChevronsLeft size={24} color={theme.colors.grey04} />
            : <ChevronsRight size={20} color={theme.colors.grey04} />
          }
        </Pressable>
      </Box>

      {/* ── Nav items (top) ── */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
      >
        {/* Top section */}
        <Box style={{ paddingHorizontal: 8, gap: 8 }}>
          {DEFAULT_NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              isExpanded={isExpanded}
              onPress={() => handleItemPress(item.id)}
            />
          ))}
        </Box>

        {/* Bottom section */}
        <Box style={{ paddingHorizontal: 8, paddingBottom: 24 }}>
          {/* Product guides card — only when expanded */}
          {isExpanded && (
            <Box
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: 8,
                padding: 16,
                marginBottom: 40,
                overflow: 'hidden' as any,
                position: 'relative' as any,
              }}
            >
              {/* Blob decorations */}
              <Box
                style={{
                  position: 'absolute' as any,
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: 'rgba(0,217,165,0.18)',
                  top: -24, left: -24,
                  ...Platform.select({ web: { filter: 'blur(16px)' } as any }),
                }}
              />
              <Box
                style={{
                  position: 'absolute' as any,
                  width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(0,217,165,0.14)',
                  bottom: -50, right: -24,
                  ...Platform.select({ web: { filter: 'blur(20px)' } as any }),
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: theme.colors.foreground,
                  lineHeight: 24,
                  marginBottom: 16,
                }}
              >
                Find All Product Guides Here
              </Text>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen, lineHeight: 24 }}>
                  Explore
                </Text>
                <ArrowRight size={18} color={theme.colors.secondaryGreen} />
              </Pressable>
            </Box>
          )}

          {/* Divider */}
          <Box
            height={1}
            backgroundColor="border"
            style={{ marginHorizontal: 8, marginBottom: 8 }}
          />

          {/* Help */}
          <BottomNavItem Icon={HelpCircle} label="Help" isExpanded={isExpanded} />

          {/* My Account */}
          <Pressable
            style={({ pressed }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: isExpanded ? 8 : 0,
              paddingHorizontal: isExpanded ? 8 : 18,
              paddingVertical: 7,
              borderRadius: 8,
              height: 54,
              justifyContent: isExpanded ? 'flex-start' : 'center',
            })}
          >
            {accountPhotoSrc ? (
              <Image
                source={accountPhotoSrc}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <Box
                width={40}
                height={40}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={{ backgroundColor: theme.colors.lightMint }}
              >
                <Text style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '700' }}>
                  {accountInitials}
                </Text>
              </Box>
            )}
            {isExpanded && (
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                {accountName}
              </Text>
            )}
          </Pressable>
        </Box>
      </ScrollView>
    </Box>
  );
}
