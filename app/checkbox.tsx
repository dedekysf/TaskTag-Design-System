
import { Checkbox } from '@/components/Checkbox';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function CheckboxScreen() {
    const totalItems = 2;

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Checkbox" totalItems={totalItems} itemLabel="variants" />

                {/* Basic */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Basic</Text>
                    <Box flexDirection="row" gap="xl">
                        <Box gap="md" alignItems="flex-start">
                            <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>CIRCULAR</Text>
                            <Checkbox checked={true} variant="circular" />
                            <Checkbox checked={true} variant="circular" />
                        </Box>
                        <Box gap="md" alignItems="flex-start">
                            <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>RECTANGULAR</Text>
                            <Checkbox checked={true} variant="rectangular" />
                            <Checkbox checked={true} variant="rectangular" />
                        </Box>
                    </Box>
                </Box>

                {/* With Label */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">With Label</Text>
                    <Box flexDirection="row" gap="xl">
                        {/* Circular Col */}
                        <Box gap="sm" flex={1}>
                            <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>CIRCULAR</Text>
                            <Checkbox label="Option 1" checked={false} />
                            <Checkbox label="Option 2" checked={true} />
                            <Checkbox label="Option 3" checked={false} />
                        </Box>
                        {/* Rectangular Col */}
                        <Box gap="sm" flex={1}>
                            <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>RECTANGULAR</Text>
                            <Checkbox label="Option 1" variant="rectangular" checked={false} />
                            <Checkbox label="Option 2" variant="rectangular" checked={true} />
                            <Checkbox label="Option 3" variant="rectangular" checked={false} />
                        </Box>
                    </Box>
                </Box>

                {/* States */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">States</Text>

                    {/* Default State */}
                    <Box marginBottom="lg">
                        <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }} marginBottom="md">DEFAULT STATE</Text>
                        <Box flexDirection="row" gap="xl">
                            <Box gap="sm" flex={1}>
                                <Checkbox label="Circular unchecked" checked={false} />
                                <Checkbox label="Circular checked" checked={true} />
                            </Box>
                            <Box gap="sm" flex={1}>
                                <Checkbox label="Rectangular unchecked" variant="rectangular" checked={false} />
                                <Checkbox label="Rectangular checked" variant="rectangular" checked={true} />
                            </Box>
                        </Box>
                    </Box>

                    {/* Disabled State */}
                    <Box>
                        <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }} marginBottom="md">DISABLED STATE</Text>
                        <Box flexDirection="row" gap="xl">
                            <Box gap="sm" flex={1}>
                                <Checkbox label="Circular disabled" disabled checked={false} />
                                <Checkbox label="Circular disabled checked" disabled checked={true} />
                            </Box>
                            <Box gap="sm" flex={1}>
                                <Checkbox label="Rectangular disabled" variant="rectangular" disabled checked={false} />
                                <Checkbox label="Rectangular disabled checked" variant="rectangular" disabled checked={true} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ScrollView>
    );
}
