import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView } from 'react-native';

export default function ListTableTemplate() {
    const theme = useTheme<Theme>();

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="List & Table View" totalItems={1} />

                <Text style={{ marginBottom: 24, color: theme.colors.grey05 }}>
                    Format layout standar untuk mendata banyak baris, dilengkapi dengan area judul (*title*), filter *toolbar*, penamaan *Header* kolom, dan daftar panjang (berulang).
                </Text>

                <ComponentSection
                    title="Template Preview"
                    githubUrls={[
                        {
                            label: 'TeamListScreen Prototype',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/app/prototype/team-list/index.tsx'
                        }
                    ]}
                    usageCode=""
                >
                    <Box 
                        width="100%" 
                        height={500} 
                        backgroundColor="white" 
                        borderRadius="xl"
                        borderColor="border"
                        borderWidth={1}
                        style={{ overflow: 'hidden' }}
                    >
                        {/* Mock Title Header */}
                        <Box padding="xl" borderBottomWidth={1} borderBottomColor="border" flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Box height={24} width={150} backgroundColor="grey04" marginBottom="sm" borderRadius="sm" />
                                <Box height={16} width={200} backgroundColor="grey03" borderRadius="sm" />
                            </Box>
                            <Box flexDirection="row" gap="md">
                                <Box height={36} width={80} backgroundColor="grey02" borderRadius="sm" borderWidth={1} borderColor="border" />
                                <Box height={36} width={120} backgroundColor="primary" borderRadius="sm" />
                            </Box>
                        </Box>

                        {/* Mock Search Toolbar */}
                        <Box paddingHorizontal="xl" paddingVertical="md">
                            <Box height={40} backgroundColor="grey01" borderRadius="md" width="100%" />
                        </Box>

                        {/* Mock Web Table Header */}
                        <Box paddingHorizontal="xl" paddingVertical="sm" borderBottomWidth={1} borderBottomColor="border" backgroundColor="grey01" flexDirection="row">
                            <Box flex={3} height={16} backgroundColor="grey03" borderRadius="sm" marginRight="md" />
                            <Box flex={1} height={16} backgroundColor="grey03" borderRadius="sm" marginRight="md" />
                            <Box flex={1} height={16} backgroundColor="grey03" borderRadius="sm" marginRight="md" />
                            <Box width={48} />
                        </Box>

                        {/* Mock List Rows */}
                        <ScrollView>
                            {[1, 2, 3, 4].map((i) => (
                                <Box key={i} paddingHorizontal="xl" paddingVertical="md" borderBottomWidth={1} borderBottomColor="border" flexDirection="row" alignItems="center">
                                    <Box flex={3} flexDirection="row" alignItems="center" gap="md">
                                        <Box height={40} width={40} borderRadius="full" backgroundColor="grey03" />
                                        <Box>
                                            <Box height={16} width={120} backgroundColor="grey04" marginBottom="xs" borderRadius="sm" />
                                            <Box height={12} width={180} backgroundColor="grey03" borderRadius="sm" />
                                        </Box>
                                    </Box>
                                    <Box flex={1}>
                                        <Box height={24} width={80} backgroundColor="grey02" borderRadius="sm" />
                                    </Box>
                                    <Box flex={1}>
                                        <Box height={24} width={60} backgroundColor="lightMint" borderRadius="full" />
                                    </Box>
                                    <Box width={48} alignItems="center">
                                        <Box height={24} width={24} backgroundColor="grey03" borderRadius="sm" />
                                    </Box>
                                </Box>
                            ))}
                        </ScrollView>
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
