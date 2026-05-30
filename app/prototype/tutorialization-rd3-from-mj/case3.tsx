import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Link,
  Plus,
  Search,
  Send,
  UserPlus,
  X,
} from 'lucide-react-native';

// ── Figma assets — expire ~7 days from 2026-05-30 ──────────────────────────
const imgLeftbottom   = 'https://www.figma.com/api/mcp/asset/7448f2fd-af2f-46eb-80dc-ed8b44705d30';
const imgMj           = 'https://www.figma.com/api/mcp/asset/32e67fad-0fc9-4f9b-b15e-8824cd1a5d22';
const imgOverlay1     = 'https://www.figma.com/api/mcp/asset/f5791ee1-d909-4246-b534-81d20de790bf';
const imgLefttop2     = 'https://www.figma.com/api/mcp/asset/1a6b232d-5e92-49e6-805d-cfd7cdf977c5';
const imgLefttop4     = 'https://www.figma.com/api/mcp/asset/84e82e4d-6a08-4c7a-8253-3a509dcc2e1b';
const imgRightbottom6 = 'https://www.figma.com/api/mcp/asset/3b7ab14f-cb38-4e47-8a4a-c5189898c926';
const imgSuccessCheck = 'https://www.figma.com/api/mcp/asset/dca05c6b-3462-4d31-9853-a67cf6deb0cb';
const imgOverlay7     = 'https://www.figma.com/api/mcp/asset/954bb4fc-0d08-4007-bb3f-846460822f43';

// ── Shared sub-components ───────────────────────────────────────────────────

function StatusBarRow() {
  return (
    <View style={{ height: 44, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#000' }}>9:41</Text>
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        <View style={{ width: 17, height: 12, borderRadius: 2, backgroundColor: '#000' }} />
        <View style={{ width: 16, height: 12, borderRadius: 1, backgroundColor: '#000' }} />
        <View style={{ width: 24, height: 12, borderRadius: 2, borderWidth: 1, borderColor: '#000' }}>
          <View style={{ width: '70%', height: '100%', backgroundColor: '#000', borderRadius: 1 }} />
        </View>
      </View>
    </View>
  );
}

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
    </View>
  );
}

// Animated green tooltip card
function TooltipCard({
  title,
  description,
  step,
  style,
  arrowSrc,
  arrowStyle,
  anim,
}: {
  title: string;
  description: string;
  step: string;
  style?: object;
  arrowSrc: string;
  arrowStyle?: object;
  anim: Animated.Value;
}) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <Animated.View
      style={[
        { position: 'absolute', zIndex: 60, width: 313, opacity: anim, transform: [{ translateY }] },
        style,
      ] as any}
    >
      <View
        style={{
          backgroundColor: TTTheme.colors.secondaryGreen,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 6,
        } as any}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', lineHeight: 20 }}>{title}</Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 16 }}>{step}</Text>
        </View>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 18 }}>{description}</Text>
      </View>
      <ExpoImage
        source={{ uri: arrowSrc }}
        style={[{ width: 24, height: 24, position: 'absolute' }, arrowStyle] as any}
        contentFit="contain"
      />
    </Animated.View>
  );
}

function useTooltipAnim(delay = 200) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      delay,
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return anim;
}

// ── Screen 1: Project Detail + "Add your crew" tooltip ─────────────────────

