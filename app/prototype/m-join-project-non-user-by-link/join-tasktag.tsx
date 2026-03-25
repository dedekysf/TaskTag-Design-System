import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Hammer, HardHat, Share } from 'lucide-react-native';
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
    <Box flex={1} backgroundColor="grey01">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40, flexGrow: 1 }}>

        {/* Top Card */}
        <Box
          style={{ backgroundColor: '#7B61FF' }}
          borderRadius="16"
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
                style={{ backgroundColor: '#cc7351' }}
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
          borderRadius="16"
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
          borderRadius="16"
          padding="16"
          marginBottom="12"
        >
          <Text variant="webLabelEmphasized" color="foreground" marginBottom="16">
            Members (3)
          </Text>
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

        {/* Alert & Action */}
        <Box flex={1} alignItems="center" justifyContent="center" marginTop="8" gap="16" minHeight={240}>
          <Share size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
          <Box width="100%" paddingHorizontal="16">
            <Text variant="webLabelEmphasized" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
              {"You've been shared a project on TaskTag"}
            </Text>
          </Box>

          <Button
            variant="fill"
            size="lg"
            style={{
              backgroundColor: theme.colors.foreground,
              borderRadius: 40,
              alignSelf: 'stretch',
              marginHorizontal: 16,
            }}
            onPress={() => router.push('/prototype/m-join-project-non-user-by-link/join-tasktag-signup')}
          >
            <Text variant="labelMedium" color="white">Request to Join</Text>
          </Button>
        </Box>

      </ScrollView>
    </Box>
  );
}
