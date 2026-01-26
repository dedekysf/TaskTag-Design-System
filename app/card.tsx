import { Button } from '@/components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/Card';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';


export default function CardScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Card" totalItems={2} />

        {/* Basic Card */}
        <ComponentSection
          title="Basic"
          githubUrls={[
            {
              label: 'Card',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Card.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to TaskTag</CardTitle>
        <CardDescription>
          Start managing your tasks efficiently.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Text>
          TaskTag helps you organize your team's workflow 
          with specific design system components.
        </Text>
      </CardContent>
    </Card>
  );
}`}
        >
          <Card>
            <CardHeader marginBottom="md">
              <CardTitle>Welcome to TaskTag</CardTitle>
              <CardDescription>
                Start managing your tasks efficiently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text variant="body">
                TaskTag helps you organize your team's workflow with specific design system components.
              </Text>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Action Card */}
        <ComponentSection
          title="With Action"
          githubUrls={[
            {
              label: 'Card',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Card.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Update</CardTitle>
        <CardDescription>
          Your profile information needs review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Text>
          Please review your latest activity and update 
          your contact details to ensure you receive notifications.
        </Text>
      </CardContent>
      <CardFooter>
        <Button size="sm">Update Profile</Button>
      </CardFooter>
    </Card>
  );
}`}
        >
          <Card>
            <CardHeader marginBottom="md">
              <CardTitle>Profile Update</CardTitle>
              <CardDescription>
                Your profile information needs review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text variant="body">
                Please review your latest activity and update your contact details to ensure you receive notifications.
              </Text>
            </CardContent>
            <CardFooter>
              <Button size="sm">Update Profile</Button>
            </CardFooter>
          </Card>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
