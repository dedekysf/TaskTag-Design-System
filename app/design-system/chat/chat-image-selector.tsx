import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ArrowLeft, CheckSquare, Download, Forward } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

function ChatImageSelectorPreview() {
  const theme = useTheme<Theme>();
  return (
    <Box style={{ backgroundColor: '#1a1a1a', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        flexDirection="row" alignItems="center" justifyContent="space-between"
        style={{ padding: 16, backgroundColor: '#2a2a2a' }}
      >
        <Box flexDirection="row" alignItems="center" gap="md">
          <Pressable>
            <ArrowLeft size={20} color="#fff" />
          </Pressable>
          <Box
            width={32} height={32} borderRadius="full"
            style={{ backgroundColor: '#f97316' }}
            alignItems="center" justifyContent="center"
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>DY</Text>
          </Box>
          <Box>
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>dedek yusuf15</Text>
            <Text style={{ color: '#aaa', fontSize: 11 }}>Dec 14, 2025</Text>
          </Box>
        </Box>
        <Pressable>
          <Text style={{ color: theme.colors.secondaryGreen, fontSize: 14 }}>Select All</Text>
        </Pressable>
      </Box>

      {/* Image grid placeholder */}
      <Box style={{ padding: 16, gap: 8 }}>
        <Box flexDirection="row" gap="sm">
          {[0, 1].map((i) => (
            <Box key={i} style={{ flex: 1, aspectRatio: 1, backgroundColor: '#333', borderRadius: 8, position: 'relative', alignItems: 'flex-end', padding: 6 }}>
              <View style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#fff', backgroundColor: i === 0 ? theme.colors.secondaryGreen : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {i === 0 && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
              </View>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        flexDirection="row" alignItems="center" justifyContent="space-between"
        style={{ padding: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#333' }}
      >
        <Text style={{ color: '#aaa', fontSize: 13 }}>1 selected</Text>
        <Box flexDirection="row" gap="md">
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Forward size={18} color={theme.colors.secondaryGreen} />
            <Text style={{ color: theme.colors.secondaryGreen, fontSize: 13 }}>Forward</Text>
          </Pressable>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Download size={18} color={theme.colors.secondaryGreen} />
            <Text style={{ color: theme.colors.secondaryGreen, fontSize: 13 }}>Download</Text>
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}

export default function ChatImageSelectorScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Image Selector" totalItems={1} />

        <ComponentSection
          title="Image Selector Modal"
          githubUrls={[{ label: 'ChatImageSelector', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatImageSelector.tsx' }]}
          usageCode={`import { ChatImageSelector } from '@/components/ChatImageSelector';

// Opened from ChatImageViewer when multiple images are present
<ChatImageSelector
  images={[imageUri1, imageUri2, imageUri3]}
  sender="dedek yusuf15"
  date="Dec 14, 2025"
  visible={selectorVisible}
  onClose={() => setSelectorVisible(false)}
/>`}
        >
          <ChatImageSelectorPreview />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
