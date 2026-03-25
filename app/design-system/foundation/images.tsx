
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';


export default function ImagesScreen() {
    const totalItems = 5; // 2 Aspect Ratios + 3 Avatar Shapes

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Images" totalItems={totalItems} />
                <Text variant="body" marginBottom="lg">
                    Images can be displayed using the standard React Native `Image` component or `expo-image` for better performance.
                </Text>

                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">Aspect Ratios</Text>
                    <View style={{ gap: 16 }}>
                        <Box>
                            <Text variant="label" marginBottom="sm">Square (1:1)</Text>
                            <Image
                                source={{ uri: 'https://picsum.photos/200' }}
                                style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: '#eee' }}
                            />
                        </Box>

                        <Box>
                            <Text variant="label" marginBottom="sm">Video (16:9)</Text>
                            <Image
                                source={{ uri: 'https://picsum.photos/320/180' }}
                                style={{ width: 320, height: 180, borderRadius: 8, backgroundColor: '#eee' }}
                            />
                        </Box>
                    </View>
                </Box>

                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">Avatar Shapes</Text>
                    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                        <Box alignItems="center">
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/100?img=3' }}
                                style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#eee' }}
                            />
                            <Text variant="caption" marginTop="sm">Circular</Text>
                        </Box>
                        <Box alignItems="center">
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
                                style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: '#eee' }}
                            />
                            <Text variant="caption" marginTop="sm">Rounded</Text>
                        </Box>
                        <Box alignItems="center">
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/100?img=8' }}
                                style={{ width: 64, height: 64, borderRadius: 0, backgroundColor: '#eee' }}
                            />
                            <Text variant="caption" marginTop="sm">Square</Text>
                        </Box>
                    </View>
                </Box>
            </Box>
        </ScrollView>
    );
}
