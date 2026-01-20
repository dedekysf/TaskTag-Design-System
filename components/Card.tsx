
import { Theme } from '@/constants/theme';
import { BoxProps, TextProps } from '@shopify/restyle';
import React from 'react';
import { Box, Text } from './primitives';

// Card
export type CardProps = React.ComponentProps<typeof Box> & { children?: React.ReactNode };
export function Card({ children, ...props }: CardProps) {
    return (
        <Box
            backgroundColor="card"
            borderRadius="xl"
            borderWidth={1}
            borderColor="border"
            flexDirection="column"
            gap="24"
            {...props}
        >
            {children}
        </Box>
    );
}

// CardHeader
export type CardHeaderProps = BoxProps<Theme> & { children?: React.ReactNode };
export function CardHeader({ children, ...props }: CardHeaderProps) {
    return (
        <Box
            paddingHorizontal="24"
            paddingTop="24"
            flexDirection="column"
            gap="4"
            {...props}
        >
            {children}
        </Box>
    );
}

// CardTitle
export type CardTitleProps = TextProps<Theme> & { children?: React.ReactNode };
export function CardTitle({ children, ...props }: CardTitleProps) {
    return (
        <Text
            variant="h4"
            {...props}
        >
            {children}
        </Text>
    );
}

// CardDescription
export type CardDescriptionProps = TextProps<Theme> & { children?: React.ReactNode };
export function CardDescription({ children, ...props }: CardDescriptionProps) {
    return (
        <Text
            variant="body"
            color="mutedForeground"
            {...props}
        >
            {children}
        </Text>
    );
}

// CardAction
export type CardActionProps = BoxProps<Theme> & { children?: React.ReactNode };
export function CardAction({ children, ...props }: CardActionProps) {
    return (
        <Box
            position="absolute"
            right={24}
            top={24}
            {...props}
        >
            {children}
        </Box>
    );
}

// CardContent
export type CardContentProps = BoxProps<Theme> & { children?: React.ReactNode };
export function CardContent({ children, ...props }: CardContentProps) {
    return (
        <Box
            paddingHorizontal="24"
            paddingBottom="24"
            {...props}
        >
            {children}
        </Box>
    );
}

// CardFooter
export type CardFooterProps = BoxProps<Theme> & { children?: React.ReactNode };
export function CardFooter({ children, ...props }: CardFooterProps) {
    return (
        <Box
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="24"
            paddingBottom="24"
            {...props}
        >
            {children}
        </Box>
    );
}
