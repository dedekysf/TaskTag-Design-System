import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../_shared/mobile/MockKeyboard';
import { SuccessModal } from '../_shared/mobile/SuccessModal';
import { OnboardingTooltip, useTooltipAnim } from '../_shared/mobile/OnboardingTooltip';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
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
const INVITE_CONTACTS = [
  { key: 'ce', type: 'initials' as const, initials: 'CE', bg: TTTheme.colors.pastelOrange, label: 'Carlos Eduardo', role: 'Viewer' as const },
];

function ChangeRoleTooltip({
  anim,
  onRoleTap,
}: {
  anim: Animated.Value;
  onRoleTap: () => void;
}) {
  return (
    <>
      <OnboardingTooltip
        title="Change Role"
        description="You can change the roles of your members by clicking on drop-down."
        step="Step 3/4"
        style={{ right: 14, top: 437, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={8}
        anim={anim}
      />

      <Pressable
        onPress={onRoleTap}
        style={{ position: 'absolute', right: 14, top: 437, width: 313, height: 150, zIndex: 70 } as any}
      />
    </>
  );
}

function Screen2({ onNext, onRoleTap }: { onNext: () => void; onRoleTap: () => void }) {
  const tooltipAnim = useTooltipAnim();
  const roleTooltipAnim = useRef(new Animated.Value(0)).current;
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);

  // Auto-focus on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  // Fade out the search tooltip once the user starts interacting with results.
  useEffect(() => {
    const shouldHideSearchTooltip = query.length > 0 || selected !== null;
    Animated.timing(tooltipAnim, { toValue: shouldHideSearchTooltip ? 0 : 1, duration: 300, useNativeDriver: true }).start();
  }, [query.length, selected, tooltipAnim]);

  useEffect(() => {
    Animated.timing(roleTooltipAnim, { toValue: selected ? 1 : 0, duration: 300, useNativeDriver: true }).start();
  }, [roleTooltipAnim, selected]);

  const showResults = query.length > 0 || selected !== null;
  const normalizedQuery = normalizeSearchText(query);
  const directEmailRow = query.trim().length > 0 && !query.includes('@')
    ? `${normalizedQuery}@gmail.com`
    : null;
  const visibleContacts = query.trim().length >= 5
    ? INVITE_CONTACTS.filter((item) => contactMatchesQuery(item.label, query))
    : [];
  // selected is either a contact key or a bare email string for direct invites
  const selectedContact = INVITE_CONTACTS.find((item) => item.key === selected);
  const selectedEmail = selected && !selectedContact ? selected : null;

  const handleSelect = (key: string) => {
    setSelected(key);
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
    const fontSize = size === 56 ? 17 : 15;

    if (item.type === 'mail') return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
        <Mail size={iconSize} color={TTTheme.colors.grey05} />
      </View>
    );
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize, fontWeight: '700' }} color="white">{item.initials}</Text>
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

      {/* Search — active = black border (2px) from DS textPrimary */}
      <View style={{
        marginHorizontal: 16, marginTop: 16,
        flexDirection: 'row', alignItems: 'center',
        borderWidth: isFocused || query.length > 0 ? 2 : 1,
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
          <Pressable onPress={() => setQuery('')}>
            <X size={16} color={TTTheme.colors.grey04} />
          </Pressable>
        )}
      </View>

      {/* Scrollable content — paddingBottom so results aren't hidden behind keyboard */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: selected ? 120 : 295 } as any}>

      {/* ── No query: copy link + Your Contact ── */}
      {!showResults && (
        <>
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

          {/* TODO(BE): GET /api/contacts — TaskTag Helpdesk with DS pastelOrange */}
          <Pressable
            onPress={() => handleSelect('carlos')}
            style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.pastelOrange, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '700' }} color="white">TH</Text>
            </View>
            <View style={{ flex: 1, gap: 2 } as any}>
              <Text variant="mobileLabelSmall" color="foreground">TaskTag Helpdesk</Text>
              <Button variant="ghost" color="secondary" size="xs" hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={TTTheme.colors.textPrimary} />}>
                <Text variant="mobileLabelSmall" color="foreground">Viewer</Text>
              </Button>
            </View>
            {renderSelectionCheckbox('carlos')}
          </Pressable>
        </>
      )}

      {/* ── Has query or selection: Selected Members + Suggested list ── */}
      {showResults && (
        <>
          {/* Selected Members — shown once a contact or direct email is selected */}
          {(selectedContact || selectedEmail) && (
            <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 } as any}>
              <Text variant="mobileLabelSmall" color="foreground">Selected Members (1)</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ alignItems: 'center', gap: 4 } as any}>
                  <View>
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
                      style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' } as any}
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

          {/* Suggested */}
          <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
            <Text variant="mobileLabelEmphasized" color="foreground">Suggested</Text>
          </View>

          {/* Direct email invite row — always visible and pressable; user invites by the email they're typing */}
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
                <Button variant="ghost" color="secondary" size="xs" hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={TTTheme.colors.textPrimary} />}>
                  <Text variant="mobileLabelSmall" color="foreground">Viewer</Text>
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
                  <Button variant="ghost" color="secondary" size="xs" onPress={selected === item.key ? onRoleTap : undefined} hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={TTTheme.colors.textPrimary} />}>
                    <Text variant="mobileLabelSmall" color="foreground">{item.role}</Text>
                  </Button>
                )}
              </View>
              {renderSelectionCheckbox(item.key)}
            </Pressable>
          ))}
        </>
      )}

      </ScrollView>

      {/* Send Invite FAB — visible only when a contact is selected */}
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

      {selected && <ChangeRoleTooltip anim={roleTooltipAnim} onRoleTap={onRoleTap} />}

      {/* Tooltip — Step 2/4 guidance */}
      <OnboardingTooltip
        title="Search for your crew member"
        description="Type their name or email address to find and invite them."
        step="Step 2/4"
        style={{ left: 16, top: 167, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={26}
        anim={tooltipAnim}
      />
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
        <Text style={{ fontSize: size === 56 ? 17 : 15, fontWeight: '700' }} color="white">{item.initials}</Text>
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
          <Text variant="mobileLabelSmall" color="foreground">Selected Members (1)</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ alignItems: 'center', gap: 4 } as any}>
              <View>
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
                  style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' } as any}
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
      <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 10 } as any}>
        <Text variant="mobileLabelSmall" color="foreground">Selected Members (1)</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ alignItems: 'center', gap: 4 } as any}>
            <View>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={24} color={TTTheme.colors.grey05} />
              </View>
              <View style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' }}>
                <X size={10} color={TTTheme.colors.textPrimary} />
              </View>
            </View>
            <Text variant="mobileMetadataPrimary" color="grey05" numberOfLines={1} style={{ maxWidth: 64, textAlign: 'center' }}>carlossm...</Text>
          </View>
        </View>
      </View>

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
          <Button variant="ghost" color="secondary" size="xs" onPress={onRoleTap} hoverBackgroundColor="transparent" style={{ justifyContent: 'flex-start', alignSelf: 'stretch', paddingHorizontal: 0 } as any} rightIcon={<ChevronDown size={12} color={roleColor} />}>
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
        step="Step 3/4"
        style={{ right: 14, top: 437, zIndex: 61 }}
        arrowEdge="top" arrowSide="left" arrowInset={8}
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
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={18} color={TTTheme.colors.grey05} />
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

export function Case3Screen({
  startScreen = 1,
  onComplete,
}: {
  startScreen?: 1 | 2;
  /** Called when "Add Tasks Now" is tapped — advances to Case 4 */
  onComplete?: () => void;
}) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(startScreen as 1 | 2 | 3 | 4 | 5 | 6 | 7);

  return (
    <Box flex={1} backgroundColor="white">
      {screen === 1 && <Screen1 onInvite={() => setScreen(2)} />}
      {screen === 2 && <Screen2 onNext={() => setScreen(4)} onRoleTap={() => setScreen(5)} />}
      {screen === 3 && <Screen3 onNext={() => setScreen(4)} onRoleTap={() => setScreen(5)} />}
      {screen === 4 && <Screen4 onRoleTap={() => setScreen(5)} />}
      {screen === 5 && <Screen5 onSelectAdmin={() => setScreen(6)} />}
      {screen === 6 && <Screen6 onSendInvite={() => setScreen(7)} />}
      {screen === 7 && <Screen7 onDone={onComplete ?? (() => setScreen(1))} />}
    </Box>
  );
}
