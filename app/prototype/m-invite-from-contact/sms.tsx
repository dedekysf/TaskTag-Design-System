import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Mic, Plus, Wifi } from 'lucide-react-native';
import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';

const MESSAGE_TEXT = `Hey, join me on TaskTag to manage our jobs. Tap here to get started:`;
const MESSAGE_LINK = `https://app.tasktag.com/join/x7kR2mNp`;

export default function SMSPage() {
  const theme = useTheme<Theme>();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth >= 768;
  const { name } = useLocalSearchParams<{ name: string }>();

  const grey02 = (theme.colors as any).grey02;
  const grey04 = (theme.colors as any).grey04;

  return (
    <Box
      flex={1}
      backgroundColor={isDesktop ? 'grey02' : 'white'}
      alignItems={isDesktop ? 'center' : 'stretch'}
    >
      <Box flex={1} width="100%" maxWidth={isDesktop ? 375 : undefined} backgroundColor="white">

        {/* iOS Status Bar */}
        <Box height={44} paddingHorizontal="16" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.black, letterSpacing: -0.3 }}>9:41</Text>
          <Box flexDirection="row" alignItems="center" style={{ gap: 6 } as any}>
            <Box flexDirection="row" alignItems="flex-end" style={{ gap: 2 } as any}>
              {[4, 6, 8, 11].map((h, i) => (
                <Box key={i} width={3} style={{ height: h, backgroundColor: theme.colors.black, borderRadius: 1 } as any} />
              ))}
            </Box>
            <Wifi size={14} color={theme.colors.black} strokeWidth={2.5} />
            <Box flexDirection="row" alignItems="center">
              <Box style={{ width: 22, height: 11, borderRadius: 2.5, borderWidth: 1, borderColor: theme.colors.black, justifyContent: 'center', paddingHorizontal: 1 } as any}>
                <Box style={{ width: '80%', height: 7, backgroundColor: theme.colors.black, borderRadius: 1 } as any} />
              </Box>
              <Box style={{ width: 2, height: 5, backgroundColor: theme.colors.black, borderRadius: 1, marginLeft: 1 } as any} />
            </Box>
          </Box>
        </Box>

        {/* Header */}
        <Box
          height={44}
          flexDirection="row" alignItems="center"
          paddingHorizontal="16"
          backgroundColor="white"
          style={{ borderBottomWidth: 1, borderBottomColor: (theme.colors as any).grey03 } as any}
        >
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={24} color={theme.colors.textPrimary} />
          </Pressable>
        </Box>

        {/* To / From fields */}
        <Box style={{ backgroundColor: '#f2f2f7', borderRadius: 12, marginHorizontal: 12, marginTop: 12 } as any}>
          {/* To row */}
          <Box
            flexDirection="row" alignItems="center"
            paddingHorizontal="16" paddingVertical="12"
            style={{ borderBottomWidth: 0.5, borderBottomColor: (theme.colors as any).grey03 } as any}
          >
            <Text style={{ fontSize: 15, color: grey04, marginRight: 8 }}>To:</Text>
            <Box
              paddingHorizontal="12" paddingVertical="4"
              style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 20 } as any}
            >
              <Text style={{ fontSize: 15, color: '#fff', fontWeight: '500' }}>
                {name ?? 'Contact'}
              </Text>
            </Box>
          </Box>

          {/* From row */}
          <Box
            flexDirection="row" alignItems="center"
            paddingHorizontal="16" paddingVertical="12"
          >
            <Text style={{ fontSize: 15, color: grey04, marginRight: 8 }}>From:</Text>
            <Box
              width={20} height={20}
              alignItems="center" justifyContent="center"
              style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 4, marginRight: 6 } as any}
            >
              <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700' }}>J</Text>
            </Box>
            <Text style={{ fontSize: 15, color: theme.colors.secondaryGreen, fontWeight: '500' }}>James</Text>
          </Box>
        </Box>

        {/* Message area */}
        <Box flex={1} />

        {/* Message bubble */}
        <Box paddingHorizontal="16" paddingBottom="8">
          <Box
            alignSelf="flex-end"
            paddingHorizontal="16" paddingVertical="12"
            style={{ backgroundColor: theme.colors.secondaryGreen, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 18, borderBottomRightRadius: 0, maxWidth: '85%' } as any}
          >
            <Text style={{ fontSize: 15, color: '#fff', lineHeight: 20, marginBottom: 8 }}>
              {MESSAGE_TEXT}
            </Text>
            <Text style={{ fontSize: 15, color: '#fff', lineHeight: 20, textDecorationLine: 'underline' }}>
              {MESSAGE_LINK}
            </Text>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          flexDirection="row" alignItems="center"
          paddingHorizontal="12" paddingBottom="16" paddingTop="8"
          style={{ gap: 8 } as any}
        >
          {/* + button */}
          <Pressable>
            <Box
              width={36} height={36}
              alignItems="center" justifyContent="center"
              style={{ backgroundColor: grey02, borderRadius: 18 } as any}
            >
              <Plus size={20} color={theme.colors.textPrimary} strokeWidth={2} />
            </Box>
          </Pressable>

          {/* Text input pill */}
          <Box
            flex={1} height={36} flexDirection="row" alignItems="center"
            paddingHorizontal="16"
            style={{ backgroundColor: grey02, borderRadius: 18, gap: 8 } as any}
          >
            <Text style={{ flex: 1, fontSize: 15, color: grey04 }}>
              Text Message • SMS
            </Text>
            <Mic size={18} color={grey04} />
          </Box>
        </Box>

        {/* Home Bar */}
        <Box height={24} alignItems="center" justifyContent="center">
          <Box style={{ width: 134, height: 5, backgroundColor: theme.colors.black, borderRadius: 5 } as any} />
        </Box>

      </Box>
    </Box>
  );
}
