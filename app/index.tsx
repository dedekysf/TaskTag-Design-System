import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import React from 'react';
import { Linking, Platform, Pressable, ScrollView } from 'react-native';

interface PrototypeCardProps {
  item: {
    title: string;
    jiraTicket: string;
    jiraLabel: string;
    route: string;
  };
  theme: Theme;
}

function PrototypeCard({ item, theme }: PrototypeCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => router.push(item.route as any)}
      style={{
        width: Platform.OS === 'web' ? 320 : '100%',
      }}
    >
      <Box
        minHeight={160}
        borderWidth={1}
        borderColor={isHovered ? "primary" : "border"}
        borderRadius="lg"
        padding="lg"
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
          onPress={() => router.push(item.route as any)}
          // Explicitly pass hover to the button to trigger card's hover state if bubbling fails
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

  const prototypes = [
    {
      title: 'Design System',
      jiraTicket: '',
      jiraLabel: '',
      route: '/design-system'
    },
    {
      title: 'Thumbnail and Preview',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-276?atlOrigin=eyJpIjoiNGU5N2UzZjVkNDJhNGZlZmI1NzJhY2MzNGMyYzg4ODMiLCJwIjoiaiJ9',
      jiraLabel: 'TD-276',
      route: '/prototype/thumbnail-and-preview'
    },
    {
      title: 'Join Project Non User',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-302?atlOrigin=eyJpIjoiNTk4MTIzZDUxOGVmNDYxN2IyOGNmZTkzYTQzOGQ2MjAiLCJwIjoiaiJ9',
      jiraLabel: 'TD-302',
      route: '/prototype/join-project-non-user'
    },
    {
      title: 'Join Project TT User',
      jiraTicket: 'https://tasktag-design.atlassian.net/browse/TD-302?atlOrigin=eyJpIjoiNTk4MTIzZDUxOGVmNDYxN2IyOGNmZTkzYTQzOGQ2MjAiLCJwIjoiaiJ9',
      jiraLabel: 'TD-302',
      route: '/prototype/join-project-tt-user'
    }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Box padding="xl" paddingBottom="80">
        <Text variant="webHeading22" marginBottom="xl">Prototypes Design</Text>

        <Box 
          flexDirection="row" 
          flexWrap="wrap" 
          gap="lg"
        >
          {prototypes.map((item, index) => (
            <PrototypeCard key={index} item={item} theme={theme} />
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
