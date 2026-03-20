import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Box, Text } from './primitives';
import { Hash, Reply, Copy, Forward, Trash2, Download, Plus } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

interface ChatMessageMenuProps {
  hasMedia?: boolean;
  mediaCount?: number;
  onDownload?: () => void;
  onClose: () => void;
}

const REACTIONS = ['😃', '👍', '👀', '👌', '😐', '✅'];
export function ChatMessageMenu({ hasMedia, mediaCount = 0, onDownload, onClose }: ChatMessageMenuProps) {
  const theme = useTheme<Theme>();

  const MenuItem = ({ icon: Icon, label, color = 'textPrimary', onPress }: any) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <Pressable 
        onPress={() => {
          onPress?.();
          onClose();
        }}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={({ pressed }) => [
          styles.menuItem,
          (pressed || isHovered) && { backgroundColor: theme.colors.grey02 }
        ]}
      >
        <Icon size={20} color={color === 'alertRed' ? theme.colors.alertRed : theme.colors.textPrimary} />
        <Text variant="body" color={color} style={{ marginLeft: theme.spacing.md }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <Box 
      backgroundColor="background" 
      borderRadius="xl" 
      paddingVertical="sm"
      style={styles.shadow}
    >
      {/* Reactions Row */}
      <Box 
        flexDirection="row" 
        paddingHorizontal="md" 
        paddingVertical="sm" 
        justifyContent="space-between"
        alignItems="center"
        marginBottom="xs"
      >
        {REACTIONS.map((emoji, i) => (
          <Pressable key={i} onPress={onClose}>
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
          </Pressable>
        ))}
        <Pressable 
          style={{ 
            backgroundColor: theme.colors.grey02, 
            width: 28, 
            height: 28, 
            borderRadius: 14, 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          onPress={onClose}
        >
          <Plus size={16} color={theme.colors.grey05} />
        </Pressable>
      </Box>

      {/* Actions */}
      <MenuItem icon={Hash} label="Edit Tag" />
      <MenuItem icon={Reply} label="Reply" />
      <MenuItem icon={Copy} label="Copy" />
      <MenuItem icon={Forward} label="Forward" />
      
      {hasMedia && (
        <MenuItem icon={Download} label={mediaCount > 1 ? "Download All" : "Download"} onPress={onDownload} />
      )}

      <MenuItem icon={Trash2} label="Delete" color="alertRed" />
    </Box>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    width: 260,
  },
});
