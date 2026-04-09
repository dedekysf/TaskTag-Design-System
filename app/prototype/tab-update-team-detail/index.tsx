import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { router } from 'expo-router';
import { Clock, CreditCard, XCircle } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

const VARIANTS = [
  {
    key: 'free-trial',
    label: 'Free Trial',
    description: 'Team on active free trial period',
    Icon: Clock,
    color: TTTheme.colors.secondaryGreen,
    route: '/prototype/tab-update-team-detail/free-trial',
  },
  {
    key: 'subscribe',
    label: 'Subscribe',
    description: 'Team with active subscription',
    Icon: CreditCard,
    color: TTTheme.colors.blue,
    route: '/prototype/tab-update-team-detail/subscribe',
  },
  {
    key: 'expired',
    label: 'Expired',
    description: 'Team with expired subscription',
    Icon: XCircle,
    color: TTTheme.colors.alertRed,
    route: '/prototype/tab-update-team-detail/expired',
  },
];

export default function TabUpdateTeamDetailIndex() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Box width="100%" maxWidth={480}>
        <Text
          variant="h2"
          style={{ color: TTTheme.colors.textSecondary, marginBottom: 32, textAlign: 'center' }}
        >
          Tab update for team detail
        </Text>

        <Box style={{ gap: 16 }}>
          {VARIANTS.map(({ key, label, description, Icon, color, route }) => (
            <Pressable
              key={key}
              onPress={() => router.push(route as any)}
              style={({ hovered, pressed }: any) => ({
                backgroundColor: hovered ? TTTheme.colors.card : TTTheme.colors.background,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: TTTheme.colors.border,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                opacity: pressed ? 0.85 : 1,
                cursor: 'pointer',
              })}
            >
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: key === 'subscribe' ? TTTheme.colors.lightSky : key === 'expired' ? TTTheme.colors.lightPink : color + '1A',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} color={color} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text
                  variant="webLargeLabel"
                  style={{ color: TTTheme.colors.textSecondary, fontWeight: '600', marginBottom: 2 }}
                >
                  {label}
                </Text>
                <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05 }}>
                  {description}
                </Text>
              </Box>
            </Pressable>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
