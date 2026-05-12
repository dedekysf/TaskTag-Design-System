import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertCircle, Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

type DropdownOption = { value: string; label: string };
type DropdownSize = 'sm' | 'md';

function Dropdown({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  label,
  required,
  errorMessage,
  disabled,
  size = 'md',
}: {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
  label?: string;
  required?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  size?: DropdownSize;
}) {
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  const hasError = !!errorMessage;
  const height = size === 'sm' ? 36 : 44;

  const borderColor = hasError ? theme.colors.alertRed : open ? theme.colors.foreground : theme.colors.grey03;

  return (
    <Box style={{ position: 'relative' }}>
      {label && (
        <Box flexDirection="row" marginBottom="xs">
          <Text variant="webLabelSmall" color="foreground">{label}</Text>
          {required && <Text style={{ color: theme.colors.alertRed, marginLeft: 2 }}>*</Text>}
        </Box>
      )}
      <Pressable
        onPress={disabled ? undefined : () => setOpen(v => !v)}
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          height, paddingHorizontal: 12,
          borderWidth: 1, borderColor,
          borderRadius: 8, backgroundColor: disabled ? theme.colors.grey02 : '#fff',
        }}
      >
        <Text style={{
          fontSize: 14, flex: 1,
          color: selected ? theme.colors.foreground : theme.colors.grey05,
        }}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={16} color={theme.colors.grey05}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Pressable>

      {hasError && (
        <Box flexDirection="row" alignItems="center" gap="xs" marginTop="xs">
          <AlertCircle size={12} color={theme.colors.alertRed} />
          <Text style={{ fontSize: 12, color: theme.colors.alertRed }}>{errorMessage}</Text>
        </Box>
      )}

      {open && (
        <View style={{
          position: 'absolute', top: (label ? height + 24 : height) + 4, left: 0, right: 0,
          backgroundColor: '#fff', borderRadius: 8, borderWidth: 1,
          borderColor: theme.colors.grey03, zIndex: 100, elevation: 8,
          shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8,
        }}>
          {options.map(opt => (
            <Pressable key={opt.value} onPress={() => { onChange?.(opt.value); setOpen(false); }}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingHorizontal: 12, paddingVertical: 12 }}>
              <Text style={{ fontSize: 14, color: theme.colors.foreground }}>{opt.label}</Text>
              {value === opt.value && <Check size={16} color={theme.colors.secondaryGreen} />}
            </Pressable>
          ))}
        </View>
      )}
    </Box>
  );
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
];

export default function DropdownScreen() {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('active');
  const [v3, setV3] = useState('');
  const [v4, setV4] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Dropdown" totalItems={5} />

        <ComponentSection
          title="Basic"
          githubUrls={[]}
          usageCode={`const [value, setValue] = useState('');

<Dropdown
  options={[
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Select an option"
/>`}
        >
          <Box padding="md" style={{ zIndex: 20, minHeight: 160 }}>
            <Dropdown options={STATUS_OPTIONS} value={v1} onChange={setV1} placeholder="Select status" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Label"
          githubUrls={[]}
          usageCode={`<Dropdown
  label="Status"
  options={STATUS_OPTIONS}
  value={value}
  onChange={setValue}
/>`}
        >
          <Box padding="md" style={{ zIndex: 20, minHeight: 180 }}>
            <Dropdown label="Status" options={STATUS_OPTIONS} value={v2} onChange={setV2} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Required"
          githubUrls={[]}
          usageCode={`<Dropdown
  label="Role"
  required
  options={ROLE_OPTIONS}
  value={value}
  onChange={setValue}
  placeholder="Select role"
/>`}
        >
          <Box padding="md" style={{ zIndex: 20, minHeight: 180 }}>
            <Dropdown label="Role" required options={ROLE_OPTIONS} value={v3} onChange={setV3} placeholder="Select role" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Error State"
          githubUrls={[]}
          usageCode={`<Dropdown
  label="Status"
  options={STATUS_OPTIONS}
  value=""
  errorMessage="Please select a status"
/>`}
        >
          <Box padding="md">
            <Dropdown label="Status" options={STATUS_OPTIONS} value="" errorMessage="Please select a status" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Disabled"
          githubUrls={[]}
          usageCode={`<Dropdown
  label="Role"
  options={ROLE_OPTIONS}
  value="member"
  disabled
/>`}
        >
          <Box padding="md">
            <Dropdown label="Role" options={ROLE_OPTIONS} value="member" disabled />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
