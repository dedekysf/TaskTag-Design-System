import { Button } from '@/components/Button';
import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Pressable, View } from 'react-native';

type PrototypeChatTaskCardAction = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
};

type PrototypeChatTaskCardProps = {
  badge: string;
  title: string;
  descriptionPrefix?: string;
  highlightText?: string;
  descriptionSuffix?: string;
  actions?: PrototypeChatTaskCardAction[];
};

export function PrototypeChatTaskCard({
  badge,
  title,
  descriptionPrefix,
  highlightText,
  descriptionSuffix,
  actions = [],
}: PrototypeChatTaskCardProps) {
  const hasDescription = Boolean(descriptionPrefix || highlightText || descriptionSuffix);
  const singleAction = actions.length === 1;
  const multiAction = actions.length > 1;

  return (
    <View style={{ borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 12, borderTopLeftRadius: 0, padding: 12 }}>
      <View style={{ gap: 12 }}>
        {/* Badge chip */}
        <View style={{ backgroundColor: TTTheme.colors.lightMint, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
          <Text variant="mobileMetadataSecondary" style={{ color: TTTheme.colors.secondaryGreen, letterSpacing: 0.5 }}>
            {badge}
          </Text>
        </View>

        {/* Title + Description — 4px gap between them */}
        <View style={{ gap: 4 }}>
          <Text variant="mobileLabelSmall" color="foreground">
            {title}
          </Text>
          {hasDescription && (
            <Text variant="mobileMetadataPrimary" style={{ color: TTTheme.colors.grey05 }}>
              {descriptionPrefix}
              {highlightText ? (
                <Text variant="mobileMetadataPrimary" style={{ color: TTTheme.colors.secondaryGreen }}>
                  {highlightText}
                </Text>
              ) : null}
              {descriptionSuffix}
            </Text>
          )}
        </View>

        {/* Single action — green fill button */}
        {singleAction && (
          <Button
            variant="fill"
            color="secondary"
            size="xs"
            onPress={actions[0].onPress}
            style={{ alignSelf: 'stretch' }}
          >
            {actions[0].label}
          </Button>
        )}

        {/* Multi action — black primary + outline secondary */}
        {multiAction && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {actions.map((action) => {
              const isSecondary = action.variant === 'secondary';
              return (
                <Pressable
                  key={action.label}
                  onPress={action.onPress}
                  style={{
                    flex: 1,
                    backgroundColor: isSecondary ? '#fff' : TTTheme.colors.textPrimary,
                    borderWidth: isSecondary ? 1.5 : 0,
                    borderColor: TTTheme.colors.textPrimary,
                    borderRadius: 8,
                    paddingVertical: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text variant="mobileLabelSmall" style={{ color: isSecondary ? TTTheme.colors.foreground : '#fff' }}>
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
