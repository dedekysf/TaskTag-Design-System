import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { theme as TTTheme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  BatteryFull,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  Image as ImageIcon,
  FileText,
  HardHat,
  MoreVertical,
  Plus,
  SignalHigh,
  UserPlus,
  WifiHigh,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const TASK = {
  name: 'Install Sink and Faucet in Kitchen',
  project: 'Raintree Hollow Court Renovation',
  assignee: 'Alex Smith',
  assigneeInitials: 'AS',
  assigneeColor: '#e6b566',
  priority: 'High',
  dateRange: 'Dec 25 - Jan 5, 2026',
  description: 'Ensure all room components within the electrical board are thoroughly inspected and reconfigured as needed to meet safety and operational standards.',
};

const CHECKLIST_ITEMS = ['Task item 1', 'Task item 2', 'Task item 3'];

export default function TaskOverviewApp() {
  const theme = useTheme<Theme>();
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <Box flex={1} backgroundColor="grey01">

      {/* Status Bar */}
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

      {/* App Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="md"
        backgroundColor="card"
        borderBottomWidth={1}
        borderColor="border"
        style={{ height: 52 }}
      >
        <Box flexDirection="row" alignItems="center" gap="4">
          <Pressable style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={24} color={theme.colors.foreground} />
          </Pressable>
          <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary, fontFamily: 'Inter_600SemiBold' }}>
            Task Details
          </Text>
        </Box>
        <Pressable style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <MoreVertical size={20} color={theme.colors.foreground} />
        </Pressable>
      </Box>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}>

        {/* Task Name Card */}
        <Box backgroundColor="card" borderRadius="lg" padding="md" style={{ gap: 12 }}>
          {/* Checkbox + Task Name */}
          <Box flexDirection="row" alignItems="flex-start" style={{ gap: 12 }}>
            <View style={{
              width: 20, height: 20, borderRadius: 10,
              borderWidth: 2, borderColor: TTTheme.colors.textSecondary,
              marginTop: 2, flexShrink: 0,
            }} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '400', color: TTTheme.colors.textPrimary, lineHeight: 20, fontFamily: 'Inter_400Regular', letterSpacing: 0.28 }}>
              {TASK.name}
            </Text>
          </Box>

          {/* Tags Row */}
          <Box flexDirection="row" alignItems="center" style={{ gap: 16, paddingLeft: 32 }}>
            {/* Project tag */}
            <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
              <HardHat size={16} color={TTTheme.colors.vividYellow} strokeWidth={1.5} />
              <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '400', color: TTTheme.colors.textSecondary, fontFamily: 'Inter_400Regular', letterSpacing: 0.24 }}>
                {TASK.project.length > 20 ? `${TASK.project.substring(0, 20)}...` : TASK.project}
              </Text>
            </Box>
            {/* Assignee tag */}
            <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: TASK.assigneeColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 8, fontWeight: '400', color: '#fff', fontFamily: 'Inter_400Regular' }}>{TASK.assigneeInitials}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '400', color: TTTheme.colors.textSecondary, fontFamily: 'Inter_400Regular', letterSpacing: 0.24 }}>
                {TASK.assignee}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Action Pills */}
        <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
          {/* Priority */}
          <Box
            flexDirection="row" alignItems="center"
            backgroundColor="card"
            style={{ borderRadius: 40, height: 32, paddingHorizontal: 16, gap: 8 }}
          >
            <ChevronsUp size={16} color={TTTheme.colors.alertRed} />
            <Text style={{ fontSize: 14, fontWeight: '400', color: TTTheme.colors.alertRed, fontFamily: 'Inter_400Regular', letterSpacing: 0.28 }}>
              {TASK.priority}
            </Text>
          </Box>
          {/* Date */}
          <Box
            flexDirection="row" alignItems="center"
            backgroundColor="card"
            style={{ borderRadius: 40, height: 32, paddingHorizontal: 16, gap: 8 }}
          >
            <Calendar size={16} color={TTTheme.colors.textSecondary} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, fontWeight: '400', color: TTTheme.colors.textSecondary, fontFamily: 'Inter_400Regular', letterSpacing: 0.28 }}>
              {TASK.dateRange}
            </Text>
          </Box>
        </Box>

        {/* Description */}
        <Box backgroundColor="card" borderRadius="8" padding="16">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="12">
            <Text variant="webLabelEmphasized" color="foreground">Description</Text>
          </Box>
          <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 16 }}>
            {TASK.description}
          </Text>
        </Box>

        {/* Assignee */}
        <Box backgroundColor="card" borderRadius="8" padding="16">
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="12">
            <Text variant="webLabelEmphasized" color="foreground">Assignee (2)</Text>
            <Text variant="webMetadataPrimary" color="grey05">See All</Text>
          </Box>
          <Box flexDirection="row" gap="8">
            {/* Add Assignee button */}
            <Box alignItems="center" gap="4" width={56}>
              <Box width={56} height={56} borderRadius="full" backgroundColor="grey02" alignItems="center" justifyContent="center">
                <UserPlus size={24} color={theme.colors.grey05} strokeWidth={1.5} />
              </Box>
              <Text variant="webMetadataPrimary" color="grey05" numberOfLines={1}>Assignee</Text>
            </Box>
            {/* Linda Smith (Owner) */}
            <Box alignItems="center" gap="4" width={56}>
              <Box width={56} height={56} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.pastelOrange }}>
                <Text variant="h2" color="white" style={{ fontWeight: '400' }}>LS</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="grey05" numberOfLines={1}>Linda S...</Text>
            </Box>
            {/* Oscar Horizon */}
            <Box alignItems="center" gap="4" width={56}>
              <Box width={56} height={56} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: '#2ba4e0' }}>
                <Text variant="h2" color="white" style={{ fontWeight: '400' }}>OH</Text>
              </Box>
              <Text variant="webMetadataPrimary" color="grey05" numberOfLines={1}>Oscar H...</Text>
            </Box>
          </Box>
        </Box>

        {/* Checklist */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="card" borderRadius="8" padding="16">
          <Box flexDirection="row" alignItems="center" gap="12">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center">
              <FileText size={20} color={theme.colors.white} />
            </Box>
            <Text variant="webLabelEmphasized" color="foreground">
              Checklist (0/{CHECKLIST_ITEMS.length})
            </Text>
          </Box>
          <ChevronRight size={24} color={theme.colors.textSecondary} />
        </Box>

        {/* Activity Log + Files & Media */}
        <Box flexDirection="row" gap="12">
          {/* Activity Log */}
          <Box flex={1} backgroundColor="card" borderRadius="8" padding="16">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="12">
              <Zap size={18} color={theme.colors.white} />
            </Box>
            <Text variant="webLabelEmphasized" color="foreground">Activity Log</Text>
          </Box>
          {/* Files & Media */}
          <Box flex={1} backgroundColor="card" borderRadius="8" padding="16">
            <Box width={32} height={32} borderRadius="8" backgroundColor="black" alignItems="center" justifyContent="center" marginBottom="12">
              <ImageIcon size={18} color={theme.colors.white} />
            </Box>
            <Text variant="webLabelEmphasized" color="foreground">Files & Media</Text>
          </Box>
        </Box>

      </ScrollView>

      {/* Note Banner */}
      {bannerVisible && (
        <View style={{ position: 'absolute', bottom: 104, left: 16, right: 16, backgroundColor: theme.colors.brightYellow, borderRadius: 12, padding: 16, gap: 4 }}>
          <Pressable
            onPress={() => setBannerVisible(false)}
            style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <X size={16} color="#000" />
          </Pressable>
          <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
          <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18, opacity: 0.7, paddingRight: 20 }}>
            After tapping view task, if already installed app then open app, if not direct to app/play store.
          </Text>
        </View>
      )}

      {/* FAB — New Update */}
      <View style={{ position: 'absolute', bottom: 24, right: 16 }}>
        <Pressable
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: TTTheme.colors.black,
            borderRadius: 100, paddingHorizontal: 16, paddingVertical: 12,
          }}
        >
          <Plus size={20} color="#fff" strokeWidth={2} />
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', fontFamily: 'Inter_500Medium' }}>
            New Update
          </Text>
        </Pressable>
      </View>

      {/* Home Indicator */}
      <View style={{ alignItems: 'center', paddingBottom: 8, paddingTop: 4 }}>
        <View style={{ width: 134, height: 5, borderRadius: 5, backgroundColor: TTTheme.colors.black }} />
      </View>

    </Box>
  );
}
