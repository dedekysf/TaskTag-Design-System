import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MembersScreen } from '../_shared/mobile/MembersScreen';
import { MockKeyboard } from '../_shared/mobile/MockKeyboard';
import { OnboardingTooltip, useTooltipAnim } from '../_shared/mobile/OnboardingTooltip';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, TextInput, View } from 'react-native';
import {
  ChevronDown,
  ChevronLeft,
  Link,
  Mail,
  Search,
  Send,
  X,
} from 'lucide-react-native';


// ── Shared sub-components ───────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
      <View style={{ width: 134, height: 5, backgroundColor: TTTheme.colors.grey06, borderRadius: 5 }} />
    </View>
  );
}



// ── Screen 1: Project Detail + "Add your crew" tooltip ─────────────────────

function Screen1({ onInvite }: { onInvite: () => void }) {
  const tooltipAnim = useTooltipAnim();

  const SPOT_TOP    = 331;
  const SPOT_HEIGHT = 139;
  const TOOLTIP_TOP = 278;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', overflow: 'hidden' }}>
      <StatusBarRow />
      <ProjectDetailScreen onInvite={onInvite} scrollEnabled={false} />

      {/* Spotlight: box-shadow covers full screen, cutout = member card bounds */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: SPOT_TOP, left: 16,
          width: 343, height: SPOT_HEIGHT,
          borderRadius: 8,
          zIndex: 50,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
        } as any}
      />

      {/* Tooltip */}
      <OnboardingTooltip
        title="Add your crew"
        description={'Tap "Invite" to add a crew member — they\'ll get invitation.'}
        style={{ top: TOOLTIP_TOP, left: 16 }}
        arrowEdge="bottom" arrowSide="left" arrowInset={31}
        anim={tooltipAnim}
      />

      {/* Tap target covering tooltip + spotlight */}
      <Pressable
        onPress={onInvite}
        style={{ position: 'absolute', top: TOOLTIP_TOP, left: 16, width: 312, height: SPOT_TOP - TOOLTIP_TOP + SPOT_HEIGHT, zIndex: 70 } as any}
      />
    </View>
  );
}

// ── Screen 2: Interactive invite search — auto-focus, real TextInput, dynamic results

function getEmailHighlightEnd(text: string) {
  const emailDivider = text.indexOf('@');
  return emailDivider >= 0 ? emailDivider : text.length;
}

