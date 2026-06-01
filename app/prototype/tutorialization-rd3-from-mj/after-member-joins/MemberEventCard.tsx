import { PrototypeChatTaskCard } from '@/components/PrototypeChatTaskCard';

type MemberEventCardProps = {
  variant: 'memberJoined' | 'taskAssigned';
  memberName: string;
  /** used by memberJoined variant */
  projectName?: string;
  /** used by taskAssigned variant */
  taskName?: string;
  /** memberJoined: label for the single action button (default: 'Assign a task') */
  primaryLabel?: string;
  /** taskAssigned: label for the secondary action button (default: 'Assign more') */
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
};

export function MemberEventCard({
  variant,
  memberName,
  projectName,
  taskName,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}: MemberEventCardProps) {
  if (variant === 'memberJoined') {
    return (
      <PrototypeChatTaskCard
        badge="MEMBER JOINED"
        title={`${memberName} joined the project`}
        descriptionPrefix={`${memberName} is now part of `}
        highlightText={projectName}
        descriptionSuffix=" and ready to collaborate."
        actions={[{ label: primaryLabel ?? 'Assign a task', onPress: onPrimaryPress }]}
      />
    );
  }

  return (
    <PrototypeChatTaskCard
      badge="TASK ASSIGNED"
      title={`${memberName} has been assigned a task`}
      descriptionPrefix={`${memberName} is now working on `}
      highlightText={taskName}
      actions={[
        { label: 'View task', onPress: onPrimaryPress },
        { label: secondaryLabel ?? 'Assign more', onPress: onSecondaryPress, variant: 'secondary' },
      ]}
    />
  );
}
