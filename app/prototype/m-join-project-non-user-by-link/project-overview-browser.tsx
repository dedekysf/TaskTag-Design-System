import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { BatteryFull, ChevronRight, Clock, FileText, Hammer, HardHat, Hash, Image as ImageIcon, Lock, MoreHorizontal, SignalHigh, WifiHigh, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property.',
};

export default function ProjectOverview() {
  const theme = useTheme<Theme>();
  const [sheetVisible, setSheetVisible] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);

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
          <Pressable>
            <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>Sign Up</Text>
          </Pressable>
        </Box>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 220, flexGrow: 1 }}
        >

          {/* Top Card */}
          <Box
            style={{ backgroundColor: theme.colors.purple }}
            borderRadius="8"
            padding="16"
            marginBottom="12"
          >
            <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
              <Box width={24} height={24} borderRadius="4" alignItems="center" justifyContent="center">
                <HardHat size={20} color={theme.colors.white} />
              </Box>
              <Text variant="h3" color="white">{PROJECT.name}</Text>
            </Box>
            <Box paddingLeft="32" marginBottom="16">
              <Text variant="webMetadataPrimary" color="white">{PROJECT.address}</Text>
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
          <Box backgroundColor="card" borderRadius="8" padding="16" marginBottom="12">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" width="100%" marginBottom="12">
              <Text variant="webLabelEmphasized" color="foreground">Description</Text>
            </Box>
            <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>{PROJECT.description}</Text>
          </Box>

          {/* Members Card */}
          <Box backgroundColor="card" borderRadius="8" padding="16" marginBottom="12">
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="16">
              <Text variant="webLabelEmphasized" color="foreground">Members (3)</Text>
            </Box>
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

          {/* Checklist Card */}
          <Box flexDirection="row" alignItems="center" backgroundColor="card" borderRadius="8" padding="16" marginBottom="12" style={{ cursor: 'not-allowed' } as any}>
            <Box flexDirection="row" alignItems="center" gap="16">
              <Box width={40} height={40} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center">
                <FileText size={20} color={theme.colors.grey05} />
              </Box>
              <Box gap="4">
                <Text variant="webLabelEmphasized" color="grey05">Checklist</Text>
                <Text variant="webMetadataPrimary" color="grey04">Start faster with a project template.</Text>
              </Box>
            </Box>
          </Box>

          {/* Tasks Card */}
          <Box flexDirection="row" alignItems="center" backgroundColor="card" borderRadius="8" padding="16" marginBottom="12" style={{ cursor: 'not-allowed' } as any}>
            <Box flexDirection="row" alignItems="center" gap="16">
              <Box width={40} height={40} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center">
                <Hash size={20} color={theme.colors.grey05} />
              </Box>
              <Text variant="webLabelEmphasized" color="grey05">Tasks</Text>
            </Box>
          </Box>

          {/* Bottom Grid */}
          <Box flexDirection="row" gap="12" marginBottom="12">
            <Box flex={1} backgroundColor="card" borderRadius="8" padding="16" style={{ cursor: 'not-allowed' } as any}>
              <Box width={36} height={36} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center" marginBottom="16">
                <Zap size={18} color={theme.colors.grey05} fill={theme.colors.grey05} />
              </Box>
              <Text variant="webLabelEmphasized" color="grey05" style={{ fontWeight: '600' }}>Activity Log</Text>
            </Box>
            <Box flex={1} backgroundColor="card" borderRadius="8" padding="16" style={{ cursor: 'not-allowed' } as any}>
              <Box width={36} height={36} borderRadius="8" backgroundColor="grey03" alignItems="center" justifyContent="center" marginBottom="16">
                <ImageIcon size={18} color={theme.colors.grey05} />
              </Box>
              <Text variant="webLabelEmphasized" color="grey05" style={{ fontWeight: '600' }}>Files & Media</Text>
            </Box>
          </Box>

        </ScrollView>

        {/* Important Note For Dev */}
        {bannerVisible && (
          <View style={{ position: 'absolute', bottom: 220, left: 16, right: 16, backgroundColor: '#fbe676', borderRadius: 12, padding: 16, gap: 4, zIndex: 40 }}>
            <Pressable
              onPress={() => setBannerVisible(false)}
              style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <Text variant="webLabelEmphasized" style={{ color: '#000', fontSize: 16, lineHeight: 16 }}>×</Text>
            </Pressable>
            <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
            <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18, paddingRight: 20 }}>
              When user presses download button, if already have open the app. If not direct to Play/App store.
            </Text>
          </View>
        )}

        {/* Fixed Bottom Banner */}
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: '#000000', borderRadius: 12, padding: 16, zIndex: 10 }}>
          <View style={{ marginBottom: 4 }}>
            <Text variant="webLabelEmphasized" color="white">You're almost in!</Text>
          </View>
          <Text variant="webSecondaryBody" style={{ color: '#E0E0E0', marginBottom: 16, lineHeight: 20 }}>
            Your request to join this project is pending approval. Download the app to jump in, create tasks, and stay in the loop.
          </Text>
          <Button
            variant="fill"
            size="lg"
            style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 8 }}
            onPress={() => { if (typeof window !== 'undefined') window.open('https://play.google.com/store/apps/details?id=com.eloveit.TaskTag', '_blank'); }}
          >
            <Text variant="webLabelEmphasized" color="white">Download App</Text>
          </Button>
        </View>

        {/* Bottom Sheet */}
        {sheetVisible && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
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

              {/* Request Sent content */}
              <View style={{ alignItems: 'center', paddingVertical: 8, marginBottom: 24 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.grey02, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Clock size={28} color={theme.colors.grey05} strokeWidth={1.5} />
                </View>
                <Text variant="mobileHeading22" color="textPrimary" style={{ marginBottom: 8, textAlign: 'center' }}>
                  Request Sent
                </Text>
                <Text variant="mobileBody" color="textSecondary" style={{ textAlign: 'center', lineHeight: 22 }}>
                  {"You'll be notified when it's approved."}
                </Text>
              </View>

              {/* Got It button */}
              <Button
                variant="fill"
                size="lg"
                style={{ width: '100%', backgroundColor: theme.colors.foreground, borderRadius: 12 }}
                onPress={() => setSheetVisible(false)}
              >
                <Text variant="mobileLargeLabel" color="white">Got It</Text>
              </Button>
            </View>
          </View>
        )}

      </Box>
    </Box>
  );
}
