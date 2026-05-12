import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

const ROLES = [
  { value: 'owner', label: 'Owner', description: 'Full project control' },
  { value: 'admin', label: 'Admin', description: 'Manage members & tasks' },
  { value: 'member', label: 'Member', description: 'View & update tasks' },
];

function RoleDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState(false);
  const current = ROLES.find(r => r.value === value) || ROLES[2];

  return (
    <Box style={{ position: 'relative', zIndex: 10 }}>
      <Pressable
        onPress={() => setOpen(v => !v)}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          borderWidth: 1, borderColor: theme.colors.grey03,
          borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
          backgroundColor: '#fff', minWidth: 140,
        }}
      >
        <Text style={{ flex: 1, fontSize: 14, color: theme.colors.foreground, fontWeight: '500' }}>
          {current.label}
        </Text>
        <ChevronDown size={16} color={theme.colors.grey05} />
      </Pressable>

      {open && (
        <View style={{
          position: 'absolute', top: 44, left: 0, right: 0,
          backgroundColor: '#fff', borderRadius: 8, borderWidth: 1,
          borderColor: theme.colors.grey03, shadowColor: '#000',
          shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, zIndex: 100,
        }}>
          {ROLES.map((role) => (
            <Pressable
              key={role.value}
              onPress={() => { onChange(role.value); setOpen(false); }}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}
            >
              <Box flex={1}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>{role.label}</Text>
                <Text style={{ fontSize: 12, color: theme.colors.grey05 }}>{role.description}</Text>
              </Box>
              {value === role.value && <Check size={16} color={theme.colors.secondaryGreen} />}
            </Pressable>
          ))}
        </View>
      )}
    </Box>
  );
}

function RoleDropdownDemo() {
  const [role1, setRole1] = useState('member');
  const [role2, setRole2] = useState('admin');
  const theme = useTheme<Theme>();
  return (
    <Box gap="md" style={{ paddingBottom: 160 }}>
      <Box flexDirection="row" alignItems="center" gap="md">
        <Box
          width={36} height={36} borderRadius="full"
          style={{ backgroundColor: theme.colors.pastelBlue }}
          alignItems="center" justifyContent="center"
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>JH</Text>
        </Box>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>James Hammer</Text>
        <RoleDropdown value={role1} onChange={setRole1} />
      </Box>
      <Box flexDirection="row" alignItems="center" gap="md">
        <Box
          width={36} height={36} borderRadius="full"
          style={{ backgroundColor: theme.colors.pastelMagenta }}
          alignItems="center" justifyContent="center"
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>SM</Text>
        </Box>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>Sarah Mills</Text>
        <RoleDropdown value={role2} onChange={setRole2} />
      </Box>
    </Box>
  );
}

export default function RoleDropdownScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Role Dropdown" totalItems={1} />

        <ComponentSection
          title="Member Role Selector"
          githubUrls={[]}
          usageCode={`const ROLES = [
  { value: 'owner', label: 'Owner', description: 'Full project control' },
  { value: 'admin', label: 'Admin', description: 'Manage members & tasks' },
  { value: 'member', label: 'Member', description: 'View & update tasks' },
];

const [role, setRole] = useState('member');

<Pressable
  onPress={() => setOpen(v => !v)}
  style={{ flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: theme.colors.grey03, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10 }}
>
  <Text style={{ flex: 1, fontSize: 14 }}>{currentRole.label}</Text>
  <ChevronDown size={16} color={theme.colors.grey05} />
</Pressable>

{open && (
  <View style={{ position: 'absolute', top: 44, left: 0, right: 0,
    backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: theme.colors.grey03 }}>
    {ROLES.map((r) => (
      <Pressable key={r.value} onPress={() => { setRole(r.value); setOpen(false); }}
        style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
        <Box flex={1}>
          <Text style={{ fontSize: 14, fontWeight: '500' }}>{r.label}</Text>
          <Text style={{ fontSize: 12, color: theme.colors.grey05 }}>{r.description}</Text>
        </Box>
        {role === r.value && <Check size={16} color={theme.colors.secondaryGreen} />}
      </Pressable>
    ))}
  </View>
)}`}
        >
          <RoleDropdownDemo />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
