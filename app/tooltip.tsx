import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Tooltip } from '@/components/Tooltip';
import { Mail, Search, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function TooltipScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Tooltip" totalItems={4} itemLabel="sections" />

                {/* Positions */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Positions</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                        <Tooltip content="Tooltip on top" variant="top">
                            <Button variant="outline" color="primary" size="md">
                                Top
                            </Button>
                        </Tooltip>
                        <Tooltip content="Tooltip on bottom" variant="bottom">
                            <Button variant="outline" color="primary" size="md">
                                Bottom
                            </Button>
                        </Tooltip>
                        <Tooltip content="Tooltip on left" variant="left">
                            <Button variant="outline" color="primary" size="md">
                                Left
                            </Button>
                        </Tooltip>
                        <Tooltip content="Tooltip on right" variant="right">
                            <Button variant="outline" color="primary" size="md">
                                Right
                            </Button>
                        </Tooltip>
                    </View>
                </Box>

                {/* Sizes */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Sizes</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                        <Tooltip content="Small tooltip" size="sm">
                            <Button variant="fill" color="primary" size="md">
                                Small
                            </Button>
                        </Tooltip>
                        <Tooltip content="Medium tooltip" size="md">
                            <Button variant="fill" color="primary" size="md">
                                Medium
                            </Button>
                        </Tooltip>
                        <Tooltip content="Large tooltip with more text" size="lg">
                            <Button variant="fill" color="primary" size="md">
                                Large
                            </Button>
                        </Tooltip>
                    </View>
                </Box>

                {/* Styles */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Styles</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                        <Tooltip content="Default tooltip style" tooltipStyle="default">
                            <Button variant="fill" color="secondary" size="md">
                                Default
                            </Button>
                        </Tooltip>
                        <Tooltip content="Success tooltip style" tooltipStyle="success">
                            <Button variant="fill" color="secondary" size="md">
                                Success
                            </Button>
                        </Tooltip>
                    </View>
                </Box>

                {/* With Icons */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">With Icons</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                        <Tooltip content="User profile information">
                            <Button variant="ghost" color="primary" size="md" isIconOnly>
                                <User size={20} color="#18a87d" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Search for items">
                            <Button variant="ghost" color="primary" size="md" isIconOnly>
                                <Search size={20} color="#18a87d" />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Send email">
                            <Button variant="ghost" color="primary" size="md" isIconOnly>
                                <Mail size={20} color="#18a87d" />
                            </Button>
                        </Tooltip>
                    </View>
                </Box>

            </Box>
        </ScrollView>
    );
}
