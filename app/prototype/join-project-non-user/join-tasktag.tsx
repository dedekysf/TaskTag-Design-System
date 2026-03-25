import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import {
  Activity,
  FileText,
  Hash,
  Image as ImageIcon,
  Link,
  ListFilter,
  MessageSquare,
  Plus,
  Search,
  UserPlus,
  Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  description:
    'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
  memberCount: 7,
};

const TABS = [
  { key: 'tasks', label: 'Tasks', Icon: Hash },
  { key: 'checklist', label: 'Checklist', Icon: FileText },
  { key: 'files', label: 'Files & Media', Icon: ImageIcon },
  { key: 'activity', label: 'Activity Log', Icon: Activity },
  { key: 'members', label: 'Members', Icon: Users, badge: PROJECT.memberCount },
];

function SkillsTooltip({ skills }: { skills: string[] }) {
  const [visible, setVisible] = React.useState(false);
  const overflow = skills.length - 2;
  return (
    <Pressable
      onPress={() => setVisible(v => !v)}
      onHoverIn={() => setVisible(true)}
      onHoverOut={() => setVisible(false)}
      style={{ position: 'relative', zIndex: 9999, overflow: 'visible' } as any}
    >
      <Text variant="webBody" color="textSecondary">
        +{overflow} more
      </Text>
      {visible && (
        <Box
          style={{
            position: 'absolute',
            top: 28,
            left: 0,
            backgroundColor: '#1a1a1a',
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            zIndex: 9999,
            elevation: 9999,
            minWidth: 140,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
          } as any}
        >
          {skills.map((s, i) => (
            <Text key={i} variant="webBody" style={{ color: '#fff', lineHeight: 22 }}>{s}</Text>
          ))}
        </Box>
      )}
    </Pressable>
  );
}

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <Box
      flex={1}
      backgroundColor="background"
      alignItems="center"
    >
      {/* Content constrained to 1114px */}
      <Box flex={1} width="100%" maxWidth={1114}>

        {/* ── Header bar ── */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="md"
          paddingVertical="12"
          borderBottomWidth={1}
          borderColor="border"
          backgroundColor="card"
          height={74}
        >
          {/* Left: title + address */}
          <Box flex={1} flexShrink={1}>
            <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
              <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1 }}>
                {PROJECT.name}
              </Text>
            </Box>
            <Text variant="webMetadataPrimary" color="textSecondary">
              {PROJECT.address}
            </Text>
          </Box>

          {/* Right: search + New Task (filled, disabled, pill) */}
          <Box flexDirection="row" alignItems="center" gap="16">
            <Pressable hitSlop={8}>
              <Search size={20} color={theme.colors.grey04} />
            </Pressable>
            <Button
              variant="fill"
              color="secondary"
              size="sm"
              disabled
              style={{ borderRadius: 40, minWidth: 122 }}
            >
              <Box flexDirection="row" alignItems="center" gap="8">
                <Plus size={16} color={theme.colors.grey05} />
                <Text variant="labelMedium" color="grey05">New Task</Text>
              </Box>
            </Button>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* ── Description card ── */}
          <Box padding="md">
            <Box
              backgroundColor="grey01"
              borderRadius="8"
              padding="md"
              gap="8"
            >
              <Text variant="webLabelEmphasized" color="foreground">Description</Text>
              <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>
                {PROJECT.description}
              </Text>
            </Box>
          </Box>

          {/* ── Tabs bar ── */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderColor="border"
            height={56}
            paddingHorizontal="md"
          >
            {/* Tabs list */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              contentContainerStyle={{ alignItems: 'stretch' }}
            >
              {TABS.map(({ key, label, Icon, badge }) => {
                const isActive = activeTab === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setActiveTab(key)}
                    style={{ height: '100%' }}
                  >
                    <Box
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="flex-end"
                      height={56}
                      minWidth={96}
                      style={{ paddingTop: 8, marginBottom: -1 }}
                    >
                      <Box flexDirection="row" alignItems="center" gap="8" height={32} justifyContent="center" paddingHorizontal="8">
                        <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.grey04} style={{ transition: 'color 0.2s ease' } as any} />
                        <Text
                          variant="labelMedium"
                          color={isActive ? 'secondaryGreen' : 'grey04'}
                          style={{ transition: 'color 0.2s ease' } as any}
                        >
                          {label}
                        </Text>
                        {badge !== undefined && (
                          <Box
                            backgroundColor={isActive ? 'black' : 'grey04'}
                            borderRadius="full"
                            width={20}
                            height={20}
                            alignItems="center"
                            justifyContent="center"
                            style={{ transition: 'background-color 0.2s ease' } as any}
                          >
                            <Text variant="caption" color="white" style={{ fontSize: 10 }}>{badge}</Text>
                          </Box>
                        )}
                      </Box>
                      {/* Active underline */}
                      <Box
                        height={2}
                        width="100%"
                        backgroundColor={isActive ? 'secondaryGreen' : 'transparent'}
                        style={{ marginTop: 'auto', transition: 'background-color 0.2s ease' } as any}
                      />
                    </Box>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Right actions */}
            <Box flexDirection="row" alignItems="center" gap="md" style={{ paddingLeft: 16 }}>
              <Pressable hitSlop={8}>
                <Link size={20} color={theme.colors.grey04} />
              </Pressable>
              {/* Invite — outline, disabled, pill */}
              <Button
                variant="outline"
                color="secondary"
                size="sm"
                disabled
                style={{ borderRadius: 40, minWidth: 122 }}
              >
                <Box flexDirection="row" alignItems="center" gap="8">
                  <UserPlus size={16} color={theme.colors.grey05} />
                  <Text variant="labelMedium" color="grey05">Invite</Text>
                </Box>
              </Button>
            </Box>
          </Box>

          {/* ── Tab Content ── */}
          {activeTab === 'members' ? (
            <Box style={{ position: 'relative' }}>
              {/* ── Overlay ── */}
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                  backdropFilter: 'blur(2px)',
                  backgroundColor: 'rgba(247, 248, 250, 0.5)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                } as any}
              >
                <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
                  {"You've been invited to this project by "}
                  <Text variant="webHeading22" fontWeight="700">James Hammer</Text>
                </Text>
                <Button
                  variant="fill"
                  size="lg"
                  style={{ borderRadius: 40, minWidth: 220, backgroundColor: theme.colors.secondaryGreen }}
                  onPress={() => router.push('/prototype/join-project-non-user/join-tasktag-signup')}
                >
                  <Text color="white" variant="labelMedium">Create Account</Text>
                </Button>
              </Box>

              {/* ── Toolbar: Filter + Start a Chat (both disabled) ── */}
              <Box
                flexDirection="row"
                alignItems="center"
                gap="16"
                paddingHorizontal="md"
                paddingVertical="12"
                borderBottomWidth={1}
                borderColor="border"
              >
                <Button variant="ghost" size="sm" disabled style={{ opacity: 0.55, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ListFilter size={15} color={theme.colors.textSecondary} />
                  <Text variant="webBody" color="textSecondary">Filter</Text>
                </Button>
                <Button variant="ghost" size="sm" disabled style={{ opacity: 0.55, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={15} color={theme.colors.textSecondary} />
                  <Text variant="webBody" color="textSecondary">Start a Chat</Text>
                </Button>
              </Box>

              {/* ── Members Table ── */}
              <Box>

                {/* Table column headers: Name, Skills, Role only */}
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="md"
                  paddingVertical="12"
                  borderBottomWidth={1}
                  borderColor="border"
                  backgroundColor="grey01"
                >
                  <Text variant="webBody" color="textSecondary" style={{ flex: 3 }}>Name</Text>
                  <Text variant="webBody" color="textSecondary" style={{ flex: 3 }}>Skills</Text>
                  <Text variant="webBody" color="textSecondary" style={{ flex: 2 }}>Role</Text>
                </Box>

                {/* Member rows (7 active) */}
                {[
                  { name: 'James Hammer', skills: [], role: 'Owner', avatarColor: '#18a87d', avatarBg: '#dcf2ec' },
                  { name: 'John Doe', skills: ['Carpenter'], role: 'Editor', avatarColor: '#7b61ff', avatarBg: '#ebe7ff' },
                  { name: 'Jane Smith', skills: [], role: 'Editor', avatarColor: '#fc7f5b', avatarBg: '#ffece6' },
                  { name: 'Chelsea Smith', skills: ['Carpenter', 'Electrician', 'Plumber', 'Welder'], role: 'Viewer', avatarColor: '#1572a1', avatarBg: '#dceeff' },
                  { name: 'Logan Jack', skills: [], role: 'Viewer', avatarColor: '#655d8a', avatarBg: '#f2def3' },
                  { name: 'Oscar Edison', skills: [], role: 'Editor', avatarColor: '#cc7351', avatarBg: '#ffece6' },
                  { name: 'Abby Monroe', skills: ['Painter', 'Plumber', 'Welder', 'HVAC', 'Roofer'], role: 'Editor', avatarColor: '#a85796', avatarBg: '#f6eaf8' },
                ].map((member, idx, arr) => (
                  <Box
                    key={member.name}
                    flexDirection="row"
                    alignItems="center"
                    paddingHorizontal="md"
                    style={{ paddingVertical: 14 }}
                    borderBottomWidth={idx === arr.length - 1 ? 0 : 1}
                    borderColor="border"
                  >
                    {/* Name + avatar */}
                    <Box style={{ flex: 3 }} flexDirection="row" alignItems="center" gap="12">
                      <Box
                        width={32}
                        height={32}
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                        style={{ backgroundColor: member.avatarBg }}
                      >
                        <Text style={{ fontWeight: '700', color: member.avatarColor, fontSize: 11 }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </Box>
                      <Text variant="webBody" color="textSecondary">{member.name}</Text>
                    </Box>

                    {/* Skills */}
                    <Box style={{ flex: 3 }}>
                      {member.skills.length === 0 ? (
                        <Text variant="webBody" color="textSecondary">-</Text>
                      ) : member.skills.length <= 2 ? (
                        <Text variant="webBody" color="textSecondary">{member.skills.join(', ')}</Text>
                      ) : (
                        <Box flexDirection="row" alignItems="center" gap="4" style={{ position: 'relative' }}>
                          <Text variant="webBody" color="textSecondary">
                            {member.skills.slice(0, 2).join(', ')}
                          </Text>
                          <SkillsTooltip skills={member.skills} />
                        </Box>
                      )}
                    </Box>

                    {/* Role */}
                    <Box style={{ flex: 2 }}>
                      <Text variant="webBody" color="textSecondary">{member.role}</Text>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            /* ── Default Tab Content (Empty State) ── */
            <Box
              flex={1}
              alignItems="center"
              justifyContent="center"
              paddingVertical="80"
              gap="16"
              style={{
                backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #F7F8FA)',
              } as any}
            >
              <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
              <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
                {"You've been invited to this project by "}
                <Text variant="webHeading22" fontWeight="700">James Hammer</Text>
              </Text>
              <Button
                variant="fill"
                size="lg"
                style={{ borderRadius: 40, minWidth: 220, backgroundColor: theme.colors.secondaryGreen }}
                onPress={() => router.push('/prototype/join-project-non-user/join-tasktag-signup')}
              >
                <Text color="white" variant="labelMedium">Create Account</Text>
              </Button>
            </Box>
          )}
        </ScrollView>
      </Box>
    </Box>
  );
}
