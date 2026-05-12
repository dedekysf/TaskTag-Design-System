import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal as RNModal, Pressable, ScrollView, View } from 'react-native';

type ModalVariant = 'one-action' | 'two-action';
type ModalSize = 'web' | 'mobile';

function ModalDialog({
  variant,
  size = 'web',
  title,
  description,
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
  onClose,
}: {
  variant: ModalVariant;
  size?: ModalSize;
  title: string;
  description?: string;
  primaryText: string;
  secondaryText?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onClose?: () => void;
}) {
  const theme = useTheme<Theme>();
  const isMobile = size === 'mobile';

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 16,
      padding: 24, paddingTop: 16,
      shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 8,
      minWidth: isMobile ? 328 : 400, maxWidth: isMobile ? 340 : 480,
      gap: 16,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.foreground }}>
          {title}
        </Text>
        {!isMobile && onClose && (
          <Pressable onPress={onClose} style={{ padding: 4 }}>
            <X size={20} color={theme.colors.foreground} strokeWidth={2} />
          </Pressable>
        )}
      </View>

      {description && (
        <Text style={{ fontSize: 13, color: theme.colors.foreground, lineHeight: 20 }}>
          {description}
        </Text>
      )}

      {isMobile ? (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
          {secondaryText && (
            <Pressable onPress={onSecondary}
              style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ fontSize: 14, color: theme.colors.foreground }}>
                {secondaryText}
              </Text>
            </Pressable>
          )}
          <Pressable onPress={onPrimary}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>
              {primaryText}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
          {variant === 'two-action' && secondaryText && (
            <Pressable onPress={onSecondary}
              style={{
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
                borderWidth: 1, borderColor: theme.colors.grey03,
              }}>
              <Text style={{ fontSize: 14, color: theme.colors.foreground }}>
                {secondaryText}
              </Text>
            </Pressable>
          )}
          <Pressable onPress={onPrimary}
            style={{
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
              backgroundColor: theme.colors.foreground,
            }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>
              {primaryText}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function ModalDemo({ variant, size }: { variant: ModalVariant; size?: ModalSize }) {
  const theme = useTheme<Theme>();
  const [visible, setVisible] = useState(false);
  return (
    <Box padding="md">
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
          backgroundColor: theme.colors.foreground, alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Open Modal</Text>
      </Pressable>

      <RNModal visible={visible} transparent animationType="fade">
        <Pressable
          onPress={() => setVisible(false)}
          style={{
            flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <ModalDialog
              variant={variant}
              size={size}
              title="Confirm Action"
              description="Are you sure you want to proceed? This action will update your settings."
              primaryText={variant === 'two-action' ? 'Confirm' : 'Got it'}
              secondaryText={variant === 'two-action' ? 'Cancel' : undefined}
              onPrimary={() => setVisible(false)}
              onSecondary={() => setVisible(false)}
              onClose={() => setVisible(false)}
            />
          </Pressable>
        </Pressable>
      </RNModal>
    </Box>
  );
}

export default function ModalScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Modal" totalItems={3} />

        <ComponentSection
          title="One Action (Web)"
          githubUrls={[]}
          usageCode={`<Modal
  variant="one-action"
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  primaryText="Got it"
  onPrimary={() => setVisible(false)}
  onClose={() => setVisible(false)}
/>`}
        >
          <ModalDemo variant="one-action" />
        </ComponentSection>

        <ComponentSection
          title="Two Action (Web)"
          githubUrls={[]}
          usageCode={`<Modal
  variant="two-action"
  title="Confirm Action"
  primaryText="Confirm"
  secondaryText="Cancel"
  onPrimary={() => setVisible(false)}
  onSecondary={() => setVisible(false)}
/>`}
        >
          <ModalDemo variant="two-action" />
        </ComponentSection>

        <ComponentSection
          title="Mobile Style"
          githubUrls={[]}
          usageCode={`<Modal
  variant="two-action"
  size="mobile"
  title="Confirm Action"
  primaryText="Confirm"
  secondaryText="Cancel"
/>`}
        >
          <ModalDemo variant="two-action" size="mobile" />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
