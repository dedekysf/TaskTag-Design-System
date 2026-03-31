import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme } from '@/constants/theme';
import { UserCheck, MapPin, Building2, Globe, MessageSquare, Instagram, Twitter, Facebook } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, View, Platform } from 'react-native';

export default function EmailApprovalMockup() {
  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f0f2f5' }} 
      contentContainerStyle={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 }}
    >
      {/* ── Email Container ── */}
      <Box 
        backgroundColor="white" 
        width="100%" 
        maxWidth={600} 
        style={{ 
          borderRadius: 16, 
          overflow: 'hidden',
          ...Platform.select({
            web: { boxShadow: '0 10px 40px rgba(0,0,0,0.08)' } as any,
            default: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }
          })
        }}
      >
        {/* Brand Header */}
        <Box 
          paddingVertical="32" 
          alignItems="center" 
          backgroundColor="white"
          borderBottomWidth={1}
          borderColor="grey01"
        >
          <Image 
            source={require('@/assets/images/tasktag-logo.png')} 
            style={{ width: 140, height: 35 }} 
            resizeMode="contain" 
          />
        </Box>

        {/* Hero Section */}
        <Box backgroundColor="lightMint" padding="32" alignItems="center" gap="16">
          <Box 
            width={72} 
            height={72} 
            borderRadius="full" 
            backgroundColor="white" 
            alignItems="center" 
            justifyContent="center"
            style={{ marginBottom: 8 }}
          >
            <UserCheck size={36} color={theme.colors.secondaryGreen} strokeWidth={2.5} />
          </Box>
          <Text variant="webHeading32" textAlign="center" style={{ color: theme.colors.textPrimary, fontWeight: '800', lineHeight: 40 }}>
            You're In! 🎉
          </Text>
          <Text variant="webLargeLabel" textAlign="center" style={{ color: theme.colors.secondaryGreen, opacity: 0.8, marginTop: -8 }}>
            Your request has been approved
          </Text>
        </Box>

        {/* Content Section */}
        <Box padding="32" gap="24">
          <Text variant="webBody" style={{ color: theme.colors.textSecondary, lineHeight: 26, textAlign: 'center', fontSize: 18 }}>
            Hi there, great news! <Text fontWeight="700" color="foreground">Linda Smith</Text> has approved your request to join the project team for <Text fontWeight="700" color="foreground">Scott 1</Text>.
          </Text>

          {/* Project Detail Card */}
          <Box 
            backgroundColor="grey01" 
            padding="20" 
            borderRadius="12" 
            borderWidth={1} 
            borderColor="border"
            gap="12"
          >
            <Box flexDirection="row" alignItems="center" gap="12">
              <Building2 size={20} color={theme.colors.grey04} />
              <Box>
                <Text variant="labelMedium" color="grey04">Organization</Text>
                <Text variant="webLabelEmphasized">TaskTag Project</Text>
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="12">
              <MapPin size={20} color={theme.colors.grey04} />
              <Box>
                <Text variant="labelMedium" color="grey04">Project Location</Text>
                <Text variant="webLabelEmphasized">11 N Raintree Hollow Court</Text>
              </Box>
            </Box>
          </Box>

          {/* CTA Button */}
          <Box paddingVertical="16" alignItems="center">
            <Button
              variant="fill"
              size="lg"
              style={{ 
                height: 60, 
                borderRadius: 30, 
                backgroundColor: theme.colors.black, 
                paddingHorizontal: 48,
                minWidth: 260
              }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Open Project Dashboard</Text>
            </Button>
            <Text variant="caption" style={{ marginTop: 16, textAlign: 'center', color: theme.colors.grey04 }}>
              Link expires in 7 days.
            </Text>
          </Box>

          <Box height={1} backgroundColor="border" />

          {/* Security Note */}
          <Box flexDirection="row" gap="12" alignItems="flex-start">
            <Globe size={18} color={theme.colors.grey04} />
            <Text variant="webMetadataPrimary" style={{ flex: 1, color: theme.colors.grey04 }}>
              If you didn't request to join this project, you can safely ignore this email or contact our support team.
            </Text>
          </Box>
        </Box>

        {/* Footer */}
        <Box backgroundColor="grey01" padding="32" alignItems="center" gap="20">
          <Box flexDirection="row" gap="20">
            <Facebook size={20} color={theme.colors.grey04} />
            <Twitter size={20} color={theme.colors.grey04} />
            <Instagram size={20} color={theme.colors.grey04} />
          </Box>
          <Box alignItems="center">
            <Text variant="webMetadataSecondary" textAlign="center" color="grey04">
              © 2026 TaskTag Inc. All rights reserved.
            </Text>
            <Text variant="webMetadataSecondary" textAlign="center" color="grey04">
              9442 N. Capitol of Texas Hwy, Austin, TX 78759
            </Text>
          </Box>
          <Box flexDirection="row" gap="12">
            <Text variant="webLink" style={{ fontSize: 12 }}>Privacy Policy</Text>
            <Text variant="webMetadataSecondary" color="grey03">|</Text>
            <Text variant="webLink" style={{ fontSize: 12 }}>Unsubscribe</Text>
          </Box>
        </Box>
      </Box>

      {/* External Links Placeholder */}
      <Box paddingVertical="32" alignItems="center" gap="8">
        <Text variant="caption" color="grey04">Sent with 💚 from TaskTag Team</Text>
      </Box>
    </ScrollView>
  );
}
