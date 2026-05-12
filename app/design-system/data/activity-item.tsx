import { Avatar } from '@/components/Avatar';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { CheckCircle, Folder, Image, Trash2, UserPlus } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

type ActivityIcon = 'check' | 'delete' | 'folder' | 'user-plus' | 'image';

function ActivityItem({
  userName,
  time,
  action,
  icon,
  tags,
}: {
  userName: string;
  time: string;
  action: string;
  icon: ActivityIcon;
  tags?: { label: string; type: 'folder' | 'task' | 'task-done' }[];
}) {
  const theme = useTheme<Theme>();

  const IconMap: Record<ActivityIcon, React.ComponentType<any>> = {
    check: CheckCircle,
    delete: Trash2,
    folder: Folder,
    'user-plus': UserPlus,
    image: Image,
  };

  const IconBgMap: Record<ActivityIcon, string> = {
    check: theme.colors.lightMint,
    delete: theme.colors.lightPink,
    folder: theme.colors.lightSky,
    'user-plus': theme.colors.lightMint,
    image: theme.colors.lightSky,
  };

  const IconColorMap: Record<ActivityIcon, string> = {
    check: theme.colors.secondaryGreen,
    delete: theme.colors.alertRed,
    folder: theme.colors.blue,
    'user-plus': theme.colors.secondaryGreen,
    image: theme.colors.blue,
  };

  const IconComp = IconMap[icon];

  return (
    <Box
      flexDirection="row" gap="md" paddingVertical="md" paddingHorizontal="md"
      borderBottomWidth={1} borderBottomColor="border"
    >
      <Box style={{ position: 'relative' }}>
        <Avatar type="text" initials={userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()} color="pastelBlue" size="sm" />
        <View style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 16, height: 16, borderRadius: 8,
          backgroundColor: IconBgMap[icon],
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 1, borderColor: '#fff',
        }}>
          <IconComp size={9} color={IconColorMap[icon]} />
        </View>
      </Box>
      <Box flex={1}>
        <Box flexDirection="row" alignItems="center" gap="xs" flexWrap="wrap" style={{ marginBottom: 4 }}>
          <Text variant="webBody" color="foreground" style={{ fontWeight: '600' }}>{userName}</Text>
          <Text variant="webMetadataPrimary" color="grey05">{time}</Text>
        </Box>
        <Text variant="webSecondaryBody" color="textSecondary" style={{ marginBottom: tags ? 6 : 0 }}>{action}</Text>
        {tags && (
          <Box flexDirection="row" flexWrap="wrap" gap="xs">
            {tags.map((tag, i) => (
              <Box
                key={i}
                style={{
                  borderRadius: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  backgroundColor:
                    tag.type === 'folder' ? theme.colors.lightMint
                    : tag.type === 'task-done' ? theme.colors.grey02
                    : theme.colors.foreground,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: tag.type === 'folder' ? theme.colors.secondaryGreen
                      : tag.type === 'task-done' ? theme.colors.grey05
                      : '#fff',
                    textDecorationLine: tag.type === 'task-done' ? 'line-through' : 'none',
                  }}
                >
                  {tag.label}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function DateDivider({ label }: { label: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      paddingVertical="xs" paddingHorizontal="md"
      style={{ backgroundColor: theme.colors.grey02 }}
    >
      <Text variant="webMetadataPrimary" color="grey05">{label}</Text>
    </Box>
  );
}

export default function ActivityItemScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Activity Item" totalItems={2} />

        <ComponentSection
          title="Activity Log"
          githubUrls={[]}
          usageCode={`// Date divider
<Box paddingVertical="xs" paddingHorizontal="md" style={{ backgroundColor: theme.colors.grey02 }}>
  <Text variant="webMetadataPrimary" color="grey05">Today</Text>
</Box>

// Activity item
<Box flexDirection="row" gap="md" paddingVertical="md" paddingHorizontal="md" borderBottomWidth={1} borderBottomColor="border">
  {/* Avatar with icon badge */}
  <View style={{ position: 'relative' }}>
    <Avatar type="text" initials="JH" color="pastelBlue" size="sm" />
    <View style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8,
      backgroundColor: theme.colors.lightMint, alignItems: 'center', justifyContent: 'center' }}>
      <CheckCircle size={9} color={theme.colors.secondaryGreen} />
    </View>
  </View>

  <Box flex={1}>
    <Box flexDirection="row" gap="xs" style={{ marginBottom: 4 }}>
      <Text variant="webBody" color="foreground" style={{ fontWeight: '600' }}>James Hammer</Text>
      <Text variant="webMetadataPrimary" color="grey05">2 hours ago</Text>
    </Box>
    <Text variant="webSecondaryBody" color="textSecondary">Marked a task as completed</Text>

    {/* Tags */}
    <Box flexDirection="row" flexWrap="wrap" gap="xs" style={{ marginTop: 6 }}>
      <Box style={{ borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: theme.colors.foreground }}>
        <Text style={{ fontSize: 12, color: '#fff' }}>Clean the kitchen</Text>
      </Box>
      <Box style={{ borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: theme.colors.lightMint }}>
        <Text style={{ fontSize: 12, color: theme.colors.secondaryGreen }}>LA Avenue 37 D</Text>
      </Box>
    </Box>
  </Box>
</Box>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <DateDivider label="Today" />
            <ActivityItem
              userName="James Hammer"
              time="2 hours ago"
              action="Marked a task as completed"
              icon="check"
              tags={[
                { label: 'Clean the kitchen', type: 'task' },
                { label: 'LA Avenue 37 D', type: 'folder' },
              ]}
            />
            <ActivityItem
              userName="Sarah Mills"
              time="5 hours ago"
              action="Deleted a task"
              icon="delete"
              tags={[
                { label: 'Fix leaking pipe', type: 'task-done' },
              ]}
            />
            <DateDivider label="Yesterday" />
            <ActivityItem
              userName="Tom Clark"
              time="1 day ago"
              action="Added you to a project"
              icon="user-plus"
              tags={[
                { label: 'Raintree Hollow Renovation', type: 'folder' },
              ]}
            />
            <ActivityItem
              userName="Lisa Park"
              time="1 day ago"
              action="Uploaded photos"
              icon="image"
              tags={[
                { label: 'Floor 2 Inspection', type: 'task' },
              ]}
            />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Single Item"
          githubUrls={[]}
          usageCode={`<ActivityItem
  userName="James Hammer"
  time="2 hours ago"
  action="Marked a task as completed"
  icon="check"
  tags={[
    { label: 'Clean the kitchen', type: 'task' },
    { label: 'LA Avenue 37 D', type: 'folder' },
  ]}
/>`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <ActivityItem
              userName="James Hammer"
              time="2 hours ago"
              action="Marked a task as completed"
              icon="check"
              tags={[
                { label: 'Clean the kitchen', type: 'task' },
                { label: 'LA Avenue 37 D', type: 'folder' },
              ]}
            />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
