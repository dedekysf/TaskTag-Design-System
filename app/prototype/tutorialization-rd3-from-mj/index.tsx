import { Box } from '@/components/primitives';
import React, { useState } from 'react';
import { Case1Screen } from './case1';
import { Case2Screen } from './case2';
import { Case3Screen } from './case3';
import { Case4Screen } from './case4';
import { Case5Screen } from './case5';
import { Case6Screen } from './case6';
import { Case7Screen } from './case7';
import { Case8Screen } from './case8';

type TutorialCase = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default function TutorializationRD3() {
  const [activeCase, setActiveCase] = useState<TutorialCase>(1);
  const [case3StartScreen, setCase3StartScreen] = useState<1 | 2>(1);

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

      {/* Case 3: Add Members - "Add Tasks Now" goes to Case 4 */}
      {activeCase === 3 && (
        <Case3Screen
          startScreen={case3StartScreen}
          onComplete={() => setActiveCase(4)}
        />
      )}

      {/* Case 4: Task Creation */}
      {activeCase === 4 && (
        <Case4Screen onComplete={() => setActiveCase(5)} />
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
        <Case8Screen onComplete={() => setActiveCase(1)} />
      )}
    </Box>
  );
}
