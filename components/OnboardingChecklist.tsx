import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronUp, PlayCircle } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable } from 'react-native';

type OnboardingStep = {
  title: string;
  description: string;
  chipColor: string;
  dotColor: string;
  action: string;
  state: 'primary' | 'outline' | 'disabled';
};

type ChecklistSizes = {
  columns: 1 | 2 | 3;
  cardBasis: `${number}%`;
  containerPaddingX: number;
  containerPaddingY: number;
  gap: number;
  heading: number;
  headingLine: number;
  progress: number;
  progressLine: number;
  chipText: number;
  chipLine: number;
  body: number;
  bodyLine: number;
  action: number;
  actionLine: number;
  playIcon: number;
};

const STEPS: OnboardingStep[] = [
  {
    title: 'Project Creation',
    description: "Start by setting up your first project - it's the foundation of all teamwork.",
    chipColor: '#dcf2ec',
    dotColor: '#18a87d',
    action: 'Create Project',
    state: 'primary',
  },
  {
    title: 'Task Creation',
    description: 'Tasks help break your project into steps. Add one to get started.',
    chipColor: '#fdf4e0',
    dotColor: '#fbbd42',
    action: 'Create Task',
    state: 'disabled',
  },
  {
    title: 'Invite Member',
    description: 'Add/Invite your team members to start collaborating.',
    chipColor: '#ffece6',
    dotColor: '#fc7f5b',
    action: 'Invite',
    state: 'outline',
  },
  {
    title: "Let's Chat",
    description: 'Use chat to communicate, share updates, assign tasks and tag messages - all in one place.',
    chipColor: '#fde7ff',
    dotColor: '#a620b2',
    action: 'Start Chat',
    state: 'outline',
  },
  {
    title: "Everything's Connected",
    description: 'Tag projects and tasks directly in chat to keep conversations organized.',
    chipColor: '#ebe7ff',
    dotColor: '#7b61ff',
    action: 'Add Tag',
    state: 'disabled',
  },
];

function getChecklistSizes(width: number): ChecklistSizes {
  if (width >= 1080) {
    return {
      columns: 3,
      cardBasis: '31.25%',
      containerPaddingX: 34,
      containerPaddingY: 42,
      gap: 30,
      heading: 24,
      headingLine: 30,
      progress: 29,
      progressLine: 34,
      chipText: 21,
      chipLine: 26,
      body: 17,
      bodyLine: 24,
      action: 18,
      actionLine: 24,
      playIcon: 30,
    };
  }

  if (width >= 900) {
    return {
      columns: 2,
      cardBasis: '48.4%',
      containerPaddingX: 32,
      containerPaddingY: 36,
      gap: 24,
      heading: 23,
      headingLine: 30,
      progress: 27,
      progressLine: 32,
      chipText: 20,
      chipLine: 25,
      body: 16,
      bodyLine: 23,
      action: 18,
      actionLine: 24,
      playIcon: 29,
    };
  }

  return {
    columns: 1,
    cardBasis: '100%',
    containerPaddingX: 18,
    containerPaddingY: 24,
    gap: 16,
    heading: 22,
    headingLine: 28,
    progress: 24,
    progressLine: 30,
    chipText: 19,
    chipLine: 24,
    body: 16,
    bodyLine: 22,
    action: 17,
    actionLine: 23,
    playIcon: 27,
  };
}

