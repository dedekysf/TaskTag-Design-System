import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Folder, Tag as TagIcon, Trash2, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

type TagColor = 'primary' | 'destructive';
type TagAppearance = 'fill' | 'outline';

function Tag({
  color = 'primary',
  appearance = 'fill',
  icon,
  children,
}: {
  color?: TagColor;
  appearance?: TagAppearance;
  icon?: React.ReactNode;
  children: string;
}) {
  const theme = useTheme<Theme>();

  const styles = {
    primary: {
      fill: { bg: theme.colors.lightMint, text: theme.colors.secondaryGreen, borderColor: 'transparent' },
      outline: { bg: 'transparent', text: theme.colors.secondaryGreen, borderColor: theme.colors.secondaryGreen },
    },
    destructive: {
      fill: { bg: theme.colors.lightPink, text: theme.colors.alertRed, borderColor: 'transparent' },
      outline: { bg: 'transparent', text: theme.colors.alertRed, borderColor: theme.colors.alertRed },
    },
  }[color][appearance];

  return (
    <Box
      flexDirection="row" alignItems="center" gap="xs"
      style={{
        backgroundColor: styles.bg,
        borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4,
        borderWidth: appearance === 'outline' ? 1 : 0,
        borderColor: styles.borderColor,
        alignSelf: 'flex-start',
      }}
    >
      {icon}
      <Text style={{ fontSize: 12, color: styles.text, lineHeight: 16 }}>{children}</Text>
    </Box>
  );
}

export default function TagScreen() {
  const theme = useTheme<Theme>();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Tag" totalItems={4} />

        <ComponentSection
          title="Primary (Fill)"
          githubUrls={[]}
          usageCode={`// Used as status/category labels
<Tag color="primary" appearance="fill">Active</Tag>
<Tag color="primary" appearance="fill">In Progress</Tag>
<Tag color="primary" appearance="fill">Project</Tag>`}
        >
          <Box flexDirection="row" flexWrap="wrap" gap="sm" padding="md">
            <Tag color="primary" appearance="fill">Active</Tag>
            <Tag color="primary" appearance="fill">In Progress</Tag>
            <Tag color="primary" appearance="fill">Project</Tag>
            <Tag color="primary" appearance="fill">Team</Tag>
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Destructive (Fill)"
          githubUrls={[]}
          usageCode={`<Tag color="destructive" appearance="fill">Overdue</Tag>
<Tag color="destructive" appearance="fill">Deleted</Tag>`}
        >
          <Box flexDirection="row" flexWrap="wrap" gap="sm" padding="md">
            <Tag color="destructive" appearance="fill">Overdue</Tag>
            <Tag color="destructive" appearance="fill">Deleted</Tag>
            <Tag color="destructive" appearance="fill">Expired</Tag>
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Outline Variants"
          githubUrls={[]}
          usageCode={`<Tag color="primary" appearance="outline">Primary</Tag>
<Tag color="destructive" appearance="outline">Destructive</Tag>`}
        >
          <Box flexDirection="row" flexWrap="wrap" gap="sm" padding="md">
            <Tag color="primary" appearance="outline">Primary Outline</Tag>
            <Tag color="destructive" appearance="outline">Destructive Outline</Tag>
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Icon"
          githubUrls={[]}
          usageCode={`import { Folder, User } from 'lucide-react-native';

<Tag color="primary" appearance="fill"
  icon={<Folder size={10} color={theme.colors.secondaryGreen} />}>
  LA Avenue 37 D
</Tag>

<Tag color="destructive" appearance="fill"
  icon={<Trash2 size={10} color={theme.colors.alertRed} />}>
  Deleted Task
</Tag>`}
        >
          <Box flexDirection="row" flexWrap="wrap" gap="sm" padding="md">
            <Tag color="primary" appearance="fill"
              icon={<Folder size={10} color={theme.colors.secondaryGreen} />}>
              LA Avenue 37 D
            </Tag>
            <Tag color="primary" appearance="fill"
              icon={<User size={10} color={theme.colors.secondaryGreen} />}>
              James Hammer
            </Tag>
            <Tag color="destructive" appearance="fill"
              icon={<Trash2 size={10} color={theme.colors.alertRed} />}>
              Deleted Task
            </Tag>
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
