import { Avatar } from '@/components/Avatar';
import { Tooltip } from '@/components/Tooltip';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronDown, Repeat, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable } from 'react-native';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Assignee' | 'Viewer';
  avatarUrl?: string;
  initials?: string;
  color?: string;
  isPending?: boolean;
  isFromActiveMembers?: boolean;
}

export interface ProjectMemberRowProps {
  member: Member;
  isHovered: boolean;
  isDropdownOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleDropdown: () => void;
  onUpdateRole: (role: 'Owner' | 'Assignee' | 'Viewer') => void;
  onDelete: () => void;
  onResendInvite?: () => void;
  style?: any;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06595', '#CC5DE8', '#845EF7'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function ProjectCreationMemberRow({
  member,
  isHovered,
  isDropdownOpen,
  onMouseEnter,
  onMouseLeave,
  onToggleDropdown,
  onUpdateRole,
  onDelete,
  onResendInvite,
  style,
}: ProjectMemberRowProps) {
  const theme = useTheme<Theme>();
  const shouldHighlight = isHovered || isDropdownOpen;

  return (
    <Pressable
      onHoverIn={onMouseEnter}
      onHoverOut={onMouseLeave}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: shouldHighlight ? theme.colors.grey01 : theme.colors.white,
        },
        style,
      ]}
    >
      {/* Avatar */}
      <Tooltip variant="bottom-right" size="sm" content={member.name}>
        <Box>
          {member.isPending ? (
            <Avatar size="md" type="icon" color={theme.colors.grey02} />
          ) : member.avatarUrl ? (
            <Avatar size="md" type="photo" src={member.avatarUrl} />
          ) : (
            <Avatar
              size="md"
              type="text"
              initials={member.initials || getInitials(member.name)}
              color={member.color || getAvatarColor(member.name)}
            />
          )}
        </Box>
      </Tooltip>

      {/* Name & Email */}
      <Box flex={1}>
        {member.isPending ? (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: theme.colors.foreground,
              lineHeight: 18,
            }}
          >
            {member.email}
          </Text>
        ) : (
          <>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: theme.colors.foreground,
                lineHeight: 18,
              }}
            >
              {member.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: theme.colors.grey04,
                lineHeight: 16,
              }}
            >
              {member.email}
            </Text>
          </>
        )}
      </Box>

      {/* Action Icons */}
      {member.isPending ? (
        <Box flexDirection="row" alignItems="center" gap="8">
          <Tooltip variant="bottom-right" size="sm" content="Resend invite">
            <Pressable
              onPress={onResendInvite}
              style={{
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                backgroundColor: isHovered ? theme.colors.grey02 : 'transparent',
              }}
            >
              <Repeat size={18} color={theme.colors.foreground} strokeWidth={2} />
            </Pressable>
          </Tooltip>

          <Tooltip variant="bottom-right" size="sm" content="Cancel invite">
            <Pressable
              onPress={onDelete}
              style={{
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                backgroundColor: isHovered ? theme.colors.grey02 : 'transparent',
              }}
            >
              <Trash2 size={18} color={theme.colors.foreground} strokeWidth={2} />
            </Pressable>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip variant="bottom-right" size="sm" content="Delete">
          <Pressable
            onPress={onDelete}
            style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              backgroundColor: isHovered ? theme.colors.grey02 : 'transparent',
            }}
          >
            <Trash2 size={18} color={theme.colors.foreground} strokeWidth={2} />
          </Pressable>
        </Tooltip>
      )}

      {/* Role */}
      {member.role === 'Owner' || member.isPending ? (
        <Box
          alignItems="flex-end"
          justifyContent="center"
          style={{ paddingHorizontal: 12, paddingVertical: 6, width: 100 }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: theme.colors.foreground,
            }}
          >
            {member.role}
          </Text>
        </Box>
      ) : (
        <Box style={{ position: 'relative', zIndex: isDropdownOpen ? 100 : 1 }}>
          <Pressable
            onPress={onToggleDropdown}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 4,
              width: 100,
              backgroundColor: isDropdownOpen || isHovered ? theme.colors.grey01 : 'transparent',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: theme.colors.foreground,
              }}
            >
              {member.role}
            </Text>
            <ChevronDown
              size={16}
              color={theme.colors.foreground}
              style={{
                transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }],
              }}
            />
          </Pressable>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <Box
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 4,
                paddingVertical: 4,
                minWidth: 120,
                backgroundColor: theme.colors.card,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                ...Platform.select({
                  web: {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  } as any,
                  default: {
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                  },
                }),
              }}
            >
              <Pressable
                onPress={() => onUpdateRole('Assignee')}
                style={({ hovered }: any) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                })}
              >
                <Text style={{ fontSize: 14, color: theme.colors.foreground }}>Assignee</Text>
              </Pressable>
              <Pressable
                onPress={() => onUpdateRole('Viewer')}
                style={({ hovered }: any) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                })}
              >
                <Text style={{ fontSize: 14, color: theme.colors.foreground }}>Viewer</Text>
              </Pressable>
            </Box>
          )}
        </Box>
      )}
    </Pressable>
  );
}
