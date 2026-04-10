import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

const SCREENS = [
  {
    title: 'Request to Join Team',
    description: 'Send a request to join the team as a TaskTag user',
    route: '/prototype/m-join-team-tt-user-by-link/link',
  },
  {
    title: 'Team Detail',
    description: 'View team info after opening an invite link',
    route: '/prototype/m-join-team-tt-user-by-link/team-detail',
  },
];

function ScreenCard({ title, description, route, theme }: { title: string; description: string; route: string; theme: Theme }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => router.push(route as any)}
      style={{ width: '100%' }}
    >
      <Box
        backgroundColor="card"
        borderWidth={1}
        borderColor={hovered ? 'primary' : 'border'}
        borderRadius="lg"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="20"
        paddingVertical="20"
        gap="16"
        style={{
          transition: 'all 0.15s ease-in-out',
          ...(hovered ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 4,
            transform: [{ translateY: -2 }],
          } : {}),
        } as any}
      >
        <Box flex={1} gap="4">
          <Text variant="webLabelEmphasized" color="foreground">{title}</Text>
          <Text variant="webMetadataPrimary" color="textSecondary">{description}</Text>
        </Box>
        <ChevronRight size={18} color={theme.colors.grey04} />
      </Box>
    </Pressable>
  );
}

export default function MJoinTeamTTUserByLinkIndex() {
  const theme = useTheme<Theme>();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Box width="100%" maxWidth={480} gap="xl">

        {/* Headline */}
        <Box gap="8">
          <Text variant="webHeading22" color="foreground">
            Team Detail Update Design
          </Text>
          <Text variant="webMetadataPrimary" color="textSecondary">
            This feature affects when users view the team details page or request to join. Please access each card below.
          </Text>
        </Box>

        {/* Cards */}
        <Box gap="12">
          {SCREENS.map((s) => (
            <ScreenCard key={s.route} {...s} theme={theme} />
          ))}
        </Box>

      </Box>
    </ScrollView>
  );
}
