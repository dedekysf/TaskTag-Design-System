import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Linking, Platform, Pressable, ScrollView, useWindowDimensions } from 'react-native';

type PlatformFilter = 'All Device' | 'Web' | 'Mobile';

interface PrototypeCardProps {
  item: {
    title: string;
    jiraTicket: string;
    jiraLabel: string;
    route: string;
    platform?: 'Web' | 'Mobile';
    platforms?: ('Web' | 'Mobile')[];
  };
  theme: Theme;
}

function PrototypeCard({ item, theme }: PrototypeCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => {
        if (Platform.OS === 'web') {
          window.open(item.route, '_blank');
        } else {
          router.push(item.route as any);
        }
      }}
      style={{
        width: '100%',
        flex: 1,
      }}
    >
      <Box
        flex={1}
        minHeight={200}
        borderWidth={1}
        borderColor={isHovered ? "primary" : "border"}
        borderRadius="lg"
        padding="md"
        backgroundColor="card"
        justifyContent="space-between"
        style={{
          transition: 'all 0.2s ease-in-out',
          ...(isHovered ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 30,
            elevation: 12,
            transform: [{ translateY: -6 }, { scale: 1.01 }]
          } : {})
        } as any}
      >
        <Box>
          {(() => {
            const chips = item.platforms ?? (item.platform ? [item.platform] : ['Web']);
            return (
              <Box flexDirection="row" style={{ gap: 6, marginBottom: 16 } as any}>
                {chips.map(p => (
                  <Box
                    key={p}
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      borderWidth: 0,
                      borderRadius: 100,
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                      backgroundColor: p === 'Mobile' ? theme.colors.lightCream : theme.colors.lightMint,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary, textTransform: 'uppercase' }}>{p}</Text>
                  </Box>
                ))}
              </Box>
            );
          })()}
          <Text variant="webLabelEmphasized" marginBottom="sm">{item.title}</Text>

          {item.jiraLabel ? (
            <Text
              variant="webSecondaryBody"
              color="blue"
              marginBottom="lg"
              style={{ textDecorationLine: 'underline' }}
              onPress={(e) => {
                e.stopPropagation();
                Linking.openURL(item.jiraTicket);
              }}
            >
              Jira Ticket ({item.jiraLabel})
            </Text>
          ) : null}
        </Box>

        <Button
          variant="outline"
          color="secondary"
          size="xs"
          style={{ width: '100%' }}
          onPress={() => {
            if (Platform.OS === 'web') {
              window.open(item.route, '_blank');
            } else {
              router.push(item.route as any);
            }
          }}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
        >
          View
        </Button>
      </Box>
    </Pressable>
  );
}

