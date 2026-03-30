import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Folder,
  FolderPlus,
  HardHat,
  ImagePlus,
  ListFilter,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView } from 'react-native';

// ── Types ─────────────────────────────────────────────────────────────────────

type ActionPart = { text: string; type: 'normal' | 'mention' | 'bold' };
type IconType =
  | 'plus' | 'trash' | 'check' | 'restore' | 'image'
  | 'user-plus' | 'user-minus' | 'edit' | 'folder' | 'users' | 'map-pin';

interface ActivityItem {
  id: string;
  date: string;
  timestamp: string;
  user: { initials: string; bg: string };
  userName: string;
  actionParts: ActionPart[];
  tags?: { folder?: string; hash?: string; hashVariant?: 'black' | 'crossed-grey' };
  iconType: IconType;
  iconBgKey: keyof Theme['colors'];
}

// ── Avatars ───────────────────────────────────────────────────────────────────

const AV_TV = { initials: 'TV', bg: '#7B8BF5' };

// ── Data (only 3 visible) ─────────────────────────────────────────────────────

const VISIBLE: ActivityItem[] = [
  {
    id: 'j6-1', date: 'Jan 6, 2026', timestamp: '04:00 PM',
    user: AV_TV, userName: 'Tristan Enver Valerio',
    actionParts: [{ text: 'This task was deleted', type: 'normal' }],
    tags: { folder: '1320 Smith Street Residential', hash: 'Plumbing Inspection', hashVariant: 'crossed-grey' },
    iconType: 'trash', iconBgKey: 'alertRed',
  },
  {
    id: 'j6-2', date: 'Jan 6, 2026', timestamp: '02:44 PM',
    user: AV_TV, userName: 'Tristan Enver Valerio',
    actionParts: [
      { text: 'Added ', type: 'normal' },
      { text: '@Dedek Yusuf', type: 'mention' },
      { text: ' as Task Assignee', type: 'normal' },
    ],
    tags: { folder: '1320 Smith Street Residential', hash: 'Plumbing Inspection', hashVariant: 'crossed-grey' },
    iconType: 'user-plus', iconBgKey: 'blue',
  },
  {
    id: 'j6-3', date: 'Jan 6, 2026', timestamp: '01:44 PM',
    user: AV_TV, userName: 'Tristan Enver Valerio',
    actionParts: [{ text: 'Completed this task', type: 'normal' }],
    tags: { folder: '1320 Smith Street Residential', hash: 'Foundation Inspection', hashVariant: 'black' },
    iconType: 'check', iconBgKey: 'secondaryGreen',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ActivityIconBadge({ type, bg }: { type: IconType; bg: string }) {
  const white = '#FFFFFF';
  const s = 9;
  const icon = (() => {
    switch (type) {
      case 'trash':      return <Trash2 size={s} color={white} />;
      case 'check':      return <Check size={s} color={white} />;
      case 'restore':    return <RotateCcw size={s} color={white} />;
      case 'image':      return <ImagePlus size={s} color={white} />;
      case 'user-plus':  return <UserPlus size={s} color={white} />;
      case 'user-minus': return <UserMinus size={s} color={white} />;
      case 'folder':     return <Folder size={s} color={white} />;
      case 'users':      return <Users size={s} color={white} />;
      default:           return <Plus size={s} color={white} />;
    }
  })();
  return (
    <Box
      width={16} height={16} borderRadius="full"
      alignItems="center" justifyContent="center"
      style={{ backgroundColor: bg, position: 'absolute', bottom: 0, right: -4 } as any}
    >
      {icon}
    </Box>
  );
}

function ActivityRow({ item, isLast }: { item: ActivityItem; isLast: boolean }) {
  const theme = useTheme<Theme>();
  const iconBg = (theme.colors as any)[item.iconBgKey] ?? theme.colors.textSecondary;

  return (
    <Box
      flexDirection="row"
      gap="16"
      paddingTop="16"
      borderBottomWidth={isLast ? 2 : 0}
      borderColor="border"
      style={isLast ? { borderStyle: 'dashed', paddingBottom: 16 } as any : undefined}
    >
      {/* Avatar + badge */}
      <Box style={{ position: 'relative', width: 40, height: 40 } as any}>
        <Box
          width={40} height={40} borderRadius="full"
          alignItems="center" justifyContent="center"
          style={{ backgroundColor: item.user.bg }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
            {item.user.initials}
          </Text>
        </Box>
        <ActivityIconBadge type={item.iconType} bg={iconBg} />
      </Box>

      {/* Content */}
      <Box
        flex={1}
        borderBottomWidth={isLast ? 0 : 1}
        borderColor="border"
        style={{ paddingBottom: 16 }}
      >
        <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
          <Text variant="webLabelEmphasized" color="foreground">{item.userName}</Text>
          <Text variant="webMetadataSecondary" color="textSecondary">{item.timestamp}</Text>
        </Box>

        <Text variant="webBody" color="foreground" marginBottom="8">
          {item.actionParts.map((part, i) => (
            <Text
              key={i}
              variant="webBody"
              color={part.type === 'mention' ? 'blue' : 'foreground'}
              style={part.type === 'bold' ? { fontWeight: '700' } : undefined}
            >
              {part.text}
            </Text>
          ))}
        </Text>

        {item.tags && (
          <Box flexDirection="row" alignItems="center" gap="8" flexWrap="wrap">
            {item.tags.folder && (
              <Box
                flexDirection="row" alignItems="center" gap="4"
                paddingHorizontal="8" borderRadius="4"
                style={{ backgroundColor: theme.colors.secondaryGreen, height: 20, maxWidth: 128 } as any}
              >
                <Folder size={10} color="#fff" />
                <Text
                  variant="webMetadataPrimary"
                  numberOfLines={1}
                  style={{ fontWeight: '500', color: '#fff', flex: 1 }}
                >
                  {item.tags.folder}
                </Text>
              </Box>
            )}
            {item.tags.hash && (() => {
              const crossed = item.tags.hashVariant === 'crossed-grey';
              return (
                <Box
                  flexDirection="row" alignItems="center" gap="4"
                  paddingHorizontal="8" borderRadius="4"
                  style={{ backgroundColor: crossed ? theme.colors.grey03 : theme.colors.black, height: 20, maxWidth: 128 } as any}
                >
                  <Text style={{ fontSize: 10, color: crossed ? theme.colors.grey05 : '#fff' }}>#</Text>
                  <Text
                    variant="webMetadataPrimary"
                    numberOfLines={1}
                    style={{
                      fontWeight: '500',
                      color: crossed ? theme.colors.grey05 : '#fff',
                      textDecorationLine: crossed ? 'line-through' : 'none',
                      flex: 1,
                    }}
                  >
                    {item.tags.hash!}
                  </Text>
                </Box>
              );
            })()}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function SkeletonRow({ isLast }: { isLast: boolean }) {
  return (
    <Box
      flexDirection="row"
      gap="16"
      paddingVertical="16"
      borderBottomWidth={isLast ? 0 : 1}
      borderColor="border"
    >
      {/* Avatar skeleton */}
      <Box width={40} height={40} borderRadius="full" backgroundColor="grey03" />

      {/* Content skeleton */}
      <Box flex={1} gap="8">
        <Box flexDirection="row" alignItems="center" gap="8">
          <Box width={140} height={12} borderRadius="4" backgroundColor="grey03" />
          <Box width={50} height={10} borderRadius="4" backgroundColor="grey03" />
        </Box>
        <Box style={{ maxWidth: 500, width: '80%' }} height={10} borderRadius="4" backgroundColor="grey03" />
        <Box flexDirection="row" gap="8" marginTop="4">
          <Box width={100} height={20} borderRadius="4" backgroundColor="grey03" />
          <Box width={100} height={20} borderRadius="4" backgroundColor="grey03" />
        </Box>
      </Box>
    </Box>
  );
}

// ── Upgrade Modal ─────────────────────────────────────────────────────────────

const FEATURES = [
  '2TB shared team storage',
  'Unlimited projects & tasks',
  'Add unlimited users to projects & tasks',
  'Team admin & member roles',
  'Centralized billing',
  'Global activity log for full visibility',
];

function UpgradeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const theme = useTheme<Theme>();
  const [showAllBilling, setShowAllBilling] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box
            flexDirection="row"
            borderRadius="16"
            style={{ borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden', width: 800, height: 600 } as any}
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
                    height={48} flexDirection="row" alignItems="center" justifyContent="center"
                    paddingHorizontal="16" borderRadius="8"
                    style={{ gap: 12, backgroundColor: theme.colors.grey01, borderWidth: 1, borderColor: theme.colors.border } as any}
                  >
                    <HardHat size={20} color={theme.colors.secondaryGreen} />
                    <Text variant="webLabelSmall" color="textSecondary">Scott 1</Text>
                  </Box>
                </Box>

                {/* Billing Cycle */}
                <Box style={{ gap: 8 } as any}>
                  <Text variant="webLabelSmall" color="textPrimary">Billing Cycle</Text>

                  {/* Yearly */}
                  <Pressable onPress={() => setSelectedPlan('yearly')}>
                    <Box
                      flexDirection="row" alignItems="center" justifyContent="space-between"
                      padding="12" borderRadius="8"
                      style={{ borderWidth: 1, borderColor: selectedPlan === 'yearly' ? theme.colors.secondaryGreen : theme.colors.border } as any}
                    >
                      <Box style={{ gap: 2 } as any}>
                        <Text variant="webLabelSmall" color="textSecondary">Yearly</Text>
                        <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
                          <Text variant="webSecondaryBody" color="textSecondary">$16 /member/month</Text>
                          <Box
                            paddingHorizontal="4" borderRadius="4"
                            style={{ backgroundColor: theme.colors.lightMint, paddingVertical: 4 } as any}
                          >
                            <Text variant="webMetadataPrimary" color="secondaryGreen">Save 20%</Text>
                          </Box>
                        </Box>
                      </Box>
                      {selectedPlan === 'yearly' && <Check size={16} color={theme.colors.secondaryGreen} />}
                    </Box>
                  </Pressable>

                  {/* Monthly — shown when expanded */}
                  {showAllBilling && (
                    <Pressable onPress={() => setSelectedPlan('monthly')}>
                      <Box
                        padding="12" borderRadius="8"
                        style={{ borderWidth: 1, borderColor: selectedPlan === 'monthly' ? theme.colors.secondaryGreen : theme.colors.border } as any}
                      >
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                          <Box style={{ gap: 2 } as any}>
                            <Text variant="webLabelSmall" color="textSecondary">Monthly</Text>
                            <Text variant="webSecondaryBody" color="textSecondary">$20 /member/month</Text>
                          </Box>
                          {selectedPlan === 'monthly' && <Check size={16} color={theme.colors.secondaryGreen} />}
                        </Box>
                      </Box>
                    </Pressable>
                  )}

                  {/* Toggle */}
                  <Pressable onPress={() => setShowAllBilling(v => !v)}>
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
                    <Text variant="webSecondaryBody" color="textSecondary" fontWeight="700">
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
              flex={1} padding="24"
              alignItems="center" justifyContent="center"
              style={{ backgroundColor: theme.colors.lightMint, gap: 16, position: 'relative' } as any}
            >
              {/* Close button */}
              <Pressable
                onPress={onClose}
                style={{ position: 'absolute', top: 20, right: 20, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' } as any}
              >
                <X size={20} color={(theme.colors as any).grey06} />
              </Pressable>

              {/* Illustration */}
              <Image
                source={require('@/assets/images/il-collaboration.png')}
                style={{ width: 200, height: 200, resizeMode: 'contain' }}
              />

              {/* Title */}
              <Text variant="webLargeLabel" color="textPrimary" style={{ alignSelf: 'flex-start' }}>
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

// ── Info Banner ────────────────────────────────────────────────────────────────

function InfoBanner({ onUpgrade }: { onUpgrade: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      marginHorizontal="md"
      marginTop="16"
      marginBottom="4"
      borderRadius="12"
      padding="16"
      style={{
        backgroundColor: theme.colors.lightMint,
        borderWidth: 1,
        borderColor: theme.colors.secondaryGreen,
      } as any}
    >
      <Box flexDirection="row" alignItems="center" gap="12">
        <Zap size={24} color={theme.colors.secondaryGreen} fill={theme.colors.secondaryGreen} />
        <Box flex={1}>
          <Text variant="webLargeLabel" color="textPrimary" marginBottom="4">
            There's more activity waiting for you
          </Text>
          <Text variant="webSecondaryBody" color="textSecondary" style={{ lineHeight: 18 }}>
            {"You're seeing just 3 events. "}
            <Text variant="webSecondaryBody" color="textSecondary" style={{ fontWeight: '600', fontFamily: 'Inter_600SemiBold' }}>
              Upgrade to Teams
            </Text>
            {" for full visibility across all your projects."}
          </Text>
        </Box>
        <Button
          variant="fill"
          size="sm"
          onPress={onUpgrade}
          style={{ backgroundColor: theme.colors.black, minWidth: 100 }}
        >
          <Text variant="labelMedium" color="white">Upgrade to Teams</Text>
        </Button>
      </Box>
    </Box>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function GlobalActivityLogPaywalled() {
  const theme = useTheme<Theme>();
  const [search, setSearch] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const lowerSearch = search.toLowerCase();
  const filtered = lowerSearch
    ? VISIBLE.filter(a =>
        a.userName.toLowerCase().includes(lowerSearch) ||
        a.actionParts.some(p => p.text.toLowerCase().includes(lowerSearch)) ||
        a.tags?.folder?.toLowerCase().includes(lowerSearch) ||
        a.tags?.hash?.toLowerCase().includes(lowerSearch)
      )
    : VISIBLE;

  return (
    <Box flex={1} backgroundColor="grey02" alignItems="center">
      <Box flex={1} width="100%" maxWidth={1114}>

        {/* ── Header ── */}
        <Box backgroundColor="card" borderBottomWidth={1} borderColor="border">
          <Box
            flexDirection="row" alignItems="center" justifyContent="space-between"
            paddingHorizontal="md" paddingVertical="16"
          >
            <Text variant="webHeading22" color="foreground">Global Activity Log</Text>
            <Box flexDirection="row" alignItems="center" gap="12">
              <Pressable hitSlop={8} style={{ height: 32, alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} color={(theme.colors as any).grey06} />
              </Pressable>
              <Button variant="fill" size="sm" style={{ minWidth: 120, backgroundColor: theme.colors.black }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Plus size={15} color={theme.colors.white} />
                  <Text variant="labelMedium" color="white">New Task</Text>
                </Box>
              </Button>
            </Box>
          </Box>

          {/* Search + filters */}
          <Box
            flexDirection="row" alignItems="center" gap="12"
            paddingHorizontal="md" paddingBottom="16"
            borderTopWidth={1} borderColor="border" paddingTop="16"
          >
            <Box flex={1} style={{ marginBottom: -16 } as any}>
              <TextInput
                icon={Search}
                iconColor={(theme.colors as any).grey06}
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                size="md"
                showClearButton
              />
            </Box>
            <Button variant="ghost" color="secondary" size="sm" style={{ height: 40 }}>
              <Box flexDirection="row" alignItems="center" gap="8">
                <ListFilter size={15} color={theme.colors.black} />
                <Text variant="webBody" color="foreground">Filter</Text>
              </Box>
            </Button>
            <Button variant="ghost" color="secondary" size="sm" style={{ height: 40 }}>
              <Box flexDirection="row" alignItems="center" gap="8">
                <FolderPlus size={15} color={theme.colors.black} />
                <Text variant="webBody" color="foreground">Export Timesheet</Text>
              </Box>
            </Button>
          </Box>
        </Box>

        {/* ── Content ── */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#FFFFFF' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>

          {/* Date header */}
          <Box
            paddingHorizontal="md" paddingVertical="12"
            backgroundColor="grey01"
          >
            <Text variant="webLabelSmall" color="textSecondary">Jan 6, 2026</Text>
          </Box>

          {/* 3 visible activity rows */}
          <Box paddingHorizontal="md">
            {filtered.length === 0 ? (
              <Box alignItems="center" paddingVertical="40">
                <Text variant="webBody" color="textSecondary">No results for "{search}"</Text>
              </Box>
            ) : (
              filtered.map((item, i) => (
                <ActivityRow key={item.id} item={item} isLast={i === filtered.length - 1} />
              ))
            )}
          </Box>

          {/* Info banner above skeleton */}
          <InfoBanner onUpgrade={() => setShowUpgradeModal(true)} />

          {/* 1 skeleton row */}
          <Box paddingHorizontal="md">
            <SkeletonRow isLast={true} />
          </Box>

        </ScrollView>

      </Box>

      <UpgradeModal visible={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </Box>
  );
}
