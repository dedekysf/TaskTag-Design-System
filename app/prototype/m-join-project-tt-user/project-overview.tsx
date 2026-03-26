import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, ChevronLeft, ChevronRight, FileText, Hammer, HardHat, Hash, Image as ImageIcon, MoreVertical, Plus, SignalHigh, UserPlus, WifiHigh, Zap } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property. The scope includes initial assessment and planning, demolition of selected areas, structural adjustments, electrical and plumbing upgrades, flooring and wall finishing, cabinetry installation, painting, and final quality inspection. The project requires close coordination between contractors, suppliers, designers, and homeowners to ensure work is completed according to specifications, budget, and timeline. All tasks, files, approvals, progress updates, and communication will be managed within this project to maintain transparency, minimize delays, and ensure a smooth renovation process from start to handover.',
};

export default function ProjectOverview() {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} style={{ backgroundColor: theme.colors.grey01 }}>

      {/* Status Bar */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="xl"
        paddingTop="md"
        paddingBottom="sm"
        backgroundColor="white"
      >
        <Text style={{ fontWeight: '900', fontSize: 15, paddingLeft: 8, color: theme.colors.foreground }}>9:41</Text>
        <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
          <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
          <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
          <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
        </Box>
      </Box>

      {/* App Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        paddingHorizontal="md"
        paddingVertical="sm"
        backgroundColor="white"
        style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
      >
        <Pressable style={{ marginRight: 8 }}>
          <ChevronLeft size={24} color={theme.colors.foreground} />
        </Pressable>
        <Box flex={1}>
          <Text style={{ fontSize: 18, fontWeight: '500', fontFamily: 'Inter_500Medium', color: theme.colors.textPrimary }}>
            Project Details
          </Text>
        </Box>
        <Pressable>
          <MoreVertical size={24} color={theme.colors.foreground} />
        </Pressable>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
      >

        {/* Project Card */}
        <Box style={{ backgroundColor: theme.colors.purple }} borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
            <Box width={24} height={24} borderRadius="4" alignItems="center" justifyContent="center">
              <HardHat size={20} color={theme.colors.white} />
            </Box>
            <Text style={{ fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold', color: theme.colors.white }}>
              {PROJECT.name}
            </Text>
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
              <Text variant="webMetadataPrimary" color="white">Aquaworks Construct...</Text>
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
        <Box backgroundColor="white" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="12">
            <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: theme.colors.black }}>Description</Text>
            <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05 }}>See More</Text>
          </Box>
          <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary, lineHeight: 16 }} numberOfLines={4}>
            {PROJECT.description}
          </Text>
        </Box>

        {/* Members Card */}
        <Box backgroundColor="white" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="12">
            <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: theme.colors.black }}>Members (2)</Text>
            <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05 }}>See All</Text>
          </Box>
          <Box flexDirection="row" gap="8">
            {/* Invite Button */}
            <Box alignItems="center" gap="4">
              <Box
                width={56} height={56} borderRadius="full"
                style={{ backgroundColor: theme.colors.grey01 }}
                alignItems="center" justifyContent="center"
              >
                <UserPlus size={24} color={theme.colors.grey05} strokeWidth={1.5} />
              </Box>
              <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textAlign: 'center' }}>Invite</Text>
            </Box>
            {/* Alex Smith */}
            <Box alignItems="center" gap="4">
              <Box width={56} height={56} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.pastelOrange }}>
                <Text style={{ fontSize: 22, fontWeight: '400', fontFamily: 'Inter_400Regular', color: theme.colors.white }}>AS</Text>
              </Box>
              <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textAlign: 'center' }} numberOfLines={1}>Alex S...</Text>
            </Box>
            {/* Chelsea */}
            <Box alignItems="center" gap="4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=49' }} style={{ width: 56, height: 56, borderRadius: 28 }} />
              <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey05, textAlign: 'center' }} numberOfLines={1}>Chelse...</Text>
            </Box>
          </Box>
        </Box>

        {/* Checklist Card */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="white" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" gap="12">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
              <FileText size={20} color={theme.colors.white} />
            </Box>
            <Box gap="4">
              <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: theme.colors.black }}>Checklist</Text>
              <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary }}>Start faster with a project template.</Text>
            </Box>
          </Box>
          <ChevronRight size={24} color={theme.colors.textSecondary} />
        </Box>

        {/* Tasks Card */}
        <Box backgroundColor="white" borderRadius="8" padding="16" marginBottom="12">
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom="12">
            <Box flexDirection="row" alignItems="center" gap="12">
              <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
                <Hash size={20} color={theme.colors.white} />
              </Box>
              <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: theme.colors.black }}>Tasks</Text>
            </Box>
            <ChevronRight size={24} color={theme.colors.textSecondary} />
          </Box>
          <Box flexDirection="row" gap="6">
            <View style={{ backgroundColor: '#FDF4E0', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold', color: '#FBBD42' }}>
                12 <Text style={{ fontWeight: '400', fontFamily: 'Inter_400Regular' }}>Current</Text>
              </Text>
            </View>
            <View style={{ backgroundColor: '#FFDADA', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium', color: '#FF4444' }}>
                2 Overdue
              </Text>
            </View>
          </Box>
        </Box>

        {/* Bottom Grid */}
        <Box flexDirection="row" gap="12" marginBottom="12">
          <Box flex={1} backgroundColor="white" borderRadius="8" padding="16">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="12">
              <Zap size={18} color={theme.colors.white} fill={theme.colors.white} />
            </Box>
            <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: theme.colors.black }}>Activity Log</Text>
          </Box>
          <Box flex={1} backgroundColor="white" borderRadius="8" padding="16">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="12">
              <ImageIcon size={18} color={theme.colors.white} />
            </Box>
            <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', color: theme.colors.black }}>Files & Media</Text>
          </Box>
        </Box>

      </ScrollView>

      {/* FAB — New Update */}
      <View style={{ position: 'absolute', bottom: 40, right: 17 }}>
        <Pressable>
          <View style={{ backgroundColor: theme.colors.black, borderRadius: 156, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 12 }}>
            <Plus size={24} color={theme.colors.white} />
            <Text style={{ color: theme.colors.white, fontSize: 16, fontWeight: '500', fontFamily: 'Inter_500Medium' }}>New Update</Text>
          </View>
        </Pressable>
      </View>

      {/* Bottom Home Indicator */}
      <View style={{ height: 24, backgroundColor: theme.colors.white, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
        <View style={{ width: 134, height: 5, backgroundColor: theme.colors.grey05, borderRadius: 100 }} />
      </View>

    </Box>
  );
}
