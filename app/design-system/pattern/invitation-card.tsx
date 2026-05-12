import { Button } from '@/components/Button';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Clock, Hammer, MapPin } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

function ProjectInvitationCard() {
  const theme = useTheme<Theme>();
  return (
    <Box backgroundColor="card" borderRadius="xl" padding="24" paddingTop="32">
      {/* Greeting */}
      <Box marginBottom="24">
        <Text variant="h2" style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>Hi Oscar 👋,</Text>
        <Text variant="webLargeLabel" style={{ color: theme.colors.textSecondary }}>
          <Text variant="webLargeLabel" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>James Hammer</Text>
          {' has invited you to join a project on Tasktag.'}
        </Text>
      </Box>

      {/* Project Identity */}
      <Box backgroundColor="grey02" borderRadius="xl" padding="md" gap="md" marginBottom="24" borderWidth={1} borderColor="grey03">
        <Text variant="webHeading22" color="foreground">Raintree Hollow Court Renovation</Text>
        <Box height={1} backgroundColor="grey03" />
        <Box gap="sm">
          <Box flexDirection="row" alignItems="center" gap="md">
            <Box width={120}><Text variant="webBody" color="grey05">Address</Text></Box>
            <Text variant="webBody" color="foreground">11 N Raintree Hollow Court</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="md">
            <Box width={120}><Text variant="webBody" color="grey05">Team Name</Text></Box>
            <Text variant="webBody" color="foreground">Aquaworks Construction</Text>
          </Box>
        </Box>
        <Box height={1} backgroundColor="grey03" />
        <Text variant="webBody" style={{ color: theme.colors.textSecondary }}>
          {"You'll join as a "}
          <Text variant="webBody" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>Member</Text>
          {' with 12 other people.'}
        </Text>
      </Box>

      {/* CTA */}
      <Box marginBottom="8">
        <Button variant="fill" size="xl" style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '400', color: '#fff' }}>Accept & Join Project</Text>
        </Button>
      </Box>

      {/* Expiry */}
      <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
        <Clock size={14} color={theme.colors.foreground} />
        <Text variant="webSecondaryBody" style={{ color: theme.colors.foreground }}>This invite expires in 7 days</Text>
      </Box>
    </Box>
  );
}

function TaskInvitationCard() {
  const theme = useTheme<Theme>();
  return (
    <Box backgroundColor="card" borderRadius="xl" padding="24" paddingTop="32">
      {/* Greeting */}
      <Box marginBottom="24">
        <Text variant="h2" style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>Hi Oscar 👋,</Text>
        <Text variant="webLargeLabel" style={{ color: theme.colors.textSecondary }}>
          <Text variant="webLargeLabel" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>James Hammer</Text>
          {' has assigned you a new task on Tasktag.'}
        </Text>
      </Box>

      {/* Task Identity */}
      <Box backgroundColor="grey02" borderRadius="xl" padding="md" gap="md" marginBottom="24" borderWidth={1} borderColor="grey03">
        <Text variant="webHeading22" color="foreground">Deep clean the kitchen appliances</Text>
        <Box height={1} backgroundColor="grey03" />
        <Box gap="sm">
          <Box flexDirection="row" alignItems="center" gap="md">
            <Box width={120}><Text variant="webBody" color="grey05">Project Name</Text></Box>
            <Text variant="webBody" color="foreground">LA Avenue 37 D</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="md">
            <Box width={120}><Text variant="webBody" color="grey05">Due Date</Text></Box>
            <Text variant="webBody" color="foreground">Dec 15 - Dec 20</Text>
          </Box>
        </Box>
        <Box height={1} backgroundColor="grey03" />
        <Text variant="webBody" style={{ color: theme.colors.textSecondary }}>
          {"You'll join as an "}
          <Text variant="webBody" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>Assignee</Text>
          {' with 3 other people.'}
        </Text>
      </Box>

      {/* CTA */}
      <Box marginBottom="8">
        <Button variant="fill" size="xl" style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '400', color: '#fff' }}>Accept & Join Task</Text>
        </Button>
      </Box>

      {/* Expiry */}
      <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
        <Clock size={14} color={theme.colors.foreground} />
        <Text variant="webSecondaryBody" style={{ color: theme.colors.foreground }}>This invite expires in 7 days</Text>
      </Box>
    </Box>
  );
}

