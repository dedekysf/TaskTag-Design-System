import { Card, CardContent, CardHeader } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView, View } from 'react-native';

const WebTypeCard = ({ label, description, variant, customStyle }: { label: string, description: string, variant: any, customStyle?: any }) => (
    <Card minWidth={300} gap="0">
        <CardHeader marginBottom="md">
            <Text variant={variant} style={customStyle}>{label}</Text>
        </CardHeader>
        <CardContent>
            <Text variant="webMetadataPrimary" color="textSecondary" style={{ opacity: 0.7 }}>{description}</Text>
        </CardContent>
    </Card>
);



export default function TypographyWebScreen() {
    const totalItems = 12; // Static count based on rendered items

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Typography (Web)" totalItems={totalItems} itemLabel="items" />

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
                    {/* Row 1 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Heading"
                            description="32px / Semibold / 36px"
                            variant="webHeading32"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Heading"
                            description="22px / Semibold / 32px"
                            variant="webHeading22"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Large Label"
                            description="18px / Medium / 24px"
                            variant="webLargeLabel"
                        />
                    </View>

                    {/* Row 2 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Label / emphasized body"
                            description="16px / Semibold / 24px"
                            variant="webLabelEmphasized"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Button"
                            description="16px / Medium / 24px"
                            variant="webButton"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Label small"
                            description="14px / Medium / 16px"
                            variant="webLabelSmall"
                        />
                    </View>

                    {/* Row 3 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Body"
                            description="16px / Regular / 24px"
                            variant="webBody"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Link"
                            description="14px / Regular / 16px / Underline"
                            variant="webLink"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Secondary body"
                            description="14px / Regular / 16px"
                            variant="webSecondaryBody"
                        />
                    </View>

                    {/* Row 4 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Metadata Primary"
                            description="12px / Regular / 16px"
                            variant="webMetadataPrimary"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <WebTypeCard
                            label="Metadata Secondary"
                            description="10px / Medium / 12px"
                            variant="webMetadataSecondary"
                        />
                    </View>
                    {/* Empty 3rd column filler if needed, or just let it flow */}
                </View>
            </Box>
        </ScrollView>
    );
}
