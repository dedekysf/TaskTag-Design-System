import { Button } from '@/components/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';


export default function CardScreen() {
    const totalItems = 2;

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Card Component" totalItems={totalItems} itemLabel="variants" />

                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">
                        Basic Card
                    </Text>
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
                </Box>

                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">
                        Action Card
                    </Text>
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
                </Box>
            </Box>
        </ScrollView>
    );
}
