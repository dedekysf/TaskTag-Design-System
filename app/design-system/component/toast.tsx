import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

function Toast({ variant, message, onClose }: { variant: 'success' | 'error' | 'info'; message: string; onClose?: () => void }) {
  const theme = useTheme<Theme>();
  const config = {
    success: { bg: theme.colors.lightMint, icon: CheckCircle, color: theme.colors.secondaryGreen, border: theme.colors.secondaryGreen },
    error:   { bg: theme.colors.lightPink, icon: AlertCircle, color: theme.colors.alertRed,      border: theme.colors.alertRed },
    info:    { bg: theme.colors.lightSky,  icon: Info,         color: theme.colors.blue,          border: theme.colors.blue },
  }[variant];
  const Icon = config.icon;
  return (
    <Box
      flexDirection="row" alignItems="center" justifyContent="space-between"
      padding="md" borderRadius="lg" borderWidth={1} gap="sm"
      style={{ backgroundColor: config.bg, borderColor: config.border, maxWidth: 400 }}
    >
      <Box flexDirection="row" alignItems="center" gap="sm" style={{ flex: 1 }}>
        <Icon size={18} color={config.color} />
        <Text variant="webBody" style={{ color: config.color, flex: 1 }}>{message}</Text>
      </Box>
      {onClose && (
        <Pressable onPress={onClose}>
          <X size={16} color={config.color} />
        </Pressable>
      )}
    </Box>
  );
}

function ToastWithProgress({ message }: { message: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row" alignItems="center" gap="sm"
      padding="md" borderRadius="lg" style={{ backgroundColor: theme.colors.foreground, maxWidth: 400 }}
    >
      <CheckCircle size={18} color={theme.colors.secondaryGreen} />
      <Text variant="webBody" color="white" style={{ flex: 1 }}>{message}</Text>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: theme.colors.secondaryGreen, width: '60%' }} />
    </Box>
  );
}

export default function ToastScreen() {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Toast / Snackbar" totalItems={4} />

        <ComponentSection
          title="Success"
          githubUrls={[]}
          usageCode={`<Toast variant="success" message="Changes saved successfully." />`}
        >
          <Box padding="md">
            <Toast variant="success" message="Changes saved successfully." />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Error"
          githubUrls={[]}
          usageCode={`<Toast variant="error" message="Something went wrong. Please try again." />`}
        >
          <Box padding="md">
            <Toast variant="error" message="Something went wrong. Please try again." />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Info"
          githubUrls={[]}
          usageCode={`<Toast variant="info" message="Your invite link has been copied." />`}
        >
          <Box padding="md">
            <Toast variant="info" message="Your invite link has been copied." />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Progress Bar (auto-dismiss)"
          githubUrls={[]}
          usageCode={`<ToastWithProgress message="Invitation resent successfully." />`}
        >
          <Box padding="md">
            <ToastWithProgress message="Invitation resent successfully." />
          </Box>
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