export default function InvitationCardScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Invitation Card" totalItems={2} />

        <ComponentSection
          title="Project Invitation"
          githubUrls={[]}
          usageCode={`// Project invitation card used in email invitation flow
// Routes: /prototype/project-invitation-expired-by-email
<Box backgroundColor="card" borderRadius="xl" padding="24" paddingTop="32">
  {/* Greeting */}
  <Box marginBottom="24">
    <Text variant="h2">Hi Oscar 👋,</Text>
    <Text variant="webLargeLabel">
      <Text variant="webLargeLabel" style={{ fontWeight: '600' }}>James Hammer</Text>
      {' has invited you to join a project on Tasktag.'}
    </Text>
  </Box>

  {/* Project info in grey box */}
  <Box backgroundColor="grey02" borderRadius="xl" padding="md" gap="md" marginBottom="24"
    borderWidth={1} borderColor="grey03">
    <Text variant="webHeading22" color="foreground">{PROJECT_DATA.name}</Text>
    <Box height={1} backgroundColor="grey03" />
    {/* label:value rows */}
    <Box gap="sm">
      <Box flexDirection="row" alignItems="center" gap="md">
        <Box width={120}><Text variant="webBody" color="grey05">Address</Text></Box>
        <Text variant="webBody" color="foreground">{PROJECT_DATA.address}</Text>
      </Box>
    </Box>
    <Box height={1} backgroundColor="grey03" />
    <Text variant="webBody">You'll join as a <Text style={{ fontWeight: '600' }}>Member</Text> with 12 others.</Text>
  </Box>

  <Button variant="fill" size="xl" style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen }}>
    Accept & Join Project
  </Button>

  <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
    <Clock size={14} color={theme.colors.foreground} />
    <Text variant="webSecondaryBody">This invite expires in 7 days</Text>
  </Box>
</Box>`}
        >
          <Box style={{ maxWidth: 560 }}>
            <ProjectInvitationCard />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Task Invitation"
          githubUrls={[]}
          usageCode={`// Task invitation card used in email invitation flow
// Routes: /prototype/task-invitation-expired-by-email
<Box backgroundColor="card" borderRadius="xl" padding="24" paddingTop="32">
  <Box marginBottom="24">
    <Text variant="h2">Hi Oscar 👋,</Text>
    <Text variant="webLargeLabel">
      <Text style={{ fontWeight: '600' }}>James Hammer</Text>
      {' has assigned you a new task on Tasktag.'}
    </Text>
  </Box>

  <Box backgroundColor="grey02" borderRadius="xl" padding="md" gap="md" marginBottom="24"
    borderWidth={1} borderColor="grey03">
    <Text variant="webHeading22">{TASK_DATA.title}</Text>
    <Box height={1} backgroundColor="grey03" />
    <Box gap="sm">
      <Box flexDirection="row" gap="md">
        <Box width={120}><Text variant="webBody" color="grey05">Project Name</Text></Box>
        <Text variant="webBody">{TASK_DATA.project}</Text>
      </Box>
      <Box flexDirection="row" gap="md">
        <Box width={120}><Text variant="webBody" color="grey05">Due Date</Text></Box>
        <Text variant="webBody">{TASK_DATA.date}</Text>
      </Box>
    </Box>
    <Box height={1} backgroundColor="grey03" />
    <Text variant="webBody">You'll join as an <Text style={{ fontWeight: '600' }}>Assignee</Text> with 3 others.</Text>
  </Box>

  <Button variant="fill" size="xl" style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen }}>
    Accept & Join Task
  </Button>
</Box>`}
        >
          <Box style={{ maxWidth: 560 }}>
            <TaskInvitationCard />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
