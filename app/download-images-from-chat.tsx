/**
 * Standalone Chat Screen
 * URL: /download-images-from-chat
 */

import { ChatHeader } from '@/components/ChatHeader';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';


// All images are construction-themed via Unsplash.
// Dimensions encode the original orientation so downloads preserve it.
// Grid thumbnails are cover-cropped to the first-image's ratio for display.
const BASE = 'https://images.unsplash.com';
const MSGS_IMGS = {
  // single square — construction worker overhead view
  sq:  [`${BASE}/photo-1504307651254-35680f356dfd?w=800&h=800&fit=crop&q=80`],
  // single landscape 2:1 — building frame under construction wide shot
  ls:  [`${BASE}/photo-1541888946425-d81bb19240f5?w=1280&h=640&fit=crop&q=80`],
  // single portrait 9:16 — construction tower crane vertical
  pt:  [`${BASE}/photo-1503387762-592deb58ef4e?w=720&h=1280&fit=crop&q=80`],
  // two: landscape first → both cells shown as landscape (vertical stack)
  lp:  [
    `${BASE}/photo-1486325212027-8081e485255e?w=1280&h=640&fit=crop&q=80`, // landscape
    `${BASE}/photo-1590402494682-cd3fb53b1f70?w=1280&h=640&fit=crop&q=80`, // landscape
  ],
  // two: portrait first → both cells shown as portrait (side by side)
  pl:  [
    `${BASE}/photo-1565008447742-97f6f38c985c?w=720&h=1280&fit=crop&q=80`, // portrait
    `${BASE}/photo-1541888946425-d81bb19240f5?w=1280&h=640&fit=crop&q=80`, // landscape (shown as portrait crop)
  ],
  // three: square first → 2×1 top + 1 bottom, all square cells
  three: [
    `${BASE}/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=80`,    // square
    `${BASE}/photo-1504307651254-35680f356dfd?w=1280&h=640&fit=crop&q=80`, // landscape (shown as square crop)
    `${BASE}/photo-1503387762-592deb58ef4e?w=720&h=1280&fit=crop&q=80`,   // portrait (shown as square crop)
  ],
  // six: landscape first → 2×2 grid + 2 hidden, all cells at landscape ratio
  six: [
    `${BASE}/photo-1590402494682-cd3fb53b1f70?w=1280&h=640&fit=crop&q=80`, // landscape
    `${BASE}/photo-1541888946425-d81bb19240f5?w=800&h=800&fit=crop&q=80`,  // square (shown as landscape crop)
    `${BASE}/photo-1486325212027-8081e485255e?w=720&h=1280&fit=crop&q=80`, // portrait (shown as landscape crop)
    `${BASE}/photo-1503387762-592deb58ef4e?w=1280&h=640&fit=crop&q=80`,   // landscape
    `${BASE}/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=80`,    // hidden — +2 overlay
    `${BASE}/photo-1565008447742-97f6f38c985c?w=720&h=1280&fit=crop&q=80`, // hidden — +2 overlay
  ],
};

const MESSAGES = [
  { id: "sq",    sender: "You",          time: "10:00 AM", message: "1. Single Square (1:1)",          images: MSGS_IMGS.sq    },
  { id: "ls",    sender: "dedek yusuf15",time: "10:01 AM", message: "2. Single Landscape (2:1)",       images: MSGS_IMGS.ls    },
  { id: "pt",    sender: "You",          time: "10:02 AM", message: "3. Single Portrait (9:16)",        images: MSGS_IMGS.pt    },
  { id: "2lp",   sender: "dedek yusuf15",time: "10:03 AM", message: "4. Two — Landscape first (vertical stack, both cells landscape ratio)",  images: MSGS_IMGS.lp    },
  { id: "2pl",   sender: "You",          time: "10:04 AM", message: "5. Two — Portrait first (side by side, both cells portrait ratio)",      images: MSGS_IMGS.pl    },
  { id: "3",     sender: "dedek yusuf15",time: "10:05 AM", message: "6. Three — Square first (all cells square ratio)",                       images: MSGS_IMGS.three },
  { id: "6",     sender: "You",          time: "10:06 AM", message: "7. Six — Landscape first (+2 overlay, all cells landscape ratio)",        images: MSGS_IMGS.six   },
];

export default function StandaloneChatScreen() {
  const scrollViewRef = React.useRef<any>(null);

  return (
    <Box flex={1} backgroundColor="grey01" alignItems="center" justifyContent="center">
      {/* Centered Chat Container */}
      <Box
        width={470}
        height="95%"
        backgroundColor="background"
        borderRadius="xl"
        overflow="hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <ChatHeader />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* Date Divider */}
            <Box flexDirection="row" alignItems="center" marginVertical="xl">
              <Box flex={1} height={1} backgroundColor="grey03" />
              <Box marginHorizontal="md">
                <Text style={{ fontSize: 12, color: '#bdbdbd', fontWeight: '600' }}>Today</Text>
              </Box>
              <Box flex={1} height={1} backgroundColor="grey03" />
            </Box>

            {MESSAGES.map((msg) => (
              <ChatMessage
                key={msg.id}
                id={msg.id}
                sender={msg.sender}
                time={msg.time}
                message={msg.message}
                images={msg.images}
              />
            ))}
          </ScrollView>

          <ChatInput />
        </KeyboardAvoidingView>
      </Box>
    </Box>
  );
}
