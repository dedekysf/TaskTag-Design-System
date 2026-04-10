import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Hammer, HardHat, UserPlus, FileText, Hash, Zap, Image as ImageIcon, Lock, BatteryFull, WifiHigh, SignalHigh, MoreHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property. The scope includes demolition, structural adjustments, electrical and plumbing upgrades, flooring, cabinetry installation, painting, and final quality inspection.',
};

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <Box flex={1} backgroundColor="background" alignItems="center">
      {/* Mobile Frame Container */}
      <Box flex={1} width="100%" maxWidth={480} backgroundColor="grey02">
        
        {/* Status Bar Mock */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="xl"
          paddingTop="md"
          paddingBottom="sm"
          backgroundColor="background"
        >
          <Text color="foreground" style={{ fontWeight: '600', fontSize: 15, paddingLeft: 8 }}>9:41</Text>
          <Box flexDirection="row" alignItems="center" gap="8" paddingRight="8">
            <SignalHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
            <WifiHigh size={15} color={theme.colors.foreground} strokeWidth={2.5} />
            <BatteryFull size={22} color={theme.colors.foreground} strokeWidth={2} />
          </Box>
        </Box>

        {/* Browser Header */}
        <Box paddingHorizontal="md" paddingBottom="sm" backgroundColor="background" borderBottomWidth={1} borderColor="border">
          <Box flexDirection="row" alignItems="center" gap="8">
            <Box flex={1} flexDirection="row" alignItems="center" justifyContent="center" backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12" gap="8" borderRadius="8">
              <Lock size={12} color={theme.colors.grey05} />
              <Text variant="webLabelSmall" color="foreground">tasktag.com</Text>
            </Box>
            <Pressable style={{ padding: 4 }}>
              <MoreHorizontal size={20} color={theme.colors.foreground} strokeWidth={2} />
            </Pressable>
          </Box>
        </Box>

        {/* TaskTag Logo + Sign Up */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' }}>
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 100, height: 30 }}
            resizeMode="contain"
          />
          <Pressable onPress={() => router.push('/prototype/m-join-project-non-user/join-tasktag-signup')}>
            <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>Sign Up</Text>
          </Pressable>
        </Box>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, flexGrow: 1 }}
        >

          {/* Top Card */}
          <Box
            style={{ backgroundColor: theme.colors.purple }}
            borderRadius="8"
            padding="16"
            marginBottom="12"
          >
            <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
              <Box
                width={24}
                height={24}
                borderRadius="4"
                alignItems="center"
                justifyContent="center"
              >
                <HardHat size={20} color={theme.colors.white} />
              </Box>
              <Text variant="h3" color="white">
                {PROJECT.name}
              </Text>
            </Box>
            
            <Box paddingLeft="32" marginBottom="16">
              <Text variant="webMetadataPrimary" color="white">
                {PROJECT.address}
              </Text>
            </Box>
            
            <Box flexDirection="row" gap="16">
              {/* Team Tag */}
              <Box flexDirection="row" alignItems="center" gap="8">
                <Box
                  width={24}
                  height={24}
                  backgroundColor="black"
                  borderRadius="4"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Hammer size={14} color={theme.colors.white} />
                </Box>
                <Text variant="webMetadataPrimary" color="white">
                  {'Aquaworks Construction'.length > 20 ? `${'Aquaworks Construction'.substring(0, 20)}...` : 'Aquaworks Construction'}
                </Text>
              </Box>
              
              {/* Owner Tag */}
              <Box flexDirection="row" alignItems="center" gap="8">
                <Box
                  width={24}
                  height={24}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  style={{ backgroundColor: theme.colors.pastelOrange }}
                >
                  <Text variant="webMetadataSecondary" color="white" textAlign="center" style={{ width: 24, lineHeight: 24 }}>
                    AS
                  </Text>
                </Box>
                <Text variant="webMetadataPrimary" color="white">
                  Alex Smith
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Description Card */}
          <Box
            backgroundColor="card"
            borderRadius="8"
            padding="16"
            marginBottom="12"
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" marginBottom="12">
              <Text variant="webLabelEmphasized" color="foreground">
                Description
              </Text>
              <Pressable onPress={() => setDescExpanded(prev => !prev)}>
                <Text variant="webMetadataPrimary" color="grey05">{descExpanded ? 'See Less' : 'See More'}</Text>
              </Pressable>
            </Box>
            <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }} numberOfLines={descExpanded ? undefined : 3}>
              {PROJECT.description}
            </Text>
          </Box>

          {/* Invitation Block */}
          <Box
            backgroundColor="black"
            borderRadius="8"
            padding="12"
            marginBottom="12"
            gap="16"
          >
            <Box alignItems="center" gap="8">
              <Box
                width={40}
                height={40}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                style={{ backgroundColor: 'rgba(0,217,165,0.15)' }}
              >
                <UserPlus size={20} color="#00D9A5" strokeWidth={1.5} />
              </Box>
              <Text variant="webLabelEmphasized" color="white" textAlign="center">
                {"James Hammer invited you"}
              </Text>
              <Text variant="webMetadataPrimary" color="white" textAlign="center">
                {"One step away from joining this project."}
              </Text>
            </Box>
            <Button
              variant="fill"
              size="lg"
              style={{ backgroundColor: '#18A87D', alignSelf: 'stretch' }}
              onPress={() => router.push('/prototype/m-join-project-non-user/join-tasktag-signup')}
            >
              <Text variant="labelMedium" color="white">Join This Project</Text>
            </Button>
          </Box>

          {/* Members Card */}
          <Box
            backgroundColor="card"
            borderRadius="8"
            padding="16"
            marginBottom="12"
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="16">
              <Text variant="webLabelEmphasized" color="foreground">
                Members (3)
              </Text>
            </Box>
            <Box flexDirection="row" gap="16">
              {/* Member 1: AS */}
              <Box alignItems="center" gap="8">
                <Box
                  width={56}
                  height={56}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  style={{ backgroundColor: '#cd714f' }}
                >
                  <Text variant="h2" color="white" style={{ fontSize: 22, fontWeight: '400' }}>
                    AS
                  </Text>
                </Box>
                <Text variant="webMetadataPrimary" color="textSecondary">
                  Alex S...
                </Text>
              </Box>
              
              {/* Member 2: Photo */}
              <Box alignItems="center" gap="8">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=49' }}
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                />
                <Text variant="webMetadataPrimary" color="textSecondary">
                  Chelse...
                </Text>
              </Box>

              {/* Member 3: CR */}
              <Box alignItems="center" gap="8">
                <Box
                  width={56}
                  height={56}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  style={{ backgroundColor: '#0f6466' }}
                >
                  <Text variant="h2" color="white" style={{ fontSize: 22, fontWeight: '400' }}>
                    CR
                  </Text>
                </Box>
                <Text variant="webMetadataPrimary" color="textSecondary">
                  Chelita...
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Checklist Card */}
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="card"
            borderRadius="8"
            padding="16"
            marginBottom="12"
            style={{ cursor: 'not-allowed' } as any}
          >
            <Box flexDirection="row" alignItems="center" gap="16">
              <Box width={40} height={40} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center">
                <FileText size={20} color={theme.colors.grey05} />
              </Box>
              <Box gap="4">
                <Text variant="webLabelEmphasized" color="grey05">
                  Checklist
                </Text>
                <Text variant="webMetadataPrimary" color="grey04">
                  Start faster with a project template.
                </Text>
              </Box>
            </Box>
          </Box>

          {/* Tasks Card */}
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="card"
            borderRadius="8"
            padding="16"
            marginBottom="12"
            style={{ cursor: 'not-allowed' } as any}
          >
            <Box flexDirection="row" alignItems="center" gap="16">
              <Box width={40} height={40} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center">
                <Hash size={20} color={theme.colors.grey05} />
              </Box>
              <Text variant="webLabelEmphasized" color="grey05">
                Tasks
              </Text>
            </Box>
          </Box>

          {/* Bottom Grid */}
          <Box flexDirection="row" gap="12" marginBottom="12">
            {/* Activity Log */}
            <Box flex={1} backgroundColor="card" borderRadius="8" padding="16" style={{ cursor: 'not-allowed' } as any}>
              <Box width={36} height={36} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center" marginBottom="16">
                <Zap size={18} color={theme.colors.grey05} fill={theme.colors.grey05} />
              </Box>
              <Text variant="webLabelEmphasized" color="grey05" style={{ fontWeight: '600' }}>
                Activity Log
              </Text>
            </Box>
            
            {/* Files & Media */}
            <Box flex={1} backgroundColor="card" borderRadius="8" padding="16" style={{ cursor: 'not-allowed' } as any}>
              <Box width={36} height={36} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center" marginBottom="16">
                <ImageIcon size={18} color={theme.colors.grey05} />
              </Box>
              <Text variant="webLabelEmphasized" color="grey05" style={{ fontWeight: '600' }}>
                Files & Media
              </Text>
            </Box>
          </Box>
          
        </ScrollView>

      </Box>
    </Box>
  );
}
