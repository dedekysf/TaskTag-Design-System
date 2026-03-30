/**
 * ChatMessage Component
 */

import React from 'react';
import { Box, Text } from './primitives';
import { ChatImageGrid } from './ChatImageGrid';
import { ChatImageViewer } from './ChatImageViewer';
import { Check } from 'lucide-react-native';
import { ChatMessageMenu } from './ChatMessageMenu';
import { View, Pressable, StyleSheet, Platform, Modal, useWindowDimensions } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

interface ChatMessageProps {
  sender: string;
  time: string;
  message?: string;
  images?: string[];
  id?: string;
  projectName?: string;
  taskName?: string;
}

export function ChatMessage({ sender, time, message, images, projectName, taskName }: ChatMessageProps) {
  const theme = useTheme<Theme>();
  const isMe = sender.toLowerCase() === 'you';
  const isDedek = sender.toLowerCase().includes('dedek');
  const [menuVisible,     setMenuVisible]     = React.useState(false);
  const [menuPos,         setMenuPos]         = React.useState({ x: 0, y: 0, flip: false });
  const [isHovered,       setIsHovered]       = React.useState(false);
  const [viewerVisible,   setViewerVisible]   = React.useState(false);
  const [viewerIndex,     setViewerIndex]     = React.useState(0);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 500;
  const screenW = isDesktopWeb ? 470 : windowWidth;
  const borderPad = isDedek ? 2 : 0; // 1px border each side needs 2px extra bubble width
  const bubbleMaxWidth = Math.round(screenW * 0.72) + (isMe ? 0 : 20) + 8 + borderPad;

  const avatarBg = isDedek ? 'orange' : 'blue';
  const initials = isMe ? 'JH' : (sender.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase());

  const handleContextMenu = (e: any) => {
    if (Platform.OS === 'web') {
      e.preventDefault();
      e.stopPropagation();
      const x = e.nativeEvent?.clientX || e.clientX || 0;
      const y = e.nativeEvent?.clientY || e.clientY || 0;
      const flip = y > windowHeight * 0.6;
      setMenuPos({ x, y, flip });
      setMenuVisible(true);
    }
  };

  const handleImagePress = (index: number) => {
    if (!images) return;
    setViewerIndex(index);
    setViewerVisible(true);
  };

  const stringImages = images?.filter((img): img is string => typeof img === 'string') ?? [];

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={{
        borderRadius: 0,
        padding: 12,
        marginHorizontal: -12,
        marginBottom: 8,
        backgroundColor: isHovered ? theme.colors.grey01 : 'transparent',
      }}
    >
      <Box width="100%">
        <Box flexDirection="row" alignItems="stretch" gap="md">

          {/* Avatar */}
          <Box width={36} alignItems="center">
            <Box
              width={36} height={36} borderRadius="full"
              backgroundColor={avatarBg} alignItems="center" justifyContent="center"
            >
              <Text variant="caption" color="white" fontWeight="600">{initials}</Text>
            </Box>
          </Box>

          <Box flex={1} style={{ paddingTop: 6 }}>
            <Box flexDirection="row" alignItems="center" gap="sm" marginBottom="xs">
              <Text variant="label" color={isMe ? 'darkMagenta' : 'textPrimary'} fontWeight="600">
                {sender}
              </Text>
              <Text variant="webMetadataSecondary" color="grey05">{time}</Text>
            </Box>

            <Box flexDirection="row" alignItems="flex-end" style={{ gap: 4 }}>
              <View
                // @ts-ignore
                onContextMenu={handleContextMenu}
              >
                <Pressable
                  onLongPress={Platform.OS === 'web' ? undefined : () => {
                    setMenuPos({ x: 100, y: 100, flip: false });
                    setMenuVisible(true);
                  }}
                  delayLongPress={500}
                  style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
                >
                  <Box
                    backgroundColor={isMe ? 'lightMint' : (isDedek ? 'white' : 'grey02')}
                    borderWidth={isDedek ? 1 : 0}
                    borderColor="border"
                    style={{
                      borderRadius: 16,
                      borderTopLeftRadius: 0,
                      overflow: 'hidden',
                      padding: 4,
                      alignSelf: 'flex-start',
                      maxWidth: bubbleMaxWidth,
                    }}
                  >
                    {message && (
                      <Box style={{ paddingHorizontal: 8, paddingTop: 4, paddingBottom: images && images.length > 0 ? 8 : 4, maxWidth: bubbleMaxWidth - 8 }}>
                        <Text variant="body" color="textSecondary">{message}</Text>
                      </Box>
                    )}
                    {images && images.length > 0 && (
                      <ChatImageGrid
                        images={images}
                        sent={isMe}
                        onImagePress={handleImagePress}
                      />
                    )}
                  </Box>
                </Pressable>
              </View>

              {isMe && <Check size={16} color="#22c55e" style={{ marginBottom: 4 }} />}
            </Box>
          </Box>
        </Box>

        {/* Image viewer — handles single and multi-image with swipe navigation */}
        {stringImages.length >= 1 && (
          <ChatImageViewer
            images={stringImages}
            initialIndex={viewerIndex}
            sender={sender}
            time={time}
            visible={viewerVisible}
            onClose={() => setViewerVisible(false)}
            projectName={projectName}
            taskName={taskName}
          />
        )}

        {/* Context Menu */}
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuVisible(false)}
            {...(Platform.OS === 'web' ? {
              onContextMenu: (e: any) => { e.preventDefault(); setMenuVisible(false); }
            } : {})}
          >
            <Box
              style={{
                position: 'absolute',
                left: menuPos.x,
                top:    menuPos.flip ? undefined : menuPos.y,
                bottom: menuPos.flip ? (windowHeight - menuPos.y + 10) : undefined,
              }}
            >
              <ChatMessageMenu
                hasMedia={!!images && images.length > 0}
                mediaCount={images?.length || 0}
                onDownload={() => {
                  if (Platform.OS === 'web' && images) {
                    images.forEach(async (url, index) => {
                      try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = `chat-${sender}-${Date.now()}-${index}.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(blobUrl);
                        document.body.removeChild(a);
                      } catch {
                        const a = document.createElement('a');
                        a.target = '_blank';
                        a.href = url;
                        a.download = `chat-${sender}-${Date.now()}-${index}.jpg`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    });
                  }
                }}
                onClose={() => setMenuVisible(false)}
              />
            </Box>
          </Pressable>
        </Modal>
      </Box>
    </Pressable>
  );
}
