import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronsDown, ChevronsUp, Minus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type Priority = 'high' | 'medium' | 'low' | null;

const PRIORITIES = [
  {
    value: 'high' as const,
    label: 'High',
    color: '#ef4444',
    icon: (color: string) => <ChevronsUp size={20} color={color} strokeWidth={2} />,
  },
  {
    value: 'medium' as const,
    label: 'Medium',
    color: '#f59e0b',
    icon: (color: string) => (
      <View>
        <Minus size={20} color={color} strokeWidth={2} style={{ marginBottom: -8 }} />
        <Minus size={20} color={color} strokeWidth={2} style={{ marginTop: -8 }} />
      </View>
    ),
  },
  {
    value: 'low' as const,
    label: 'Low',
    color: '#93c5fd',
    icon: (color: string) => <ChevronsDown size={20} color={color} strokeWidth={2} />,
  },
];

function PriorityBadge({ priority }: { priority: Priority }) {
  const theme = useTheme<Theme>();
  if (!priority) {
    return (
      <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>— None —</Text>
    );
  }
  const p = PRIORITIES.find(x => x.value === priority)!;
  return (
    <Box flexDirection="row" alignItems="center" gap="xs">
      {p.icon(p.color)}
      <Text style={{ fontSize: 13, color: theme.colors.foreground, fontWeight: '500' }}>{p.label}</Text>
    </Box>
  );
}

function PriorityDropdown({ value, onSelect, onClose }: {
  value: Priority;
  onSelect: (p: Priority) => void;
  onClose: () => void;
}) {
  const theme = useTheme<Theme>();
  return (
    <View style={{
      width: 180, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1,
      borderColor: '#e8e8e8', paddingVertical: 4,
      shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 6,
    }}>
      {PRIORITIES.map(p => (
        <Pressable
          key={p.value}
          onPress={() => { onSelect(p.value); onClose(); }}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center', gap: 12,
            paddingHorizontal: 16, paddingVertical: 8,
            backgroundColor: pressed ? theme.colors.grey02 : 'transparent',
          })}
        >
          {p.icon(p.color)}
          <Text style={{ fontSize: 14, color: theme.colors.foreground }}>{p.label}</Text>
          {value === p.value && (
            <View style={{
              width: 6, height: 6, borderRadius: 3,
              backgroundColor: theme.colors.secondaryGreen,
              marginLeft: 'auto' as any,
            }} />
          )}
        </Pressable>
      ))}
    </View>
  );
}

function PriorityDropdownDemo() {
  const [value, setValue] = useState<Priority>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme<Theme>();

  return (
    <Box style={{ zIndex: 10 }}>
      <Pressable
        onPress={() => setOpen(v => !v)}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          paddingHorizontal: 12, paddingVertical: 8,
          borderWidth: 1, borderColor: open ? theme.colors.foreground : theme.colors.grey03,
          borderRadius: 8, backgroundColor: '#fff', alignSelf: 'flex-start',
        }}
      >
        <PriorityBadge priority={value} />
        <ChevronsDown size={14} color={theme.colors.grey05} />
      </Pressable>
      {open && (
        <View style={{ position: 'absolute', top: 44, left: 0, zIndex: 20 }}>
          <PriorityDropdown value={value} onSelect={setValue} onClose={() => setOpen(false)} />
        </View>
      )}
    </Box>
  );
}

export default function PriorityDropdownScreen() {
  const theme = useTheme<Theme>();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Priority Dropdown" totalItems={3} />

        <ComponentSection
          title="Interactive"
          githubUrls={[]}
          usageCode={`const [priority, setPriority] = useState<'high'|'medium'|'low'|null>(null);

<Pressable onPress={() => setOpen(v => !v)}>
  <PriorityBadge priority={priority} />
</Pressable>
{open && (
  <PriorityDropdown
    value={priority}
    onSelect={setPriority}
    onClose={() => setOpen(false)}
  />
)}`}
        >
          <Box padding="md" style={{ minHeight: 200, zIndex: 10 }}>
            <PriorityDropdownDemo />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="States"
          githubUrls={[]}
          usageCode={`// Priority badges
<PriorityBadge priority="high" />
<PriorityBadge priority="medium" />
<PriorityBadge priority="low" />`}
        >
          <Box padding="md" gap="sm">
            {PRIORITIES.map(p => (
              <Box key={p.value} flexDirection="row" alignItems="center" gap="sm"
                paddingVertical="xs" paddingHorizontal="sm"
                style={{ borderRadius: 8, borderWidth: 1, borderColor: '#e8e8e8', alignSelf: 'flex-start' }}>
                {p.icon(p.color)}
                <Text style={{ fontSize: 14, color: theme.colors.foreground }}>{p.label}</Text>
              </Box>
            ))}
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Dropdown List"
          githubUrls={[]}
          usageCode={`<PriorityDropdown
  value="medium"
  onSelect={(p) => console.log(p)}
  onClose={() => {}}
/>`}
        >
          <Box padding="md">
            <PriorityDropdown value="medium" onSelect={() => {}} onClose={() => {}} />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
