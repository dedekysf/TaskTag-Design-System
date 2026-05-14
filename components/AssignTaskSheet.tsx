import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Image, ImageSourcePropType, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';

// ─── Data ─────────────────────────────────────────────────────────────────────

type SheetItem =
  | { type: 'project'; name: string }
  | { type: 'task'; name: string };

const ALL_ITEMS: SheetItem[] = [
  { type: 'project', name: 'LA Avenue 34 G' },
  { type: 'task', name: 'Fix the sink' },
  { type: 'project', name: 'Welcome to Tasktag! 🎉' },
  { type: 'task', name: 'Create Your First Task' },
  { type: 'task', name: 'Invite Contacts' },
  { type: 'task', name: 'Set a Due Date' },
  { type: 'task', name: 'Mark All the Tasks as Done' },
  { type: 'task', name: 'Archive the Projects' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface AssignTaskSheetProps {
  visible: boolean;
  onClose: () => void;
  ownerPhotoSrc?: ImageSourcePropType;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AssignTaskSheet({ visible, onClose, ownerPhotoSrc }: AssignTaskSheetProps) {
  const theme = useTheme<Theme>();
  const [query, setQuery] = useState('');

  const filtered = ALL_ITEMS.filter(item =>
    item.type === 'project' || item.name.toLowerCase().includes(query.toLowerCase())
  );

  // When filtering tasks, also include the preceding project header only if it has matching tasks
  const displayed: SheetItem[] = query.trim()
    ? (() => {
        const result: SheetItem[] = [];
        let pendingProject: SheetItem | null = null;
        for (const item of ALL_ITEMS) {
          if (item.type === 'project') {
            pendingProject = item;
          } else if (item.name.toLowerCase().includes(query.toLowerCase())) {
            if (pendingProject) { result.push(pendingProject); pendingProject = null; }
            result.push(item);
          }
        }
        return result;
      })()
    : ALL_ITEMS;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}
        onPress={onClose}
      >
        <Pressable onPress={e => e.stopPropagation()}>
          <Box
            backgroundColor="white"
            style={{
              width: 490,
              maxHeight: 560,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0px 8px 32px rgba(0,0,0,0.16)',
            } as any}
          >
            {/* ── Search Row ── */}
            <Box
              flexDirection="row"
              alignItems="center"
              style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 12 }}
            >
              {/* # icon pill */}
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: theme.colors.secondaryGreen,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', lineHeight: 22 }}>#</Text>
              </Box>

              {/* Text input */}
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search Tag"
                placeholderTextColor={theme.colors.grey04}
                autoFocus
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: theme.colors.textPrimary,
                  outlineStyle: 'none',
                } as any}
              />

              {/* Cancel */}
              <Pressable onPress={onClose}>
                <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen }}>
                  Cancel
                </Text>
              </Pressable>
            </Box>

            {/* ── Divider ── */}
            <View style={{ height: 1, backgroundColor: theme.colors.border }} />

            {/* ── List ── */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Section label */}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  color: theme.colors.grey05,
                  paddingHorizontal: 20,
                  paddingTop: 16,
                  paddingBottom: 8,
                }}
              >
                All Projects &amp; Tasks
              </Text>

              {displayed.map((item, idx) =>
                item.type === 'project' ? (
                  <ProjectRow key={`project-${idx}`} name={item.name} />
                ) : (
                  <TaskRow key={`task-${idx}`} name={item.name} ownerPhotoSrc={ownerPhotoSrc} />
                )
              )}
            </ScrollView>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Project Row ──────────────────────────────────────────────────────────────

function ProjectRow({ name }: { name: string }) {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      style={{ paddingHorizontal: 20, paddingVertical: 10, gap: 12 }}
    >
      {/* tt logo */}
      <Box
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: '#0F172A',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Text style={{ color: 'white', fontSize: 11, fontWeight: '700', letterSpacing: -0.5 }}>tt</Text>
      </Box>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#0F172A' }}>{name}</Text>
    </Box>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({ name, ownerPhotoSrc }: { name: string; ownerPhotoSrc?: ImageSourcePropType }) {
  const theme = useTheme<Theme>();

  return (
    <Pressable
      style={({ hovered }: any) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 12,
        backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
      })}
    >
      {/* # icon */}
      <Box style={{ width: 32, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.secondaryGreen, lineHeight: 24 }}>#</Text>
      </Box>

      {/* Task name */}
      <Text style={{ flex: 1, fontSize: 16, fontWeight: '400', color: theme.colors.textPrimary }}>
        {name}
      </Text>

      {/* Owner avatar */}
      {ownerPhotoSrc ? (
        <Image
          source={ownerPhotoSrc}
          style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0 }}
        />
      ) : (
        <Box
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#FBBF24',
            flexShrink: 0,
          }}
        />
      )}
    </Pressable>
  );
}
