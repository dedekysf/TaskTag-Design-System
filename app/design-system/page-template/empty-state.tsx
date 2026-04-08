import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ScrollView } from 'react-native';

export default function EmptyStateTemplate() {
    const theme = useTheme<Theme>();

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Empty State & Fallbacks" totalItems={1} />

                <Text style={{ marginBottom: 24, color: theme.colors.grey05 }}>
                    Template halaman umpan balik tunggal yang secara terpusat menyajikan ilustrasi peringatan, teks penjelas, dan tombol aksi "kembali".
                </Text>

                <ComponentSection
                    title="Template Preview"
                    githubUrls={[
                        {
                            label: 'InvitationExpired Prototype',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/app/prototype/team-invitation-expired-by-email/invitation-expired.tsx'
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
                        {/* Mock Header */}
                        <Box height={64} borderBottomWidth={1} borderBottomColor="border" padding="md" flexDirection="row" alignItems="center">
                            <Box height={24} width={100} backgroundColor="grey03" borderRadius="sm" />
                        </Box>

                        {/* Mock Content */}
                        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                            <Box alignItems="center" maxWidth={400} width="100%">
                                {/* Mock Illustration */}
                                <Box height={180} width={220} backgroundColor="grey02" borderRadius="lg" marginBottom="xl" />
                                
                                <Box height={28} width={250} backgroundColor="grey04" marginBottom="sm" borderRadius="sm" />
                                <Box height={16} width={300} backgroundColor="grey03" marginBottom="xl" borderRadius="sm" />
                                
                                <Box height={44} width={200} backgroundColor="primary" borderRadius="md" />
                            </Box>
                        </ScrollView>
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
