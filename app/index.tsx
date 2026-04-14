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
      title: 'Email - Team Request Approved',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-315?atlOrigin=eyJpIjoiZDg2YTRkNmY0NWYzNDljNjliY2Y5MWEyNzc5MjZjNWIiLCJwIjoiaiJ9',
      jiraLabel: 'TD-315',
      route: '/prototype/m-join-team-non-user-by-link/email-approval',
      platform: 'Mobile' as const,
    },
    {
      title: 'Join Team Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-313?atlOrigin=eyJpIjoiOTE5ZjIyZDAwN2E2NDBkYThiNWNmYTQ1ODc5N2FlOTYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-313',
      route: '/prototype/m-join-team-non-user-by-link',
      platform: 'Mobile' as const,
    },
    {
      title: 'Join Team Non User by Email',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-311?atlOrigin=eyJpIjoiNTg5NWM2OTNlYTU2NDkxYWEzNGZjYzk3MGMzOWZkMTUiLCJwIjoiaiJ9',
      jiraLabel: 'TD-311',
      route: '/prototype/m-join-team-non-user',
      platform: 'Mobile' as const,
    },
    {
      title: 'Email - Team Request Approved',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-315?atlOrigin=eyJpIjoiZDg2YTRkNmY0NWYzNDljNjliY2Y5MWEyNzc5MjZjNWIiLCJwIjoiaiJ9',
      jiraLabel: 'TD-315',
      route: '/prototype/join-team-non-user-by-link/email-approval',
      platform: 'Web' as const,
    },
    {
      title: 'Join Team Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-313?atlOrigin=eyJpIjoiOTE5ZjIyZDAwN2E2NDBkYThiNWNmYTQ1ODc5N2FlOTYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-313',
      route: '/prototype/join-team-non-user-by-link',
      platform: 'Web' as const,
    },
    {
      title: 'Join Team Non User by Email',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-311?atlOrigin=eyJpIjoiNTg5NWM2OTNlYTU2NDkxYWEzNGZjYzk3MGMzOWZkMTUiLCJwIjoiaiJ9',
      jiraLabel: 'TD-311',
      route: '/prototype/join-team-non-user',
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
      title: 'Email - Project Request Approved',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-314?atlOrigin=eyJpIjoiMzcyY2EyNmNjZmNjNDMyM2FmYmI0ZmQwNzJjMGNhZGEiLCJwIjoiaiJ9',
      jiraLabel: 'TD-314',
      route: '/prototype/m-join-project-non-user-by-link/email-approval',
      platform: 'Mobile' as const,
    },
    {
      title: 'Join Project Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-304?atlOrigin=eyJpIjoiOTI4NjRmN2ZlMzk0NDAwNDgwMWFiMWZmNjkzYWNjMzYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-304',
      route: '/prototype/m-join-project-non-user-by-link',
      platform: 'Mobile' as const
    },
    {
      title: 'Join Project Non User by Email',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-304?atlOrigin=eyJpIjoiOTI4NjRmN2ZlMzk0NDAwNDgwMWFiMWZmNjkzYWNjMzYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-304',
      route: '/prototype/m-join-project-non-user',
      platform: 'Mobile' as const
    },
    {
      title: 'Email - Project Request Approved',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-314?atlOrigin=eyJpIjoiMzcyY2EyNmNjZmNjNDMyM2FmYmI0ZmQwNzJjMGNhZGEiLCJwIjoiaiJ9',
      jiraLabel: 'TD-314',
      route: '/prototype/join-project-non-user-by-link/email-approval',
      platform: 'Web' as const,
    },
    {
      title: 'Join Project Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-303?atlOrigin=eyJpIjoiZDE1Yzk1MzExNDhjNGEwZWEwZTk0YjE3NTk2NGRmZGQiLCJwIjoiaiJ9',
      jiraLabel: 'TD-303',
      route: '/prototype/join-project-non-user-by-link',
      platform: 'Web' as const
    },
    {
      title: 'Join Project Non User by Email',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-302?atlOrigin=eyJpIjoiNTk4MTIzZDUxOGVmNDYxN2IyOGNmZTkzYTQzOGQ2MjAiLCJwIjoiaiJ9',
      jiraLabel: 'TD-302',
      route: '/prototype/join-project-non-user',
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
    // {
    //   title: 'Join Task Non User by Email',
    //   jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-334?atlOrigin=eyJpIjoiMDVjN2RlMGE4MjYyNDQyNGE3NDkzMzBmZDJjYzhiNWYiLCJwIjoiaiJ9',
    //   jiraLabel: 'TD-334',
    //   route: '/prototype/join-task-non-user',
    //   platform: 'Web' as const,
    // },
    {
      title: 'Join Task Non User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-335?atlOrigin=eyJpIjoiYjYxNDA2OWMzZjllNGM5ZGEwM2QyNjQxZTZlZWQwYmEiLCJwIjoiaiJ9',
      jiraLabel: 'TD-335',
      route: '/prototype/m-join-task-non-user-by-link',
      platform: 'Mobile' as const,
    },
    {
      title: 'Email - Task Request Approved',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-336?atlOrigin=eyJpIjoiYzA5N2RiYTNiYzc4NDc1N2JhZWVmODc1NDBhOTA1ZmUiLCJwIjoiaiJ9',
      jiraLabel: 'TD-336',
      route: '/prototype/join-task-non-user-by-link/email-approval',
      platform: 'Web' as const,
    },
    {
      title: 'Invite Members During Team Creation',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-320?atlOrigin=eyJpIjoiZGRiNmNlMmYyMzc1NDE2Mjg3ZDQ2ZjkwYTcyNjNlNjYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-320',
      route: '/prototype/create-team',
      platform: 'Web' as const,
    },
    {
      title: 'Remove Member Discoverable on Active Member',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-323?atlOrigin=eyJpIjoiNjVjMjI1YzZiYWU0NDhhMDhiNmJkM2FhOGYzMmZhOGMiLCJwIjoiaiJ9',
      jiraLabel: 'TD-323',
      route: '/prototype/team-detail',
      platform: 'Web' as const,
    },
    {
      title: 'Role Descriptions and Naming Consistency',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-322?atlOrigin=eyJpIjoiZjg4ZWI2MzA2ZWZmNDg3MGFhNjExOTk1NWU5MThjM2YiLCJwIjoiaiJ9',
      jiraLabel: 'TD-322',
      route: '/prototype/team-detail',
      platform: 'Web' as const,
    },
    {
      title: 'Email - Task Request Approved',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-336?atlOrigin=eyJpIjoiYzA5N2RiYTNiYzc4NDc1N2JhZWVmODc1NDBhOTA1ZmUiLCJwIjoiaiJ9',
      jiraLabel: 'TD-336',
      route: '/prototype/m-join-task-non-user-by-link/email-approval',
      platform: 'Mobile' as const,
    },
    {
      title: 'Team Invitation Expired by Email',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-318?atlOrigin=eyJpIjoiYWI2MjBmYTY2ODRlNDI5NDkzYTE5ZmIyNDVjOTk2ZGIiLCJwIjoiaiJ9',
      jiraLabel: 'TD-318',
      route: '/prototype/m-team-invitation-expired-by-email',
      platform: 'Mobile' as const,
    },
    {
      title: 'Team Invitation Expired by Email',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-318?atlOrigin=eyJpIjoiYWI2MjBmYTY2ODRlNDI5NDkzYTE5ZmIyNDVjOTk2ZGIiLCJwIjoiaiJ9',
      jiraLabel: 'TD-318',
      route: '/prototype/team-invitation-expired-by-email',
      platform: 'Web' as const,
    },
    {
      title: 'Tab Update Team Detail',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-321?atlOrigin=eyJpIjoiNzc1MmViYjVjMjYwNDIxODkzZDhjODRhNmVmZTViY2IiLCJwIjoiaiJ9',
      jiraLabel: 'TD-321',
      route: '/prototype/tab-update-team-detail',
      platform: 'Web' as const,
    },
    {
      title: 'Join Team TT User by Link',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-337?atlOrigin=eyJpIjoiMGQwMDFhZjdkZWEyNDUxYjlkYTk0ZjA1NDIxN2UxNmYiLCJwIjoiaiJ9',
      jiraLabel: 'TD-337',
      route: '/prototype/m-join-team-tt-user-by-link',
      platform: 'Mobile' as const,
    },
  ];

  const PINNED_TITLES = ['GitHub', 'Design System'];

  const github = {
    title: 'GitHub',
    jiraTicket: '',
    jiraLabel: '',
    route: 'https://github.com/dedekysf/TaskTag-Design-System/tree/main/app/prototype',
    platforms: ['Web', 'Mobile'] as ('Web' | 'Mobile')[],
  };
  const designSystem = prototypes.find(p => p.title === 'Design System')!;
  const joinTaskNonUser = prototypes.find(p => p.title === 'Join Task Non User by Email' && p.platform === 'Web')!;
  const emailTaskApprovalWeb = prototypes.find(p => p.title === 'Email - Task Request Approved' && p.platform === 'Web')!;
  const inviteDuringCreation = prototypes.find(p => p.title === 'Invite Members During Team Creation')!;
  const removeMember = prototypes.find(p => p.title === 'Remove Member Discoverable on Active Member')!;
  const teamDetail = prototypes.find(p => p.title === 'Role Descriptions and Naming Consistency')!;
  const tabUpdateTeamDetail = prototypes.find(p => p.title === 'Tab Update Team Detail')!;
  const emailTaskApprovalMobile = prototypes.find(p => p.title === 'Email - Task Request Approved' && p.platform === 'Mobile');
  const joinTaskByLinkMobile = prototypes.find(p => p.title === 'Join Task Non User by Link' && p.platform === 'Mobile');
  const joinTeamTTUser = prototypes.find(p => p.title === 'Join Team TT User by Link');
  const expiredNonUsers = prototypes.filter(p => p.title === 'Team Invitation Expired by Email');
  const rest = prototypes.filter(p => 
    !PINNED_TITLES.includes(p.title) && 
    p.title !== 'Team Invitation Expired by Email' && 
    p.title !== 'Role Descriptions and Naming Consistency' && 
    p.title !== 'Remove Member Discoverable on Active Member' &&
    p.title !== 'Join Task Non User by Email' &&
    p.title !== 'Email - Task Request Approved' &&
    p.title !== 'Invite Members During Team Creation' &&
    p.title !== 'Tab Update Team Detail' &&
    p.title !== 'Join Team TT User by Link' &&
    p.title !== 'Join Task Non User by Link'
  );

  const rawFiltered = [github, designSystem, emailTaskApprovalWeb, tabUpdateTeamDetail, inviteDuringCreation, removeMember, teamDetail, joinTaskByLinkMobile, emailTaskApprovalMobile, joinTeamTTUser, ...expiredNonUsers, ...rest].filter(Boolean) as typeof prototypes;

  const filtered = rawFiltered.filter(item => {
    const matchTab = activeTab === 'All Device' || PINNED_TITLES.includes(item.title) || ('platform' in item ? item.platform : 'Web') === activeTab;
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
