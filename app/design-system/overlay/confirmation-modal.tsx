import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

function ConfirmationModalPreview({ title, description, confirmLabel, variant }: {
  title: string;
  description: string;
  confirmLabel: string;
  variant: 'danger' | 'default';
}) {
  const theme = useTheme<Theme>();
  const [visible, setVisible] = useState(false);
  const confirmBg = variant === 'danger' ? theme.colors.alertRed : theme.colors.foreground;

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={{ backgroundColor: variant === 'danger' ? theme.colors.alertRed : theme.colors.foreground, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12, alignSelf: 'flex-start' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>{title}</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, maxWidth: '90%' }}
            onPress={(e) => e.stopPropagation()}
          >
            {variant === 'danger' && (
              <Box
                width={48} height={48} borderRadius="full"
                style={{ backgroundColor: theme.colors.lightPink, marginBottom: 16 }}
                alignItems="center" justifyContent="center"
              >
                <Trash2 size={22} color={theme.colors.alertRed} />
              </Box>
            )}
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.foreground, marginBottom: 8 }}>
              {title}
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 24 }}>
              {description}
            </Text>
            <Box flexDirection="row" gap="sm">
              <Pressable
                onPress={() => setVisible(false)}
                style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.grey03, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '600', color: theme.colors.foreground }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => setVisible(false)}
                style={{ flex: 1, backgroundColor: confirmBg, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '600', color: '#fff' }}>{confirmLabel}</Text>
              </Pressable>
            </Box>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default function ConfirmationModalScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Confirmation Modal" totalItems={2} />

        <ComponentSection
          title="Danger — Delete"
          githubUrls={[]}
          usageCode={`<Modal visible={visible} transparent animationType="fade">
  <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320 }}>
      {/* Icon */}
      <Box width={48} height={48} borderRadius="full" style={{ backgroundColor: theme.colors.lightPink, marginBottom: 16 }}
        alignItems="center" justifyContent="center">
        <Trash2 size={22} color={theme.colors.alertRed} />
      </Box>

      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Delete Message?</Text>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 24 }}>
        This action cannot be undone. The message will be permanently removed.
      </Text>

      {/* Actions */}
      <Box flexDirection="row" gap="sm">
        <Pressable style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.grey03, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontWeight: '600' }}>Cancel</Text>
        </Pressable>
        <Pressable style={{ flex: 1, backgroundColor: theme.colors.alertRed, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', color: '#fff' }}>Delete</Text>
        </Pressable>
      </Box>
    </View>
  </Pressable>
</Modal>`}
        >
          <ConfirmationModalPreview
            title="Delete Message"
            description="This action cannot be undone. The message will be permanently removed."
            confirmLabel="Delete"
            variant="danger"
          />
        </ComponentSection>

        <ComponentSection
          title="Default — Confirm Action"
          githubUrls={[]}
          usageCode={`<Modal visible={visible} transparent animationType="fade">
  <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Confirm Action?</Text>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 24 }}>
        Are you sure you want to proceed with this action?
      </Text>

      <Box flexDirection="row" gap="sm">
        <Pressable style={{ flex: 1, borderWidth: 1, borderColor: theme.colors.grey03, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontWeight: '600' }}>Cancel</Text>
        </Pressable>
        <Pressable style={{ flex: 1, backgroundColor: theme.colors.foreground, borderRadius: 8, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontWeight: '600', color: '#fff' }}>Confirm</Text>
        </Pressable>
      </Box>
    </View>
  </Pressable>
</Modal>`}
        >
          <ConfirmationModalPreview
            title="Confirm Action"
            description="Are you sure you want to proceed with this action?"
            confirmLabel="Confirm"
            variant="default"
          />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
