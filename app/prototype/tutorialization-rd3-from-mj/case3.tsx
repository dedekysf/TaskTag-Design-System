import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../_shared/mobile/MockKeyboard';
import { SuccessModal } from '../_shared/mobile/SuccessModal';
import { OnboardingTooltip, useTooltipAnim } from '../_shared/mobile/OnboardingTooltip';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, View } from 'react-native';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Link,
  Mail,
  Plus,
  Search,
  Send,
  UserPlus,
  X,
} from 'lucide-react-native';


// ── Shared sub-components ───────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
    </View>
  );
}



// ── Screen 1: Project Detail + "Add your crew" tooltip ─────────────────────

function Screen1({ onInvite }: { onInvite: () => void }) {
  const tooltipAnim = useTooltipAnim();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <ProjectDetailScreen onInvite={onInvite} />

      {/* Spotlight: box-shadow covers full screen, element shape = Members card cutout with matching radius */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 355, left: 16,
          width: 323, height: 139,
          borderRadius: 8,
          zIndex: 50,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
        } as any}
      />

      {/* Tooltip */}
      <OnboardingTooltip
        title="Add your crew"
        description={'Tap "Invite" to add a crew member — they\'ll get invitation.'}
        step="Step 1/4"
        style={{ top: 264, left: 16 }}
        arrowEdge="bottom" arrowSide="left" arrowInset={31}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onInvite}
        style={{ position: 'absolute', top: 264, left: 16, width: 312, height: 120, zIndex: 70 } as any}
      />
    </View>
  );
}

// ── Screen 2: Invite screen + keyboard + "Search for your crew member" tooltip

function Screen2({ onNext }: { onNext: () => void }) {
  const tooltipAnim = useTooltipAnim();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelEmphasized" color="foreground" style={{ marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — pill shape */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.grey03, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
        <Search size={18} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileSecondaryBody" color="grey05" style={{ flex: 1 }}>Add member by email, name or group</Text>
      </View>

      {/* Copy link — green circle */}
      <View style={{ marginHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
          <Link size={20} color="#fff" />
        </View>
        <Text variant="mobileLabelSmall" color="foreground">Copy link to invite</Text>
      </View>

      {/* Your Contact header + sub-text */}
      <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 3 } as any}>
        <Text variant="mobileLabelSmall" color="foreground">Your Contact (1)</Text>
        <Text variant="mobileSecondaryBody" color="grey05">Choose contact first to invite or add member</Text>
      </View>

      {/* TODO(BE): GET /api/contacts — replace with real contact list */}
      {/* TaskTag Helpdesk — 44px avatar, stacked name/role, radio button */}
      <View style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '700' }} color="white">TH</Text>
        </View>
        <View style={{ flex: 1, gap: 2 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">TaskTag Helpdesk</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text variant="mobileSecondaryBody" color="foreground">Viewer</Text>
            <ChevronDown size={12} color={TTTheme.colors.textPrimary} />
          </View>
        </View>
        <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: TTTheme.colors.grey03 }} />
      </View>

      {/* Keyboard — same as case2 form phase */}
      <MockKeyboard />

      {/* Tooltip — tap it to advance */}
      <OnboardingTooltip
        title="Search for your crew member"
        description="Type their name or email address to find and invite them."
        step="Step 2/4"
        style={{ left: 35, top: 184, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={8}
        anim={tooltipAnim}
      />
      <Pressable
        onPress={onNext}
        style={{ position: 'absolute', left: 35, top: 184, width: 313, height: 90, zIndex: 70 } as any}
      />
    </View>
  );
}

// ── Screen 3: Search "Carlos" — no tooltip ──────────────────────────────────

