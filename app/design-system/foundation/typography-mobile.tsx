import { Card, CardContent, CardHeader } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView, View } from 'react-native';

const MobileTypeCard = ({ label, description, variant, customStyle }: { label: string, description: string, variant: any, customStyle?: any }) => (
    <Card minWidth={300} gap="0">
        <CardHeader marginBottom="md">
            <Text variant={variant} style={customStyle}>{label}</Text>
        </CardHeader>
        <CardContent>
            <Text variant="mobileMetadataPrimary" color="textSecondary" style={{ opacity: 0.7 }}>{description}</Text>
        </CardContent>
    </Card>
);


export default function TypographyMobileScreen() {
    const totalItems = 11; // Static count

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Typography (Mobile)" totalItems={totalItems} itemLabel="items" />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24 }}>
                    {/* Row 1 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Heading"
                            description="28px / Semibold / 32px"
                            variant="mobileHeading28"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Heading"
                            description="22px / Semibold / 32px"
                            variant="mobileHeading22"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Large Label"
                            description="18px / Medium / 24px"
                            variant="mobileLargeLabel"
                        />
                    </View>

                    {/* Row 2 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Label / emphasized body"
                            description="16px / Semibold / 21px"
                            variant="mobileLabelEmphasized"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Button"
                            description="16px / Regular / 21px"
                            variant="mobileButton"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Label small"
                            description="14px / Medium / 16px"
                            variant="mobileLabelSmall"
                        />
                    </View>

                    {/* Row 3 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Body"
                            description="16px / Regular / 21px"
                            variant="mobileBody"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Link"
                            description="14px / Regular / 16px / Underline"
                            variant="mobileLink"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Secondary body"
                            description="14px / Regular / 16px / 0.28px"
                            variant="mobileSecondaryBody"
                        />
                    </View>

                    {/* Row 4 */}
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Metadata Primary"
                            description="12px / Regular / 16px"
                            variant="mobileMetadataPrimary"
                        />
                    </View>
                    <View style={{ width: '31%', minWidth: 300 }}>
                        <MobileTypeCard
                            label="Metadata Secondary"
                            description="10px / Medium / 12px"
                            variant="mobileMetadataSecondary"
                        />
                    </View>
                </View>
            </Box>
        </ScrollView>
    );
}
