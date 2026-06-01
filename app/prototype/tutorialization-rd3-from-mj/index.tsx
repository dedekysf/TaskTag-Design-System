import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Case1Screen } from './case1';
import { Case2Screen } from './case2';
import { Case3Screen } from './case3';
import { Case4Screen } from './case4';
import { Case5Screen } from './after-member-joins/case5';
import { Case6Screen } from './after-member-joins/case6';
import { Case7Screen } from './after-member-joins/case7';
import { Case8Screen } from './after-member-joins/case8';

type TutorialCase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Flow = 'menu' | 'before' | 'after';

const SHORTCUTS = [
  {
    key: 'before' as Flow,
    label: 'Tutorialization from MJ before member joins',
    description: 'Project detail → Invite → Add members (Case 1–3)',
    startCase: 1 as TutorialCase,
  },
  {
    key: 'after' as Flow,
    label: 'Tutorialization from MJ after member joins',
    description: 'Assign → Chat → Tag (Case 5–8)',
    startCase: 5 as TutorialCase,
  },
];

export default function TutorializationRD3() {
  const { flow: flowParam } = useLocalSearchParams<{ flow?: string }>();
  const [flow, setFlow] = useState<Flow>((flowParam as Flow) ?? 'menu');
  const [activeCase, setActiveCase] = useState<TutorialCase>(flowParam === 'after' ? 5 : 1);
  const [case3StartScreen, setCase3StartScreen] = useState<1 | 2>(1);
  const [case4StartPhase, setCase4StartPhase] = useState<'project' | 'taskForm'>('project');

  useEffect(() => {
    if (flowParam === 'before' || flowParam === 'after') {
      setFlow(flowParam as Flow);
      setActiveCase(flowParam === 'after' ? 5 : 1);
    }
  }, [flowParam]);

  if (flow === 'menu') {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Box width="100%" maxWidth={640}>
          <Text
            variant="h2"
            style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}
          >
            Tutorialization RD3 from MJ
          </Text>

          <Text
            variant="webSecondaryBody"
            style={{ color: TTTheme.colors.grey05, textAlign: 'center', marginBottom: 32 }}
          >
            Select a flow to preview.
          </Text>

          <Box style={{ gap: 16 }}>
            {SHORTCUTS.map(({ key, label, description, startCase }) => (
              <Box
                key={key}
                style={{
                  backgroundColor: TTTheme.colors.card,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: TTTheme.colors.border,
                  padding: 24,
                  gap: 12,
                }}
              >
                <Box style={{ gap: 4 }}>
                  <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, fontWeight: '600' }}>
                    {label}
                  </Text>
                  <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05 }}>
                    {description}
                  </Text>
                </Box>

                <Pressable
                  onPress={() => {
                    setActiveCase(startCase);
                    setCase3StartScreen(1);
                    setFlow(key);
                  }}
                  style={({ pressed }: any) => ({
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: TTTheme.colors.black,
                    backgroundColor: 'transparent',
                    opacity: pressed ? 0.75 : 1,
                    cursor: 'pointer',
                  })}
                >
                  <Text variant="webLabelEmphasized" style={{ color: TTTheme.colors.black }}>Start</Text>
                </Pressable>
              </Box>
            ))}
          </Box>
        </Box>
      </ScrollView>
    );
  }

  return (
    <Box flex={1}>
      {activeCase === 1 && (
        <Case1Screen onComplete={() => setActiveCase(2)} />
      )}

      {activeCase === 2 && (
        <Case2Screen
          onAddMembers={() => { setCase3StartScreen(2); setActiveCase(3); }}
          onViewProjectDetails={() => { setCase3StartScreen(1); setActiveCase(3); }}
        />
      )}

      {/* Case 3: Add Members */}
      {activeCase === 3 && (
        <Case3Screen
          startScreen={case3StartScreen}
          onComplete={() => {
            setCase4StartPhase('project');
            setActiveCase(4);
          }}
          onAddTasksNow={() => {
            setCase4StartPhase('taskForm');
            setActiveCase(4);
          }}
        />
      )}

      {/* Case 4: Task Creation */}
      {activeCase === 4 && (
        <Case4Screen startPhase={case4StartPhase} onComplete={() => setActiveCase(5)} />
      )}

      {/* Case 5: Assign task after member joined */}
      {activeCase === 5 && (
        <Case5Screen onComplete={() => setActiveCase(6)} />
      )}

      {/* Case 6: Chat for the first time after member joined */}
      {activeCase === 6 && (
        <Case6Screen onComplete={() => setActiveCase(7)} />
      )}

      {/* Case 7: Tag for the first time — link message to project + task */}
      {activeCase === 7 && (
        <Case7Screen onComplete={() => setActiveCase(8)} />
      )}

      {/* Case 8: Tag for the first time (Bathroom Reno variant with nudge flow) */}
      {activeCase === 8 && (
        <Case8Screen onComplete={() => setFlow('menu')} />
      )}
    </Box>
  );
}
