import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Building2,
  ChevronDown,
  FolderPlus,
  Home,
  Plus,
  Search,
} from 'lucide-react-native';
import React from 'react';
import { ImageSourcePropType, Platform, Pressable, ScrollView } from 'react-native';
import { OnboardingChecklist } from './OnboardingChecklist';

const FILTERS = ['Active Projects', 'Owner', 'Team', 'Member'];

function HeaderAction() {
  const theme = useTheme<Theme>();

  return (
    <Box
      height={92}
      backgroundColor="card"
      borderBottomWidth={1}
      borderColor="border"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ paddingHorizontal: 40 }}
    >
      <Text style={{ fontSize: 32, fontWeight: '700', color: theme.colors.foreground, lineHeight: 40 }}>
        Projects
      </Text>

      <Box flexDirection="row" alignItems="center" gap="24">
        <Pressable accessibilityRole="button" hitSlop={8}>
          <Search size={34} strokeWidth={2.3} color={theme.colors.foreground} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={({ hovered }: any) => ({
            height: 52,
            paddingHorizontal: 28,
            borderWidth: 1,
            borderColor: theme.colors.foreground,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 12,
            backgroundColor: theme.colors.white,
            opacity: hovered ? 0.78 : 1,
            cursor: 'pointer' as any,
          })}
        >
          <Plus size={24} strokeWidth={2.4} color={theme.colors.foreground} />
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 28 }}>
            New Task
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}

function RecentCard({ avatarSource }: { avatarSource: ImageSourcePropType }) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="card"
      borderWidth={1}
      borderColor="border"
      borderRadius="8"
      style={{
        width: 390,
        minHeight: 154,
        paddingHorizontal: 28,
        paddingVertical: 24,
        ...Platform.select({
          web: { boxShadow: '0px 1px 4px rgba(10, 22, 41, 0.06)' } as any,
        }),
      }}
    >
      <Box flexDirection="row" alignItems="center" style={{ gap: 14, marginBottom: 34 }}>
        <Box
          width={52}
          height={52}
          borderRadius="8"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: theme.colors.purple }}
        >
          <Home size={30} strokeWidth={2.4} color={theme.colors.white} />
        </Box>
        <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.foreground, lineHeight: 28 }} numberOfLines={1}>
          Welcome to Tasktag! {'\uD83C\uDF89'}
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center" gap="8">
        <Box
          flexDirection="row"
          alignItems="center"
          gap="8"
          backgroundColor="grey02"
          borderRadius="4"
          style={{ flexShrink: 1, height: 42, paddingHorizontal: 7, paddingVertical: 4 }}
        >
          <Box
            width={32}
            height={32}
            borderRadius="4"
            backgroundColor="secondaryGreen"
            alignItems="center"
            justifyContent="center"
          >
            <Building2 size={20} color={theme.colors.white} />
          </Box>
          <Text style={{ fontSize: 17, color: theme.colors.textSecondary, lineHeight: 22 }} numberOfLines={1}>
            Personal P...
          </Text>
        </Box>

        <Box
          flexDirection="row"
          alignItems="center"
          gap="8"
          backgroundColor="grey02"
          borderRadius="4"
          style={{ flexShrink: 1, height: 42, paddingHorizontal: 7, paddingVertical: 4 }}
        >
          <Avatar size="xs" type="photo" src={avatarSource} />
          <Text style={{ fontSize: 17, color: theme.colors.textSecondary, lineHeight: 22 }} numberOfLines={1}>
            Savannah Nguyen
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function FilterButton({ label }: { label: string }) {
  const theme = useTheme<Theme>();

  return (
    <Pressable
      accessibilityRole="button"
      style={({ hovered }: any) => ({
        height: 52,
        minWidth: label === 'Active Projects' ? 206 : 132,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.foreground,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme.colors.white,
        opacity: hovered ? 0.78 : 1,
        cursor: 'pointer' as any,
      })}
    >
      <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.foreground, lineHeight: 26 }} numberOfLines={1}>
        {label}
      </Text>
      <ChevronDown size={22} strokeWidth={2.4} color={theme.colors.foreground} />
    </Pressable>
  );
}

function ProjectRow({ avatarSource }: { avatarSource: ImageSourcePropType }) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="card"
      height={76}
      borderBottomWidth={1}
      borderColor="border"
      flexDirection="row"
      alignItems="center"
      style={{ paddingHorizontal: 28 }}
    >
      <Box flex={1.2} flexDirection="row" alignItems="center" gap="12">
        <Box
          width={52}
          height={52}
          borderRadius="8"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: theme.colors.purple }}
        >
          <Home size={30} strokeWidth={2.4} color={theme.colors.white} />
        </Box>
        <Text style={{ fontSize: 20, fontWeight: '500', color: theme.colors.foreground, lineHeight: 28 }}>
          Welcome to Tasktag! {'\uD83C\uDF89'}
        </Text>
      </Box>

      <Box flex={1.2} flexDirection="row" alignItems="center" gap="12">
        <Avatar size="sm" type="photo" src={avatarSource} />
        <Box justifyContent="center">
          <Text style={{ fontSize: 20, color: theme.colors.foreground, lineHeight: 24 }}>
            Savannah Nguyen
          </Text>
          <Text style={{ fontSize: 15, color: theme.colors.grey05, lineHeight: 20 }}>
            Owner
          </Text>
        </Box>
      </Box>

      <Box flex={1.2} flexDirection="row" alignItems="center" gap="12">
        <Box
          width={40}
          height={40}
          borderRadius="4"
          backgroundColor="secondaryGreen"
          alignItems="center"
          justifyContent="center"
        >
          <Building2 size={24} color={theme.colors.white} />
        </Box>
        <Text style={{ fontSize: 20, color: theme.colors.foreground, lineHeight: 26 }}>
          Personal Projects
        </Text>
      </Box>

      <Box width={48} alignItems="flex-end">
        <Avatar size="sm" type="photo" src={avatarSource} />
      </Box>
    </Box>
  );
}

export function ProjectChecklist() {
  const avatarSource = require('@/assets/images/sample-three.jpg');
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor="background">
      <HeaderAction />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 40,
          paddingTop: 40,
          paddingBottom: 48,
          gap: 0,
        }}
      >
        <OnboardingChecklist />

        <Box style={{ marginTop: 112 }}>
          <RecentCard avatarSource={avatarSource} />
        </Box>

        <Box style={{ marginTop: 40, gap: 16 }}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ gap: 24 }}>
            <FilterButton label={FILTERS[0]} />

            <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ gap: 12, flex: 1 }}>
              {FILTERS.slice(1).map((filter) => (
                <FilterButton key={filter} label={filter} />
              ))}
            </Box>

            <Box flexDirection="row" justifyContent="flex-end" style={{ minWidth: 206 }}>
              <Pressable
                accessibilityRole="button"
                style={({ hovered }: any) => ({
                  backgroundColor: theme.colors.black,
                  height: 52,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  opacity: hovered ? 0.82 : 1,
                  cursor: 'pointer' as any,
                })}
              >
                <FolderPlus size={22} color={theme.colors.white} />
                <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.white, lineHeight: 26 }}>
                  Create Project
                </Text>
              </Pressable>
            </Box>
          </Box>

          <Box
            backgroundColor="card"
            borderWidth={0}
            overflow="hidden"
            style={{ marginTop: 0 }}
          >
            <ProjectRow avatarSource={avatarSource} />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
