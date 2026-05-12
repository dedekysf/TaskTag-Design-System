import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronUp, PlayCircle } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable } from 'react-native';

type OnboardingStep = {
  title: string;
  description: string;
  chipColor: string;
  dotColor: string;
  action: string;
  state: 'primary' | 'outline' | 'disabled';
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

function StepCard({ step }: { step: OnboardingStep }) {
  const theme = useTheme<Theme>();
  const isPrimary = step.state === 'primary';
  const isDisabled = step.state === 'disabled';

  return (
    <Box
      backgroundColor="card"
      borderRadius="8"
      style={{
        flexBasis: '31.7%',
        flexGrow: 1,
        minWidth: 320,
        height: 188,
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        paddingVertical: 18,
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
            paddingHorizontal: 12,
            paddingVertical: 5,
            maxWidth: '100%',
          }}
        >
          <Box width={8} height={8} borderRadius="full" style={{ backgroundColor: step.dotColor }} />
          <Text
            numberOfLines={1}
            style={{ fontSize: 23, fontWeight: '400', color: theme.colors.foreground, lineHeight: 28 }}
          >
            {step.title}
          </Text>
        </Box>

        <Text style={{ fontSize: 18, lineHeight: 25, color: theme.colors.grey05 }}>
          {step.description}
        </Text>
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="16"
        style={{ marginTop: 18 }}
      >
        <Pressable
          style={({ hovered }: any) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            opacity: hovered ? 0.76 : 1,
            cursor: 'pointer' as any,
          })}
        >
          <PlayCircle size={31} strokeWidth={2.3} color={theme.colors.foreground} />
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.foreground, lineHeight: 26 }}>
            Watch Tutorial
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          style={{
            height: 52,
            minWidth: 178,
            paddingHorizontal: 20,
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
              fontSize: 20,
              fontWeight: '500',
              lineHeight: 26,
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

export function OnboardingChecklist() {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="grey02"
      borderRadius="16"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 522,
        paddingHorizontal: 40,
        paddingTop: 42,
        paddingBottom: 42,
      }}
    >
      <BackgroundRings />

      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="32"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Text style={{ fontSize: 27, fontWeight: '700', color: theme.colors.foreground, lineHeight: 34 }}>
          {"Let's Get You Started"}
        </Text>
        <Box flexDirection="row" alignItems="center" gap="12">
          <Text style={{ fontSize: 30, fontWeight: '700', color: theme.colors.foreground, lineHeight: 36 }}>
            <Text style={{ fontSize: 30, fontWeight: '700', color: theme.colors.secondaryGreen, lineHeight: 36 }}>
              0
            </Text>
            /5
          </Text>
          <ChevronUp size={26} strokeWidth={3} color={theme.colors.foreground} />
        </Box>
      </Box>

      <Box
        flexDirection="row"
        flexWrap="wrap"
        style={{
          gap: 32,
          position: 'relative',
          zIndex: 1,
          ...Platform.select({ web: { rowGap: 32, columnGap: 32 } as any }),
        }}
      >
        {STEPS.map((step) => (
          <StepCard key={step.title} step={step} />
        ))}
      </Box>
    </Box>
  );
}