function Screen3({ onNext }: { onNext: () => void }) {
  const radio = <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: TTTheme.colors.grey03 }} />;
  const roleRow = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Text variant="mobileSecondaryBody" color="foreground">Viewer</Text>
      <ChevronDown size={12} color={TTTheme.colors.textPrimary} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelEmphasized" color="foreground" style={{ marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — pill with "Carlos" */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.grey03, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
        <Search size={18} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelSmall" color="foreground" style={{ flex: 1 }}>Carlos</Text>
        <X size={16} color={TTTheme.colors.grey04} />
      </View>

      {/* Suggested header */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
        <Text variant="mobileLabelSmall" color="foreground">Suggested</Text>
      </View>

      {/* TODO(BE): GET /api/contacts/search?q=Carlos — search results with matching highlight */}
      {/* carlossmith@gmail.com — mail icon, highlight */}
      <Pressable onPress={onNext} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={20} color={TTTheme.colors.grey04} />
        </View>
        <View style={{ flex: 1, gap: 2 } as any}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>carlos</Text>
            <Text variant="mobileLabelSmall" color="foreground">smith@gmail.com</Text>
          </View>
          {roleRow}
        </View>
        {radio}
      </Pressable>

      {/* Carlos Eduardo */}
      <Pressable onPress={onNext} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '700' }} color="white">CE</Text>
        </View>
        <View style={{ flex: 1, gap: 2 } as any}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>Carlos</Text>
            <Text variant="mobileLabelSmall" color="foreground"> Eduardo</Text>
          </View>
          {roleRow}
        </View>
        {radio}
      </Pressable>

      {/* Carlos Constructions — no avatar */}
      <Pressable onPress={onNext} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44 }} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>Carlos</Text>
            <Text variant="mobileLabelSmall" color="foreground"> Constructions</Text>
          </View>
        </View>
        {radio}
      </Pressable>

      {/* Logan Smith */}
      <Pressable onPress={onNext} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#0D9488', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '700' }} color="white">LS</Text>
        </View>
        <View style={{ flex: 1, gap: 2 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">Logan Smith</Text>
          {roleRow}
        </View>
        {radio}
      </Pressable>

      {/* Melissa Monroe — photo */}
      <Pressable onPress={onNext} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <Image source={require('@/assets/images/mj.png')} style={{ width: 44, height: 44, borderRadius: 22 }} resizeMode="cover" />
        <View style={{ flex: 1, gap: 2 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">Melissa Monroe</Text>
          {roleRow}
        </View>
        {radio}
      </Pressable>

      <MockKeyboard />
    </View>
  );
}

// ── Shared member list layout (used in Screens 4, 5, 6) ────────────────────

type RoleType = 'Viewer' | 'Admin' | 'Editor';

function MemberListLayout({
  carlosRole,
  onRoleTap,
  onSendInvite,
}: {
  carlosRole: RoleType;
  onRoleTap?: () => void;
  onSendInvite?: () => void;
}) {
  const roleColor = carlosRole === 'Viewer' ? TTTheme.colors.textPrimary : TTTheme.colors.secondaryGreen;
  const roleBorderColor = carlosRole === 'Viewer' ? TTTheme.colors.border : TTTheme.colors.secondaryGreen;

  return (
    <>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelEmphasized" color="foreground" style={{ marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — pill with "Carlos" */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.grey03, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10, gap: 8 }}>
        <Search size={18} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelSmall" color="foreground" style={{ flex: 1 }}>Carlos</Text>
        <X size={16} color={TTTheme.colors.grey04} />
      </View>

      {/* Selected Members */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 } as any}>
        <Text variant="mobileLabelSmall" color="foreground">Selected Members (1)</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ alignItems: 'center', gap: 4 } as any}>
            <View>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} color={TTTheme.colors.grey04} />
              </View>
              <View style={{ position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' }}>
                <X size={10} color={TTTheme.colors.textPrimary} />
              </View>
            </View>
            <Text variant="mobileMetadataPrimary" color="grey05" numberOfLines={1} style={{ maxWidth: 64, textAlign: 'center' }}>carlossm...</Text>
          </View>
        </View>
      </View>

      {/* Suggested header */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
        <Text variant="mobileLabelSmall" color="foreground">Suggested</Text>
      </View>

      {/* carlossmith — mail icon + green checkmark */}
      <View style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={20} color={TTTheme.colors.grey04} />
        </View>
        <View style={{ flex: 1, gap: 2 } as any}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>carlos</Text>
            <Text variant="mobileLabelSmall" color="foreground">smith@gmail.com</Text>
          </View>
          <Pressable onPress={onRoleTap} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text variant="mobileSecondaryBody" style={{ color: roleColor }}>{carlosRole}</Text>
            <ChevronDown size={12} color={roleColor} />
          </Pressable>
        </View>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
          <Check size={16} color="#fff" />
        </View>
      </View>

      {/* Other contacts — radio buttons */}
      {([
        { avatar: 'initials', initials: 'CE', bg: '#F97316', hl: 'Carlos', rest: ' Eduardo' },
        { avatar: 'none',     initials: '',   bg: '',        hl: 'Carlos', rest: ' Constructions' },
        { avatar: 'initials', initials: 'LS', bg: '#0D9488', hl: null,     rest: 'Logan Smith' },
        { avatar: 'photo',    initials: 'MM', bg: '',        hl: null,     rest: 'Melissa Monroe' },
      ] as Array<{avatar:string;initials:string;bg:string;hl:string|null;rest:string}>).map((item) => (
        <View key={item.rest} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
          {item.avatar === 'photo' ? (
            <Image source={require('@/assets/images/mj.png')} style={{ width: 44, height: 44, borderRadius: 22 }} resizeMode="cover" />
          ) : item.avatar === 'initials' ? (
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '700' }} color="white">{item.initials}</Text>
            </View>
          ) : (
            <View style={{ width: 44, height: 44 }} />
          )}
          <View style={{ flex: 1, gap: 2 } as any}>
            {item.hl ? (
              <View style={{ flexDirection: 'row' }}>
                <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>{item.hl}</Text>
                <Text variant="mobileLabelSmall" color="foreground">{item.rest}</Text>
              </View>
            ) : (
              <Text variant="mobileLabelSmall" color="foreground">{item.rest}</Text>
            )}
            {item.avatar !== 'none' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text variant="mobileSecondaryBody" color="foreground">Viewer</Text>
                <ChevronDown size={12} color={TTTheme.colors.textPrimary} />
              </View>
            )}
          </View>
          <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: TTTheme.colors.grey03 }} />
        </View>
      ))}

      {/* Send Invite FAB */}
      <Pressable onPress={onSendInvite} style={{ position: 'absolute', bottom: 32, right: 16, zIndex: 2 } as any}>
        <View style={{ backgroundColor: '#000', borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Send size={16} color="#fff" />
          <Text variant="mobileLabelSmall" color="white">Send Invite</Text>
        </View>
      </Pressable>
    </>
  );
}

