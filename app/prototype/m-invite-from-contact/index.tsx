import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Check,
  ChevronLeft,
  Link,
  Search,
  Users,
  Wifi,
} from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

// ── Data ──────────────────────────────────────────────────────────────────────

type Contact = {
  id: string;
  initials: string;
  bgColor: string;
  name: string;
  email?: string;
};

const CONTACTS: Contact[] = [
  { id: '1', initials: 'AO', bgColor: '#CC7351', name: 'Alexander Oliver', email: 'alexanderoliver@gmail.com' },
  { id: '2', initials: 'CS', bgColor: '#4A90A4', name: 'Chelsea Smith', email: 'chelseasmith@gmail.com' },
  { id: '3', initials: 'LS', bgColor: '#035B60', name: 'Logan Smith', email: 'logansmith@gmail.com' },
  { id: '4', initials: 'MM', bgColor: '#8B7355', name: 'Melissa Monroe', email: 'melissamonroe@gmail.com' },
  { id: '5', initials: 'TW', bgColor: '#655D8A', name: 'Theresa Webb', email: 'theresawebb@gmail.com' },
  { id: '6', initials: 'TH', bgColor: '#FC7F5B', name: 'Tasktag Helpdesk', email: undefined },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function IOSStatusBar() {
  const theme = useTheme<Theme>();
  const black = theme.colors.black;
  return (
    <Box height={44} paddingHorizontal="16" flexDirection="row" alignItems="center" justifyContent="space-between">
      <Text style={{ fontSize: 15, fontWeight: '600', color: black, letterSpacing: -0.3 }}>9:41</Text>
      <Box flexDirection="row" alignItems="center" style={{ gap: 6 } as any}>
        <Box flexDirection="row" alignItems="flex-end" style={{ gap: 2 } as any}>
          {[4, 6, 8, 11].map((h, i) => (
            <Box key={i} width={3} style={{ height: h, backgroundColor: black, borderRadius: 1 } as any} />
          ))}
        </Box>
        <Wifi size={14} color={black} strokeWidth={2.5} />
        <Box flexDirection="row" alignItems="center">
          <Box style={{ width: 22, height: 11, borderRadius: 2.5, borderWidth: 1, borderColor: black, justifyContent: 'center', paddingHorizontal: 1 } as any}>
            <Box style={{ width: '80%', height: 7, backgroundColor: black, borderRadius: 1 } as any} />
          </Box>
          <Box style={{ width: 2, height: 5, backgroundColor: black, borderRadius: 1, marginLeft: 1 } as any} />
        </Box>
      </Box>
    </Box>
  );
}

function ContactRow({ contact, selected, onToggle }: { contact: Contact; selected: boolean; onToggle: () => void }) {
  const theme = useTheme<Theme>();
  const grey03 = (theme.colors as any).grey03;
  return (
    <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
      <Box
        width={40} height={40}
        alignItems="center" justifyContent="center"
        style={{ backgroundColor: contact.bgColor, borderRadius: 20 } as any}
      >
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>{contact.initials}</Text>
      </Box>
      <Box flex={1}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 16, lineHeight: 24, color: theme.colors.textPrimary, fontFamily: 'Inter_400Regular' }}
        >
          {contact.name}
        </Text>
        {contact.email && (
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, lineHeight: 16, letterSpacing: 0.24, color: (theme.colors as any).grey04 }}
          >
            {contact.email}
          </Text>
        )}
      </Box>
      <Pressable onPress={onToggle}>
        <Box
          width={20} height={20}
          alignItems="center" justifyContent="center"
          style={{
            borderRadius: 10,
            backgroundColor: selected ? theme.colors.secondaryGreen : 'transparent',
            borderWidth: selected ? 0 : 2,
            borderColor: grey03,
          } as any}
        >
          {selected && <Check size={12} color="#fff" strokeWidth={3} />}
        </Box>
      </Pressable>
    </Box>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function MInviteFromContact() {
  const theme = useTheme<Theme>();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth >= 768;

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = search
    ? CONTACTS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : CONTACTS;

  return (
    <Box
      flex={1}
      backgroundColor={isDesktop ? 'grey02' : 'white'}
      alignItems={isDesktop ? 'center' : 'stretch'}
    >
      <Box flex={1} width="100%" maxWidth={isDesktop ? 375 : undefined} backgroundColor="white">

        <IOSStatusBar />

        {/* Header */}
        <Box
          height={44}
          flexDirection="row" alignItems="center"
          paddingHorizontal="16"
          backgroundColor="white"
          style={{ borderBottomWidth: 1, borderBottomColor: (theme.colors as any).grey03 } as any}
        >
          <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
            <Pressable>
              <ChevronLeft size={24} color={theme.colors.textPrimary} />
            </Pressable>
            <Text variant="webLargeLabel" color="textPrimary">New Chat</Text>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}>

          {/* Search + Actions */}
          <Box paddingHorizontal="16" paddingTop="16" style={{ gap: 16 } as any}>

            {/* Search */}
            <Box style={{ marginBottom: -16 } as any}>
              <TextInput
                icon={Search}
                iconColor={(theme.colors as any).grey04}
                size="md"
                value={search}
                onChangeText={setSearch}
                placeholder="Add contact by email, name or group"
                showClearButton={false}
              />
            </Box>

            {/* Copy link to invite */}
            <Pressable>
              <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
                <Box
                  width={40} height={40}
                  alignItems="center" justifyContent="center"
                  style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 20 } as any}
                >
                  <Link size={20} color="#fff" />
                </Box>
                <Text variant="webLabelEmphasized" color="textPrimary">Copy link to invite</Text>
              </Box>
            </Pressable>

            {/* Invite from Phone's contact */}
            <Pressable onPress={() => router.push('/prototype/m-invite-from-contact/phone-contact' as any)}>
              <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
                <Box
                  width={40} height={40}
                  alignItems="center" justifyContent="center"
                  style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 20 } as any}
                >
                  <Users size={20} color="#fff" />
                </Box>
                <Text variant="webLabelEmphasized" color="textPrimary">Invite from Phone's contact</Text>
              </Box>
            </Pressable>
          </Box>

          {/* Contact list */}
          <Box paddingHorizontal="16" paddingTop="16" style={{ gap: 16 } as any}>
            <Box style={{ gap: 4 } as any}>
              <Text variant="webLabelEmphasized" color="textPrimary">
                Your Contact ({filtered.length})
              </Text>
              <Text
                variant="webMetadataPrimary"
                style={{ color: (theme.colors as any).grey04 }}
              >
                Choose contact first to create a group.
              </Text>
            </Box>

            {filtered.map(contact => (
              <ContactRow
                key={contact.id}
                contact={contact}
                selected={selected.has(contact.id)}
                onToggle={() => toggle(contact.id)}
              />
            ))}
          </Box>

        </ScrollView>

        {/* Home Bar */}
        <Box height={24} alignItems="center" justifyContent="center">
          <Box style={{ width: 134, height: 5, backgroundColor: theme.colors.black, borderRadius: 5 } as any} />
        </Box>

      </Box>
    </Box>
  );
}
