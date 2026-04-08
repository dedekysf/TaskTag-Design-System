import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView } from 'react-native';

export default function BaseDashboardTemplate() {
    const theme = useTheme<Theme>();

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Base Dashboard Layout" totalItems={1} />

                <Text style={{ marginBottom: 24, color: theme.colors.grey05 }}>
                    Struktur *shell* aplikasi utama pasca-login yang digunakan secara universal antar Dashboard Tim, File, atau Task.
                </Text>

                <ComponentSection
                    title="Template Preview"
                    githubUrls={[
                        {
                            label: 'TeamDashboardBase Prototype',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/app/prototype/_shared/TeamDashboardBase.tsx'
                        }
                    ]}
                    usageCode=""
                >
                    <Box 
                        width="100%" 
                        height={500} 
                        flexDirection="row"
                        backgroundColor="white" 
                        borderRadius="xl"
                        borderColor="border"
                        borderWidth={1}
                        style={{ overflow: 'hidden' }}
                    >
                        {/* Mock Sidebar */}
                        <Box width={200} backgroundColor="black" padding="md">
                            <Box height={24} width={100} backgroundColor="grey06" marginBottom="xl" borderRadius="sm" />
                            <Box height={16} width="100%" backgroundColor="grey06" marginBottom="md" borderRadius="sm" />
                            <Box height={16} width="80%" backgroundColor="grey07" marginBottom="md" borderRadius="sm" />
                            <Box height={16} width="90%" backgroundColor="grey07" marginBottom="md" borderRadius="sm" />
                        </Box>

                        {/* Mock Main Content */}
                        <Box flex={1} backgroundColor="grey01">
                            {/* Top Header */}
                            <Box height={64} backgroundColor="white" borderBottomWidth={1} borderBottomColor="border" padding="md" flexDirection="row" justifyContent="flex-end" alignItems="center">
                                <Box height={32} width={32} borderRadius="full" backgroundColor="grey03" />
                            </Box>

                            {/* Scrollable Content Container */}
                            <Box padding="xl" flex={1}>
                                <Box height={32} width={250} backgroundColor="grey03" marginBottom="lg" borderRadius="sm" />
                                
                                <Box flexDirection="row" gap="md" marginBottom="xl">
                                    <Box flex={1} height={100} backgroundColor="white" borderRadius="md" borderWidth={1} borderColor="border" />
                                    <Box flex={1} height={100} backgroundColor="white" borderRadius="md" borderWidth={1} borderColor="border" />
                                    <Box flex={1} height={100} backgroundColor="white" borderRadius="md" borderWidth={1} borderColor="border" />
                                </Box>

                                <Box height={200} width="100%" backgroundColor="white" borderRadius="md" borderWidth={1} borderColor="border" />
                            </Box>
                        </Box>
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
