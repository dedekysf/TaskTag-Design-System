/**
 * Standalone Chat Screen
 * URL: /download-images-from-chat
 *
 * Covers all acceptance criteria from the "Image thumbnail layout — chat messages" spec:
 *   ✓ Single portrait  → 3:4 container, max 280px
 *   ✓ Single square    → 1:1 container, max 280px
 *   ✓ Single landscape → 16:9 container, max 360px
 *   ✓ 2 portrait-first → side by side, portrait cells
 *   ✓ 2 landscape-first → stacked vertically, landscape cells
 *   ✓ 3 portrait-first  → hero-left (55%) + 2 stacked right
 *   ✓ 3 square-first    → hero-top (1:1) + 2 side by side below
 *   ✓ 3 landscape-first → hero-top (16:9) + 2 side by side below
 *   ✓ 4 images          → 2×2 square grid, no overlay
 *   ✓ 6 images          → 2×2 grid + +3 overlay on cell 4 (N = 6 − 3)
 */

import { ChatHeader } from '@/components/ChatHeader';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

const BASE = 'https://images.unsplash.com';

// ── Image pools by orientation ───────────────────────────────────────────────
const IMG = {
  // portrait (9:16)
  pt1: `${BASE}/photo-1503387762-592deb58ef4e?w=720&h=1280&fit=crop&q=80`,
  pt2: `${BASE}/photo-1565008447742-97f6f38c985c?w=720&h=1280&fit=crop&q=80`,
  pt3: `${BASE}/photo-1590402494682-cd3fb53b1f70?w=720&h=1280&fit=crop&q=80`,
  // square (1:1)
  sq1: `${BASE}/photo-1504307651254-35680f356dfd?w=800&h=800&fit=crop&q=80`,
  sq2: `${BASE}/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=80`,
  sq3: `${BASE}/photo-1541888946425-d81bb19240f5?w=800&h=800&fit=crop&q=80`,
  // landscape (16:9)
  ls1: `${BASE}/photo-1541888946425-d81bb19240f5?w=1280&h=720&fit=crop&q=80`,
  ls2: `${BASE}/photo-1486325212027-8081e485255e?w=1280&h=720&fit=crop&q=80`,
  ls3: `${BASE}/photo-1590402494682-cd3fb53b1f70?w=1280&h=720&fit=crop&q=80`,
  ls4: `${BASE}/photo-1558618666-fcd25c85cd64?w=1280&h=720&fit=crop&q=80`,
};

const MESSAGES = [
  // ── Single images ──────────────────────────────────────────────────────────
  {
    id: '1', sender: 'You', time: '10:00 AM',
    message: '1. Single portrait → 3:4 container, max 280px',
    images: [IMG.pt1],
  },
  {
    id: '2', sender: 'dedek yusuf15', time: '10:01 AM',
    message: '2. Single square → 1:1 container, max 280px',
    images: [IMG.sq1],
  },
  {
    id: '3', sender: 'You', time: '10:02 AM',
    message: '3. Single landscape → 16:9 container, max 360px',
    images: [IMG.ls1],
  },

  // ── Two images ─────────────────────────────────────────────────────────────
  {
    id: '4', sender: 'dedek yusuf15', time: '10:03 AM',
    message: '4. Two portrait-first → side by side, portrait cells (3:4)',
    images: [IMG.pt1, IMG.ls1],   // second is cropped to match first ratio
  },
  {
    id: '5', sender: 'You', time: '10:04 AM',
    message: '5. Two landscape-first → stacked vertically, landscape cells (16:9)',
    images: [IMG.ls1, IMG.pt1],   // second is cropped to match first ratio
  },

  // ── Three images ───────────────────────────────────────────────────────────
  {
    id: '6', sender: 'dedek yusuf15', time: '10:05 AM',
    message: '6. Three portrait-first → hero-left (55%) + 2 stacked right',
    images: [IMG.pt1, IMG.pt2, IMG.sq1],
  },
  {
    id: '7', sender: 'You', time: '10:06 AM',
    message: '7. Three square-first → hero-top (1:1, full width) + 2 side by side below',
    images: [IMG.sq1, IMG.pt1, IMG.ls1],
  },
  {
    id: '8', sender: 'dedek yusuf15', time: '10:07 AM',
    message: '8. Three landscape-first → hero-top (16:9, full width) + 2 side by side below',
    images: [IMG.ls1, IMG.sq1, IMG.pt1],
  },

  // ── Four images ────────────────────────────────────────────────────────────
  {
    id: '9', sender: 'You', time: '10:08 AM',
    message: '9. Four images → 2×2 square grid, no overlay',
    images: [IMG.ls1, IMG.pt1, IMG.sq1, IMG.ls2],
  },

  // ── Six images ─────────────────────────────────────────────────────────────
  {
    id: '10', sender: 'dedek yusuf15', time: '10:09 AM',
    message: '10. Six images → 2×2 grid + +3 overlay on cell 4 (N = 6 − 3)',
    images: [IMG.ls1, IMG.sq1, IMG.pt1, IMG.ls2, IMG.sq2, IMG.pt2],
  },
];

export default function StandaloneChatScreen() {
  const scrollViewRef = React.useRef<any>(null);
  const theme = useTheme<Theme>();

  const shadowStyle = Platform.select({
    web: { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 30px' } as any,
    ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
    android: { elevation: 8 },
  });

  return (
    <Box flex={1} backgroundColor="grey01" alignItems="center" justifyContent="center">
      {/* Centered Chat Container */}
      <Box
        width={470}
        height="95%"
        backgroundColor="background"
        borderRadius="xl"
        overflow="hidden"
        style={shadowStyle}
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
            contentContainerStyle={{ padding: theme.spacing['16'] }}
          >
            {/* Date Divider */}
            <Box flexDirection="row" alignItems="center" marginVertical="xl">
              <Box flex={1} height={1} backgroundColor="grey03" />
              <Box marginHorizontal="md">
                <Text variant="caption" color="grey05" fontWeight="600">Today</Text>
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
