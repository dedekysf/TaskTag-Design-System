import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { MapPin, X } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, Pressable, View } from 'react-native';

// Simulated invite token data
const INVITE = {
  projectName: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
};

export default function JoinTasktagSignup() {
  const theme = useTheme<Theme>();

  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [isAppleHovered, setIsAppleHovered] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={[{ position: 'absolute', width: '100%', height: '100%' }, Platform.OS === 'web' && { cursor: 'default' } as any]}
        onPress={() => router.back()}
      />
      <View style={{ alignSelf: 'stretch', marginHorizontal: 16, backgroundColor: theme.colors.background, borderRadius: 16, overflow: 'hidden', elevation: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 32 }}>
          <Box width="100%">
            {/* Heading */}
            <Text variant="h2" textAlign="center" marginBottom="4">
              Create an account
            </Text>
            <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
              <Text variant="webMetadataPrimary" color="mutedForeground">
                {"Someone shared this project with you"}
              </Text>
            </Box>

            {/* Context banner */}
            <Box
              backgroundColor="lightSky"
              alignItems="flex-start"
              padding="md"
              borderRadius="xl"
              marginBottom="lg"
              width="100%"
              position="relative"
              zIndex="10"
            >
              <Text variant="webLabelSmall" color="foreground" style={{ marginBottom: 8 }}>
                {INVITE.projectName}
              </Text>
              <Box flexDirection="row" alignItems="center" gap="4" marginBottom="16">
                <MapPin size={14} color={theme.colors.textSecondary} />
                <Text variant="webMetadataPrimary" color="mutedForeground">
                  {INVITE.address}
                </Text>
              </Box>

              <Box flexDirection="row" alignItems="center" gap="4">
                <Text variant="webLabelSmall" color="mutedForeground">Your Role : </Text>
                <Text variant="webLabelSmall" color="foreground" fontWeight="700">
                  Viewer <Text variant="webMetadataPrimary" fontWeight="400">(Pending Approval)</Text>
                </Text>
              </Box>
            </Box>

            {/* Social sign-in */}
            <Box marginBottom="lg" alignItems="center">
              <Box flexDirection="row" gap="md" width="100%" marginBottom="20">
                <Pressable
                  onHoverIn={() => setIsGoogleHovered(true)}
                  onHoverOut={() => setIsGoogleHovered(false)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 52,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: isGoogleHovered ? theme.colors.grey01 : theme.colors.card,
                      gap: 12,
                      opacity: pressed ? 0.8 : 1,
                    } as any,
                    Platform.OS === 'web' && { cursor: 'pointer' } as any,
                  ]}
                >
                  <Image
                    source={require('@/assets/images/google-logo.svg')}
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                  />
                  <Text variant="labelMedium" color="foreground">Google</Text>
                </Pressable>

                <Pressable
                  onHoverIn={() => setIsAppleHovered(true)}
                  onHoverOut={() => setIsAppleHovered(false)}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 52,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      backgroundColor: isAppleHovered ? theme.colors.grey01 : theme.colors.card,
                      gap: 12,
                      opacity: pressed ? 0.8 : 1,
                    } as any,
                    Platform.OS === 'web' && { cursor: 'pointer' } as any,
                  ]}
                >
                  <Image
                    source={require('@/assets/images/apple-logo.svg')}
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                  />
                  <Text variant="labelMedium" color="foreground">Apple</Text>
                </Pressable>
              </Box>

              <Box flexDirection="row" alignItems="center" width="100%" gap="12">
                <Box flex={1} height={1} backgroundColor="border" />
                <Text variant="webMetadataPrimary" color="mutedForeground">or</Text>
                <Box flex={1} height={1} backgroundColor="border" />
              </Box>
            </Box>

            {/* CTA Sign up with email */}
            <Button
              variant="outline"
              color="primary"
              size="lg"
              style={{ width: '100%' }}
              onPress={() => router.push('/prototype/m-join-project-non-user-by-link/signup-with-email' as any)}
            >
              Sign up with email
            </Button>

            <Box marginTop="16" marginBottom="8" alignItems="center">
              <Text variant="webMetadataPrimary" color="textSecondary">
                Already have an account?{' '}
                <Text
                  variant="webMetadataPrimary"
                  color="secondaryGreen"
                  fontWeight="600"
                  onPress={() => router.push('/')}
                  style={{ cursor: 'pointer' } as any}
                >
                  Log in
                </Text>
              </Text>
            </Box>
          </Box>
        </View>

        {/* Close Button */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            {
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.grey02,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              opacity: pressed ? 0.7 : 1,
            },
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any)
          ]}
        >
          <X size={18} color={theme.colors.foreground} />
        </Pressable>
      </View>
    </View>
  );
}