function normalizeSearchText(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getQueryTokens(query: string) {
  return query.trim().split(/\s+/).map(normalizeSearchText).filter(Boolean);
}

function contactMatchesQuery(text: string, query: string) {
  const tokens = getQueryTokens(query);
  const target = normalizeSearchText(text);

  return tokens.length === 0 || tokens.every((token) => target.includes(token));
}

function getHighlightRanges(text: string, query: string) {
  const highlightEnd = getEmailHighlightEnd(text);
  const normalizedChars: string[] = [];
  const originalIndexes: number[] = [];

  text.split('').forEach((char, index) => {
    const normalized = normalizeSearchText(char);
    if (normalized) {
      normalizedChars.push(normalized);
      originalIndexes.push(index);
    }
  });

  const normalizedText = normalizedChars.join('');
  const ranges = getQueryTokens(query)
    .map((token) => {
      const normalizedIndex = normalizedText.indexOf(token);
      if (normalizedIndex < 0) return null;

      const start = originalIndexes[normalizedIndex];
      const end = originalIndexes[normalizedIndex + token.length - 1] + 1;
      if (start >= highlightEnd) return null;

      return {
        start,
        end: Math.min(end, highlightEnd),
      };
    })
    .filter((range): range is { start: number; end: number } => range !== null)
    .sort((a, b) => a.start - b.start);

  return ranges.reduce<{ start: number; end: number }[]>((merged, range) => {
    const previous = merged[merged.length - 1];
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
    return merged;
  }, []);
}

function HighlightedSearchText({ text, query }: { text: string; query: string }) {
  const ranges = getHighlightRanges(text, query);

  if (ranges.length === 0) {
    return <Text variant="mobileLabelSmall" color="foreground">{text}</Text>;
  }

  const chunks: { text: string; highlighted: boolean }[] = [];
  let cursor = 0;

  ranges.forEach((range) => {
    if (range.start > cursor) {
      chunks.push({ text: text.slice(cursor, range.start), highlighted: false });
    }
    chunks.push({ text: text.slice(range.start, range.end), highlighted: true });
    cursor = range.end;
  });

  if (cursor < text.length) {
    chunks.push({ text: text.slice(cursor), highlighted: false });
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {chunks.map((chunk, index) => (
        <Text
          key={`${chunk.text}-${index}`}
          variant="mobileLabelSmall"
          color={chunk.highlighted ? undefined : 'foreground'}
          style={chunk.highlighted ? { color: TTTheme.colors.secondaryGreen } : undefined}
        >
          {chunk.text}
        </Text>
      ))}
    </View>
  );
}

// TODO(BE): GET /api/contacts/search?q= — replace static list with real search
// TODO(BE): GET /api/contacts/search?q= — replace static list with real search
const INVITE_CONTACTS: { key: string; type: 'mail' | 'initials'; initials: string; bg: string; label: string; role: 'Viewer' | 'Admin' | 'Editor' }[] = [];

function ChangeRoleTooltip({
  anim,
  onRoleTap,
  arrowInset = 50,
}: {
  anim: Animated.Value;
  onRoleTap: () => void;
  arrowInset?: number;
}) {
  return (
    <>
      <OnboardingTooltip
        title="Change Role"
        description="You can change the roles of your members by clicking on drop-down."
        style={{ right: 14, top: 391, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={arrowInset}
        anim={anim}
      />

      <Pressable
        onPress={onRoleTap}
        style={{ position: 'absolute', right: 14, top: 364, width: 313, height: 180, zIndex: 70 } as any}
      />
    </>
  );
}

function Screen2({ onNext }: { onNext: () => void }) {
  const tooltipAnim = useTooltipAnim();
  const roleTooltipAnim = useRef(new Animated.Value(0)).current;
  const confirmTooltipAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [roleSheetVisible, setRoleSheetVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType>('Viewer');
  const [roleConfirmed, setRoleConfirmed] = useState(false);
  const [roleTooltipDismissedBySearch, setRoleTooltipDismissedBySearch] = useState(false);
  const [roleTooltipPerformed, setRoleTooltipPerformed] = useState(false);
  const inputRef = useRef<any>(null);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  // Once user types or selects, dismiss tooltip permanently (don't re-show if query is cleared)
  useEffect(() => {
    if (query.length > 0 || selected !== null) setTooltipDismissed(true);
  }, [query.length, selected]);

  useEffect(() => {
    Animated.timing(tooltipAnim, { toValue: tooltipDismissed ? 0 : 1, duration: tooltipDismissed ? 2000 : 300, useNativeDriver: true }).start();
  }, [tooltipDismissed, tooltipAnim]);

  useEffect(() => {
    const visible = !!selected && query.length > 0 && !roleTooltipDismissedBySearch && !roleTooltipPerformed;
    Animated.timing(roleTooltipAnim, { toValue: visible ? 1 : 0, duration: visible ? 300 : 250, useNativeDriver: true }).start();
  }, [query.length, selected, roleTooltipDismissedBySearch, roleTooltipPerformed, roleTooltipAnim]);

  const handleOpenRoleSheet = () => {
    setRoleSheetVisible(true);
    setRoleTooltipPerformed(true);
    Animated.timing(sheetAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    Animated.timing(sheetAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setRoleSheetVisible(false);
      setRoleConfirmed(true);
      Animated.timing(confirmTooltipAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const normalizedQuery = normalizeSearchText(query);
  const directEmailRow = query.trim().length > 0
    ? (query.includes('@') ? query.trim() : `${normalizedQuery}@gmail.com`)
    : null;
  const visibleContacts = query.trim().length >= 5
    ? INVITE_CONTACTS.filter((item) => contactMatchesQuery(item.label, query))
    : [];
  // selected is either a contact key or a bare email string for direct invites
  const selectedContact = INVITE_CONTACTS.find((item) => item.key === selected);
  const selectedEmail = selected && !selectedContact ? selected : null;

  const handleSelect = (key: string) => {
    setSelected(key);
    setRoleTooltipDismissedBySearch(false);
    setRoleTooltipPerformed(false);
    inputRef.current?.blur();
  };

  const renderSelectionCheckbox = (key: string) => (
    <View pointerEvents="none">
      <Checkbox
        variant="circular"
        checked={selected === key}
      />
    </View>
  );

  const renderAvatar = (item: typeof INVITE_CONTACTS[number], size = 44) => {
    const iconSize = size === 56 ? 24 : 20;

    if (item.type === 'mail') return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
        <Mail size={iconSize} color={TTTheme.colors.grey05} />
      </View>
    );
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant={size === 56 ? 'mobileLargeLabel' : 'mobileLabelEmphasized'} style={{ fontWeight: '700' }} color="white">{item.initials}</Text>
      </View>
    );
  };

  const getSelectedPreviewLabel = (item: typeof INVITE_CONTACTS[number]) => (
    item.type === 'mail' ? 'carlossm...' : 'Carlos E...'
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ChevronLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelEmphasized" color="foreground" style={{ marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — active = black border color from DS textPrimary, width stays 1 */}
      <View style={{
        marginHorizontal: 16, marginTop: 16,
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1,
        borderColor: isFocused || query.length > 0 ? TTTheme.colors.textPrimary : TTTheme.colors.grey03,
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8,
      } as any}>
        <Search size={18} color={isFocused || query.length > 0 ? TTTheme.colors.textPrimary : TTTheme.colors.grey04} />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add member by email, name or group"
          placeholderTextColor={TTTheme.colors.grey05}
          style={{ flex: 1, fontSize: 14, color: TTTheme.colors.foreground, padding: 0, outlineStyle: 'none' } as any}
        />
        {query.length > 0 && (
          <Pressable onPress={() => { setQuery(''); if (selected) { setRoleTooltipDismissedBySearch(true); } else { setRoleConfirmed(false); setSelectedRole('Viewer'); } }}>
            <X size={16} color={TTTheme.colors.grey04} />
          </Pressable>
        )}
      </View>

      {/* ── Selected Members — outside ScrollView so the X Pressable receives touches reliably ── */}
      {(selectedContact || selectedEmail) && (
        <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 } as any}>
          <Text variant="mobileLabelEmphasized" color="foreground">Selected Members (1)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ alignItems: 'center', gap: 4 } as any}>
              <View style={{ width: 62, height: 62, alignItems: 'center', justifyContent: 'center' }}>
                {selectedContact
                  ? renderAvatar(selectedContact, 56)
                  : (
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={24} color={TTTheme.colors.grey05} />
                    </View>
                  )
                }
                <Pressable
                  onPress={() => { setSelected(null); setQuery(''); setRoleConfirmed(false); setSelectedRole('Viewer'); setTooltipDismissed(false); setRoleTooltipDismissedBySearch(false); setRoleTooltipPerformed(false); }}
                  style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center', zIndex: 200 } as any}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={10} color={TTTheme.colors.textPrimary} />
                </Pressable>
              </View>
              <Text variant="mobileMetadataPrimary" color="grey05" numberOfLines={1} style={{ maxWidth: 64, textAlign: 'center' }}>
                {selectedContact ? getSelectedPreviewLabel(selectedContact) : selectedEmail?.split('@')[0].slice(0, 8) + '...'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Scrollable content — paddingBottom so results aren't hidden behind keyboard */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: selected ? 120 : 295 } as any}>

      {/* ── No query: copy link + Your Contact (always shown when query empty) ── */}
      {query.length === 0 && (
        <>
          {/* Copy link — hidden when a member is already selected */}
          {!(selectedContact || selectedEmail) && (
            <View style={{ marginHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
                <Link size={20} color="#fff" />
              </View>
              <Text variant="mobileLabelSmall" color="foreground">Copy link to invite</Text>
            </View>
          )}

          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 3 } as any}>
            <Text variant="mobileLabelEmphasized" color="foreground">Your Contact (1)</Text>
            <Text variant="mobileMetadataPrimary" color="grey05">Choose contact first to invite or add member</Text>
          </View>

          {/* TODO(BE): GET /api/contacts — TaskTag Helpdesk with DS pastelOrange */}
          <Pressable
            onPress={() => handleSelect('carlos')}
            style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.pastelOrange, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="mobileLabelEmphasized" style={{ fontWeight: '700' }} color="white">TH</Text>
            </View>
            <View style={{ flex: 1, gap: 2 } as any}>
              <Text variant="mobileLabelSmall" color="foreground">TaskTag Helpdesk</Text>
              <Button variant="ghost" color="secondary" size="xs" disabled hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={TTTheme.colors.grey05} />}>
                <Text variant="mobileLabelSmall" color="grey05">Viewer</Text>
              </Button>
            </View>
            {renderSelectionCheckbox('carlos')}
          </Pressable>
        </>
      )}

      {/* ── Has query: Suggested list ── */}
      {query.length > 0 && (
        <>
          <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
            <Text variant="mobileLabelEmphasized" color="foreground">Suggested</Text>
          </View>

          {directEmailRow && (
            <Pressable
              onPress={() => handleSelect(directEmailRow)}
              style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} color={TTTheme.colors.grey05} />
              </View>
              <View style={{ flex: 1, gap: 4 } as any}>
                <HighlightedSearchText text={directEmailRow} query={query} />
                <Button
                  variant="ghost" color="secondary" size="xs"
                  onPress={selected === directEmailRow ? handleOpenRoleSheet : undefined}
                  disabled={selected !== directEmailRow}
                  hoverBackgroundColor="transparent"
                  style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0, transform: [{ scale: 1 }] } as any}
                  rightIcon={<ChevronDown size={12} color={selected === directEmailRow ? TTTheme.colors.textPrimary : TTTheme.colors.grey05} />}
                >
                  <Text variant="mobileLabelSmall" color={selected === directEmailRow ? 'foreground' : 'grey05'}>{selected === directEmailRow ? selectedRole : 'Viewer'}</Text>
                </Button>
              </View>
              {renderSelectionCheckbox(directEmailRow)}
            </Pressable>
          )}

          {/* TODO(BE): GET /api/contacts/search?q={query} — filtered results */}
          {visibleContacts.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => handleSelect(item.key)}
              style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
            >
              {renderAvatar(item)}
              <View style={{ flex: 1, gap: 4 } as any}>
                <HighlightedSearchText text={item.label} query={query} />
                {item.role && (
                  <Button variant="ghost" color="secondary" size="xs" onPress={selected === item.key ? handleOpenRoleSheet : undefined} disabled={selected !== item.key} hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0, transform: [{ scale: 1 }] } as any} rightIcon={<ChevronDown size={12} color={selected === item.key ? TTTheme.colors.textPrimary : TTTheme.colors.grey05} />}>
                    <Text variant="mobileLabelSmall" color={selected === item.key ? 'foreground' : 'grey05'}>{selected === item.key ? selectedRole : item.role}</Text>
                  </Button>
                )}
              </View>
              {renderSelectionCheckbox(item.key)}
            </Pressable>
          ))}
        </>
      )}

      </ScrollView>

      {/* Send Invite FAB — visible only when a contact/email is selected */}
      {selected && (
        <Pressable onPress={onNext} style={{ position: 'absolute', bottom: 32, right: 16, zIndex: 2 } as any}>
          <View style={{ backgroundColor: '#000', borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Send size={16} color="#fff" />
            <Text variant="mobileLabelSmall" color="white">Send Invite</Text>
          </View>
        </Pressable>
      )}

      {!selected && <MockKeyboard />}
      {selected && <HomeIndicator />}

      {/* Step 3/4: Change Role tooltip — shown after selection, before role is confirmed */}
      {selected && !roleConfirmed && <ChangeRoleTooltip anim={roleTooltipAnim} onRoleTap={handleOpenRoleSheet} arrowInset={35} />}

      {/* Step 4/4: Confirm Members tooltip — shown after role is selected */}
      {selected && roleConfirmed && (
        <OnboardingTooltip
          title="Confirm Members"
          description="After selecting your members, just hit this button to confirm your selection."
          style={{ left: 34, bottom: 97, zIndex: 61 }}
          arrowEdge="bottom" arrowSide="right" arrowInset={34}
          anim={confirmTooltipAnim}
        />
      )}

      {/* Step 2/4: Search guidance tooltip — 'none' when dismissed so it doesn't block the X button */}
      <OnboardingTooltip
        title="Search for your crew member"
        description="Type their email or name- if they're not on Tasktag yet, they'll get a link to join the project"
        style={{ left: 16, top: 167, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={26}
        anim={tooltipAnim}
        pointerEvents={tooltipDismissed ? 'none' : 'box-none'}
      />

      {/* Role selection bottom sheet */}
      {roleSheetVisible && (
        <>
          <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, opacity: sheetAnim } as any} />
          <Animated.View
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              backgroundColor: '#fff',
              borderTopLeftRadius: 24, borderTopRightRadius: 24,
              paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0,
              zIndex: 51,
              transform: [{ translateY: sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] }) }],
            } as any}
          >
            <View style={{ width: 40, height: 4, backgroundColor: TTTheme.colors.grey04, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text variant="mobileLargeLabel" color="foreground" style={{ fontWeight: '700', textAlign: 'center', marginBottom: 24 }}>Select Role</Text>
            {(['Admin', 'Editor', 'Viewer'] as RoleType[]).map((role) => (
              <Pressable key={role} onPress={() => handleSelectRole(role)}>
                <View style={{ paddingVertical: 18 }}>
                  <Text variant="mobileLabelEmphasized" color={role === selectedRole ? 'secondaryGreen' : 'foreground'}>
                    {role}
                  </Text>
                </View>
              </Pressable>
            ))}
            {/* Home bar */}
            <View style={{ height: 24, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 124, height: 5, backgroundColor: TTTheme.colors.grey06, borderRadius: 5 }} />
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

// ── Screen 3: Search "Carlos" — no tooltip ──────────────────────────────────

function Screen3({ onNext, onRoleTap }: { onNext: () => void; onRoleTap: () => void }) {
  const searchQuery = 'carlossmith';
  const [selected, setSelected] = useState<string | null>(null);
  const roleTooltipAnim = useRef(new Animated.Value(0)).current;
  const selectedContact = INVITE_CONTACTS.find((item) => item.key === selected);
  const selectedEmail = selected && !selectedContact ? selected : null;
  const visibleContacts = INVITE_CONTACTS.filter((item) => contactMatchesQuery(item.label, searchQuery));
  const renderRoleRow = (key: string) => (
    <Button variant="ghost" color="secondary" size="xs" onPress={selected === key ? onRoleTap : undefined} hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={TTTheme.colors.textPrimary} />}>
      <Text variant="mobileLabelSmall" color="foreground">Viewer</Text>
    </Button>
  );

  useEffect(() => {
    Animated.timing(roleTooltipAnim, { toValue: selected ? 1 : 0, duration: 300, useNativeDriver: true }).start();
  }, [roleTooltipAnim, selected]);

  const renderAvatar = (item: typeof INVITE_CONTACTS[number], size = 44) => {
    if (item.type === 'mail') {
      return (
        <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={size === 56 ? 24 : 20} color={TTTheme.colors.grey05} />
        </View>
      );
    }

    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant={size === 56 ? 'mobileLargeLabel' : 'mobileLabelEmphasized'} style={{ fontWeight: '700' }} color="white">{item.initials}</Text>
      </View>
    );
  };

  const getSelectedPreviewLabel = (item: typeof INVITE_CONTACTS[number]) => (
    item.type === 'mail' ? 'carlossm...' : 'Carlos E...'
  );

  const renderSelectionCheckbox = (key: string) => (
    <View pointerEvents="none">
      <Checkbox
        variant="circular"
        checked={selected === key}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ChevronLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelEmphasized" color="foreground" style={{ marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — pill with "carlossmith" */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.grey03, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
        <Search size={18} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelSmall" color="foreground" style={{ flex: 1 }}>carlossmith</Text>
        <X size={16} color={TTTheme.colors.grey04} />
      </View>

      {(selectedContact || selectedEmail) && (
        <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 } as any}>
          <Text variant="mobileLabelEmphasized" color="foreground">Selected Members (1)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ alignItems: 'center', gap: 4 } as any}>
              <View style={{ width: 62, height: 62, alignItems: 'center', justifyContent: 'center' }}>
                {selectedContact
                  ? renderAvatar(selectedContact, 56)
                  : (
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={24} color={TTTheme.colors.grey05} />
                    </View>
                  )
                }
                <Pressable
                  onPress={() => setSelected(null)}
                  style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center', zIndex: 200 } as any}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={10} color={TTTheme.colors.textPrimary} />
                </Pressable>
              </View>
              <Text variant="mobileMetadataPrimary" color="grey05" numberOfLines={1} style={{ maxWidth: 64, textAlign: 'center' }}>
                {selectedContact ? getSelectedPreviewLabel(selectedContact) : selectedEmail?.split('@')[0].slice(0, 8) + '...'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Suggested header */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
        <Text variant="mobileLabelEmphasized" color="foreground">Suggested</Text>
      </View>

      {/* Direct email invite row — hardcoded for "carlossmith" query state */}
      <Pressable
        onPress={() => setSelected('carlossmith@gmail.com')}
        style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
      >
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={20} color={TTTheme.colors.grey05} />
        </View>
        <View style={{ flex: 1, gap: 4 } as any}>
          <HighlightedSearchText text="carlossmith@gmail.com" query={searchQuery} />
          {renderRoleRow('carlossmith@gmail.com')}
        </View>
        {renderSelectionCheckbox('carlossmith@gmail.com')}
      </Pressable>

      {/* TODO(BE): GET /api/contacts/search?q=carlossmith — contact matches */}
      {visibleContacts.map((item) => (
        <Pressable
          key={item.key}
          onPress={() => setSelected(item.key)}
          style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
        >
          {renderAvatar(item)}
          <View style={{ flex: 1, gap: 4 } as any}>
            <HighlightedSearchText text={item.label} query={searchQuery} />
            {renderRoleRow(item.key)}
          </View>
          {renderSelectionCheckbox(item.key)}
        </Pressable>
      ))}

      {selected && (
        <Pressable onPress={onNext} style={{ position: 'absolute', bottom: 32, right: 16, zIndex: 2 } as any}>
          <View style={{ backgroundColor: '#000', borderRadius: 28, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Send size={16} color="#fff" />
            <Text variant="mobileLabelSmall" color="white">Send Invite</Text>
          </View>
        </Pressable>
      )}

      <HomeIndicator />

      {selected && <ChangeRoleTooltip anim={roleTooltipAnim} onRoleTap={onRoleTap} />}
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
  const [carlosSelected, setCarlosSelected] = useState(true);
  const searchQuery = 'Carlos';
  const roleColor = carlosRole === 'Viewer' ? TTTheme.colors.textPrimary : TTTheme.colors.secondaryGreen;

  return (
    <>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ChevronLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelEmphasized" color="foreground" style={{ marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — pill with "Carlos" */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.grey03, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
        <Search size={18} color={TTTheme.colors.textPrimary} />
        <Text variant="mobileLabelSmall" color="foreground" style={{ flex: 1 }}>Carlos</Text>
        <X size={16} color={TTTheme.colors.grey04} />
      </View>

      {/* Selected Members */}
      {carlosSelected && (
        <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">Selected Members (1)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ alignItems: 'center', gap: 4 } as any}>
              <View style={{ width: 62, height: 62, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={24} color={TTTheme.colors.grey05} />
                </View>
                <Pressable
                  onPress={() => setCarlosSelected(false)}
                  style={{ position: 'absolute', top: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center', zIndex: 200 } as any}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={10} color={TTTheme.colors.textPrimary} />
                </Pressable>
              </View>
              <Text variant="mobileMetadataPrimary" color="grey05" numberOfLines={1} style={{ maxWidth: 64, textAlign: 'center' }}>carlossm...</Text>
            </View>
          </View>
        </View>
      )}

      {/* Suggested header */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
        <Text variant="mobileLabelEmphasized" color="foreground">Suggested</Text>
      </View>

      {/* carlossmith — mail icon + green checkmark */}
      <View style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={20} color={TTTheme.colors.grey05} />
        </View>
        <View style={{ flex: 1, gap: 4 } as any}>
          <HighlightedSearchText text="carlossmith@gmail.com" query={searchQuery} />
          <Button variant="ghost" color="secondary" size="xs" onPress={onRoleTap} hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0, transform: [{ scale: 1 }] } as any} rightIcon={<ChevronDown size={12} color={roleColor} />}>
            <Text variant="mobileLabelSmall" style={{ color: roleColor }}>{carlosRole}</Text>
          </Button>
        </View>
        <View pointerEvents="none">
          <Checkbox variant="circular" checked />
        </View>
      </View>

      {/* Other suggested contact */}
      {([
        { initials: 'CE', bg: TTTheme.colors.pastelOrange,  label: 'Carlos Eduardo',       hasRole: true },
      ] as {initials:string;bg:string;label:string;hasRole:boolean}[]).map((item) => (
        <View key={item.label} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '700' }} color="white">{item.initials}</Text>
          </View>
          <View style={{ flex: 1, gap: 2 } as any}>
            <HighlightedSearchText text={item.label} query={searchQuery} />
            {item.hasRole && (
              <Button variant="ghost" color="secondary" size="xs" hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={TTTheme.colors.textPrimary} />}>
                <Text variant="mobileLabelSmall" color="foreground">Viewer</Text>
              </Button>
            )}
          </View>
          <View pointerEvents="none">
            <Checkbox variant="circular" checked={false} />
          </View>
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
        description="You can change the roles of your members by clicking on drop-down."
        style={{ right: 14, top: 437, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={35}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onRoleTap}
        style={{ position: 'absolute', right: 14, top: 437, width: 313, height: 150, zIndex: 70 } as any}
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
        style={{ left: 36, top: 551, zIndex: 61 }}
        arrowEdge="bottom" arrowSide="right" arrowInset={34}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onSendInvite}
        style={{ position: 'absolute', left: 36, top: 551, width: 313, height: 90, zIndex: 70 } as any}
      />

      <HomeIndicator />
    </View>
  );
}

// ── Screen 7: Members page ───────────────────────────────────────────────────

function Screen7({
  onAddTasksNow,
  onBackToProject,
}: {
  onAddTasksNow: () => void;
  onBackToProject: () => void;
}) {
  return <MembersScreen onPrimary={onAddTasksNow} onSecondary={onBackToProject} />;
}

// ── Main Case3Screen ─────────────────────────────────────────────────────────

export function Case3Screen({
  startScreen = 1,
  onComplete,
  onAddTasksNow,
}: {
  startScreen?: 1 | 2;
  onComplete?: () => void;
  onAddTasksNow?: () => void;
}) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(startScreen as 1 | 2 | 3 | 4 | 5 | 6 | 7);

  const backToProject = onComplete ?? (() => setScreen(1));
  const addTasksNow   = onAddTasksNow ?? backToProject;

  return (
    <Box flex={1} backgroundColor="white">
      {screen === 1 && <Screen1 onInvite={() => setScreen(2)} />}
      {screen === 2 && <Screen2 onNext={() => setScreen(7)} />}
      {screen === 3 && <Screen3 onNext={() => setScreen(4)} onRoleTap={() => setScreen(5)} />}
      {screen === 4 && <Screen4 onRoleTap={() => setScreen(5)} />}
      {screen === 5 && <Screen5 onSelectAdmin={() => setScreen(6)} />}
      {screen === 6 && <Screen6 onSendInvite={() => setScreen(7)} />}
      {screen === 7 && <Screen7 onAddTasksNow={addTasksNow} onBackToProject={backToProject} />}
    </Box>
  );
}
