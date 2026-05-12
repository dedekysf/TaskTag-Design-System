import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

function SectionHeaderBasic({ title, count, onAdd }: { title: string; count?: number; onAdd?: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row" alignItems="center" justifyContent="space-between"
      paddingVertical="sm" paddingHorizontal="md"
      borderBottomWidth={1} borderBottomColor="border"
    >
      <Box flexDirection="row" alignItems="center" gap="sm">
        <Text variant="webLabelEmphasized" color="foreground">{title}</Text>
        {count !== undefined && (
          <Box
            style={{ backgroundColor: theme.colors.grey03, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}
          >
            <Text variant="webMetadataPrimary" color="grey05">{count}</Text>
          </Box>
        )}
      </Box>
      {onAdd && (
        <Pressable onPress={onAdd}>
          <Plus size={18} color={theme.colors.grey05} />
        </Pressable>
      )}
    </Box>
  );
}

function SectionHeaderCollapsible({ title, isOpen }: { title: string; isOpen: boolean }) {
  const theme = useTheme<Theme>();
  return (
    <Pressable>
      <Box
        flexDirection="row" alignItems="center" justifyContent="space-between"
        paddingVertical="sm" paddingHorizontal="md"
        style={{ backgroundColor: theme.colors.grey02 }}
      >
        <Text variant="webLabelEmphasized" color="foreground">{title}</Text>
        {isOpen ? (
          <ChevronDown size={16} color={theme.colors.grey05} />
        ) : (
          <ChevronRight size={16} color={theme.colors.grey05} />
        )}
      </Box>
    </Pressable>
  );
}

export default function SectionHeaderScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Section Header" totalItems={3} />

        <ComponentSection
          title="Basic"
          githubUrls={[]}
          usageCode={`<Box flexDirection="row" alignItems="center" justifyContent="space-between"
  paddingVertical="sm" paddingHorizontal="md"
  borderBottomWidth={1} borderBottomColor="border"
>
  <Text variant="webLabelEmphasized" color="foreground">Members</Text>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <SectionHeaderBasic title="Members" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Count + Add Button"
          githubUrls={[]}
          usageCode={`<Box flexDirection="row" alignItems="center" justifyContent="space-between"
  paddingVertical="sm" paddingHorizontal="md"
  borderBottomWidth={1} borderBottomColor="border"
>
  <Box flexDirection="row" alignItems="center" gap="sm">
    <Text variant="webLabelEmphasized" color="foreground">Tasks</Text>
    <Box style={{ backgroundColor: theme.colors.grey03, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
      <Text variant="webMetadataPrimary" color="grey05">12</Text>
    </Box>
  </Box>
  <Pressable>
    <Plus size={18} color={theme.colors.grey05} />
  </Pressable>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <SectionHeaderBasic title="Tasks" count={12} onAdd={() => {}} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Collapsible"
          githubUrls={[]}
          usageCode={`const [isOpen, setIsOpen] = useState(true);

<Pressable onPress={() => setIsOpen(v => !v)}>
  <Box flexDirection="row" alignItems="center" justifyContent="space-between"
    paddingVertical="sm" paddingHorizontal="md"
    style={{ backgroundColor: theme.colors.grey02 }}
  >
    <Text variant="webLabelEmphasized" color="foreground">Recent Activity</Text>
    {isOpen ? <ChevronDown size={16} color={theme.colors.grey05} />
             : <ChevronRight size={16} color={theme.colors.grey05} />}
  </Box>
</Pressable>`}
        >
          <Box gap="sm">
            <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
              <SectionHeaderCollapsible title="Recent Activity" isOpen={true} />
            </Box>
            <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
              <SectionHeaderCollapsible title="Recent Activity" isOpen={false} />
            </Box>
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
