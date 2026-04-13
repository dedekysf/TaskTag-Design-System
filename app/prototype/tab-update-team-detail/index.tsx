import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Clock, CreditCard, XCircle } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

const VARIANTS = [
  {
    key: 'free-trial',
    label: 'Free Trial',
    description: 'Team on active free trial period',
    updates: [
      'Default tab changed to Overview',
      'Dot indicator added on Invoice tab',
      'Overview tab content',
      'Invoice tab content',
    ],
    Icon: Clock,
    color: TTTheme.colors.secondaryGreen,
    route: '/prototype/tab-update-team-detail/free-trial',
  },
  {
    key: 'subscribe',
    label: 'Subscribe',
    description: 'Team with active subscription',
    updates: [
      'Default tab changed to Overview',
      'Overview tab content',
      'Invoice tab content',
    ],
    Icon: CreditCard,
    color: TTTheme.colors.blue,
    route: '/prototype/tab-update-team-detail/subscribe',
  },
  {
    key: 'expired',
    label: 'Expired',
    description: 'Team with expired subscription',
    updates: [
      'Default tab changed to Overview',
      'Dot indicator added on Invoice tab',
      'Overview tab content',
      'Invoice tab content',
    ],
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
      <Box width="100%" maxWidth={960}>
        <Text
          variant="h2"
          style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}
        >
          Tab Update For Team Detail
        </Text>

        <Text
          variant="webSecondaryBody"
          style={{ color: TTTheme.colors.textSecondary, textAlign: 'center', marginBottom: 16 }}
        >
          This feature affects 3 states in team details. Please access each state to see the changes.
        </Text>

        <Box
          style={{
            backgroundColor: TTTheme.colors.lightSky,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: TTTheme.colors.blue,
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginBottom: 32,
            alignItems: 'center',
          }}
        >
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.blue, textAlign: 'center' }}>
            This page is not for implementation — it is only an explanation. The page to be implemented is the next one.
          </Text>
        </Box>

        <Box style={{ flexDirection: 'row', gap: 16, alignItems: 'stretch' }}>
          {VARIANTS.map(({ key, label, description, updates, Icon, color, route }) => (
            <Box
              key={key}
              style={{
                flex: 1,
                backgroundColor: TTTheme.colors.card,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: TTTheme.colors.border,
                padding: 24,
                gap: 0,
              }}
            >
              {/* Icon */}
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: key === 'subscribe' ? TTTheme.colors.lightSky : key === 'expired' ? TTTheme.colors.lightPink : color + '1A',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Icon size={24} color={color} />
              </Box>

              {/* Label + description */}
              <Box style={{ flex: 1, marginBottom: 16 }}>
                <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, fontWeight: '600', lineHeight: 24, marginBottom: 4 }}>
                  {label}
                </Text>
                <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, lineHeight: 20 }}>
                  {description}
                </Text>

                {updates && (
                  <Box style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: TTTheme.colors.border, gap: 6 }}>
                    <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, marginBottom: 6 }}>
                      WHAT'S UPDATED
                    </Text>
                    {updates.map((item, i) => (
                      <Box key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                        <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, lineHeight: 20 }}>·</Text>
                        <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, lineHeight: 20 }}>{item}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              {/* Button */}
              <Pressable
                onPress={() => window.open(route, '_blank')}
                style={({ pressed }: any) => ({
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: TTTheme.colors.black,
                  backgroundColor: 'transparent',
                  opacity: pressed ? 0.75 : 1,
                  cursor: 'pointer',
                })}
              >
                <Text variant="webLabelEmphasized" style={{ color: TTTheme.colors.black }}>View Detail</Text>
              </Pressable>
            </Box>
          ))}
        </Box>
      </Box>
    </ScrollView>
  );
}
