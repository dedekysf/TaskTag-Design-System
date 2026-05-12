import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ArrowLeft, Download, Hash, MoreHorizontal, Share2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

function ChatImageViewerPreview() {
  const theme = useTheme<Theme>();
  return (
    <Box style={{ backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        flexDirection="row" alignItems="center" justifyContent="space-between"
        style={{ padding: 12, paddingTop: 16 }}
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
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>dedek yusuf15</Text>
            <Text style={{ color: '#888', fontSize: 11 }}>Dec 14, 2025 · 10:28 AM</Text>
          </Box>
        </Box>
        <Box flexDirection="row" gap="md">
          <Pressable><Hash size={18} color="#fff" /></Pressable>
          <Pressable><Share2 size={18} color="#fff" /></Pressable>
          <Pressable><Download size={18} color="#fff" /></Pressable>
          <Pressable><MoreHorizontal size={18} color="#fff" /></Pressable>
        </Box>
      </Box>

      {/* Image area placeholder */}
      <Box style={{ height: 200, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center', marginHorizontal: 0 }}>
        <Text style={{ color: '#555', fontSize: 13 }}>Image Preview</Text>
      </Box>

      {/* Thumbnail strip */}
      <Box flexDirection="row" gap="xs" style={{ padding: 12 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            style={{
              width: 52, height: 52, borderRadius: 6,
              backgroundColor: i === 0 ? '#444' : '#222',
              borderWidth: i === 0 ? 2 : 0,
              borderColor: theme.colors.secondaryGreen,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function ChatImageViewerScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Image Viewer" totalItems={1} />

        <ComponentSection
          title="Full-Screen Viewer"
          githubUrls={[{ label: 'ChatImageViewer', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatImageViewer.tsx' }]}
          usageCode={`import { ChatImageViewer } from '@/components/ChatImageViewer';

<ChatImageViewer
  images={[imageUri1, imageUri2, imageUri3]}
  initialIndex={0}
  sender="dedek yusuf15"
  time="10:28 AM"
  visible={viewerVisible}
  onClose={() => setViewerVisible(false)}
  projectName="Raintree Hollow Renovation"
  taskName="Inspect Floor 2 Plumbing"
/>`}
        >
          <ChatImageViewerPreview />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
