import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Building2,
  ChevronDown,
  FolderPlus,
  Home,
  LayoutGrid,
  Plus,
  Search,
} from 'lucide-react-native';
import React from 'react';
import { ImageSourcePropType, Platform, Pressable, ScrollView } from 'react-native';

const FILTERS = ['Active Projects', 'Owner', 'Team', 'Member'];

function HeaderAction() {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="card"
      borderBottomWidth={1}
      borderColor="border"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ paddingHorizontal: 32, paddingVertical: 28 }}
    >
      <Text style={{ fontSize: 30, fontWeight: '700', color: theme.colors.foreground, lineHeight: 38 }}>
        Projects
      </Text>

      <Box flexDirection="row" alignItems="center" style={{ gap: 22 }}>
        <Pressable accessibilityRole="button" hitSlop={8}>
          <Search size={31} strokeWidth={2.2} color={theme.colors.foreground} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={({ hovered }: any) => ({
            paddingHorizontal: 24,
            paddingVertical: 8,
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
          <Plus size={21} strokeWidth={2.3} color={theme.colors.foreground} />
          <Text style={{ fontSize: 19, fontWeight: '600', color: theme.colors.foreground, lineHeight: 25 }}>
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
        width: '100%',
        maxWidth: 402,
        alignSelf: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 20,
        ...Platform.select({
          web: { boxShadow: '0px 1px 4px rgba(10, 22, 41, 0.06)' } as any,
        }),
      }}
    >
      <Box flexDirection="row" alignItems="center" style={{ gap: 12, marginBottom: 28 }}>
        <Box
          width={44}
          height={44}
          borderRadius="8"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: theme.colors.purple }}
        >
          <Home size={27} strokeWidth={2.4} color={theme.colors.white} />
        </Box>
        <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.foreground, lineHeight: 27, flexShrink: 1 }} numberOfLines={1}>
          Welcome to Tasktag! {'\uD83C\uDF89'}
        </Text>
      </Box>

      <Box flexDirection="row" alignItems="center" gap="8" style={{ flexWrap: 'wrap' }}>
        <Box
          flexDirection="row"
          alignItems="center"
          gap="8"
          backgroundColor="grey02"
          borderRadius="4"
          style={{ flexShrink: 1, paddingHorizontal: 6, paddingVertical: 4 }}
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
          <Text style={{ fontSize: 16, color: theme.colors.textSecondary, lineHeight: 21 }} numberOfLines={1}>
            Personal P...
          </Text>
        </Box>

        <Box
          flexDirection="row"
          alignItems="center"
          gap="8"
          backgroundColor="grey02"
          borderRadius="4"
          style={{ flexShrink: 1, paddingHorizontal: 6, paddingVertical: 4 }}
        >
          <Avatar size="xs" type="photo" src={avatarSource} />
          <Text style={{ fontSize: 16, color: theme.colors.textSecondary, lineHeight: 21 }} numberOfLines={1}>
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
        minWidth: label === 'Active Projects' ? 216 : 126,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: theme.colors.white,
        opacity: hovered ? 0.78 : 1,
        cursor: 'pointer' as any,
      })}
    >
      <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.foreground, lineHeight: 24 }} numberOfLines={1}>
        {label}
      </Text>
      <ChevronDown size={19} strokeWidth={2.4} color={theme.colors.foreground} />
    </Pressable>
  );
}

function ProjectRow({ avatarSource }: { avatarSource: ImageSourcePropType }) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="card"
      borderBottomWidth={1}
      borderColor="border"
      flexDirection="row"
      alignItems="center"
      style={{ paddingHorizontal: 20, paddingVertical: 10 }}
    >
      <Box flex={1.2} flexDirection="row" alignItems="center" gap="12">
        <Box
          width={44}
          height={44}
          borderRadius="8"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: theme.colors.purple }}
        >
          <Home size={27} strokeWidth={2.4} color={theme.colors.white} />
        </Box>
        <Text style={{ fontSize: 20, fontWeight: '500', color: theme.colors.foreground, lineHeight: 27 }} numberOfLines={1}>
          Welcome to Tasktag! {'\uD83C\uDF89'}
        </Text>
      </Box>

      <Box flex={1.2} flexDirection="row" alignItems="center" gap="12">
        <Avatar size="sm" type="photo" src={avatarSource} />
        <Box justifyContent="center">
          <Text style={{ fontSize: 20, color: theme.colors.foreground, lineHeight: 24 }} numberOfLines={1}>
            Savannah Nguyen
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.grey05, lineHeight: 18 }}>
            Owner
          </Text>
        </Box>
      </Box>

      <Box flex={1.2} flexDirection="row" alignItems="center" gap="12">
        <Box
          width={36}
          height={36}
          borderRadius="4"
          backgroundColor="secondaryGreen"
          alignItems="center"
          justifyContent="center"
        >
          <Building2 size={22} color={theme.colors.white} />
        </Box>
        <Text style={{ fontSize: 20, color: theme.colors.foreground, lineHeight: 26 }} numberOfLines={1}>
          Personal Projects
        </Text>
      </Box>

      <Box width={48} alignItems="flex-end">
        <Avatar size="sm" type="photo" src={avatarSource} />
      </Box>
    </Box>
  );
}

export function ProjectList({ onCreateProject }: { onCreateProject?: () => void } = {}) {
  const avatarSource = require('@/assets/images/sample-three.jpg');
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor="background">
      <HeaderAction />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 32,
          paddingTop: 32,
          paddingBottom: 48,
          gap: 0,
        }}
      >
        <Box style={{ marginTop: 0 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.foreground, lineHeight: 32, marginBottom: 22 }}>
            Recent
          </Text>
          <RecentCard avatarSource={avatarSource} />
        </Box>

        <Box style={{ marginTop: 42, gap: 16 }}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ gap: 24, flexWrap: 'wrap' }}>
            <FilterButton label={FILTERS[0]} />

            <Box flexDirection="row" alignItems="center" justifyContent="flex-end" style={{ gap: 12, flex: 1, flexWrap: 'wrap' }}>
              {FILTERS.slice(1).map((filter) => <FilterButton key={filter} label={filter} />)}
              <Pressable accessibilityRole="button" hitSlop={8} style={{ padding: 8 }}>
                <LayoutGrid size={22} strokeWidth={2.3} color={theme.colors.foreground} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onCreateProject}
                style={({ hovered }: any) => ({
                  backgroundColor: theme.colors.black,
                  paddingHorizontal: 22,
                  paddingVertical: 11,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  opacity: hovered ? 0.82 : 1,
                  cursor: 'pointer' as any,
                })}
              >
                <FolderPlus size={19} color={theme.colors.white} />
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.white, lineHeight: 24 }}>
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

export { ProjectList as ProjectChecklist };
