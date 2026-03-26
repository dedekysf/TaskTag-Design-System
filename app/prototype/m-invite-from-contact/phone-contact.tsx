import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { ChevronLeft, Search, Wifi } from 'lucide-react-native';
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
  phone: string;
};

type ContactGroup = {
  letter: string;
  contacts: Contact[];
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

const CONTACT_GROUPS: ContactGroup[] = [
  {
    letter: 'A',
    contacts: [
      { id: 'a1', initials: 'AS', bgColor: '#8B7355', name: 'Abby Smith', phone: '+1 (213) 555-0182' },
      { id: 'a2', initials: 'AZ', bgColor: '#18A87D', name: 'Adam Zhang', phone: '+1 (415) 555-0134' },
      { id: 'a3', initials: 'AJ', bgColor: '#18A87D', name: 'Alice Johnson', phone: '+1 (312) 555-0271' },
      { id: 'a4', initials: 'AB', bgColor: '#18A87D', name: 'Alice Brown', phone: '+1 (646) 555-0193' },
    ],
  },
  {
    letter: 'B',
    contacts: [
      { id: 'b1', initials: 'BS', bgColor: '#18A87D', name: 'Billy Smith', phone: '+1 (702) 555-0148' },
      { id: 'b2', initials: 'BA', bgColor: '#8B7355', name: 'Billy Anderson', phone: '+1 (503) 555-0217' },
    ],
  },
  {
    letter: 'C',
    contacts: [
      { id: 'c1', initials: 'CS', bgColor: '#655D8A', name: 'Catherine Scott', phone: '+1 (404) 555-0163' },
      { id: 'c2', initials: 'CW', bgColor: '#CC7351', name: 'Chris Walker', phone: '+1 (214) 555-0309' },
    ],
  },
  {
    letter: 'D',
    contacts: [
      { id: 'd1', initials: 'DM', bgColor: '#035B60', name: 'David Miller', phone: '+1 (617) 555-0244' },
    ],
  },
  {
    letter: 'E',
    contacts: [
      { id: 'e1', initials: 'EL', bgColor: '#18A87D', name: 'Emily Lee', phone: '+1 (206) 555-0187' },
      { id: 'e2', initials: 'EW', bgColor: '#655D8A', name: 'Ethan Wilson', phone: '+1 (305) 555-0126' },
    ],
  },
  {
    letter: 'F',
    contacts: [
      { id: 'f1', initials: 'FT', bgColor: '#CC7351', name: 'Fiona Taylor', phone: '+1 (512) 555-0358' },
    ],
  },
  {
    letter: 'L',
    contacts: [
      { id: 'l1', initials: 'LS', bgColor: '#035B60', name: 'Logan Smith', phone: '+1 (713) 555-0241' },
      { id: 'l2', initials: 'LJ', bgColor: '#18A87D', name: 'Laura Jones', phone: '+1 (347) 555-0175' },
    ],
  },
  {
    letter: 'M',
    contacts: [
      { id: 'm1', initials: 'MM', bgColor: '#8B7355', name: 'Melissa Monroe', phone: '+1 (480) 555-0392' },
      { id: 'm2', initials: 'MK', bgColor: '#655D8A', name: 'Michael King', phone: '+1 (773) 555-0218' },
    ],
  },
  {
    letter: 'T',
    contacts: [
      { id: 't1', initials: 'TW', bgColor: '#655D8A', name: 'Theresa Webb', phone: '+1 (602) 555-0147' },
      { id: 't2', initials: 'TH', bgColor: '#FC7F5B', name: 'Tasktag Helpdesk', phone: '+1 (800) 555-0100' },
    ],
  },
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

// ── Main ───────────────────────────────────────────────────────────────────────

export default function MInviteFromPhoneContact() {
  const theme = useTheme<Theme>();
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth >= 768;

  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const grey01 = (theme.colors as any).grey01;
  const grey03 = (theme.colors as any).grey03;
  const grey04 = (theme.colors as any).grey04;

  const filteredGroups = CONTACT_GROUPS
    .map(group => ({
      ...group,
      contacts: search
        ? group.contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
        : group.contacts,
    }))
    .filter(group => group.contacts.length > 0);

  return (
    <Box
      flex={1}
      backgroundColor={isDesktop ? 'grey02' : 'white'}
      alignItems={isDesktop ? 'center' : 'stretch'}
    >
      <Box flex={1} width="100%" maxWidth={isDesktop ? 375 : undefined} backgroundColor="white" style={{ position: 'relative' } as any}>

        <IOSStatusBar />

        {/* Header */}
        <Box
          height={44}
          flexDirection="row" alignItems="center"
          paddingHorizontal="16"
          backgroundColor="white"
          style={{ borderBottomWidth: 1, borderBottomColor: grey03 } as any}
        >
          <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
            <Pressable onPress={() => router.back()}>
              <ChevronLeft size={24} color={theme.colors.textPrimary} />
            </Pressable>
            <Text variant="webLargeLabel" color="textPrimary">Invite from Phone's contact</Text>
          </Box>
        </Box>

        {/* Search */}
        <Box paddingHorizontal="16" paddingTop="16" paddingBottom="16" style={{ marginBottom: -16 } as any}>
          <TextInput
            icon={Search}
            iconColor={grey04}
            size="md"
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            showClearButton={false}
          />
        </Box>

        {/* Divider */}
        <Box height={1} backgroundColor="border" />

        {/* List + Alphabet index */}
        <Box flex={1} style={{ position: 'relative' } as any}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
            {filteredGroups.map(group => (
              <Box key={group.letter}>
                {/* Section header */}
                <Box
                  paddingHorizontal="16" paddingVertical="8"
                  style={{ backgroundColor: grey01 } as any}
                >
                  <Text variant="webLabelEmphasized" color="textPrimary">{group.letter}</Text>
                </Box>

                {/* Contacts */}
                <Box paddingLeft="16" paddingTop="16" style={{ gap: 16 } as any}>
                  {group.contacts.map(contact => (
                    <Pressable key={contact.id} onPress={() => setSelectedContact(contact)}>
                      <Box flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
                        <Box
                          width={40} height={40}
                          alignItems="center" justifyContent="center"
                          style={{ backgroundColor: contact.bgColor, borderRadius: 20 } as any}
                        >
                          <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            {contact.initials}
                          </Text>
                        </Box>
                        <Box>
                          <Text variant="webLabelEmphasized" color="textPrimary" numberOfLines={1}>
                            {contact.name}
                          </Text>
                          <Text variant="webMetadataPrimary" style={{ color: (theme.colors as any).grey05 }} numberOfLines={1}>
                            {contact.phone}
                          </Text>
                        </Box>
                      </Box>
                    </Pressable>
                  ))}
                </Box>
                <Box height={16} />
              </Box>
            ))}
          </ScrollView>

          {/* Alphabet index */}
          <Box
            style={{
              position: 'absolute',
              right: 4,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            } as any}
          >
            {ALPHABET.map(letter => (
              <Text
                key={letter}
                variant="webMetadataSecondary"
                style={{ color: grey04 }}
              >
                {letter}
              </Text>
            ))}
          </Box>
        </Box>

        {/* Home Bar */}
        <Box height={24} alignItems="center" justifyContent="center">
          <Box style={{ width: 134, height: 5, backgroundColor: theme.colors.black, borderRadius: 5 } as any} />
        </Box>

        {/* Invite Modal Overlay — inside frame */}
        {!!selectedContact && (
          <Pressable
            onPress={() => setSelectedContact(null)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' } as any}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <Box
                backgroundColor="white"
                padding="24"
                style={{ borderRadius: 8, width: 343 } as any}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: '600', lineHeight: 32, color: theme.colors.textPrimary, marginBottom: 8 }}
                >
                  Invite
                </Text>
                <Text
                  style={{ fontSize: 16, fontWeight: '400', lineHeight: 21, color: theme.colors.textSecondary, marginBottom: 24 }}
                >
                  Do you want to invite {selectedContact?.name} to TaskTag?
                </Text>
                <Box flexDirection="row" justifyContent="flex-end" style={{ gap: 24 } as any}>
                  <Pressable onPress={() => setSelectedContact(null)}>
                    <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 21, color: theme.colors.textPrimary }}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => {
                    const name = selectedContact?.name;
                    setSelectedContact(null);
                    router.push({ pathname: '/prototype/m-invite-from-contact/sms' as any, params: { name } });
                  }}>
                    <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 21, color: theme.colors.secondaryGreen }}>
                      Invite
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </Pressable>
          </Pressable>
        )}

      </Box>
    </Box>
  );
}
