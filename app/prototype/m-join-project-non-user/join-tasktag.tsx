import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Hammer, HardHat, User, UserPlus, ChevronRight, FileText, Hash, Zap, Image as ImageIcon, Lock, BatteryFull, WifiHigh, SignalHigh } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView } from 'react-native';

const PROJECT = {
  name: 'Raintree Hollow',
  address: '11 N Raintree Hollow Ln, Houston, Texas 77027, USA',
  description:
    'This project involves a full residential home renovation aimed at improving functionality, comfort, safety, and visual appeal of the property.',
};

export default function JoinTasktag() {
  const theme = useTheme<Theme>();

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

        {/* Browser Header Mock */}
        <Box
          paddingHorizontal="md"
          paddingBottom="sm"
          backgroundColor="background"
          borderBottomWidth={1}
          borderColor="border"
        >
          <Box flexDirection="row" alignItems="center" justifyContent="center" backgroundColor="grey02" paddingHorizontal="12" paddingVertical="12" borderRadius="8" gap="8">
            <Lock size={12} color={theme.colors.grey05} />
            <Text variant="caption" color="foreground" style={{ fontSize: 14, fontWeight: '500' }}>tasktag.com</Text>
          </Box>
        </Box>

        {/* Header */}
        <Box 
          flexDirection="row" 
          alignItems="center" 
          justifyContent="space-between" 
          paddingHorizontal="md" 
          paddingVertical="sm" 
          backgroundColor="background"
        >
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 28, width: 100 }}
            resizeMode="contain"
          />
          <Box 
            width={32} 
            height={32} 
            borderRadius="full" 
            backgroundColor="grey02" 
            alignItems="center" 
            justifyContent="center"
          >
            <User size={18} color={theme.colors.grey06} />
          </Box>
        </Box>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 280, flexGrow: 1 }}
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
              <Text variant="webMetadataPrimary" color="white" style={{ opacity: 0.9 }}>
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
                  Aquaworks Construct...
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
            </Box>
            <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>
              {PROJECT.description}
            </Text>
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
            justifyContent="space-between"
            backgroundColor="card"
            borderRadius="8"
            padding="16"
            marginBottom="12"
          >
            <Box flexDirection="row" alignItems="center" gap="16">
              <Box width={40} height={40} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
                <FileText size={20} color={theme.colors.white} />
              </Box>
              <Box gap="4">
                <Text variant="webLabelEmphasized" color="foreground">
                  Checklist
                </Text>
                <Text variant="webMetadataPrimary" color="textSecondary">
                  Start faster with a project template.
                </Text>
              </Box>
            </Box>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Box>

          {/* Tasks Card */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="card"
            borderRadius="8"
            padding="16"
            marginBottom="12"
          >
            <Box flexDirection="row" alignItems="center" gap="16">
              <Box width={40} height={40} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
                <Hash size={20} color={theme.colors.white} />
              </Box>
              <Text variant="webLabelEmphasized" color="foreground">
                Tasks
              </Text>
            </Box>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Box>

          {/* Bottom Grid */}
          <Box flexDirection="row" gap="12" marginBottom="12">
            {/* Activity Log */}
            <Box flex={1} backgroundColor="card" borderRadius="8" padding="16">
              <Box width={36} height={36} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="16">
                <Zap size={18} color={theme.colors.white} fill={theme.colors.white} />
              </Box>
              <Text variant="webLabelEmphasized" color="foreground" style={{ fontWeight: '600' }}>
                Activity Log
              </Text>
            </Box>
            
            {/* Files & Media */}
            <Box flex={1} backgroundColor="card" borderRadius="8" padding="16">
              <Box width={36} height={36} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="16">
                <ImageIcon size={18} color={theme.colors.white} />
              </Box>
              <Text variant="webLabelEmphasized" color="foreground" style={{ fontWeight: '600' }}>
                Files & Media
              </Text>
            </Box>
          </Box>
          
        </ScrollView>

        {/* Fixed Bottom Invitation Block */}
        <Box 
          position="absolute" 
          bottom={0} 
          left={0} 
          right={0} 
          backgroundColor="background" 
          padding="xl" 
          style={{ borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 48, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10 } as any}
        >
          <Box alignItems="center" style={{ gap: 16 }}>
            <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
            <Text variant="webLabelEmphasized" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
              {"You've been invited to this project by "}
              <Text variant="webLabelEmphasized" fontWeight="700">James Hammer</Text>
            </Text>
          </Box>
          <Button
            variant="fill"
            size="lg"
            style={{
              backgroundColor: theme.colors.foreground,
              borderRadius: 40,
              alignSelf: 'stretch',
              marginTop: 24,
            }}
            onPress={() => router.push('/prototype/m-join-project-non-user/join-tasktag-signup')}
          >
            <Text variant="labelMedium" color="white">Join This Project</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
