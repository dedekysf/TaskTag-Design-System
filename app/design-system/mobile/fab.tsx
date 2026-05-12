import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { MessageSquare, Plus, UserPlus } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

function FAB({ label, icon, showLabel = true }: {
  label?: string;
  icon?: React.ReactNode;
  showLabel?: boolean;
}) {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: theme.colors.foreground,
        borderRadius: 100, paddingHorizontal: 16, paddingVertical: 12,
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      {icon ?? <Plus size={20} color="#fff" strokeWidth={2.5} />}
      {showLabel && label && (
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{label}</Text>
      )}
    </Pressable>
  );
}

export default function FABScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="FAB (Floating Action Button)" totalItems={3} />

        <ComponentSection
          title="Default (With Label)"
          githubUrls={[]}
          usageCode={`// Typically positioned: absolute, bottom: 100, right: 16
import { Plus } from 'lucide-react-native';

<Pressable style={{
  flexDirection: 'row', alignItems: 'center', gap: 8,
  backgroundColor: theme.colors.foreground,
  borderRadius: 100, paddingHorizontal: 16, paddingVertical: 12,
  shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
}}>
  <Plus size={20} color="#fff" strokeWidth={2.5} />
  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>New Task</Text>
</Pressable>`}
        >
          <Box padding="md" alignItems="flex-start">
            <FAB label="New Task" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Icon Only"
          githubUrls={[]}
          usageCode={`<Pressable style={{
  width: 52, height: 52, borderRadius: 26,
  backgroundColor: theme.colors.foreground,
  alignItems: 'center', justifyContent: 'center',
  shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
}}>
  <Plus size={24} color="#fff" strokeWidth={2.5} />
</Pressable>`}
        >
          <Box padding="md" flexDirection="row" gap="md">
            <Pressable style={{ width: 52, height: 52, borderRadius: 26,
              backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 }}>
              <Plus size={24} color="#fff" strokeWidth={2.5} />
            </Pressable>
            <Pressable style={{ width: 52, height: 52, borderRadius: 26,
              backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 }}>
              <MessageSquare size={24} color="#fff" strokeWidth={2} />
            </Pressable>
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Custom Icon + Label"
          githubUrls={[]}
          usageCode={`<FAB
  label="Invite Member"
  icon={<UserPlus size={20} color="#fff" strokeWidth={2} />}
/>`}
        >
          <Box padding="md" alignItems="flex-start">
            <FAB label="Invite Member" icon={<UserPlus size={20} color="#fff" strokeWidth={2} />} />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
