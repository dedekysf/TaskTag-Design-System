import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { User } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

interface AssignedMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  isPending?: boolean;
  email?: string;
}

function MemberAvatar({ member, size = 24 }: { member: AssignedMember; size?: number }) {
  const theme = useTheme<Theme>();
  if (member.isPending) {
    return (
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: theme.colors.grey02,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <User size={size * 0.6} color={theme.colors.grey05} strokeWidth={2} />
      </View>
    );
  }
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: member.color,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: size * 0.4, color: '#fff', fontWeight: '600' }}>
        {member.initials}
      </Text>
    </View>
  );
}

function AssignedMembersButton({
  member,
  onPress,
}: {
  member: AssignedMember;
  onPress?: () => void;
}) {
  const theme = useTheme<Theme>();
  const displayName = member.isPending ? (member.email ?? member.name) : member.name;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 4,
        height: 32, width: 124, borderRadius: 16,
        paddingHorizontal: 8,
        borderWidth: 1, borderColor: theme.colors.border,
        backgroundColor: pressed ? theme.colors.grey01 : '#fff',
      })}
    >
      <MemberAvatar member={member} size={24} />
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 12, color: theme.colors.foreground,
          letterSpacing: 0.24,
        }}
      >
        {displayName}
      </Text>
    </Pressable>
  );
}

const SAMPLE_MEMBERS: AssignedMember[] = [
  { id: '1', name: 'Jordan Hayes', initials: 'JH', color: '#93c5fd' },
  { id: '2', name: 'Sam Mitchell', initials: 'SM', color: '#f9a8d4' },
  { id: '3', name: 'Alex Kim Very Long Name', initials: 'AK', color: '#86efac' },
  { id: 'invite-1', name: 'Pending', initials: '', color: '', isPending: true, email: 'new@example.com' },
];

export default function AssignedMembersButtonScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Assigned Members Button" totalItems={3} />

        <ComponentSection
          title="Default"
          githubUrls={[]}
          usageCode={`<AssignedMembersButton
  member={{ id: '1', name: 'Jordan Hayes', initials: 'JH', color: '#93c5fd' }}
  onPress={() => {}}
/>`}
        >
          <Box padding="md" gap="sm">
            {SAMPLE_MEMBERS.slice(0, 2).map(m => (
              <AssignedMembersButton key={m.id} member={m} onPress={() => {}} />
            ))}
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Text Truncation"
          githubUrls={[]}
          usageCode={`// Long names are truncated at 124px width
<AssignedMembersButton
  member={{ id: '3', name: 'Alex Kim Very Long Name', initials: 'AK', color: '#86efac' }}
/>`}
        >
          <Box padding="md">
            <AssignedMembersButton member={SAMPLE_MEMBERS[2]} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Pending (Invited)"
          githubUrls={[]}
          usageCode={`// Pending invites show user icon + email
<AssignedMembersButton
  member={{ id: 'invite-1', name: 'Pending', isPending: true, email: 'new@example.com', initials: '', color: '' }}
/>`}
        >
          <Box padding="md">
            <AssignedMembersButton member={SAMPLE_MEMBERS[3]} />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