// ── Screen 4: "Change Role" tooltip ─────────────────────────────────────────

function Screen4({ onRoleTap }: { onRoleTap: () => void }) {
  const tooltipAnim = useTooltipAnim();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <MemberListLayout carlosRole="Viewer" onRoleTap={onRoleTap} />

      <OnboardingTooltip
        title="Change Role"
        description="Tap to set the right access level for this crew member."
        step="Step 3/4"
        style={{ right: 14, top: 437, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={8}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onRoleTap}
        style={{ position: 'absolute', right: 14, top: 437, width: 313, height: 90, zIndex: 70 } as any}
      />

      <HomeIndicator />
    </View>
  );
}

// ── Screen 5: Select Role bottom sheet ──────────────────────────────────────

function Screen5({ onSelectAdmin }: { onSelectAdmin: () => void }) {
  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sheetTranslateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <MemberListLayout carlosRole="Viewer" />

      {/* Dark overlay */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, opacity: sheetAnim } as any} />

      {/* Role sheet — slides up */}
      <Animated.View
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32,
          zIndex: 51,
          transform: [{ translateY: sheetTranslateY }],
        } as any}
      >
        <View style={{ width: 40, height: 4, backgroundColor: TTTheme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
        <Text variant="mobileLargeLabel" color="foreground" style={{ fontWeight: '700', textAlign: 'center', marginBottom: 24 }}>Select Role</Text>

        {(['Admin', 'Editor', 'Viewer'] as RoleType[]).map((role) => (
          <Pressable key={role} onPress={role === 'Admin' ? onSelectAdmin : undefined}>
            <View style={{ paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
              <Text variant="mobileLabelEmphasized" color={role === 'Viewer' ? 'secondaryGreen' : 'foreground'}>
                {role}
              </Text>
            </View>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}

// ── Screen 6: "Confirm Members" tooltip ─────────────────────────────────────

function Screen6({ onSendInvite }: { onSendInvite: () => void }) {
  const tooltipAnim = useTooltipAnim();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <MemberListLayout carlosRole="Admin" onSendInvite={onSendInvite} />

      <OnboardingTooltip
        title="Confirm Members"
        description='Tap "Send Invite" to send an invite link to all selected members.'
        step="Step 4/4"
        style={{ left: 16, top: 551, zIndex: 61 }}
        arrowEdge="bottom" arrowSide="right" arrowInset={8}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onSendInvite}
        style={{ position: 'absolute', left: 16, top: 551, width: 313, height: 90, zIndex: 70 } as any}
      />

      <HomeIndicator />
    </View>
  );
}

// ── Screen 7: Invite Sent! ───────────────────────────────────────────────────

function Screen7({ onDone }: { onDone: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
          <Text variant="mobileLabelEmphasized" color="foreground">Members</Text>
        </View>
        <Plus size={20} color={TTTheme.colors.textPrimary} />
      </View>

      {/* Invite row */}
      <View style={{ marginHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <UserPlus size={20} color={TTTheme.colors.grey04} />
        </View>
        <Text variant="mobileLabelSmall" color="foreground">Invite or Add Member</Text>
      </View>

      {/* Copy link row */}
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Copy size={18} color={TTTheme.colors.grey04} />
        </View>
        <Text variant="mobileLabelSmall" color="foreground">Copy link to invite</Text>
      </View>

      {/* TODO(BE): GET /api/projects/:id/invites?status=pending — pending invites list + count */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
        <Text variant="mobileMetadataSecondary" color="grey04" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending Member (1)</Text>
      </View>
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        {/* TODO(BE): invite.member.avatar + invite.member.initials */}
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C3CE1', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700' }} color="white">CS</Text>
        </View>
        <View style={{ flex: 1 }}>
          {/* TODO(BE): invite.member.email */}
          <Text variant="mobileLabelSmall" color="foreground">carlos@gmail.com</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            {/* TODO(BE): invite.role + invite.expiresAt */}
            <Text variant="mobileMetadataPrimary" color="grey04">Viewer</Text>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: TTTheme.colors.grey04 }} />
            <Text variant="mobileMetadataPrimary" color="alertRed">Expired May 28</Text>
          </View>
        </View>
      </View>

      {/* TODO(BE): GET /api/projects/:id/members — active members list + count */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8, borderTopWidth: 1, borderTopColor: TTTheme.colors.border, paddingTop: 12 }}>
        <Text variant="mobileMetadataSecondary" color="grey04" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Members (2)</Text>
      </View>
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        {/* TODO(BE): member.avatar */}
        <Image source={require('@/assets/images/mj.png')} style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode="cover" />
        <View style={{ flex: 1 }}>
          {/* TODO(BE): member.name + member.role */}
          <Text variant="mobileLabelSmall" color="foreground">Maria Jose</Text>
          <Text variant="mobileMetadataPrimary" color="grey04">Owner</Text>
        </View>
      </View>

      {/* Success modal — overlay + animated card */}
      <SuccessModal
        title="Invite Sent!"
        description="Your crew member will receive an invite link via WhatsApp."
        primaryLabel="Add Tasks Now"
        onPrimary={onDone}
        secondaryLabel="Back to Project"
        onSecondary={onDone}
      />
    </View>
  );
}

// ── Main Case3Screen ─────────────────────────────────────────────────────────

export function Case3Screen({ startScreen = 1 }: { startScreen?: 1 | 2 }) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(startScreen as 1 | 2 | 3 | 4 | 5 | 6 | 7);

  return (
    <Box flex={1} backgroundColor="white">
      {screen === 1 && <Screen1 onInvite={() => setScreen(2)} />}
      {screen === 2 && <Screen2 onNext={() => setScreen(3)} />}
      {screen === 3 && <Screen3 onNext={() => setScreen(4)} />}
      {screen === 4 && <Screen4 onRoleTap={() => setScreen(5)} />}
      {screen === 5 && <Screen5 onSelectAdmin={() => setScreen(6)} />}
      {screen === 6 && <Screen6 onSendInvite={() => setScreen(7)} />}
      {screen === 7 && <Screen7 onDone={() => setScreen(1)} />}
    </Box>
  );
}
