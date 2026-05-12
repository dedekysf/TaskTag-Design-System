import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Animated, Pressable, ScrollView } from 'react-native';

const SIZES = {
  sm: { trackW: 28, trackH: 16, thumbSize: 12, translateOn: 14 },
  md: { trackW: 36, trackH: 20, thumbSize: 16, translateOn: 18 },
  lg: { trackW: 44, trackH: 24, thumbSize: 20, translateOn: 22 },
} as const;

function Toggle({
  checked,
  onPress,
  disabled = false,
  size = 'md',
}: {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const theme = useTheme<Theme>();
  const cfg = SIZES[size];
  const translateX = React.useRef(new Animated.Value(checked ? cfg.translateOn : 2)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: checked ? cfg.translateOn : 2,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [checked, cfg.translateOn]);

  const trackBg = disabled
    ? theme.colors.grey03
    : checked
    ? theme.colors.secondaryGreen
    : theme.colors.grey03;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Box
        style={{
          width: cfg.trackW,
          height: cfg.trackH,
          borderRadius: cfg.trackH / 2,
          backgroundColor: trackBg,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            width: cfg.thumbSize,
            height: cfg.thumbSize,
            borderRadius: cfg.thumbSize / 2,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
            transform: [{ translateX }],
          }}
        />
      </Box>
    </Pressable>
  );
}

function ToggleRow({ label, size = 'md' }: { label: string; size?: 'sm' | 'md' | 'lg' }) {
  const [checked, setChecked] = useState(false);
  return (
    <Box flexDirection="row" alignItems="center" gap="md">
      <Toggle checked={checked} onPress={() => setChecked(v => !v)} size={size} />
      <Text variant="webBody" color="textSecondary">{label}</Text>
    </Box>
  );
}

export default function ToggleScreen() {
  const [checkedMd, setCheckedMd] = useState(true);
  const [checkedSm, setCheckedSm] = useState(false);
  const [checkedLg, setCheckedLg] = useState(true);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Toggle" totalItems={3} />

        <ComponentSection
          title="Sizes"
          githubUrls={[]}
          usageCode={`function Toggle({ checked, onPress, disabled, size = 'md' }) {
  const cfg = { sm: { trackW: 28, trackH: 16, thumbSize: 12, translateOn: 14 },
                md: { trackW: 36, trackH: 20, thumbSize: 16, translateOn: 18 },
                lg: { trackW: 44, trackH: 24, thumbSize: 20, translateOn: 22 } }[size];

  const translateX = useRef(new Animated.Value(checked ? cfg.translateOn : 2)).current;
  useEffect(() => {
    Animated.timing(translateX, { toValue: checked ? cfg.translateOn : 2, duration: 150, useNativeDriver: true }).start();
  }, [checked]);

  return (
    <Pressable onPress={onPress}>
      <View style={{ width: cfg.trackW, height: cfg.trackH, borderRadius: cfg.trackH / 2,
        backgroundColor: checked ? theme.colors.secondaryGreen : theme.colors.grey03, justifyContent: 'center' }}>
        <Animated.View style={{ width: cfg.thumbSize, height: cfg.thumbSize,
          borderRadius: cfg.thumbSize / 2, backgroundColor: '#fff',
          transform: [{ translateX }] }} />
      </View>
    </Pressable>
  );
}`}
        >
          <Box gap="lg" padding="md">
            <Box flexDirection="row" alignItems="center" gap="xl">
              <Box alignItems="center" gap="xs">
                <Toggle checked={checkedSm} onPress={() => setCheckedSm(v => !v)} size="sm" />
                <Text variant="webMetadataPrimary" color="grey05">SM</Text>
              </Box>
              <Box alignItems="center" gap="xs">
                <Toggle checked={checkedMd} onPress={() => setCheckedMd(v => !v)} size="md" />
                <Text variant="webMetadataPrimary" color="grey05">MD</Text>
              </Box>
              <Box alignItems="center" gap="xs">
                <Toggle checked={checkedLg} onPress={() => setCheckedLg(v => !v)} size="lg" />
                <Text variant="webMetadataPrimary" color="grey05">LG</Text>
              </Box>
            </Box>
          </Box>
        </ComponentSection>

        <ComponentSection
          title="With Label"
          githubUrls={[]}
          usageCode={`const [checked, setChecked] = useState(false);

<Box flexDirection="row" alignItems="center" gap="md">
  <Toggle checked={checked} onPress={() => setChecked(v => !v)} size="md" />
  <Text variant="webBody" color="textSecondary">Enable notifications</Text>
</Box>`}
        >
          <Box gap="md" padding="md">
            <ToggleRow label="Enable notifications" size="md" />
            <ToggleRow label="Auto-save drafts" size="md" />
            <ToggleRow label="Dark mode" size="md" />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Disabled"
          githubUrls={[]}
          usageCode={`// Pass disabled={true} to prevent interaction
<Toggle checked={true} onPress={() => {}} disabled={true} size="md" />
<Toggle checked={false} onPress={() => {}} disabled={true} size="md" />`}
        >
          <Box flexDirection="row" gap="xl" padding="md">
            <Box alignItems="center" gap="xs">
              <Toggle checked={true} onPress={() => {}} disabled size="md" />
              <Text variant="webMetadataPrimary" color="grey05">On</Text>
            </Box>
            <Box alignItems="center" gap="xs">
              <Toggle checked={false} onPress={() => {}} disabled size="md" />
              <Text variant="webMetadataPrimary" color="grey05">Off</Text>
            </Box>
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
