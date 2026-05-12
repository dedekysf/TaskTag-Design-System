import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

function RadioButton({
  checked,
  onPress,
  label,
  disabled = false,
}: {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}) {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1 }}
    >
      <Box
        width={20} height={20} borderRadius="full"
        alignItems="center" justifyContent="center"
        style={{
          backgroundColor: checked ? theme.colors.secondaryGreen : '#fff',
          borderWidth: 2,
          borderColor: checked ? theme.colors.secondaryGreen : theme.colors.grey04,
        }}
      >
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </Box>
      {label && (
        <Text
          variant="webSecondaryBody"
          style={{ color: disabled ? theme.colors.grey04 : theme.colors.textPrimary }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function RadioGroupDemo({ options, withLabel = true }: { options: string[]; withLabel?: boolean }) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <Box gap="md">
      {options.map(opt => (
        <RadioButton
          key={opt}
          checked={selected === opt}
          onPress={() => setSelected(opt)}
          label={withLabel ? opt : undefined}
        />
      ))}
    </Box>
  );
}

export default function RadioButtonScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Radio Button" totalItems={3} />

        <ComponentSection
          title="Basic"
          githubUrls={[]}
          usageCode={`const [selected, setSelected] = useState('option1');

<Box flexDirection="row" alignItems="center" gap="sm">
  <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center"
    style={{ backgroundColor: selected ? theme.colors.secondaryGreen : '#fff',
      borderWidth: 2, borderColor: selected ? theme.colors.secondaryGreen : theme.colors.grey04 }}>
    {selected && <Check size={11} color="#fff" strokeWidth={3} />}
  </Box>
</Box>`}
        >
          <Box flexDirection="row" gap="xl" padding="md">
            <RadioButton checked={true} onPress={() => {}} />
            <RadioButton checked={false} onPress={() => {}} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Label"
          githubUrls={[]}
          usageCode={`const [selected, setSelected] = useState('Option 1');

{['Option 1', 'Option 2', 'Option 3'].map(opt => (
  <Pressable key={opt} onPress={() => setSelected(opt)}
    style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center"
      style={{ backgroundColor: selected === opt ? theme.colors.secondaryGreen : '#fff',
        borderWidth: 2, borderColor: selected === opt ? theme.colors.secondaryGreen : theme.colors.grey04 }}>
      {selected === opt && <Check size={11} color="#fff" strokeWidth={3} />}
    </Box>
    <Text variant="webSecondaryBody">{opt}</Text>
  </Pressable>
))}`}
        >
          <Box padding="md">
            <RadioGroupDemo options={['Option 1', 'Option 2', 'Option 3']} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Disabled"
          githubUrls={[]}
          usageCode={`<RadioButton checked={true} disabled={true} label="Checked (disabled)" />
<RadioButton checked={false} disabled={true} label="Unchecked (disabled)" />`}
        >
          <Box gap="md" padding="md">
            <RadioButton checked={true} onPress={() => {}} disabled label="Checked (disabled)" />
            <RadioButton checked={false} onPress={() => {}} disabled label="Unchecked (disabled)" />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
