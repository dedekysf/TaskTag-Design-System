import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { 
  BarChart2, 
  BatteryFull,
  Link as LinkIcon, 
  Lock, 
  MapPin, 
  SignalHigh,
  Users,
  WifiHigh
} from 'lucide-react-native';
import React from 'react';
import { Linking, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';

const TEAM = {
  name: 'Painting Team',
  logo: 'PT',
  location: 'San Francisco, CA',
  memberCount: 11,
  specializations: [
    'Interior Painting',
    'Exterior Painting',
    'Wallpaper Installation',
    'Drywall Repair',
    'Pressure Washing',
    'Surface Preparation',
  ],
};

export default function RequestToJoin() {
  const theme = useTheme<Theme>();
  const [requestSent, setRequestSent] = React.useState(false);

  return (
    <Box flex={1} backgroundColor="background">
      {/* Simulation: Outer container is handled by _layout.tsx (375px frame) */}
      
      {/* Status Bar Mock */}
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

      {/* Shared Link Banner */}
      <Box 
        backgroundColor="lightMint" 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="center" 
        paddingVertical="12" 
        gap="8"
      >
        <LinkIcon size={16} color={theme.colors.textSecondary} strokeWidth={2.5} />
        <Text variant="mobileLabelSmall" style={{ color: theme.colors.textSecondary }}>
          You've received a link to join this team
        </Text>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 160 }}
      >
        {/* Team Card (Grey02) */}
        <Box
          backgroundColor="grey02"
          borderRadius="8"
          padding="md"
          marginBottom="lg"
          flexDirection="row"
          alignItems="center"
          gap="12"
        >
          <Box 
            width={80} 
            height={80} 
            borderRadius="8" 
            backgroundColor="white" 
            alignItems="center" 
            justifyContent="center"
            overflow="hidden"
            borderWidth={1}
            borderColor="border"
            padding="sm"
          >
            <Image 
              source={require('@/assets/images/sosa-logo.svg')}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </Box>
          <Box>
            <Text variant="mobileHeading22" color="foreground" style={{ marginBottom: 4 }}>{TEAM.name}</Text>
            <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(TEAM.location)}`)}>
              <Text variant="mobileMetadataPrimary" color="blue" style={{ textDecorationLine: 'underline' }}>
                {TEAM.location}
              </Text>
            </Pressable>
          </Box>
        </Box>

        <Box marginBottom="lg">
          <Text variant="mobileLabelEmphasized" color="foreground" marginBottom="sm">
            Specialisms
          </Text>
          <Box flexDirection="row" flexWrap="wrap" gap="8">
            {TEAM.specializations.map((spec, index) => (
              <Box 
                key={index} 
                paddingHorizontal="sm" 
                paddingVertical="xs" 
                borderRadius="4" 
                backgroundColor="white"
                borderWidth={1}
                borderColor="border"
              >
                <Text variant="mobileMetadataPrimary" color="textSecondary">{spec}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Available After Joining Section */}
        <Box marginBottom="lg">
          <Box flexDirection="row" alignItems="center" gap="8" marginBottom="12">
             <Lock size={18} color={theme.colors.textSecondary} />
             <Text variant="mobileLabelEmphasized" color="foreground">
               Available After Joining
             </Text>
          </Box>

          <Box gap="md">
            {/* Members Card */}
            <Box 
              flexDirection="row" 
              alignItems="center" 
              padding="md" 
              borderRadius="8" 
              borderWidth={1} 
              borderColor="border"
              backgroundColor="card"
            >
              <Box 
                width={40} 
                height={40} 
                borderRadius="8" 
                backgroundColor="grey02" 
                alignItems="center" 
                justifyContent="center"
                marginRight="12"
              >
                <Users size={20} color={theme.colors.textSecondary} />
              </Box>
              <Box flex={1}>
                <Box flexDirection="row" alignItems="center" gap="4">
                  <Text variant="mobileLabelEmphasized" color="foreground">Members</Text>
                </Box>
                <Text variant="mobileMetadataPrimary" color="mutedForeground">Join with 3 other members.</Text>
              </Box>
              <Lock size={16} color={theme.colors.textSecondary} />
            </Box>

            {/* Analytics Card */}
            <Box 
              flexDirection="row" 
              alignItems="center" 
              padding="md" 
              borderRadius="8" 
              borderWidth={1} 
              borderColor="border"
              backgroundColor="card"
            >
              <Box 
                width={40} 
                height={40} 
                borderRadius="8" 
                backgroundColor="grey02" 
                alignItems="center" 
                justifyContent="center"
                marginRight="12"
              >
                <BarChart2 size={20} color={theme.colors.textSecondary} />
              </Box>
              <Box flex={1}>
                <Text variant="mobileLabelEmphasized" color="foreground">Analytics</Text>
                <Text variant="mobileMetadataPrimary" color="mutedForeground">Join to access</Text>
              </Box>
              <Lock size={16} color={theme.colors.textSecondary} />
            </Box>
          </Box>
        </Box>

        <Text variant="mobileMetadataPrimary" color="mutedForeground">
          You can leave this team at any time.
        </Text>
      </ScrollView>

      {/* Bottom Sticky CTA */}
      <Box 
        position="absolute" 
        bottom={24} 
        left={0} 
        right={0} 
        padding="md" 
        backgroundColor="background"
        paddingBottom="md"
      >
        <Button
          variant="fill"
          color="secondary"
          size="lg"
          style={{ width: '100%' }}
          onPress={() => setRequestSent(true)}
          disabled={requestSent}
        >
          {requestSent ? "Request sent" : "Request to join"}
        </Button>
        <Text 
          variant="mobileMetadataPrimary" 
          color="mutedForeground" 
          textAlign="center" 
          marginTop="sm"
        >
          {requestSent 
            ? "You'll be notified when an admin approves your request"
            : "A team admin will review your request to join"
          }
        </Text>
      </Box>

      {/* Bottom Home Indicator — 24px, no background */}
      <Box height={24} alignItems="center" justifyContent="flex-end" paddingBottom="sm">
        <Box width={134} height={5} backgroundColor="black" style={{ borderRadius: 100 }} />
      </Box>
    </Box>
  );
}
