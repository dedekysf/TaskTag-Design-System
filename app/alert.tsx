import { Alert } from '@/components/Alert';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function AlertScreen() {
    const totalItems = 4;

    const variants = [
        { label: 'WARNING', type: 'warning' },
        { label: 'INFO', type: 'info' },
        { label: 'SUCCESS', type: 'success' },
        { label: 'ERROR', type: 'error' },
    ] as const;

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Alert" totalItems={totalItems} itemLabel="variants" />

                {/* Alert Variants Section */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Alert Variants</Text>

                    {variants.map((v) => (
                        <Box key={v.type} marginBottom="lg">
                            <Text
                                variant="label"
                                marginBottom="sm"
                                style={{ textTransform: 'uppercase', color: '#828282' }}
                            >
                                {v.label}
                            </Text>
                            <Alert
                                variant={v.type}
                                title={`${v.label.charAt(0) + v.label.slice(1).toLowerCase()} Alert Title`}
                                description={`This is a ${v.type} alert message. It provides important information to the user.`}
                                buttonText="Action"
                                onButtonClick={() => console.log(`${v.type} alert button clicked`)}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Alert Without Button Section */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Alert Without Button</Text>

                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            INFO - NO BUTTON
                        </Text>
                        <Alert
                            variant="info"
                            title="Information"
                            description="This alert doesn't have an action button. It's just informational."
                        />
                    </Box>

                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            SUCCESS - NO BUTTON
                        </Text>
                        <Alert
                            variant="success"
                            title="Success!"
                            description="Your changes have been saved successfully."
                        />
                    </Box>
                </Box>

                {/* Real World Example */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Real World Example</Text>

                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            TEAM PLAN EXPIRED
                        </Text>
                        <Alert
                            variant="warning"
                            title="Access to Team Plan for TaskTag Project has ended"
                            description="Your access ended on September 17, 2025. Upgrade to a Team plan to use advanced project features."
                            buttonText="Upgrade Now"
                            onButtonClick={() => console.log('Upgrade clicked')}
                        />
                    </Box>

                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            STORAGE LIMIT
                        </Text>
                        <Alert
                            variant="error"
                            title="Storage limit exceeded"
                            description="You've used 100% of your storage. Delete some files or upgrade your plan to continue."
                            buttonText="Manage Storage"
                            onButtonClick={() => console.log('Manage storage clicked')}
                        />
                    </Box>

                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            NEW FEATURE
                        </Text>
                        <Alert
                            variant="info"
                            title="New feature available"
                            description="Check out our new collaboration tools to work better with your team."
                            buttonText="Learn More"
                            onButtonClick={() => console.log('Learn more clicked')}
                        />
                    </Box>
                </Box>

            </Box>
        </ScrollView>
    );
}
