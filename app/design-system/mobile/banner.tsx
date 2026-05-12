import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { UserPlus, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type BannerVariant = '1-cta' | '2-cta';

function Banner({
  variant = '1-cta',
  onDismiss,
  onPrimary,
  onSecondary,
}: {
  variant?: BannerVariant;
  onDismiss?: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
}) {
  const theme = useTheme<Theme>();
  return (
    <Box
      style={{
        width: 343, backgroundColor: '#1a1a1a',
        borderRadius: 16, padding: 16, gap: 16,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 25, elevation: 4,
      }}
    >
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            width: 32, height: 32, borderRadius: 16,
            backgroundColor: 'rgba(3,91,96,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <UserPlus size={16} color={theme.colors.secondaryGreen} strokeWidth={2} />
          </View>

          <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' }}>
            Projects Move Faster Together
          </Text>

          {variant === '1-cta' && (
            <Pressable onPress={onDismiss}>
              <X size={20} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            </Pressable>
          )}
        </View>

        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 }}>
          Invite a teammate so you can collaborate and share progress right away.
        </Text>
      </View>

      {variant === '2-cta' ? (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable
            onPress={onSecondary}
            style={{
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
              width: 100, alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>Later</Text>
          </Pressable>
          <Pressable
            onPress={onPrimary}
            style={{
              flex: 1, paddingVertical: 10, borderRadius: 8,
              backgroundColor: theme.colors.secondaryGreen, alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Invite Teammate</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={onPrimary}
          style={{
            paddingVertical: 12, borderRadius: 8,
            backgroundColor: theme.colors.secondaryGreen, alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Invite Teammate</Text>
        </Pressable>
      )}
    </Box>
  );
}

export default function BannerScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Banner" totalItems={2} />

        <ComponentSection
          title="1 CTA (With Dismiss)"
          githubUrls={[]}
          usageCode={`<Banner
  variant="1-cta"
  onDismiss={() => {}}
  onPrimary={() => {}}
/>`}
        >
          <Box padding="md" alignItems="center">
            <Banner variant="1-cta" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="2 CTA"
          githubUrls={[]}
          usageCode={`<Banner
  variant="2-cta"
  onPrimary={() => {}}
  onSecondary={() => {}}
/>`}
        >
          <Box padding="md" alignItems="center">
            <Banner variant="2-cta" />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
