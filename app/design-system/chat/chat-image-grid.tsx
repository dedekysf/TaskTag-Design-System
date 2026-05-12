import { ChatImageGrid } from '@/components/ChatImageGrid';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

const SAMPLE_IMAGES = [
  require('@/assets/images/sample-one.jpg'),
  require('@/assets/images/sample-two.jpg'),
  require('@/assets/images/sample-three.jpg'),
  require('@/assets/images/sample-four.jpg'),
];

export default function ChatImageGridScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Image Grid" totalItems={4} />

        <ComponentSection
          title="Single Image"
          githubUrls={[{ label: 'ChatImageGrid', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatImageGrid.tsx' }]}
          usageCode={`import { ChatImageGrid } from '@/components/ChatImageGrid';

<ChatImageGrid
  images={[imageUri]}
  sent={false}
  onImagePress={(index) => {}}
/>`}
        >
          <Box style={{ maxWidth: 300 }}>
            <ChatImageGrid
              images={[SAMPLE_IMAGES[0]]}
              sent={false}
              onImagePress={() => {}}
            />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Two Images"
          githubUrls={[{ label: 'ChatImageGrid', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatImageGrid.tsx' }]}
          usageCode={`import { ChatImageGrid } from '@/components/ChatImageGrid';

<ChatImageGrid
  images={[imageUri1, imageUri2]}
  sent={false}
  onImagePress={(index) => {}}
/>`}
        >
          <Box style={{ maxWidth: 300 }}>
            <ChatImageGrid
              images={[SAMPLE_IMAGES[0], SAMPLE_IMAGES[1]]}
              sent={false}
              onImagePress={() => {}}
            />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Three Images"
          githubUrls={[{ label: 'ChatImageGrid', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatImageGrid.tsx' }]}
          usageCode={`import { ChatImageGrid } from '@/components/ChatImageGrid';

<ChatImageGrid
  images={[imageUri1, imageUri2, imageUri3]}
  sent={false}
  onImagePress={(index) => {}}
/>`}
        >
          <Box style={{ maxWidth: 300 }}>
            <ChatImageGrid
              images={[SAMPLE_IMAGES[0], SAMPLE_IMAGES[1], SAMPLE_IMAGES[2]]}
              sent={false}
              onImagePress={() => {}}
            />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Four or More (Grid + Overlay)"
          githubUrls={[{ label: 'ChatImageGrid', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatImageGrid.tsx' }]}
          usageCode={`import { ChatImageGrid } from '@/components/ChatImageGrid';

// 4+ images: shows 2x2 grid with "+N" overlay on last tile
<ChatImageGrid
  images={[imageUri1, imageUri2, imageUri3, imageUri4]}
  sent={false}
  onImagePress={(index) => {}}
/>`}
        >
          <Box style={{ maxWidth: 300 }}>
            <ChatImageGrid
              images={SAMPLE_IMAGES}
              sent={false}
              onImagePress={() => {}}
            />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
