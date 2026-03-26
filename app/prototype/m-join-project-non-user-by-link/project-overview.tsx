import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Clock, Hammer, HardHat, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property.',
};

const APPROVER = 'Kang Shen';

export default function ProjectOverview() {
  const theme = useTheme<Theme>();
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

        {/* Request Sent Section */}
        <Box backgroundColor="card" borderRadius="16" padding="16" marginBottom="12" alignItems="center">
          {/* Clock icon */}
          <Box
            width={56}
            height={56}
            borderRadius="full"
            alignItems="center"
            justifyContent="center"
            marginBottom="12"
            style={{ backgroundColor: '#EFF6FF' }}
          >
            <Clock size={28} color="#93C5FD" strokeWidth={1.5} />
          </Box>

          <Text variant="webLabelEmphasized" color="textPrimary" style={{ marginBottom: 8, textAlign: 'center' }}>
            Request Sent
          </Text>

          <Text variant="webSecondaryBody" color="textSecondary" style={{ textAlign: 'center', marginBottom: 16, lineHeight: 22 }}>
            {"You'll be notified when it's approved."}
          </Text>

        </Box>

        {/* Divider */}
        <Box flexDirection="row" alignItems="center" gap="8" marginBottom="12">
          <Box flex={1} height={1} backgroundColor="border" />
          <Text variant="webMetadataPrimary" color="textSecondary">Get Notified Faster</Text>
          <Box flex={1} height={1} backgroundColor="border" />
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
    </View>
  );
}
