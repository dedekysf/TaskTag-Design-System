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
  FileImage,
  FileText,
  MoreVertical,
  Plus,
  SignalHigh,
  UserPlus,
  WifiHigh,
  Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

const TASK = {
  name: 'Room renovation and Electricity board fix and reconfiguration label all circuit connections properly, replace damaged breakers, and verify power stability before final inspection.',
  project: 'LA Avenue 34 G',
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
              <Zap size={16} color={TTTheme.colors.vividYellow} strokeWidth={1.5} />
              <Text style={{ fontSize: 12, fontWeight: '400', color: TTTheme.colors.textSecondary, fontFamily: 'Inter_400Regular', letterSpacing: 0.24 }}>
                {TASK.project}
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
            style={{ borderRadius: 40, paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
          >
            <ChevronsUp size={16} color={TTTheme.colors.alertRed} />
            <Text style={{ fontSize: 14, fontWeight: '400', color: TTTheme.colors.alertRed, fontFamily: 'Inter_400Regular', letterSpacing: 0.28 }}>
              {TASK.priority}
            </Text>
            <ChevronRight size={16} color={TTTheme.colors.grey04} />
          </Box>
          {/* Date */}
          <Box
            flexDirection="row" alignItems="center"
            backgroundColor="card"
            style={{ borderRadius: 40, paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
          >
            <Calendar size={16} color={TTTheme.colors.textSecondary} strokeWidth={1.5} />
            <Text style={{ fontSize: 14, fontWeight: '400', color: TTTheme.colors.textSecondary, fontFamily: 'Inter_400Regular', letterSpacing: 0.28 }}>
              {TASK.dateRange}
            </Text>
            <ChevronRight size={16} color={TTTheme.colors.grey04} />
          </Box>
        </Box>

        {/* Description */}
        <Box backgroundColor="card" borderRadius="lg" style={{ paddingHorizontal: 15, paddingVertical: 16, gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.black, fontFamily: 'Inter_600SemiBold' }}>
            Description
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '400', color: TTTheme.colors.textSecondary, lineHeight: 16, fontFamily: 'Inter_400Regular', letterSpacing: 0.24 }}>
            {TASK.description}
          </Text>
        </Box>

        {/* Assignee */}
        <Box backgroundColor="card" borderRadius="lg" style={{ paddingHorizontal: 15, paddingVertical: 16, gap: 12 }}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.black, fontFamily: 'Inter_600SemiBold' }}>
              Assignee (1)
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '400', color: TTTheme.colors.grey04, fontFamily: 'Inter_400Regular' }}>
              See All
            </Text>
          </Box>
          <Box flexDirection="row" style={{ gap: 8 }}>
            {/* Add Assignee button */}
            <Box alignItems="center" style={{ gap: 4, width: 56 }}>
              <View style={{ width: 56, height: 56, borderRadius: 40, backgroundColor: TTTheme.colors.grey01, alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={24} color={TTTheme.colors.textSecondary} />
              </View>
              <Text style={{ fontSize: 12, color: TTTheme.colors.grey04, fontFamily: 'Inter_400Regular', textAlign: 'center' }}>Assignee</Text>
            </Box>
            {/* Assignee avatar */}
            <Box alignItems="center" style={{ gap: 4, width: 56 }}>
              <View style={{ width: 56, height: 56, borderRadius: 40, backgroundColor: TASK.assigneeColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff', fontFamily: 'Inter_600SemiBold' }}>CS</Text>
              </View>
              <Text numberOfLines={1} style={{ fontSize: 12, color: TTTheme.colors.grey04, fontFamily: 'Inter_400Regular', textAlign: 'center', width: 56 }}>Chelse...</Text>
            </Box>
          </Box>
        </Box>

        {/* Checklist */}
        <Box backgroundColor="card" borderRadius="lg" style={{ paddingHorizontal: 15, paddingVertical: 16 }}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="row" alignItems="center" style={{ gap: 9 }}>
              <View style={{ backgroundColor: TTTheme.colors.black, borderRadius: 6, padding: 6 }}>
                <FileText size={20} color="#fff" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.black, fontFamily: 'Inter_600SemiBold' }}>
                Checklist (0/{CHECKLIST_ITEMS.length})
              </Text>
            </Box>
            <ChevronRight size={24} color={TTTheme.colors.textSecondary} />
          </Box>
        </Box>

        {/* Activity Log + Files & Media */}
        <Box flexDirection="row" style={{ gap: 12 }}>
          {/* Activity Log */}
          <Box flex={1} backgroundColor="card" borderRadius="lg" style={{ padding: 16, gap: 12 }}>
            <View style={{ backgroundColor: TTTheme.colors.black, borderRadius: 6, padding: 6, alignSelf: 'flex-start' }}>
              <Zap size={20} color="#fff" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.black, fontFamily: 'Inter_600SemiBold' }}>
              Activity Log
            </Text>
          </Box>
          {/* Files & Media */}
          <Box flex={1} backgroundColor="card" borderRadius="lg" style={{ padding: 16, gap: 12 }}>
            <View style={{ backgroundColor: TTTheme.colors.black, borderRadius: 6, padding: 6, alignSelf: 'flex-start' }}>
              <FileImage size={20} color="#fff" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.black, fontFamily: 'Inter_600SemiBold' }}>
              {`Files & Media`}
            </Text>
          </Box>
        </Box>

      </ScrollView>

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
