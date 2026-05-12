import {
  InvitationDetailsPanel,
  InvitationEmailScreen,
} from '@/components/InvitationEmailScreen';
import { router } from 'expo-router';
import React from 'react';

const PROJECT_DATA = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  team: 'Aquaworks Construction',
  inviter: 'James Hammer',
  memberCount: 12,
};

export default function MProjectInvitationExpiredByEmail() {
  return (
    <InvitationEmailScreen
      greetingName="Oscar"
      inviterName={PROJECT_DATA.inviter}
      invitationCopy="has invited you to join a project on Tasktag."
      ctaLabel="Accept & Join Project"
      onCtaPress={() => router.push('/prototype/m-project-invitation-expired-by-email/invitation-expired' as any)}
    >
      <InvitationDetailsPanel
        title={PROJECT_DATA.name}
        details={[
          { label: 'Address', value: PROJECT_DATA.address },
          { label: 'Team Name', value: PROJECT_DATA.team },
        ]}
        roleLabel="Member"
        roleSuffix={`with ${PROJECT_DATA.memberCount} other people.`}
      />
    </InvitationEmailScreen>
  );
}
