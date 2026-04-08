import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView, View, Image } from 'react-native';

export default function AuthLandingTemplate() {
    const theme = useTheme<Theme>();

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Auth & Invitation Landing" totalItems={1} />

                <Text style={{ marginBottom: 24, color: theme.colors.grey05 }}>
                    Blueprint standar untuk halaman penerimaan undangan untuk user Non-TaskTag, atau halaman public-facing yang berpusat (centered).
                </Text>

                <ComponentSection
                    title="Template Preview"
                    githubUrls={[
                        {
                            label: 'JoinTeamNonUser Prototype',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/app/prototype/join-team-non-user/index.tsx'
                        }
                    ]}
                    usageCode=""
                >
                    {/* Miniature Preview of the Template */}
                    <Box 
                        width="100%" 
                        height={600} 
                        backgroundColor="grey02" 
                        borderRadius="xl"
                        borderColor="border"
                        borderWidth={1}
                        style={{ overflow: 'hidden' }}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 32 }}>
                            <Box width="100%" maxWidth={400}>
                                {/* Mock Logo */}
                                <Box height={32} backgroundColor="grey03" width={120} alignSelf="center" marginBottom="xl" borderRadius="sm" />
                                
                                {/* Mock Main Card */}
                                <Box backgroundColor="card" borderRadius="xl" padding="xl" marginBottom="xl">
                                    <Box height={24} width={150} backgroundColor="grey02" marginBottom="sm" borderRadius="sm" />
                                    <Box height={16} width={250} backgroundColor="grey02" marginBottom="xl" borderRadius="sm" />
                                    
                                    <Box backgroundColor="grey01" padding="lg" borderRadius="lg" marginBottom="xl" alignItems="center">
                                        <Box height={40} width={40} borderRadius="full" backgroundColor="grey03" marginBottom="sm" />
                                        <Box height={16} width={100} backgroundColor="grey03" borderRadius="sm" />
                                    </Box>

                                    <Box height={48} width="100%" backgroundColor="primary" borderRadius="md" marginBottom="sm" />
                                    <Box height={12} width={180} alignSelf="center" backgroundColor="grey02" borderRadius="sm" />
                                </Box>

                                {/* Mock Download App */}
                                <Box alignItems="center" marginBottom="xl" opacity={0.5}>
                                    <Box height={20} width={150} backgroundColor="grey03" marginBottom="sm" borderRadius="sm" />
                                    <Box flexDirection="row" gap="md">
                                        <Box width={120} height={40} backgroundColor="grey03" borderRadius="sm" />
                                        <Box width={120} height={40} backgroundColor="grey03" borderRadius="sm" />
                                    </Box>
                                </Box>
                            </Box>
                        </ScrollView>
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
