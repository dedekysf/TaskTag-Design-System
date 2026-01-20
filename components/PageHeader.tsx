import React from 'react';
import { Box, Text } from './primitives';

interface PageHeaderProps {
    title: string;
    totalItems?: number;
    description?: string;
    itemLabel?: string;
}

export function PageHeader({ title, totalItems, description, itemLabel = 'items' }: PageHeaderProps) {
    return (
        <Box marginBottom="xl">
            <Text variant="webHeading32" marginBottom="xs">
                {title}
            </Text>
            {description ? (
                <Text variant="webLabelSmall" color="grey05">
                    {description}
                </Text>
            ) : totalItems !== undefined ? (
                <Text variant="webLabelSmall" color="grey05">
                    Total: {totalItems} {itemLabel}
                </Text>
            ) : null}
        </Box>
    );
}
