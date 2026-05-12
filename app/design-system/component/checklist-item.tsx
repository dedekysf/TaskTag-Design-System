import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { GripVertical, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

function ChecklistItem({
  text,
  checked,
  onToggle,
  onDelete,
  disabled,
}: {
  text: string;
  checked: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row" alignItems="center" gap="sm"
      paddingVertical="sm" paddingHorizontal="md"
      borderBottomWidth={1} borderBottomColor="border"
    >
      <GripVertical size={16} color={theme.colors.grey04} />

      <Pressable onPress={disabled ? undefined : onToggle}
        style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2,
          borderColor: checked ? theme.colors.secondaryGreen : theme.colors.grey04,
          backgroundColor: checked ? theme.colors.secondaryGreen : '#fff',
          alignItems: 'center', justifyContent: 'center' }}>
        {checked && (
          <Box style={{ width: 10, height: 6, borderLeftWidth: 2, borderBottomWidth: 2,
            borderColor: '#fff', transform: [{ rotate: '-45deg' }, { translateY: -1 }] }} />
        )}
      </Pressable>

      <Text flex={1} variant="webBody"
        style={{
          color: checked ? theme.colors.grey05 : theme.colors.foreground,
          textDecorationLine: checked ? 'line-through' : 'none',
        }}>
        {text}
      </Text>

      {onDelete && (
        <Pressable onPress={onDelete}>
          <Trash2 size={16} color={theme.colors.grey04} />
        </Pressable>
      )}
    </Box>
  );
}

function ChecklistDemo() {
  const [items, setItems] = useState([
    { id: '1', text: 'Electrical Board Service Task Check Completed', checked: true },
    { id: '2', text: 'Label all circuits clearly and accurately', checked: true },
    { id: '3', text: 'Replace damaged breakers immediately', checked: false },
    { id: '4', text: 'Document completed inspections with photos', checked: false },
  ]);

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const del = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
      {items.map(item => (
        <ChecklistItem key={item.id} text={item.text} checked={item.checked}
          onToggle={() => toggle(item.id)} onDelete={() => del(item.id)} />
      ))}
    </Box>
  );
}

export default function ChecklistItemScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Checklist Item" totalItems={2} />

        <ComponentSection
          title="Interactive List"
          githubUrls={[]}
          usageCode={`const [items, setItems] = useState([
  { id: '1', text: 'Check electrical board', checked: true },
  { id: '2', text: 'Replace damaged breakers', checked: false },
]);

{items.map(item => (
  <Box key={item.id} flexDirection="row" alignItems="center" gap="sm"
    paddingVertical="sm" paddingHorizontal="md"
    borderBottomWidth={1} borderBottomColor="border">
    <GripVertical size={16} color={theme.colors.grey04} />

    {/* Checkbox */}
    <Pressable onPress={() => toggle(item.id)}
      style={{ width: 20, height: 20, borderRadius: 4, borderWidth: 2,
        borderColor: item.checked ? theme.colors.secondaryGreen : theme.colors.grey04,
        backgroundColor: item.checked ? theme.colors.secondaryGreen : '#fff',
        alignItems: 'center', justifyContent: 'center' }}>
      {item.checked && <View style={{ width: 10, height: 6, borderLeftWidth: 2,
        borderBottomWidth: 2, borderColor: '#fff', transform: [{ rotate: '-45deg' }] }} />}
    </Pressable>

    <Text flex={1} style={{
      color: item.checked ? theme.colors.grey05 : theme.colors.foreground,
      textDecorationLine: item.checked ? 'line-through' : 'none',
    }}>{item.text}</Text>

    <Pressable onPress={() => del(item.id)}>
      <Trash2 size={16} color={theme.colors.grey04} />
    </Pressable>
  </Box>
))}`}
        >
          <ChecklistDemo />
        </ComponentSection>

        <ComponentSection
          title="States"
          githubUrls={[]}
          usageCode={`// Unchecked
<ChecklistItem text="Replace damaged breakers" checked={false} />

// Checked (with strikethrough)
<ChecklistItem text="Label all circuits" checked={true} />`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <ChecklistItem text="Replace damaged breakers immediately" checked={false} onToggle={() => {}} />
            <ChecklistItem text="Label all circuits clearly and accurately" checked={true} onToggle={() => {}} />
            <ChecklistItem text="Document completed inspections with photos" checked={false} onToggle={() => {}} disabled />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