export default function PrototypeIndex() {
  const theme = useTheme<Theme>();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = React.useState<PlatformFilter>('All Device');
  const [search, setSearch] = React.useState('');

  const colWidth = width > 1440 ? '20%' : width > 768 ? '25%' : width > 480 ? '50%' : '100%';

  const prototypes = [
    {
      title: 'Join Task Non User',
      jiraTicket: '',
      jiraLabel: '',
      route: '/prototype/join-task-non-user',
      platform: 'Web' as const,
    },
    {
      title: 'Invite from Contact',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-308?atlOrigin=eyJpIjoiMzY2YTM4MTE5YzFhNGE4MDhhYjRmNjU0NTVkMzU1ZGIiLCJwIjoiaiJ9',
      jiraLabel: 'TD-308',
      route: '/prototype/m-invite-from-contact',
      platform: 'Mobile' as const
    },
    {
      title: 'Global Activity Paywalled Free Tier',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-306?atlOrigin=eyJpIjoiZDFlODYwZTM2YTRmNGM2NGJiZWE1NzRiNThkMmQzNmYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-306',
      route: '/prototype/global-activity-log-paywalled',
      platform: 'Web' as const
    },
    {
      title: 'Global Activity Paywalled Free Tier',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-306?atlOrigin=eyJpIjoiZDFlODYwZTM2YTRmNGM2NGJiZWE1NzRiNThkMmQzNmYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-306',
      route: '/prototype/m-global-activity-log-paywalled',
      platform: 'Mobile' as const
    },
    {
      title: 'Join Project Non User',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-304?atlOrigin=eyJpIjoiOTI4NjRmN2ZlMzk0NDAwNDgwMWFiMWZmNjkzYWNjMzYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-304',
      route: '/prototype/m-join-project-non-user',
      platform: 'Mobile' as const
    },
    {
      title: 'Join Project TT User',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-304?atlOrigin=eyJpIjoiOTI4NjRmN2ZlMzk0NDAwNDgwMWFiMWZmNjkzYWNjMzYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-304',
      route: '/prototype/m-join-project-tt-user',
      platform: 'Mobile' as const
    },
    {
      title: 'Join Project Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-304?atlOrigin=eyJpIjoiOTI4NjRmN2ZlMzk0NDAwNDgwMWFiMWZmNjkzYWNjMzYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-304',
      route: '/prototype/m-join-project-non-user-by-link',
      platform: 'Mobile' as const
    },
    {
      title: 'Join Project Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-303?atlOrigin=eyJpIjoiZDE1Yzk1MzExNDhjNGEwZWEwZTk0YjE3NTk2NGRmZGQiLCJwIjoiaiJ9',
      jiraLabel: 'TD-303',
      route: '/prototype/join-project-non-user-by-link',
      platform: 'Web' as const
    },
    {
      title: 'Join Project Non User',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-302?atlOrigin=eyJpIjoiNTk4MTIzZDUxOGVmNDYxN2IyOGNmZTkzYTQzOGQ2MjAiLCJwIjoiaiJ9',
      jiraLabel: 'TD-302',
      route: '/prototype/join-project-non-user',
      platform: 'Web' as const
    },
    {
      title: 'Join Project TT User',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-302?atlOrigin=eyJpIjoiNTk4MTIzZDUxOGVmNDYxN2IyOGNmZTkzYTQzOGQ2MjAiLCJwIjoiaiJ9',
      jiraLabel: 'TD-302',
      route: '/prototype/join-project-tt-user',
      platform: 'Web' as const
    },
    {
      title: 'Thumbnail and Preview',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-276?atlOrigin=eyJpIjoiNGU5N2UzZjVkNDJhNGZlZmI1NzJhY2MzNGMyYzg4ODMiLCJwIjoiaiJ9',
      jiraLabel: 'TD-276',
      route: '/prototype/thumbnail-and-preview'
    },
    {
      title: 'Design System',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-256?atlOrigin=eyJpIjoiNmFkM2Q4YzY4OThhNGMyOGE2MjRhMWZmMTUzZjhhNTciLCJwIjoiaiJ9',
      jiraLabel: 'TD-256',
      route: '/design-system',
      platforms: ['Web', 'Mobile'] as ('Web' | 'Mobile')[],
    },
  ];

  const designSystem = prototypes.find(p => p.title === 'Design System')!;
  const rest = prototypes.filter(p => p.title !== 'Design System');

  const filtered = [designSystem, ...rest].filter(item => {
    const matchTab = activeTab === 'All Device' || item.title === 'Design System' || (item.platform ?? 'Web') === activeTab;
    const matchSearch = search.trim() === '' || item.title.toLowerCase().includes(search.toLowerCase()) || item.jiraLabel.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs: PlatformFilter[] = ['All Device', 'Web', 'Mobile'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Box padding="xl" paddingBottom="80">
        <Text variant="webLargeLabel" marginBottom="xl">Prototypes Design</Text>

        {/* Tabs */}
        <Box flexDirection="row" alignItems="center" style={{ gap: 8, marginBottom: 12 } as any}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <Pressable key={tab} onPress={() => setActiveTab(tab)}>
                <Box
                  paddingHorizontal="16"
                  paddingVertical="8"
                  borderRadius="xl"
                  style={{
                    backgroundColor: isActive ? theme.colors.secondaryGreen : theme.colors.grey01,
                    borderWidth: 1,
                    borderColor: isActive ? theme.colors.secondaryGreen : theme.colors.border,
                  } as any}
                >
                  <Text
                    variant="webLabelSmall"
                    style={{ color: isActive ? '#fff' : theme.colors.textPrimary }}
                  >
                    {tab}
                  </Text>
                </Box>
              </Pressable>
            );
          })}
        </Box>

        {/* Search */}
        <Box style={{ marginBottom: 12 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search..."
            icon={Search}
            size="sm"
            showClearButton={false}
          />
        </Box>

        <Box flexDirection="row" flexWrap="wrap" style={{ margin: -4 } as any}>
          {filtered.map((item, index) => (
            <Box key={index} style={{ width: Platform.OS === 'web' ? colWidth : '100%', padding: 4, display: 'flex', flexDirection: 'column' } as any}>
              <PrototypeCard item={item} theme={theme} />
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
