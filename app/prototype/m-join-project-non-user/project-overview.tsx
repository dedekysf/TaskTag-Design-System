import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Activity, Hammer, HardHat, Hash, Image as ImageIcon, MessageSquare, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property.',
};

const FEATURES = [
  { Icon: Hash, title: 'Create, assign and track tasks', subtitle: 'Manage project tasks efficiently' },
  { Icon: ImageIcon, title: 'Share media and docs', subtitle: 'Upload files, photos and documents' },
  { Icon: MessageSquare, title: 'Chat with your team', subtitle: 'Stay connected with team members' },
  { Icon: Activity, title: 'Follow updates', subtitle: 'Get notified on project changes' },
];

export default function ProjectOverview() {
  const theme = useTheme<Theme>();
  const [sheetVisible, setSheetVisible] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      {/* Top Banner */}
      {bannerVisible && (
        <View style={{ backgroundColor: theme.colors.black, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text variant="webLabelSmall" color="white" style={{ marginBottom: 4 }}>Get TaskTag</Text>
            <Text variant="webMetadataPrimary" style={{ color: 'rgba(255,255,255,0.7)' }}>Get notified faster in the app</Text>
          </View>
          <Pressable style={{ backgroundColor: theme.colors.white, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Text variant="webMetadataPrimary" color="textPrimary" style={{ fontWeight: '600' }}>Download</Text>
          </Pressable>
          <Pressable onPress={() => setBannerVisible(false)} style={{ padding: 4 }}>
            <X size={16} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>
      )}

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.grey01 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Card */}
        <Box style={{ backgroundColor: theme.colors.purple }} borderRadius="16" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
            <Box width={24} height={24} borderRadius="4" alignItems="center" justifyContent="center">
              <HardHat size={20} color={theme.colors.white} />
            </Box>
            <Text variant="h3" color="white">{PROJECT.name.split(' ').slice(0, 2).join(' ')}</Text>
          </Box>
          <Box paddingLeft="32" marginBottom="16">
            <Text variant="webMetadataPrimary" color="white" style={{ opacity: 0.9 }}>{PROJECT.address}</Text>
          </Box>
          <Box flexDirection="row" gap="16">
            <Box flexDirection="row" alignItems="center" gap="8">
              <Box width={24} height={24} backgroundColor="black" borderRadius="4" alignItems="center" justifyContent="center" overflow="hidden">
                <Hammer size={14} color={theme.colors.white} />
              </Box>
              <Text variant="webMetadataPrimary" color="white">Aquaworks Construct...</Text>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="8">
              <Box width={24} height={24} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: (theme.colors as any).pastelOrange }}>
                <Text variant="webMetadataSecondary" color="white" textAlign="center" style={{ width: 24, lineHeight: 24 }}>AS</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="white">Alex Smith</Text>
            </Box>
          </Box>
        </Box>

        {/* Description Card */}
        <Box backgroundColor="card" borderRadius="16" padding="16" marginBottom="12">
          <Text variant="webLabelEmphasized" color="foreground" marginBottom="12">Description</Text>
          <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>{PROJECT.description}</Text>
        </Box>

        {/* Members Card */}
        <Box backgroundColor="card" borderRadius="16" padding="16" marginBottom="12">
          <Text variant="webLabelEmphasized" color="foreground" marginBottom="16">Members (3)</Text>
          <Box flexDirection="row" gap="16">
            <Box alignItems="center" gap="8">
              <Box width={56} height={56} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: '#cd714f' }}>
                <Text variant="h2" color="white" style={{ fontSize: 22, fontWeight: '400' }}>AS</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="textSecondary">Alex S...</Text>
            </Box>
            <Box alignItems="center" gap="8">
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=49' }} style={{ width: 56, height: 56, borderRadius: 28 }} />
              <Text variant="webMetadataPrimary" color="textSecondary">Chelse...</Text>
            </Box>
            <Box alignItems="center" gap="8">
              <Box width={56} height={56} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: '#0f6466' }}>
                <Text variant="h2" color="white" style={{ fontSize: 22, fontWeight: '400' }}>CR</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="textSecondary">Chelita...</Text>
            </Box>
          </Box>
        </Box>

        {/* Download CTA */}
        <Box backgroundColor="card" borderRadius="16" padding="16">
          <Text variant="webSecondaryBody" color="textPrimary" style={{ fontWeight: '600', marginBottom: 8 }}>
            You're on the web version
          </Text>
          <Text variant="webMetadataPrimary" color="textSecondary" style={{ marginBottom: 12 }}>
            Download the app to create tasks, get notification and more.
          </Text>
          <Box style={{ backgroundColor: theme.colors.foreground, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' }}>
            <Text variant="webMetadataPrimary" color="white" style={{ fontWeight: '600' }}>Download App</Text>
          </Box>
        </Box>
      </ScrollView>

      {/* Bottom Sheet — inside frame via absolute positioning */}
      {sheetVisible && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {/* Overlay */}
          <Pressable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setSheetVisible(false)}
          />
          {/* Sheet */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
            {/* Handle */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 40, height: 4, backgroundColor: theme.colors.border, borderRadius: 2 }} />
            </View>

            {/* Project info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <View style={{ width: 40, height: 40, backgroundColor: theme.colors.purple, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                <HardHat size={22} color={theme.colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="webLabelSmall" color="textPrimary" style={{ marginBottom: 2 }}>{PROJECT.name}</Text>
                <Text variant="webMetadataPrimary" style={{ color: (theme.colors as any).grey05 }}>You've been added to this project</Text>
              </View>
            </View>

            {/* What you can do */}
            <Text variant="webSecondaryBody" color="textPrimary" style={{ marginBottom: 16 }}>What you can do</Text>

            <View style={{ gap: 16, marginBottom: 24 }}>
              {FEATURES.map(({ Icon, title, subtitle }, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 40, height: 40, backgroundColor: theme.colors.grey02, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={theme.colors.textPrimary} strokeWidth={1.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="webSecondaryBody" color="textPrimary" style={{ marginBottom: 2 }}>{title}</Text>
                    <Text variant="webMetadataPrimary" style={{ color: (theme.colors as any).grey05 }}>{subtitle}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* CTA */}
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: theme.colors.foreground, borderRadius: 12 }}
              onPress={() => setSheetVisible(false)}
            >
              <Text variant="webLabelEmphasized" color="white">Go to Project</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