function Screen1({ onInvite }: { onInvite: () => void }) {
  const tooltipAnim = useTooltipAnim();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <ProjectDetailScreen onInvite={onInvite} />

      {/* Dark overlay — pointer events none so Invite button stays tappable */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 } as any}>
        <ExpoImage source={{ uri: imgOverlay1 }} style={{ flex: 1 } as any} contentFit="cover" />
      </View>

      {/* Tooltip */}
      <TooltipCard
        title="Add your crew"
        description={'Tap "Invite" to add a crew member — they\'ll get a link via WhatsApp'}
        step="Step 1/4"
        style={{ top: 244, left: 24 }}
        arrowSrc={imgLeftbottom}
        arrowStyle={{ bottom: -20, left: 8, transform: [{ rotate: '180deg' }] }}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onInvite}
        style={{ position: 'absolute', top: 244, left: 24, width: 313, height: 90, zIndex: 70 } as any}
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
        <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary, marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search input — focused state */}
      <Pressable
        onPress={onNext}
        style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: TTTheme.colors.textPrimary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}
      >
        <Search size={16} color={TTTheme.colors.grey04} />
        <Text style={{ flex: 1, fontSize: 14, color: TTTheme.colors.grey04 }}>Search name or email address</Text>
      </Pressable>

      {/* Copy link row */}
      <View style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Link size={18} color={TTTheme.colors.textPrimary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>Copy link to invite</Text>
      </View>

      {/* Your Contacts label */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: TTTheme.colors.grey04, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your Contacts (1)</Text>
      </View>

      {/* TaskTag Helpdesk contact */}
      <View style={{ marginHorizontal: 16, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F97316', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>TH</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>TaskTag Helpdesk</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ fontSize: 12, color: TTTheme.colors.textPrimary }}>Viewer</Text>
          <ChevronDown size={12} color={TTTheme.colors.textPrimary} />
        </View>
      </View>

      {/* Decorative keyboard */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30 }}>
        <View style={{ backgroundColor: '#D1D5DB', paddingTop: 8, paddingHorizontal: 8, paddingBottom: 4, gap: 8 }}>
          {[
            ['Q','W','E','R','T','Y','U','I','O','P'],
            ['A','S','D','F','G','H','J','K','L'],
            ['⇧','Z','X','C','V','B','N','M','⌫'],
          ].map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
              {row.map((k) => (
                <View key={k} style={{ backgroundColor: '#fff', borderRadius: 5, paddingHorizontal: 9, paddingVertical: 10, minWidth: 28, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#000' }}>{k}</Text>
                </View>
              ))}
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#ADB5BD', borderRadius: 5, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#000' }}>123</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 5, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#9CA3AF' }}>space</Text>
            </View>
            <View style={{ backgroundColor: '#ADB5BD', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#000' }}>return</Text>
            </View>
          </View>
          <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8 }}>
            <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
          </View>
        </View>
      </View>

      {/* Tooltip — tap it to advance */}
      <TooltipCard
        title="Search for your crew member"
        description="Type their name or email address to find and invite them."
        step="Step 2/4"
        style={{ left: 35, top: 172, zIndex: 61 }}
        arrowSrc={imgLefttop2}
        arrowStyle={{ top: -20, left: 8 }}
        anim={tooltipAnim}
      />
      <Pressable
        onPress={onNext}
        style={{ position: 'absolute', left: 35, top: 172, width: 313, height: 90, zIndex: 70 } as any}
      />
    </View>
  );
}

// ── Screen 3: Search "Carlos" — no tooltip ──────────────────────────────────

function Screen3({ onNext }: { onNext: () => void }) {
  const CONTACTS = [
    { initials: 'CS', bg: '#6C3CE1', name: 'carlossmith@gmail.com', sub: 'carlossmith@gmail.com' },
    { initials: 'CE', bg: '#0EA5E9', name: 'Carlos Eduardo',        sub: 'carloseduar@gmail.com' },
    { initials: 'CC', bg: '#22C55E', name: 'Carlos Constructions',  sub: 'carlos.cons@gmail.com' },
    { initials: 'LS', bg: '#F97316', name: 'Logan Smith',           sub: 'logansmith@gmail.com' },
    { initials: 'MM', bg: '#EC4899', name: 'Melissa Monroe',        sub: 'melissa.mon@gmail.com' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
        <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary, marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search with "Carlos" */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
        <Search size={16} color={TTTheme.colors.grey04} />
        <Text style={{ flex: 1, fontSize: 14, color: TTTheme.colors.textPrimary }}>Carlos</Text>
        <X size={14} color={TTTheme.colors.grey04} />
      </View>

      {/* Copy link row */}
      <View style={{ marginHorizontal: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Link size={18} color={TTTheme.colors.textPrimary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>Copy link to invite</Text>
      </View>

      {/* Suggested header */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: TTTheme.colors.grey04, textTransform: 'uppercase', letterSpacing: 0.5 }}>Suggested</Text>
      </View>

      {/* Results — tapping any row advances */}
      {CONTACTS.map((item) => (
        <Pressable
          key={item.initials}
          onPress={onNext}
          style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}
        >
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{item.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>{item.sub}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, color: TTTheme.colors.textPrimary }}>Viewer</Text>
            <ChevronDown size={12} color={TTTheme.colors.textPrimary} />
          </View>
        </Pressable>
      ))}

      <HomeIndicator />
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
        <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary, marginLeft: 8 }}>Invite or Add Member</Text>
      </View>

      {/* Search — Carlos + X */}
      <View style={{ marginHorizontal: 16, marginTop: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
        <Search size={16} color={TTTheme.colors.grey04} />
        <Text style={{ flex: 1, fontSize: 14, color: TTTheme.colors.textPrimary }}>Carlos</Text>
        <X size={14} color={TTTheme.colors.grey04} />
      </View>

      {/* Selected Members */}
      <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: TTTheme.colors.grey04, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Selected Members (1)
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: TTTheme.colors.grey02, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#6C3CE1', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>CS</Text>
            </View>
            <Text style={{ fontSize: 12, color: TTTheme.colors.textPrimary }}>carlossmith</Text>
            <X size={12} color={TTTheme.colors.grey04} />
          </View>
        </View>
      </View>

      {/* Suggested header */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: TTTheme.colors.grey04, textTransform: 'uppercase', letterSpacing: 0.5 }}>Suggested</Text>
      </View>

      {/* carlossmith@gmail.com — checked green */}
      <View style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#6C3CE1', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>CS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>carlossmith@gmail.com</Text>
          <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>carlossmith@gmail.com</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
            <Check size={12} color="#fff" />
          </View>
          <Pressable
            onPress={onRoleTap}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: roleBorderColor, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}
          >
            <Text style={{ fontSize: 12, color: roleColor, fontWeight: '500' }}>{carlosRole}</Text>
            <ChevronDown size={12} color={roleColor} />
          </Pressable>
        </View>
      </View>

      {/* Other suggested members */}
      {[
        { initials: 'CE', bg: '#0EA5E9', name: 'Carlos Eduardo',       sub: 'carloseduar@gmail.com' },
        { initials: 'CC', bg: '#22C55E', name: 'Carlos Constructions', sub: 'carlos.cons@gmail.com' },
        { initials: 'LS', bg: '#F97316', name: 'Logan Smith',          sub: 'logansmith@gmail.com' },
        { initials: 'MM', bg: '#EC4899', name: 'Melissa Monroe',       sub: 'melissa.mon@gmail.com' },
      ].map((item) => (
        <View key={item.initials} style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{item.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>{item.name}</Text>
            <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>{item.sub}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, color: TTTheme.colors.textPrimary }}>Viewer</Text>
            <ChevronDown size={12} color={TTTheme.colors.textPrimary} />
          </View>
        </View>
      ))}

      {/* Send Invite pill */}
      <Pressable
        onPress={onSendInvite}
        style={{ position: 'absolute', bottom: 32, right: 16, zIndex: 2 } as any}
      >
        <View style={{ backgroundColor: '#000', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Send size={15} color="#fff" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Send Invite</Text>
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

      <TooltipCard
        title="Change Role"
        description="Tap to set the right access level for this crew member."
        step="Step 3/4"
        style={{ right: 14, top: 425, zIndex: 61 }}
        arrowSrc={imgLefttop4}
        arrowStyle={{ top: -20, left: 8 }}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onRoleTap}
        style={{ position: 'absolute', right: 14, top: 425, width: 313, height: 90, zIndex: 70 } as any}
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
        <View style={{ width: 40, height: 4, backgroundColor: TTTheme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: TTTheme.colors.textPrimary, marginBottom: 16 }}>Select Role</Text>

        {(['Admin', 'Editor', 'Viewer'] as RoleType[]).map((role) => (
          <Pressable key={role} onPress={role === 'Admin' ? onSelectAdmin : undefined}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: role === 'Viewer' ? TTTheme.colors.secondaryGreen : TTTheme.colors.textPrimary }}>
                  {role}
                </Text>
                <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>
                  {role === 'Admin' ? 'Full access — can manage members & settings' :
                   role === 'Editor' ? 'Can create and edit tasks & files' :
                   'Read-only access to the project'}
                </Text>
              </View>
              {role === 'Viewer' && <Check size={18} color={TTTheme.colors.secondaryGreen} />}
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

      <TooltipCard
        title="Confirm Members"
        description='Tap "Send Invite" to send an invite link to all selected members.'
        step="Step 4/4"
        style={{ left: 16, top: 563, zIndex: 61 }}
        arrowSrc={imgRightbottom6}
        arrowStyle={{ bottom: -20, right: 8, transform: [{ rotate: '180deg' }] }}
        anim={tooltipAnim}
      />

      {/* Tap target over tooltip */}
      <Pressable
        onPress={onSendInvite}
        style={{ position: 'absolute', left: 16, top: 563, width: 313, height: 90, zIndex: 70 } as any}
      />

      <HomeIndicator />
    </View>
  );
}

// ── Screen 7: Invite Sent! ───────────────────────────────────────────────────

function Screen7({ onDone }: { onDone: () => void }) {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 350,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cardTranslateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary }}>Members</Text>
        </View>
        <Plus size={20} color={TTTheme.colors.textPrimary} />
      </View>

      {/* Invite row */}
      <View style={{ marginHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <UserPlus size={20} color={TTTheme.colors.grey04} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>Invite or Add Member</Text>
      </View>

      {/* Copy link row */}
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Copy size={18} color={TTTheme.colors.grey04} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>Copy link to invite</Text>
      </View>

      {/* Pending members */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: TTTheme.colors.grey04, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending Member (1)</Text>
      </View>
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6C3CE1', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>CS</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>carlos@gmail.com</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>Viewer</Text>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: TTTheme.colors.grey04 }} />
            <Text style={{ fontSize: 12, color: '#EF4444' }}>Expired May 28</Text>
          </View>
        </View>
      </View>

      {/* Active members */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8, borderTopWidth: 1, borderTopColor: TTTheme.colors.border, paddingTop: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: TTTheme.colors.grey04, textTransform: 'uppercase', letterSpacing: 0.5 }}>Members (2)</Text>
      </View>
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
        <ExpoImage source={{ uri: imgMj }} style={{ width: 40, height: 40, borderRadius: 20 }} contentFit="cover" />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.textPrimary }}>Maria Jose</Text>
          <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>Owner</Text>
        </View>
      </View>

      {/* Dark overlay */}
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 } as any}>
        <ExpoImage source={{ uri: imgOverlay7 }} style={{ flex: 1 } as any} contentFit="cover" />
      </View>

      {/* Success card — fades + slides up */}
      <Animated.View
        style={{
          position: 'absolute', bottom: 40, left: 16, right: 16,
          backgroundColor: '#fff', borderRadius: 20, paddingBottom: 24,
          overflow: 'hidden', zIndex: 60,
          opacity: cardAnim,
          transform: [{ translateY: cardTranslateY }],
        } as any}
      >
        <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 12 }}>
          <ExpoImage source={{ uri: imgSuccessCheck }} style={{ width: 120, height: 120 }} contentFit="contain" />
        </View>
        <View style={{ paddingHorizontal: 24, gap: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: TTTheme.colors.textPrimary, textAlign: 'center' }}>Invite Sent!</Text>
          <Text style={{ fontSize: 14, color: TTTheme.colors.grey04, textAlign: 'center', lineHeight: 20 }}>
            {"Your crew member will receive an invite link via WhatsApp."}
          </Text>
        </View>
        <View style={{ marginHorizontal: 24, marginTop: 24, gap: 10 }}>
          <Pressable onPress={onDone} style={{ backgroundColor: '#000', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Add Tasks Now</Text>
          </Pressable>
          <Pressable onPress={onDone} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: TTTheme.colors.secondaryGreen }}>Back to Project</Text>
          </Pressable>
        </View>
      </Animated.View>
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
