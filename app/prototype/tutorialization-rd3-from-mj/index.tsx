import { Box } from '@/components/primitives';
import React, { useState } from 'react';
import { Case1Screen } from './case1';
import { Case2Screen } from './case2';
import { Case3Screen } from './case3';

export default function TutorializationRD3() {
  const [activeCase, setActiveCase] = useState<1 | 2 | 3>(1);
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
      {activeCase === 3 && (
        <Case3Screen startScreen={case3StartScreen} />
      )}
    </Box>
  );
}
