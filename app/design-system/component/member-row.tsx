import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, MessageSquare, RefreshCw, Trash2, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type Role = 'Owner' | 'Assignee' | 'Viewer';

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials?: string;
  color?: string;
  isPending?: boolean;
}

function Avatar({ member, size = 40 }: { member: Member; size?: number }) {
  const theme = useTheme<Theme>();
  if (member.isPending) {
    return (
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: theme.colors.grey02,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <User size={size * 0.5} color={theme.colors.grey05} strokeWidth={2} />
      </View>
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: member.color ?? '#93c5fd',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.35, color: '#fff', fontWeight: '600' }}>
        {member.initials ?? member.name.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

function MemberRow({ member, onDelete, onResend, onRoleChange }: {
  member: Member;
  onDelete?: () => void;
  onResend?: () => void;
  onRoleChange?: (role: Role) => void;
}) {
  const theme = useTheme<Theme>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const canChangeRole = member.role !== 'Owner' && !member.isPending;

  return (
    <Box
      flexDirection="row" alignItems="center" gap="sm"
      padding="sm"
      style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: '#fff' }}
    >
      <Avatar member={member} />

      <Box flex={1} style={{ minWidth: 0 }}>
        {member.isPending ? (
          <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground }}>
            {member.email}
          </Text>
        ) : (
          <>
            <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground }}>
              {member.name}
            </Text>
            <Text numberOfLines={1} style={{ fontSize: 11, color: theme.colors.grey04 }}>
              {member.email}
            </Text>
          </>
        )}
      </Box>

      {member.isPending ? (
        <Box flexDirection="row" gap="xs">
          <Pressable onPress={onResend}
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <RefreshCw size={16} color={theme.colors.foreground} strokeWidth={2} />
          </Pressable>
          <Pressable onPress={onDelete}
            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
            <Trash2 size={16} color={theme.colors.foreground} strokeWidth={2} />
          </Pressable>
        </Box>
      ) : (
        <Pressable
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
          <MessageSquare size={16} color={theme.colors.foreground} strokeWidth={2} />
        </Pressable>
      )}

      {canChangeRole ? (
        <Box style={{ position: 'relative' }}>
          <Pressable
            onPress={() => setDropdownOpen(v => !v)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 4,
              paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
              width: 100, justifyContent: 'flex-end',
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '500', color: theme.colors.foreground }}>
              {member.role}
            </Text>
            <ChevronDown size={14} color={theme.colors.foreground}
              style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }} />
          </Pressable>

          {dropdownOpen && (
            <View style={{
              position: 'absolute', top: 36, right: 0, zIndex: 50,
              backgroundColor: '#fff', borderRadius: 8, paddingVertical: 4,
              shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 8,
              minWidth: 120,
            }}>
              {(['Assignee', 'Viewer'] as Role[]).map(r => (
                <Pressable key={r} onPress={() => { onRoleChange?.(r); setDropdownOpen(false); }}
                  style={({ pressed }) => ({
                    paddingHorizontal: 12, paddingVertical: 8,
                    backgroundColor: pressed ? theme.colors.grey02 : 'transparent',
                  })}>
                  <Text style={{ fontSize: 14, color: theme.colors.foreground }}>{r}</Text>
                </Pressable>
              ))}
              <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 4 }} />
              <Pressable onPress={() => { onDelete?.(); setDropdownOpen(false); }}
                style={({ pressed }) => ({
                  paddingHorizontal: 12, paddingVertical: 8,
                  backgroundColor: pressed ? theme.colors.grey02 : 'transparent',
                })}>
                <Text style={{ fontSize: 14, color: theme.colors.alertRed }}>Remove</Text>
              </Pressable>
            </View>
          )}
        </Box>
      ) : (
        <View style={{ paddingHorizontal: 10, paddingVertical: 6, width: 100, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, fontWeight: '500', color: theme.colors.foreground }}>
            {member.role}
          </Text>
        </View>
      )}
    </Box>
  );
}

const MEMBERS: Member[] = [
  { id: '1', name: 'Jordan Hayes', email: 'jordan@tasktag.xyz', role: 'Owner', initials: 'JH', color: '#93c5fd' },
  { id: '2', name: 'Sam Mitchell', email: 'sam@tasktag.xyz', role: 'Assignee', initials: 'SM', color: '#f9a8d4' },
  { id: '3', name: 'Taylor Chen', email: 'taylor@tasktag.xyz', role: 'Viewer', initials: 'TC', color: '#86efac' },
  { id: '4', name: 'Pending', email: 'newmember@example.com', role: 'Assignee', initials: '', color: '', isPending: true },
];

export default function MemberRowScreen() {
  const [members, setMembers] = useState(MEMBERS);

  const updateRole = (id: string, role: Role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };
  const remove = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Member Row" totalItems={2} />

        <ComponentSection
          title="Interactive List"
          githubUrls={[]}
          usageCode={`{members.map(member => (
  <MemberRow
    key={member.id}
    member={member}
    onDelete={() => remove(member.id)}
    onResend={() => {}}
    onRoleChange={(role) => updateRole(member.id, role)}
  />
))}`}
        >
          <Box padding="md" gap="sm" style={{ zIndex: 10 }}>
            {members.map(m => (
              <MemberRow
                key={m.id}
                member={m}
                onDelete={() => remove(m.id)}
                onResend={() => {}}
                onRoleChange={(role) => updateRole(m.id, role)}
              />
            ))}
          </Box>
        </ComponentSection>

        <ComponentSection
          title="States"
          githubUrls={[]}
          usageCode={`// Owner - no role dropdown
<MemberRow member={{ role: 'Owner', ... }} />

// Assignee - role is editable
<MemberRow member={{ role: 'Assignee', ... }} />

// Pending invite - shows resend + cancel
<MemberRow member={{ isPending: true, ... }} />`}
        >
          <Box padding="md" gap="sm">
            <MemberRow member={MEMBERS[0]} />
            <MemberRow member={MEMBERS[1]} />
            <MemberRow member={MEMBERS[3]} />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