function StepCard({ step, sizes, onCreateProject }: { step: OnboardingStep; sizes: ChecklistSizes; onCreateProject?: () => void }) {
  const theme = useTheme<Theme>();
  const isPrimary = step.state === 'primary';
  const isDisabled = step.state === 'disabled';
  const isCreateProject = step.action === 'Create Project';

  return (
    <Box
      backgroundColor="card"
      borderRadius="8"
      style={{
        flexBasis: sizes.cardBasis,
        flexGrow: sizes.columns === 1 ? 1 : 0,
        flexShrink: 1,
        justifyContent: 'space-between',
        paddingHorizontal: sizes.columns === 1 ? 18 : 16,
        paddingVertical: sizes.columns === 1 ? 18 : 16,
      }}
    >
      <Box>
        <Box
          alignSelf="flex-start"
          flexDirection="row"
          alignItems="center"
          borderRadius="full"
          marginBottom="12"
          style={{
            backgroundColor: step.chipColor,
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 3,
            maxWidth: '100%',
          }}
        >
          <Box width={7} height={7} borderRadius="full" style={{ backgroundColor: step.dotColor }} />
          <Text
            numberOfLines={1}
            style={{ fontSize: sizes.chipText, fontWeight: '400', color: theme.colors.foreground, lineHeight: sizes.chipLine }}
          >
            {step.title}
          </Text>
        </Box>

        <Text style={{ fontSize: sizes.body, lineHeight: sizes.bodyLine, color: theme.colors.grey05 }}>
          {step.description}
        </Text>
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap={sizes.columns === 1 ? "12" : "16"}
        style={{ marginTop: 22, flexWrap: sizes.columns === 1 ? 'wrap' : 'nowrap' }}
      >
        <Pressable
          style={({ hovered }: any) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 9,
            flexShrink: 0,
            opacity: hovered ? 0.76 : 1,
            cursor: 'pointer' as any,
          })}
        >
          <PlayCircle size={sizes.playIcon} strokeWidth={2.3} color={theme.colors.foreground} />
          <Text style={{ fontSize: sizes.action, fontWeight: '600', color: theme.colors.foreground, lineHeight: sizes.actionLine }}>
            Watch Tutorial
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={isCreateProject ? onCreateProject : undefined}
          style={{
            flexBasis: sizes.columns === 1 ? '100%' : '44%',
            flexGrow: 1,
            flexShrink: 1,
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: isPrimary ? 0 : 1,
            borderColor: isDisabled ? theme.colors.grey03 : theme.colors.secondaryGreen,
            backgroundColor: isPrimary ? theme.colors.secondaryGreen : theme.colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: sizes.action,
              fontWeight: '500',
              lineHeight: sizes.actionLine,
              color: isPrimary
                ? theme.colors.white
                : isDisabled
                  ? theme.colors.grey05
                  : theme.colors.secondaryGreen,
            }}
          >
            {step.action}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}

function BackgroundRings() {
  const theme = useTheme<Theme>();
  const rings = [880, 620, 360];

  return (
    <Box
      pointerEvents="none"
      style={{
        position: 'absolute',
        right: -270,
        bottom: -330,
        width: 920,
        height: 920,
      }}
    >
      {rings.map((size) => (
        <Box
          key={size}
          style={{
            position: 'absolute',
            right: (920 - size) / 2,
            bottom: (920 - size) / 2,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: theme.colors.grey03,
            opacity: 0.72,
          }}
        />
      ))}
    </Box>
  );
}

export function OnboardingChecklist({ onCreateProject }: { onCreateProject?: () => void } = {}) {
  const theme = useTheme<Theme>();
  const [containerWidth, setContainerWidth] = useState(1180);
  const sizes = useMemo(() => getChecklistSizes(containerWidth), [containerWidth]);

  return (
    <Box
      backgroundColor="grey02"
      borderRadius="24"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingHorizontal: sizes.containerPaddingX,
        paddingTop: sizes.containerPaddingY,
        paddingBottom: sizes.containerPaddingY,
      }}
      onLayout={(event: any) => {
        const nextWidth = event.nativeEvent.layout.width;
        setContainerWidth((currentWidth) => Math.abs(currentWidth - nextWidth) > 1 ? nextWidth : currentWidth);
      }}
    >
      <BackgroundRings />

      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={{
          position: 'relative',
          zIndex: 1,
          gap: 16,
          flexWrap: sizes.columns === 1 ? 'wrap' : 'nowrap',
          marginBottom: sizes.columns === 1 ? 24 : 28,
        }}
      >
        <Text style={{ flexShrink: 1, fontSize: sizes.heading, fontWeight: '700', color: theme.colors.foreground, lineHeight: sizes.headingLine }}>
          {"Let's Get You Started"}
        </Text>
        <Box flexDirection="row" alignItems="center" gap="12">
          <Text style={{ fontSize: sizes.progress, fontWeight: '700', color: theme.colors.foreground, lineHeight: sizes.progressLine }}>
            <Text style={{ fontSize: sizes.progress, fontWeight: '700', color: theme.colors.secondaryGreen, lineHeight: sizes.progressLine }}>
              0
            </Text>
            /5
          </Text>
          <ChevronUp size={Math.max(22, sizes.progress - 4)} strokeWidth={3} color={theme.colors.foreground} />
        </Box>
      </Box>

      <Box
        flexDirection="row"
        flexWrap="wrap"
        style={{
          gap: sizes.gap,
          position: 'relative',
          zIndex: 1,
          ...Platform.select({ web: { rowGap: sizes.gap, columnGap: sizes.gap } as any }),
        }}
      >
        {STEPS.map((step) => (
          <StepCard key={step.title} step={step} sizes={sizes} onCreateProject={onCreateProject} />
        ))}
      </Box>
    </Box>
  );
}
