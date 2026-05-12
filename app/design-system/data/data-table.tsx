import { Avatar } from '@/components/Avatar';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { StatusBadge } from '@/components/StatusBadge';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const MEMBERS = [
  { id: '1', name: 'James Hammer', role: 'Admin', email: 'james@aquaworks.com', status: 'active', initials: 'JH', color: 'pastelBlue' },
  { id: '2', name: 'Sarah Mills', role: 'Member', email: 'sarah@aquaworks.com', status: 'pending', initials: 'SM', color: 'pastelMagenta' },
  { id: '3', name: 'Tom Clark', role: 'Member', email: 'tom@aquaworks.com', status: 'active', initials: 'TC', color: 'pastelOrange' },
  { id: '4', name: 'Lisa Park', role: 'Owner', email: 'lisa@aquaworks.com', status: 'active', initials: 'LP', color: 'pastelGreen' },
];

function TableHeader({ columns }: { columns: string[] }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      paddingVertical="sm" paddingHorizontal="md"
      style={{ backgroundColor: theme.colors.grey02, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
    >
      {columns.map((col, i) => (
        <Text
          key={i}
          style={{ flex: i === 0 ? 2 : 1, fontSize: 12, fontWeight: '600', color: theme.colors.grey05, textTransform: 'uppercase' }}
        >
          {col}
        </Text>
      ))}
      <View style={{ width: 24 }} />
    </Box>
  );
}

function TableRow({ item }: { item: typeof MEMBERS[0] }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row" alignItems="center"
      paddingVertical="md" paddingHorizontal="md"
      borderBottomWidth={1} borderBottomColor="border"
    >
      <Box flexDirection="row" alignItems="center" gap="sm" style={{ flex: 2 }}>
        <Avatar type="text" initials={item.initials} color={item.color as any} size="sm" />
        <Box>
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: theme.colors.grey05 }}>{item.email}</Text>
        </Box>
      </Box>
      <Text style={{ flex: 1, fontSize: 14, color: theme.colors.textSecondary }}>{item.role}</Text>
      <Box style={{ flex: 1 }}>
        <StatusBadge status={item.status as any} />
      </Box>
      <Pressable>
        <MoreHorizontal size={18} color={theme.colors.grey05} />
      </Pressable>
    </Box>
  );
}

export default function DataTableScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Data Table" totalItems={2} />

        <ComponentSection
          title="Members Table"
          githubUrls={[]}
          usageCode={`// Table Header
<Box flexDirection="row" paddingVertical="sm" paddingHorizontal="md"
  style={{ backgroundColor: theme.colors.grey02, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
  {['Name', 'Role', 'Status'].map(col => (
    <Text key={col} style={{ flex: 1, fontSize: 12, fontWeight: '600', color: theme.colors.grey05, textTransform: 'uppercase' }}>
      {col}
    </Text>
  ))}
</Box>

// Table Row
<Box flexDirection="row" alignItems="center" paddingVertical="md" paddingHorizontal="md"
  borderBottomWidth={1} borderBottomColor="border">
  <Box flexDirection="row" alignItems="center" gap="sm" style={{ flex: 2 }}>
    <Avatar type="text" initials="JH" color="pastelBlue" size="sm" />
    <Box>
      <Text style={{ fontSize: 14, fontWeight: '500' }}>James Hammer</Text>
      <Text style={{ fontSize: 12, color: theme.colors.grey05 }}>james@aquaworks.com</Text>
    </Box>
  </Box>
  <Text style={{ flex: 1, fontSize: 14, color: theme.colors.textSecondary }}>Admin</Text>
  <Box style={{ flex: 1 }}><StatusBadge status="active" /></Box>
  <Pressable><MoreHorizontal size={18} color={theme.colors.grey05} /></Pressable>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <TableHeader columns={['Name', 'Role', 'Status']} />
            {MEMBERS.map(item => <TableRow key={item.id} item={item} />)}
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Simple List (No Header)"
          githubUrls={[]}
          usageCode={`{MEMBERS.map(member => (
  <Box key={member.id} flexDirection="row" alignItems="center" gap="md"
    paddingVertical="md" paddingHorizontal="md"
    borderBottomWidth={1} borderBottomColor="border">
    <Avatar type="text" initials={member.initials} color={member.color} size="sm" />
    <Box flex={1}>
      <Text style={{ fontSize: 14, fontWeight: '500' }}>{member.name}</Text>
      <Text style={{ fontSize: 12, color: theme.colors.grey05 }}>{member.role}</Text>
    </Box>
    <StatusBadge status={member.status} />
  </Box>
))}`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            {MEMBERS.map(item => (
              <Box
                key={item.id}
                flexDirection="row" alignItems="center" gap="md"
                paddingVertical="md" paddingHorizontal="md"
                borderBottomWidth={1} borderBottomColor="border"
              >
                <Avatar type="text" initials={item.initials} color={item.color as any} size="sm" />
                <Box flex={1}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#1a1a1a' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#828282' }}>{item.role}</Text>
                </Box>
                <StatusBadge status={item.status as any} />
              </Box>
            ))}
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
