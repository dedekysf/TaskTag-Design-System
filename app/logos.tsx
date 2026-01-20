
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { Image, ScrollView } from 'react-native';


export default function LogosScreen() {
    const totalItems = 3; // 2 local + 1 react logo

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Logos" totalItems={totalItems} />

                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">App Icon</Text>
                    <Box flexDirection="row" gap="lg" flexWrap="wrap">
                        <Box alignItems="center">
                            <Image
                                source={require('@/assets/images/icon.png')}
                                style={{ width: 100, height: 100, borderRadius: 20 }}
                            />
                            <Text variant="label" marginTop="sm">App Icon</Text>
                        </Box>

                        <Box alignItems="center">
                            <Image
                                source={require('@/assets/images/splash-icon.png')}
                                style={{ width: 100, height: 100, resizeMode: 'contain' }}
                            />
                            <Text variant="label" marginTop="sm">Splash Icon</Text>
                        </Box>
                    </Box>
                </Box>

                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">React Logo</Text>
                    <Box flexDirection="row" gap="lg">
                        <Box alignItems="center">
                            <Image
                                source={require('@/assets/images/react-logo.png')}
                                style={{ width: 100, height: 100, resizeMode: 'contain' }}
                            />
                            <Text variant="label" marginTop="sm">React Logo</Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ScrollView>
    );
}
