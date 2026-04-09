/**
 * UpgradeModal
 *
 * A reusable payment/upgrade modal that prompts the user to upgrade
 * to the Team Plan. Displays plan selection (Yearly / Monthly), pricing,
 * a feature checklist, and a "Continue to Checkout" CTA.
 *
 * Usage:
 *   <UpgradeModal visible={showModal} onClose={() => setShowModal(false)} />
 */

import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Check,
  ChevronDown,
  ChevronUp,
  HardHat,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable } from 'react-native';

// ── Feature list ──────────────────────────────────────────────────────────────

const FEATURES = [
  '2TB shared team storage',
  'Unlimited projects & tasks',
  'Add unlimited users to projects & tasks',
  'Team admin & member roles',
  'Centralized billing',
  'Global activity log for full visibility',
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface UpgradeModalProps {
  /** Controls modal visibility */
  visible: boolean;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /** Optional team name shown in the Team selector. Defaults to "Scott 1". */
  teamName?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function UpgradeModal({
  visible,
  onClose,
  teamName = 'Scott 1',
}: UpgradeModalProps) {
  const theme = useTheme<Theme>();
  const [showAllBilling, setShowAllBilling] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box
            flexDirection="row"
            borderRadius="16"
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: 'hidden',
              width: 800,
              height: 600,
            } as any}
          >
            {/* ── Left panel ── */}
            <Box
              width={380}
              padding="24"
              backgroundColor="card"
              justifyContent="space-between"
            >
              {/* Top content */}
              <Box style={{ gap: 24 } as any}>

                {/* Header */}
                <Box style={{ gap: 4 } as any}>
                  <Text variant="webLabelEmphasized" color="foreground">
                    Upgrade to Team Plan
                  </Text>
                  <Text variant="webMetadataPrimary" color="grey05">
                    Power up your workspace with advanced team features.
                  </Text>
                </Box>

                {/* Team Selector */}
                <Box style={{ gap: 8 } as any}>
                  <Text variant="webLabelSmall" color="textPrimary">Team</Text>
                  <Box
                    height={48}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    paddingHorizontal="16"
                    borderRadius="8"
                    style={{
                      gap: 12,
                      backgroundColor: theme.colors.grey01,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                    } as any}
                  >
                    <HardHat size={20} color={theme.colors.secondaryGreen} />
                    <Text variant="webLabelSmall" color="textSecondary">{teamName}</Text>
                  </Box>
                </Box>

                {/* Billing Cycle */}
                <Box style={{ gap: 8 } as any}>
                  <Text variant="webLabelSmall" color="textPrimary">Billing Cycle</Text>

                  {/* Yearly */}
                  <Pressable onPress={() => setSelectedPlan('yearly')}>
                    <Box
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      padding="12"
                      borderRadius="8"
                      style={{
                        borderWidth: 1,
                        borderColor: selectedPlan === 'yearly'
                          ? theme.colors.secondaryGreen
                          : theme.colors.border,
                      } as any}
                    >
                      <Box style={{ gap: 2 } as any}>
                        <Text variant="webLabelSmall" color="textSecondary">Yearly</Text>
                        <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
                          <Text variant="webSecondaryBody" color="textSecondary">
                            $16 /member/month
                          </Text>
                          <Box
                            paddingHorizontal="4"
                            borderRadius="4"
                            style={{ backgroundColor: theme.colors.lightMint, paddingVertical: 4 } as any}
                          >
                            <Text variant="webMetadataPrimary" color="secondaryGreen">Save 20%</Text>
                          </Box>
                        </Box>
                      </Box>
                      {selectedPlan === 'yearly' && (
                        <Check size={16} color={theme.colors.secondaryGreen} />
                      )}
                    </Box>
                  </Pressable>

                  {/* Monthly — shown when expanded */}
                  {showAllBilling && (
                    <Pressable onPress={() => setSelectedPlan('monthly')}>
                      <Box
                        padding="12"
                        borderRadius="8"
                        style={{
                          borderWidth: 1,
                          borderColor: selectedPlan === 'monthly'
                            ? theme.colors.secondaryGreen
                            : theme.colors.border,
                        } as any}
                      >
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Box style={{ gap: 2 } as any}>
                            <Text variant="webLabelSmall" color="textSecondary">Monthly</Text>
                            <Text variant="webSecondaryBody" color="textSecondary">
                              $20 /member/month
                            </Text>
                          </Box>
                          {selectedPlan === 'monthly' && (
                            <Check size={16} color={theme.colors.secondaryGreen} />
                          )}
                        </Box>
                      </Box>
                    </Pressable>
                  )}

                  {/* Toggle */}
                  <Pressable onPress={() => setShowAllBilling((v) => !v)}>
                    <Box flexDirection="row" alignItems="center" style={{ gap: 4 } as any}>
                      <Text variant="webMetadataPrimary" color="grey05">
                        {showAllBilling ? 'view less' : 'view more'}
                      </Text>
                      {showAllBilling
                        ? <ChevronUp size={14} color={theme.colors.grey05} />
                        : <ChevronDown size={14} color={theme.colors.grey05} />
                      }
                    </Box>
                  </Pressable>
                </Box>
              </Box>

              {/* Bottom: Pricing + CTA */}
              <Box style={{ gap: 16 } as any}>
                <Box style={{ gap: 4 } as any}>
                  <Text variant="webSecondaryBody" color="textSecondary">
                    {"You'll be charged "}
                    <Text
                      variant="webSecondaryBody"
                      color="textSecondary"
                      fontWeight="700"
                    >
                      {selectedPlan === 'yearly' ? '$192 per year.' : '$20 per month.'}
                    </Text>
                  </Text>
                  <Text variant="webMetadataPrimary" color="textSecondary">
                    Applicable taxes will be calculated at checkout
                  </Text>
                </Box>
                <Button
                  variant="fill"
                  size="lg"
                  style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen } as any}
                >
                  <Text variant="labelMedium" color="white">Continue to Checkout</Text>
                </Button>
              </Box>
            </Box>

            {/* ── Right panel ── */}
            <Box
              flex={1}
              padding="24"
              alignItems="center"
              justifyContent="center"
              style={{
                backgroundColor: theme.colors.lightMint,
                gap: 16,
                position: 'relative',
              } as any}
            >
              {/* Close button */}
              <Pressable
                onPress={onClose}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 28,
                  height: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                } as any}
              >
                <X size={20} color={(theme.colors as any).grey06} />
              </Pressable>

              {/* Illustration */}
              <Image
                source={require('@/assets/images/il-collaboration.png')}
                style={{ width: 200, height: 200, resizeMode: 'contain' }}
              />

              {/* Title */}
              <Text
                variant="webLargeLabel"
                color="textPrimary"
                style={{ alignSelf: 'flex-start' }}
              >
                Everything in the Team Plan:
              </Text>

              {/* Feature list */}
              <Box style={{ gap: 16, alignSelf: 'stretch' } as any}>
                {FEATURES.map((f, i) => (
                  <Box key={i} flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
                    <Check size={16} color={theme.colors.secondaryGreen} />
                    <Text variant="webMetadataPrimary" color="textSecondary">{f}</Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
