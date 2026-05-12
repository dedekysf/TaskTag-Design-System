import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Image as ExpoImage } from 'expo-image';
import { Clock } from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, ScrollView } from 'react-native';

type StoreBadge = {
  source: ImageSourcePropType;
  width: number;
  height: number;
  accessibilityLabel: string;
};

type DetailItem = {
  label: string;
  value: string;
};

type InvitationDetailsPanelProps = {
  title: string;
  details: DetailItem[];
  roleLabel: string;
  roleSuffix: string;
};

type InvitationEmailScreenProps = {
  greetingName: string;
  inviterName: string;
  invitationCopy: string;
  ctaLabel: string;
  onCtaPress: () => void;
  children: React.ReactNode;
  expiryText?: string;
};

const STORE_BADGES: StoreBadge[] = [
  {
    source: require('@/assets/images/app-store.svg'),
    width: 120,
    height: 40,
    accessibilityLabel: 'Download on the App Store',
  },
  {
    source: require('@/assets/images/play-store.svg'),
    width: 135,
    height: 40,
    accessibilityLabel: 'Get it on Google Play',
  },
];

const FOOTER_LINKS = ['Terms & conditions', 'Privacy policy', 'Contact us'];

export function InvitationDetailsPanel({
  title,
  details,
  roleLabel,
  roleSuffix,
}: InvitationDetailsPanelProps) {
  return (
    <Box
      backgroundColor="grey02"
      borderRadius="xl"
      padding="md"
      gap="md"
      marginBottom="24"
      borderWidth={1}
      borderColor="grey03"
    >
      <Text variant="mobileLargeLabel" color="foreground">
        {title}
      </Text>

      <Box height={1} backgroundColor="grey03" />

      <Box gap="md">
        {details.map((item) => (
          <Box key={item.label}>
            <Text variant="mobileMetadataPrimary" color="grey05" marginBottom="4">
              {item.label}
            </Text>
            <Text variant="mobileLabelSmall" color="foreground">
              {item.value}
            </Text>
          </Box>
        ))}
      </Box>

      <Box height={1} backgroundColor="grey03" />

      <Text variant="mobileLabelSmall" color="textSecondary">
        {"You'll join as a "}
        <Text variant="mobileLabelSmall" color="textSecondary" style={{ fontWeight: '600' }}>
          {roleLabel}
        </Text>
        {` ${roleSuffix}`}
      </Text>
    </Box>
  );
}

export function InvitationEmailScreen({
  greetingName,
  inviterName,
  invitationCopy,
  ctaLabel,
  onCtaPress,
  children,
  expiryText = 'This invite expires in 7 days',
}: InvitationEmailScreenProps) {
  const theme = useTheme<Theme>();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Box width="100%" maxWidth={480}>
        <Box marginBottom="lg" alignItems="center">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120 }}
            resizeMode="contain"
          />
        </Box>

        <Box
          backgroundColor="card"
          borderRadius="xl"
          padding="16"
          paddingBottom="24"
          marginBottom="lg"
        >
          <Box marginBottom="24">
            <Text variant="mobileHeading22" color="textSecondary" marginBottom="8">
              Hi {greetingName} {'\uD83D\uDC4B'},
            </Text>
            <Text variant="webLargeLabel" color="textSecondary">
              <Text variant="webLargeLabel" color="textSecondary" style={{ fontWeight: '600' }}>
                {inviterName}
              </Text>
              {` ${invitationCopy}`}
            </Text>
          </Box>

          {children}

          <Box marginBottom="8">
            <Button
              variant="fill"
              size="lg"
              style={{
                width: '100%',
                backgroundColor: theme.colors.secondaryGreen,
                borderRadius: 8,
              }}
              onPress={onCtaPress}
            >
              <Text variant="mobileButton" color="white">
                {ctaLabel}
              </Text>
            </Button>
          </Box>

          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
            <Clock size={14} color={theme.colors.foreground} />
            <Text variant="webSecondaryBody" color="foreground">
              {expiryText}
            </Text>
          </Box>
        </Box>

        <Box alignItems="center" marginBottom="lg" marginTop="lg">
          <Text variant="webLargeLabel" color="textSecondary" marginBottom="8" textAlign="center">
            Download The App
          </Text>
          <Text
            variant="webMetadataPrimary"
            color="textSecondary"
            marginBottom="16"
            textAlign="center"
          >
            Get the most of Tasktag by installing our new mobile app.
          </Text>
          <Box flexDirection="row" gap="24" justifyContent="center">
            {STORE_BADGES.map((badge) => (
              <Pressable
                key={badge.accessibilityLabel}
                accessibilityRole="link"
                accessibilityLabel={badge.accessibilityLabel}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <ExpoImage
                  source={badge.source}
                  style={{ width: badge.width, height: badge.height }}
                  contentFit="contain"
                />
              </Pressable>
            ))}
          </Box>
        </Box>

        <Box alignItems="center" gap="24" paddingBottom="xl">
          <Text variant="webSecondaryBody" color="grey05" textAlign="center">
            Have questions? Contact our support team
          </Text>

          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="sm"
            flexWrap="wrap"
          >
            {FOOTER_LINKS.map((link, index) => (
              <React.Fragment key={link}>
                {index > 0 && <Box width={1} height={12} backgroundColor="grey03" />}
                <Text
                  variant="webMetadataPrimary"
                  color="grey05"
                  style={{ textDecorationLine: 'underline' }}
                >
                  {link}
                </Text>
              </React.Fragment>
            ))}
          </Box>

          <Text variant="webSecondaryBody" color="grey05" textAlign="center">
            {'\u00A9'} 2026 Tasktag, Houston, Texas 77001
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}
