import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../_shared/mobile/MockKeyboard';
import { SuccessModal } from '../_shared/mobile/SuccessModal';
import { OnboardingTooltip } from '../_shared/mobile/OnboardingTooltip';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { ProjectsScreen } from '../_shared/mobile/ProjectsScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, TextInput, View } from 'react-native';
import { Activity, ArrowUp, Building, Folder, Hash, MessageSquare } from 'lucide-react-native';

type Phase = 'modal' | 'form' | 'success';

function useBounceIn(delay = 0) {
  const translateY = useRef(new Animated.Value(32)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, damping: 14, stiffness: 180, mass: 0.9, useNativeDriver: true }),
        Animated.spring(scale,     { toValue: 1, damping: 14, stiffness: 180, mass: 0.9, useNativeDriver: true }),
        Animated.timing(opacity,   { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { translateY, opacity, scale };
}

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
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
            {/* TODO(BE): GET /api/workspaces/current — workspace name */}
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



export function Case2Screen({
  onViewProject,
  startPhase,
}: {
  onViewProject?: () => void;
  startPhase?: Phase;
} = {}) {
  const [phase, setPhase]           = useState<Phase>(startPhase ?? 'modal');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [pressedKey, setPressedKey]   = useState<string | null>(null);

  const nameRef        = useRef<any>(null);
  const descRef        = useRef<any>(null);
  const activeFieldRef = useRef<'name' | 'desc'>('name');
  // Keep current values in refs to avoid stale closures in key handler
  const projectNameRef = useRef('');
  const descriptionRef = useRef('');

  const modalProgress   = useRef(new Animated.Value(0)).current;
  const modalTranslateY = modalProgress.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const modalScale      = modalProgress.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });
  const illus           = useBounceIn(60);
  const content         = useBounceIn(180);


  const nameTooltipOpacity = useRef(new Animated.Value(0)).current;
  const descTooltipOpacity = useRef(new Animated.Value(0)).current;
  const sheetAnim          = useRef(new Animated.Value(0)).current;
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sheetTranslateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  useEffect(() => {
    if (phase === 'modal') {
      modalProgress.setValue(0);
      Animated.timing(modalProgress, {
        toValue: 1, duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
    if (phase === 'form') {
      sheetAnim.setValue(0);
      nameTooltipOpacity.setValue(0);
      descTooltipOpacity.setValue(0);
      Animated.timing(sheetAnim, {
        toValue: 1, duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      // Tooltip appears 250ms after sheet starts sliding up
      Animated.timing(nameTooltipOpacity, { toValue: 1, duration: 350, delay: 250, useNativeDriver: true }).start();
      const t = setTimeout(() => nameRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateProject = () => {
    Animated.timing(modalProgress, {
      toValue: 0, duration: 300,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setPhase('form'));
  };

  const fadeIn = (anim: Animated.Value) => {
    anim.stopAnimation();
    Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const startFadeOut = (anim: Animated.Value) => {
    return setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }).start();
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
    Animated.timing(descTooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
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
    Animated.timing(nameTooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
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
  const TOOLTIP_NAME_BOTTOM = 455; // +8 from prev: arrow tip still touching at 447
  const TOOLTIP_DESC_BOTTOM = 421; // +8 from prev: same

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
              <Text variant="mobileLabelSmall" color="foreground">Chats</Text>
            </View>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <Folder size={24} color={TTTheme.colors.secondaryGreen} />
              <Text variant="mobileLabelSmall" color="secondaryGreen">Projects</Text>
            </View>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <Hash size={24} color={TTTheme.colors.textPrimary} />
              <Text variant="mobileLabelSmall" color="foreground">My Tasks</Text>
            </View>
            <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
              <Activity size={24} color={TTTheme.colors.textPrimary} />
              <Text variant="mobileLabelSmall" color="foreground">Activity</Text>
            </View>
          </View>
          <HomeIndicator />
        </View>
      )}

      {/* ── Modal phase — outer = opacity+backdrop, inner = transform only ── */}
      {phase === 'modal' && (
        <Animated.View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40,
          opacity: modalProgress,
        } as any}>
          <Animated.View style={{
            position: 'absolute', bottom: 40, left: 16, right: 16,
            transform: [{ translateY: modalTranslateY }, { scale: modalScale }],
          } as any}>
            <Box backgroundColor="card" style={{ borderRadius: 24, overflow: 'hidden' } as any}>
              {/* Illustration area — circles static, image bounces in first */}
              <View style={{ height: 230, overflow: 'hidden' } as any}>
                <View style={{ position: 'absolute', width: 360, height: 360, borderRadius: 180, backgroundColor: 'rgba(111,177,157,0.13)', top: -105, left: 123 } as any} />
                <View style={{ position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: '#6FB19D', top: -85, left: 161 } as any} />
                <Animated.View style={{
                  position: 'absolute', width: 200, height: 190, top: 20, right: 24,
                  opacity: illus.opacity,
                  transform: [{ translateY: illus.translateY }, { scale: illus.scale }],
                } as any}>
                  <Image source={require('@/assets/images/project-creation-chat.png')} style={{ width: 200, height: 190 }} resizeMode="contain" />
                </Animated.View>
              </View>
              {/* Text + button — bounces in second */}
              <Animated.View style={{
                opacity: content.opacity,
                transform: [{ translateY: content.translateY }, { scale: content.scale }],
              } as any}>
                <Box paddingHorizontal="24" style={{ paddingTop: 16, paddingBottom: 28, gap: 40 } as any}>
                  <Box style={{ gap: 16 } as any}>
                    <Text variant="mobileHeading28">Ready to get to work?</Text>
                    <Text variant="mobileSecondaryBody" color="grey05" style={{ lineHeight: 21 }}>Create your first project and start managing your jobs in one place.</Text>
                  </Box>
                  <Button variant="fill" color="secondary" size="lg" onPress={handleCreateProject}>
                    Create Project
                  </Button>
                </Box>
              </Animated.View>
            </Box>
          </Animated.View>
        </Animated.View>
      )}

      {/* ── Form phase — project creation inputs ── */}
      {phase === 'form' && (
        <>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }], zIndex: 41 } as any}>
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
          </Animated.View>
          <OnboardingTooltip
            title="Name your first job"
            description="e.g. Smith House, Office Renovation"
            style={{ bottom: TOOLTIP_NAME_BOTTOM, left: 31, zIndex: 43 }}
            arrowEdge="bottom"
            arrowSide="left"
            arrowInset={20}
            anim={nameTooltipOpacity}
          />
        </>
      )}

      {/* ── Success phase ── */}
      {phase === 'success' && (
        <>
          <SuccessModal
            title="Project Created!"
            description={"You've successfully set up a project! Now, let's explore your next steps."}
            primaryLabel="View Project"
            onPrimary={onViewProject ?? (() => {})}
          />
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
            <View style={{ width: 134, height: 5, borderRadius: 5, backgroundColor: '#000' }} />
          </View>
        </>
      )}

    </Box>
  );
}
