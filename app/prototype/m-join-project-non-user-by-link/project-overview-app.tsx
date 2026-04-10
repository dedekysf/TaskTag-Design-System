import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, ChevronLeft, ChevronRight, FileText, Hammer, HardHat, Hash, Image as ImageIcon, MoreVertical, Plus, SignalHigh, UserPlus, WifiHigh, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property. The scope includes initial assessment and planning, demolition of selected areas, structural adjustments, electrical and plumbing upgrades, flooring and wall finishing, cabinetry installation, painting, and final quality inspection. The project requires close coordination between contractors, suppliers, designers, and homeowners to ensure work is completed according to specifications, budget, and timeline. All tasks, files, approvals, progress updates, and communication will be managed within this project to maintain transparency, minimize delays, and ensure a smooth renovation process from start to handover.',
};

export default function ProjectOverview() {
  const theme = useTheme<Theme>();
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <Box flex={1} backgroundColor="grey02">

      {/* Status Bar */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="xl"
        paddingTop="md"
        paddingBottom="sm"
        backgroundColor="card"
      >
        <Text color="foreground" style={{ fontWeight: '600', fontSize: 15, paddingLeft: 8 }}>9:41</Text>
        <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
          <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
          <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
          <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
        </Box>
      </Box>

      {/* App Header — 44px */}
      <Box
        flexDirection="row"
        alignItems="center"
        height={44}
        paddingHorizontal="md"
        backgroundColor="card"
        borderBottomWidth={1}
        borderColor="border"
      >
        <Pressable style={{ marginRight: 8 }}>
          <ChevronLeft size={24} color={theme.colors.foreground} />
        </Pressable>
        <Box flex={1}>
          <Text variant="webLargeLabel" color="textPrimary">Project Details</Text>
        </Box>
        <Pressable>
          <MoreVertical size={24} color={theme.colors.foreground} />
        </Pressable>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}
      >

        {/* Project Card */}
        <Box backgroundColor="purple" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
            <Box width={24} height={24} borderRadius="4" alignItems="center" justifyContent="center">
              <HardHat size={20} color={theme.colors.white} />
            </Box>
            <Text variant="h3" color="white">{PROJECT.name}</Text>
          </Box>
          <Box paddingLeft="32" marginBottom="16">
            <Text variant="webMetadataPrimary" color="white" style={{ opacity: 0.9 }} numberOfLines={1}>
              {PROJECT.address}
            </Text>
          </Box>
          <Box flexDirection="row" gap="16">
            <Box flexDirection="row" alignItems="center" gap="8">
              <Box width={24} height={24} backgroundColor="black" borderRadius="4" alignItems="center" justifyContent="center" overflow="hidden">
                <Hammer size={14} color={theme.colors.white} />
              </Box>
              <Text variant="webMetadataPrimary" color="white">
                {'Aquaworks Construction'.length > 20 ? `${'Aquaworks Construction'.substring(0, 20)}...` : 'Aquaworks Construction'}
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="8">
              <Box width={24} height={24} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.pastelOrange }}>
                <Text variant="webMetadataSecondary" color="white" textAlign="center" style={{ width: 24, lineHeight: 24 }}>AS</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="white">Alex Smith</Text>
            </Box>
          </Box>
        </Box>

        {/* Description Card */}
        <Box backgroundColor="card" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="12">
            <Text variant="webLabelEmphasized" color="foreground">Description</Text>
            <Text variant="webMetadataPrimary" color="grey05">See More</Text>
          </Box>
          <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 16 }} numberOfLines={4}>
            {PROJECT.description}
          </Text>
        </Box>

        {/* Members Card */}
        <Box backgroundColor="card" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="12">
            <Text variant="webLabelEmphasized" color="foreground">Members (2)</Text>
            <Text variant="webMetadataPrimary" color="grey05">See All</Text>
          </Box>
          <Box flexDirection="row" gap="8">
            {/* Invite Button */}
            <Box alignItems="center" gap="4">
              <Box width={56} height={56} borderRadius="full" backgroundColor="grey02" alignItems="center" justifyContent="center">
                <UserPlus size={24} color={theme.colors.grey05} strokeWidth={1.5} />
              </Box>
              <Text variant="webMetadataPrimary" color="grey05">Invite</Text>
            </Box>
            {/* Alex Smith */}
            <Box alignItems="center" gap="4">
              <Box width={56} height={56} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.pastelOrange }}>
                <Text variant="h2" color="white" style={{ fontWeight: '400' }}>AS</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="grey05" numberOfLines={1}>Alex S...</Text>
            </Box>
            {/* Chelsea */}
            <Box alignItems="center" gap="4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=49' }} style={{ width: 56, height: 56, borderRadius: 28 }} />
              <Text variant="webMetadataPrimary" color="grey05" numberOfLines={1}>Chelse...</Text>
            </Box>
          </Box>
        </Box>

        {/* Checklist Card */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="card" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" gap="12">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
              <FileText size={20} color={theme.colors.white} />
            </Box>
            <Box gap="4">
              <Text variant="webLabelEmphasized" color="foreground">Checklist</Text>
              <Text variant="webMetadataPrimary" color="textSecondary">Start faster with a project template.</Text>
            </Box>
          </Box>
          <ChevronRight size={24} color={theme.colors.textSecondary} />
        </Box>

        {/* Tasks Card */}
        <Box backgroundColor="card" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="row" alignItems="center" gap="12">
              <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
                <Hash size={20} color={theme.colors.white} />
              </Box>
              <Text variant="webLabelEmphasized" color="foreground">Tasks</Text>
            </Box>
            <ChevronRight size={24} color={theme.colors.textSecondary} />
          </Box>
        </Box>

        {/* Bottom Grid */}
        <Box flexDirection="row" gap="12" marginBottom="12">
          <Box flex={1} backgroundColor="card" borderRadius="8" padding="16">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="12">
              <Zap size={18} color={theme.colors.white} fill={theme.colors.white} />
            </Box>
            <Text variant="webLabelEmphasized" color="foreground">Activity Log</Text>
          </Box>
          <Box flex={1} backgroundColor="card" borderRadius="8" padding="16">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="12">
              <ImageIcon size={18} color={theme.colors.white} />
            </Box>
            <Text variant="webLabelEmphasized" color="foreground">Files & Media</Text>
          </Box>
        </Box>

      </ScrollView>

      {/* Note Banner */}
      {bannerVisible && (
        <View style={{ position: 'absolute', bottom: 104, left: 16, right: 16, backgroundColor: theme.colors.brightYellow, borderRadius: 12, padding: 16, gap: 4 }}>
          <Pressable
            onPress={() => setBannerVisible(false)}
            style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <X size={16} color="#000" />
          </Pressable>
          <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
          <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18, opacity: 0.7, paddingRight: 20 }}>
            After tapping view project, if already installed app then open app, if not direct to app/play store.
          </Text>
        </View>
      )}

      {/* FAB — New Update */}
      <View style={{ position: 'absolute', bottom: 40, right: 17 }}>
        <Pressable>
          <Box
            backgroundColor="black"
            flexDirection="row"
            alignItems="center"
            gap="8"
            style={{ borderRadius: 156, paddingVertical: 12, paddingHorizontal: 12 }}
          >
            <Plus size={24} color={theme.colors.white} />
            <Text variant="webButton" color="white">New Update</Text>
          </Box>
        </Pressable>
      </View>

      {/* Bottom Home Indicator — 24px, no background */}
      <Box height={24} alignItems="center" justifyContent="flex-end" paddingBottom="sm">
        <Box width={134} height={5} backgroundColor="black" style={{ borderRadius: 100 }} />
      </Box>

    </Box>
  );
}
