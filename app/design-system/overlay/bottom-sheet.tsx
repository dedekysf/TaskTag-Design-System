import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { CheckCircle, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

function BottomSheetDemo({ triggerLabel, title, description, confirmLabel }: {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
}) {
  const theme = useTheme<Theme>();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={{ backgroundColor: theme.colors.foreground, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12, alignSelf: 'flex-start' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>{triggerLabel}</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <View style={{ width: 40, height: 4, backgroundColor: theme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

            {/* Close */}
            <Pressable
              onPress={() => setVisible(false)}
              style={{ position: 'absolute', top: 20, right: 20, padding: 4 }}
            >
              <X size={20} color={theme.colors.grey05} />
            </Pressable>

            {/* Icon */}
            <Box
              width={56} height={56} borderRadius="full"
              style={{ backgroundColor: theme.colors.lightMint, marginBottom: 16 }}
              alignItems="center" justifyContent="center"
            >
              <CheckCircle size={28} color={theme.colors.secondaryGreen} />
            </Box>

            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.foreground, marginBottom: 8 }}>
              {title}
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 28 }}>
              {description}
            </Text>

            <Pressable
              onPress={() => setVisible(false)}
              style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>{confirmLabel}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default function BottomSheetScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Bottom Sheet" totalItems={2} />

        <ComponentSection
          title="Success State"
          githubUrls={[]}
          usageCode={`<Modal visible={visible} transparent animationType="slide">
  <Pressable
    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
    onPress={() => setVisible(false)}
  >
    <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
      {/* Drag handle */}
      <View style={{ width: 40, height: 4, backgroundColor: theme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

      {/* Success icon */}
      <Box width={56} height={56} borderRadius="full"
        style={{ backgroundColor: theme.colors.lightMint, marginBottom: 16 }}
        alignItems="center" justifyContent="center">
        <CheckCircle size={28} color={theme.colors.secondaryGreen} />
      </Box>

      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Request Sent</Text>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 28 }}>
        Your request has been sent to the admin. You will receive a notification once approved.
      </Text>

      <Pressable
        onPress={() => setVisible(false)}
        style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Got It</Text>
      </Pressable>
    </View>
  </Pressable>
</Modal>`}
        >
          <BottomSheetDemo
            triggerLabel="Show Success Sheet"
            title="Request Sent"
            description="Your request has been sent to the admin. You will receive a notification once approved."
            confirmLabel="Got It"
          />
        </ComponentSection>

        <ComponentSection
          title="Confirmation State"
          githubUrls={[]}
          usageCode={`<Modal visible={visible} transparent animationType="slide">
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
    <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
      <View style={{ width: 40, height: 4, backgroundColor: theme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Invitation Accepted</Text>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 28 }}>
        You have joined the project. Head to the app to get started.
      </Text>
      <Pressable
        onPress={() => setVisible(false)}
        style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 12, paddingVertical: 16, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Open App</Text>
      </Pressable>
    </View>
  </View>
</Modal>`}
        >
          <BottomSheetDemo
            triggerLabel="Show Confirmation Sheet"
            title="Invitation Accepted"
            description="You have joined the project. Head to the app to get started."
            confirmLabel="Open App"
          />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
