import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { ProjectsScreen } from '../_shared/mobile/ProjectsScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, TextInput, View } from 'react-native';
import { Activity, ArrowUp, Building, Folder, Hash, MessageSquare } from 'lucide-react-native';

// Figma asset — expires ~7 days from 2026-05-30
const imgSuccessCheck = 'https://www.figma.com/api/mcp/asset/80a232e9-7de3-4654-99d7-14e12f67a3f5';

type Phase = 'modal' | 'form' | 'success';

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
    </View>
  );
}

// pressedKey values: uppercase letter ('A'..'Z'), 'BACKSPACE', 'SPACE', 'DONE', '123'
function MockKeyboard({ pressedKey, onKeyTap }: {
  pressedKey: string | null;
  onKeyTap: (key: string) => void;
}) {
  const letterBg  = (ch: string) => pressedKey === ch        ? '#6a6a6a' : '#434343';
  const specialBg = (id: string) => pressedKey === id        ? '#7a7a7a' : '#5a5a5a';

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 291, backgroundColor: '#171717', zIndex: 42 } as any}>
      {/* QuickType suggestions bar — 43px, fills gap so keys sit at natural position */}
      <View style={{ height: 43, flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)' } as any}>
        {['Create', '"Home"', 'New'].map((word, i) => (
          <View key={word} style={{ flex: 1, height: 43, alignItems: 'center', justifyContent: 'center', borderRightWidth: i < 2 ? 0.5 : 0, borderRightColor: 'rgba(255,255,255,0.15)' } as any}>
            <Text style={{ color: '#fff', fontSize: 16 }}>{word}</Text>
          </View>
        ))}
      </View>

      {/* Rows 1 & 2: key height 43px → row = 3+3+43+3+3 = 55px × 4 + QuickType 43 + home 28 = 291 */}
      {['QWERTYUIOP', 'ASDFGHJKL'].map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 3 } as any}>
          {row.split('').map(char => (
            <Pressable
              key={char}
              onPress={() => onKeyTap(char)}
              style={{ flex: 1, height: 43, backgroundColor: letterBg(char), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '400' }}>{char}</Text>
            </Pressable>
          ))}
        </View>
      ))}

      {/* Row 3: Shift (decorative) + ZXCVBNM + Backspace */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 3 } as any}>
        <View style={{ width: 42, height: 43, backgroundColor: '#5a5a5a', borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 17 }}>⇧</Text>
        </View>
        {['Z','X','C','V','B','N','M'].map(char => (
          <Pressable
            key={char}
            onPress={() => onKeyTap(char)}
            style={{ flex: 1, height: 43, backgroundColor: letterBg(char), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '400' }}>{char}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => onKeyTap('BACKSPACE')}
          style={{ width: 42, height: 43, backgroundColor: specialBg('BACKSPACE'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 17 }}>⌫</Text>
        </Pressable>
      </View>

      {/* Bottom row */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 3 } as any}>
        <Pressable
          onPress={() => onKeyTap('123')}
          style={{ width: 44, height: 43, backgroundColor: specialBg('123'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>123</Text>
        </Pressable>
        <Pressable
          onPress={() => onKeyTap('SPACE')}
          style={{ flex: 1, height: 43, backgroundColor: letterBg('SPACE'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>space</Text>
        </Pressable>
        <Pressable
          onPress={() => onKeyTap('DONE')}
          style={{ width: 88, height: 43, backgroundColor: specialBg('DONE'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Done</Text>
        </Pressable>
      </View>

      {/* Home bar — same position as HomeIndicator (flex-end, paddingBottom 9) */}
      <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
        <View style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 5 }} />
      </View>
    </View>
  );
}

function ProjectBottomSheet({
  projectName, description,
  nameRef, descRef,
  onNameFocus, onNameChange,
  onDescFocus, onDescChange,
  onPhysicalKeyPress, onSubmit,
}: {
  projectName: string; description: string;
  nameRef: React.RefObject<any>; descRef: React.RefObject<any>;
  onNameFocus: () => void; onNameChange: (text: string) => void;
  onDescFocus: () => void; onDescChange: (text: string) => void;
  onPhysicalKeyPress: (key: string) => void; onSubmit: () => void;
}) {
  const submitActive = projectName.length > 0;

  return (
    <View style={{ position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41 } as any}>
      <Box backgroundColor="white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 } as any}>
        {/* Handle */}
        <Box alignItems="center" style={{ paddingTop: 16, paddingBottom: 8 } as any}>
          <View style={{ width: 56, height: 4, backgroundColor: TTTheme.colors.grey04, borderRadius: 2.5 }} />
        </Box>
        {/* Inputs */}
        <Box paddingHorizontal="16" style={{ paddingBottom: 8, gap: 12 } as any}>
          <Box flexDirection="row" alignItems="center" style={{ gap: 4 } as any}>
            <Box flex={1}>
              <TextInput
                ref={nameRef}
                value={projectName}
                onChangeText={onNameChange}
                onFocus={onNameFocus}
                onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
                placeholder="Enter project name..."
                placeholderTextColor={TTTheme.colors.grey05}
                style={{ fontSize: 16, color: TTTheme.colors.foreground, padding: 0, outlineStyle: 'none' } as any}
              />
            </Box>
            <Text color="grey05" style={{ fontSize: 8, width: 35, letterSpacing: 0.16 }}>Required</Text>
          </Box>
          <TextInput
            ref={descRef}
            value={description}
            onChangeText={onDescChange}
            onFocus={onDescFocus}
            onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
            placeholder="Add description..."
            placeholderTextColor={TTTheme.colors.grey05}
            multiline
            style={{ fontSize: 14, color: TTTheme.colors.foreground, letterSpacing: 0.28, padding: 0, outlineStyle: 'none' } as any}
          />
        </Box>
        {/* Divider */}
        <Box backgroundColor="border" style={{ height: 1 } as any} />
        {/* Footer row */}
        <Box flexDirection="row" alignItems="center" paddingHorizontal="16" style={{ paddingVertical: 12, gap: 8 } as any}>
          <Box flex={1} flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
            <View style={{ width: 24, height: 24, backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <Building size={14} color="#fff" />
            </View>
            <Text variant="mobileLabelSmall" color="foreground">Personal Projects</Text>
          </Box>
          <Pressable onPress={submitActive ? onSubmit : undefined}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: submitActive ? TTTheme.colors.secondaryGreen : TTTheme.colors.grey05, alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUp size={20} color="#fff" strokeWidth={2.5} />
            </View>
          </Pressable>
        </Box>
      </Box>
    </View>
  );
}

function OnboardingTooltipCard({ title, description, step: stepLabel, bottomOffset, opacity }: {
  title: string; description: string; step: string; bottomOffset: number;
  opacity: Animated.Value;
}) {
  return (
    <Animated.View style={{ position: 'absolute', left: 31, bottom: bottomOffset, width: 313, zIndex: 43, opacity } as any}>
      <View style={{ backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 16, padding: 16, gap: 16 } as any}>
        <View style={{ gap: 6 } as any}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff', lineHeight: 21 }}>{title}</Text>
          <Text style={{ fontSize: 14, color: '#fff', letterSpacing: 0.28, lineHeight: 16 }}>{description}</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#F7F8FA', letterSpacing: 0.28 }}>{stepLabel}</Text>
      </View>
      {/* Arrow — View-based (no async load), same as Case1 tooltip */}
      <View style={{ position: 'absolute', bottom: -12, left: 20, width: 24, height: 24, backgroundColor: TTTheme.colors.secondaryGreen, borderBottomRightRadius: 4, transform: [{ rotate: '45deg' }] } as any} />
    </Animated.View>
  );
}

export function Case2Screen({
  onAddMembers,
  onViewProjectDetails,
}: {
  onAddMembers?: () => void;
  onViewProjectDetails?: () => void;
} = {}) {
  const [phase, setPhase]           = useState<Phase>('modal');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [pressedKey, setPressedKey]   = useState<string | null>(null);

  const nameRef        = useRef<any>(null);
  const descRef        = useRef<any>(null);
  const activeFieldRef = useRef<'name' | 'desc'>('name');
  // Keep current values in refs to avoid stale closures in key handler
  const projectNameRef = useRef('');
  const descriptionRef = useRef('');

  const nameTooltipOpacity = useRef(new Animated.Value(0)).current;
  const descTooltipOpacity = useRef(new Animated.Value(0)).current;
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase === 'form') {
      nameTooltipOpacity.setValue(0);
      descTooltipOpacity.setValue(0);
      Animated.timing(nameTooltipOpacity, { toValue: 1, duration: 400, useNativeDriver: false }).start();
      const t = setTimeout(() => nameRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const fadeIn = (anim: Animated.Value) => {
    anim.stopAnimation();
    Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
  };

  const startFadeOut = (anim: Animated.Value) => {
    return setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: false }).start();
    }, 400);
  };

  const flashKey = (keyId: string) => {
    if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
    setPressedKey(keyId);
    keyTimerRef.current = setTimeout(() => setPressedKey(null), 150);
  };

  const handleNameFocus = () => {
    activeFieldRef.current = 'name';
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    fadeIn(nameTooltipOpacity);
    if (descTimerRef.current) clearTimeout(descTimerRef.current);
    descTooltipOpacity.stopAnimation();
    Animated.timing(descTooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const handleNameChange = (text: string) => {
    projectNameRef.current = text;
    setProjectName(text);
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    if (text.length > 0) {
      nameTimerRef.current = startFadeOut(nameTooltipOpacity);
    } else {
      fadeIn(nameTooltipOpacity);
    }
  };

  const handleDescFocus = () => {
    activeFieldRef.current = 'desc';
    if (descTimerRef.current) clearTimeout(descTimerRef.current);
    fadeIn(descTooltipOpacity);
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    nameTooltipOpacity.stopAnimation();
    Animated.timing(nameTooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const handleDescChange = (text: string) => {
    descriptionRef.current = text;
    setDescription(text);
    if (descTimerRef.current) clearTimeout(descTimerRef.current);
    if (text.length > 0) {
      descTimerRef.current = startFadeOut(descTooltipOpacity);
    } else {
      fadeIn(descTooltipOpacity);
    }
  };

  // Called by physical keyboard via TextInput onKeyPress
  const handlePhysicalKeyPress = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) flashKey(key.toUpperCase());
    else if (key === ' ')         flashKey('SPACE');
    else if (key === 'Backspace') flashKey('BACKSPACE');
  };

  // Called by tapping a visual keyboard key
  const handleKeyTap = (keyId: string) => {
    flashKey(keyId);
    const field = activeFieldRef.current;
    const current = field === 'name' ? projectNameRef.current : descriptionRef.current;
    const setter  = field === 'name' ? handleNameChange : handleDescChange;

    if (keyId === 'BACKSPACE') {
      setter(current.slice(0, -1));
    } else if (keyId === 'SPACE') {
      setter(current + ' ');
    } else if (keyId === 'DONE' || keyId === '123') {
      // no-op for prototype
    } else {
      // Single uppercase letter — insert lowercase for natural reading
      setter(current + keyId.toLowerCase());
    }

    // Re-focus the active TextInput after Pressable steals focus
    setTimeout(() => {
      if (field === 'name') nameRef.current?.focus();
      else descRef.current?.focus();
    }, 0);
  };

  // Tooltip positions: arrow tip 4px above each input field
  // Sheet starts at bottom:291; name row top ≈ 418px, desc row top ≈ 384px from screen bottom
  const TOOLTIP_NAME_BOTTOM = 443; // 418 + 4 gap + 21 arrow = 443
  const TOOLTIP_DESC_BOTTOM = 409; // 384 + 4 gap + 21 arrow = 409

  return (
    <Box flex={1} backgroundColor="white" style={{ position: 'relative' } as any}>

      <StatusBarRow />
      {phase === 'success' ? <ProjectDetailScreen /> : <ProjectsScreen />}

      {/* Bottom nav — hidden on success */}
      {phase !== 'success' && (
        <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 4, gap: 24 } as any}>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <MessageSquare size={24} color={TTTheme.colors.textPrimary} />
              <Text style={{ color: TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>Chats</Text>
            </View>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <Folder size={24} color={TTTheme.colors.secondaryGreen} />
              <Text style={{ color: TTTheme.colors.secondaryGreen, fontSize: 14, fontWeight: '500' }}>Projects</Text>
            </View>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <Hash size={24} color={TTTheme.colors.textPrimary} />
              <Text style={{ color: TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>My Tasks</Text>
            </View>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <Activity size={24} color={TTTheme.colors.textPrimary} />
              <Text style={{ color: TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>Activity</Text>
            </View>
          </View>
          <HomeIndicator />
        </View>
      )}

      {/* ── Modal phase — "Ready to get to work?" ── */}
      {phase === 'modal' && (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />
          <Box backgroundColor="card" style={{ position: 'absolute', bottom: 40, left: 16, right: 16, borderRadius: 24, overflow: 'hidden', zIndex: 41 } as any}>
            {/* Illustration — overflow:hidden clips circles at right/bottom edges */}
            <View style={{ height: 230, overflow: 'hidden' } as any}>
              {/* Circle 2 (outer): #6FB19D 13% opacity — large, clips right edge */}
              <View style={{ position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(111,177,157,0.13)', top: 0, right: -30 } as any} />
              {/* Circle 1 (inner): #6FB19D 100% solid — centered behind illustration */}
              <View style={{ position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: '#6FB19D', top: 10, right: 24 } as any} />
              {/* Image: 200px wide, right edge aligned with button (24px padding) */}
              <Image source={require('@/assets/images/project-creation-chat.png')} style={{ position: 'absolute', width: 200, height: 190, top: 20, right: 24 } as any} resizeMode="contain" />
            </View>
            <Box paddingHorizontal="24" style={{ paddingTop: 16, paddingBottom: 28, gap: 40 } as any}>
              <Box style={{ gap: 16 } as any}>
                <Text color="foreground" style={{ fontSize: 28, fontWeight: '600', lineHeight: 32 }}>Ready to get to work?</Text>
                <Text color="grey05" style={{ fontSize: 16, lineHeight: 21 }}>Create your first project and start managing your jobs in one place.</Text>
              </Box>
              <Button variant="fill" color="secondary" size="lg" onPress={() => setPhase('form')}>
                Create Project
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* ── Form phase — project creation inputs ── */}
      {phase === 'form' && (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />
          <ProjectBottomSheet
            projectName={projectName}
            description={description}
            nameRef={nameRef}
            descRef={descRef}
            onNameFocus={handleNameFocus}
            onNameChange={handleNameChange}
            onDescFocus={handleDescFocus}
            onDescChange={handleDescChange}
            onPhysicalKeyPress={handlePhysicalKeyPress}
            onSubmit={() => setPhase('success')}
          />
          <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
          <OnboardingTooltipCard
            title="Name your first job"
            description="e.g. Smith House, Office Renovation"
            step="Step 1/2"
            bottomOffset={TOOLTIP_NAME_BOTTOM}
            opacity={nameTooltipOpacity}
          />
          <OnboardingTooltipCard
            title="Add a brief description"
            description="Tell the crew what this job is about."
            step="Step 2/2"
            bottomOffset={TOOLTIP_DESC_BOTTOM}
            opacity={descTooltipOpacity}
          />
        </>
      )}

      {/* ── Success phase — "Project Created!" ── */}
      {phase === 'success' && (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />
          <View style={{ position: 'absolute', bottom: 40, left: 16, right: 16, height: 422, borderRadius: 24, overflow: 'hidden', backgroundColor: '#fff', zIndex: 41 } as any}>
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <ExpoImage source={{ uri: imgSuccessCheck }} style={{ width: 150, height: 150 }} contentFit="contain" />
            </View>
            <View style={{ paddingHorizontal: 24, marginTop: 4, gap: 8 } as any}>
              <Text style={{ fontSize: 22, fontWeight: '600', color: '#000', textAlign: 'center', lineHeight: 32 }}>Project Created!</Text>
              <Text style={{ fontSize: 16, color: TTTheme.colors.grey04, textAlign: 'center', lineHeight: 21 }}>
                {"You've successfully set up a project! Now, let's explore your next steps."}
              </Text>
            </View>
            <View style={{ position: 'absolute', bottom: 24, left: 24, right: 24, gap: 8 } as any}>
              <Pressable onPress={onAddMembers}>
                <View style={{ backgroundColor: '#000', borderRadius: 8, padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Add Members</Text>
                </View>
              </Pressable>
              <Pressable onPress={onViewProjectDetails}>
                <View style={{ borderRadius: 8, padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: TTTheme.colors.secondaryGreen, fontSize: 14, fontWeight: '500' }}>View Project Details</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </>
      )}

    </Box>
  );
}
