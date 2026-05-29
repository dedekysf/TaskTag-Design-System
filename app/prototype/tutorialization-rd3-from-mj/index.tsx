import { Box, Text } from '@/components/primitives';
import { TooltipOnboarding } from '@/components/TooltipOnboarding';
import { theme as TTTheme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import {
  Activity, ChevronLeft, FolderOpen, Hash,
  MessageSquare, MoreVertical, Plus, Search, Wifi,
} from 'lucide-react-native';

// Figma assets — node 21809:22116 + 21809:31162, expire ~7 days from 2026-05-30
const imgHotAirBallon    = 'https://www.figma.com/api/mcp/asset/f1f04d37-3019-4380-88b2-c159a28a77ed';
const imgBgPattern       = 'https://www.figma.com/api/mcp/asset/2d7a0db7-3d9e-4ea5-bb60-70b568f38e60';
const imgMsgBubble       = 'https://www.figma.com/api/mcp/asset/c027415b-7e88-44b3-9373-f7e6cf950158';
const imgEllipse215      = 'https://www.figma.com/api/mcp/asset/07603237-cbda-44f1-9f87-0e7dbbfbbb16';
const imgEllipse214      = 'https://www.figma.com/api/mcp/asset/557ff59a-8344-4dd7-98ee-1f7899d29261';
const imgTooltipArrow    = 'https://www.figma.com/api/mcp/asset/064466f1-7a0f-483c-abeb-8394334043c5';
const imgSuccessCheck    = 'https://www.figma.com/api/mcp/asset/80a232e9-7de3-4654-99d7-14e12f67a3f5';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// ── Reusable sub-pieces ────────────────────────────────────────────────────────

function StatusBarRow() {
  return (
    <Box height={44} paddingHorizontal="16" flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="white">
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#000', letterSpacing: -0.3 }}>9:41</Text>
      <Box flexDirection="row" alignItems="center" style={{ gap: 6 } as any}>
        <Box flexDirection="row" alignItems="flex-end" style={{ gap: 2, height: 11 } as any}>
          {[4, 6, 8, 11].map((h, i) => (
            <Box key={i} width={3} borderRadius="4" backgroundColor="black" style={{ height: h } as any} />
          ))}
        </Box>
        <Wifi size={14} color="#000" strokeWidth={2.5} />
        <Box flexDirection="row" alignItems="center">
          <Box style={{ width: 24, height: 12, borderRadius: 3, borderWidth: 1, borderColor: '#000', padding: 2 } as any}>
            <Box style={{ flex: 0.8, backgroundColor: '#000', borderRadius: 1 } as any} />
          </Box>
          <Box style={{ width: 2, height: 5, backgroundColor: '#000', borderRadius: 1, marginLeft: 1 } as any} />
        </Box>
      </Box>
    </Box>
  );
}

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
    </View>
  );
}

// ── Keyboard (simplified dark iOS) ────────────────────────────────────────────

function MockKeyboard() {
  const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 291, backgroundColor: '#171717', zIndex: 42 } as any}>
      {rows.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: ri === 2 ? 36 : 3, paddingVertical: 3 } as any}>
          {row.split('').map(char => (
            <View key={char} style={{ flex: 1, height: 40, backgroundColor: '#434343', borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 0 } as any}>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '400' }}>{char}</Text>
            </View>
          ))}
        </View>
      ))}
      <View style={{ flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 3 } as any}>
        <View style={{ width: 44, height: 40, backgroundColor: '#434343', borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}>
          <Text style={{ color: '#fff', fontSize: 14 }}>123</Text>
        </View>
        <View style={{ flex: 1, height: 40, backgroundColor: '#434343', borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}>
          <Text style={{ color: '#fff', fontSize: 16 }}>space</Text>
        </View>
        <View style={{ width: 88, height: 40, backgroundColor: '#434343', borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Done</Text>
        </View>
      </View>
      <View style={{ height: 28, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 5 }} />
      </View>
    </View>
  );
}

// ── Project Creation bottom sheet ──────────────────────────────────────────────

interface BottomSheetProps {
  step: Step;
  onPress: () => void;
}

function ProjectBottomSheet({ step, onPress }: BottomSheetProps) {
  const nameFilled = step >= 6;
  const descFilled = step >= 7;
  const submitGreen = step === 7;
  const sheetHeight = step === 7 ? 209 : 177;

  return (
    <Pressable
      onPress={onPress}
      style={{ position: 'absolute', bottom: 291, left: 0, right: 0, height: sheetHeight, zIndex: 41 } as any}
    >
      <View style={{ flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        {/* Pull handle */}
        <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ width: 56, height: 4, backgroundColor: '#BDBDBD', borderRadius: 2.5 }} />
        </View>

        {/* Input fields */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 8, gap: 12 } as any}>
          {/* Project name */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
            <View style={{ flex: 1 }}>
              {nameFilled
                ? <Text style={{ fontSize: 16, color: '#0A1629' }}>1520 Oliver Street</Text>
                : <Text style={{ fontSize: 16, color: '#828282' }}><Text style={{ color: '#303742' }}>|</Text> Enter project name...</Text>
              }
            </View>
            <Text style={{ fontSize: 8, color: '#303742', width: 35, letterSpacing: 0.16 }}>Required</Text>
          </View>

          {/* Description */}
          {descFilled
            ? <Text style={{ fontSize: 14, color: '#303742', letterSpacing: 0.28, lineHeight: 18 }}>Fix and upgrade kitchen sink to resolve leaks, improve drainage, and ensure proper water flow functionality.</Text>
            : <Text style={{ fontSize: 14, color: '#828282', letterSpacing: 0.28 }}>{nameFilled ? '|Add description...' : 'Add description...'}</Text>
          }
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />

        {/* Action row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8 } as any}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
            <View style={{ width: 24, height: 24, backgroundColor: '#000', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 12, height: 12, backgroundColor: '#555', borderRadius: 2 }} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#000' }}>Personal Projects</Text>
          </View>
          {/* Submit button */}
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: submitGreen ? TTTheme.colors.secondaryGreen : '#828282', alignItems: 'center', justifyContent: 'center' }}>
            {/* Arrow up: two lines forming chevron */}
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 2, height: 10, backgroundColor: '#fff', position: 'absolute' }} />
              <View style={{ position: 'absolute', top: -4, width: 8, height: 8, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#fff', transform: [{ rotate: '-45deg' }] } as any} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ── Green onboarding tooltip ───────────────────────────────────────────────────

interface TooltipCardProps {
  title: string;
  description: string;
  step: string;
  bottomOffset: number;
}

function OnboardingTooltipCard({ title, description, step: stepLabel, bottomOffset }: TooltipCardProps) {
  return (
    <View style={{ position: 'absolute', left: 31, bottom: bottomOffset, width: 313, zIndex: 43 } as any}>
      <View style={{ backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 16, padding: 16, gap: 16 } as any}>
        <View style={{ gap: 6 } as any}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff', lineHeight: 21 }}>{title}</Text>
          <Text style={{ fontSize: 14, color: '#fff', letterSpacing: 0.28, lineHeight: 16 }}>{description}</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#F7F8FA', letterSpacing: 0.28 }}>{stepLabel}</Text>
      </View>
      {/* Arrow pointing down-left */}
      <View style={{ position: 'absolute', bottom: -21, left: 8, width: 53, height: 21 } as any}>
        <ExpoImage
          source={{ uri: imgTooltipArrow }}
          style={{ width: 53, height: 21, transform: [{ rotate: '180deg' }] }}
          contentFit="fill"
        />
      </View>
    </View>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function TutorializationRD3FromMJ() {
  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    if (step === 2) {
      const t = setTimeout(() => setStep(3), 3000);
      return () => clearTimeout(t);
    }
    // name tooltip shown → auto-advance to description tooltip after 3s
    if (step === 5) {
      const t = setTimeout(() => setStep(6), 3000);
      return () => clearTimeout(t);
    }
    // description tooltip → auto-advance to filled form after 3s
    if (step === 6) {
      const t = setTimeout(() => setStep(7), 3000);
      return () => clearTimeout(t);
    }
  }, [step]);

  const isChatsScreen  = step <= 3;
  const isProjectsScreen = step >= 4 && step <= 7;
  const isDetailScreen = step === 8;

  // tooltip bottom offset: 291 (keyboard) + 177 (sheet) - 21 (overlap into sheet) = 447
  const TOOLTIP_BOTTOM = 291 + 177 - 21;

  return (
    <Box flex={1} backgroundColor="white" style={{ position: 'relative' } as any}>

        {/* ── iOS status bar ── */}
        <StatusBarRow />

        {/* ── CHATS SCREEN (steps 1–3) ── */}
        {isChatsScreen && (
          <>
            <View style={{ backgroundColor: '#fff', paddingTop: 4, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image source={require('@/assets/images/tasktag-logo.png')} style={{ height: 32, width: 120 }} resizeMode="contain" />
                <Image source={require('@/assets/images/sample-three.jpg')} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 16 } as any}>
                <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey01, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
                  <Search size={20} color={TTTheme.colors.grey04} />
                  <Text style={{ color: TTTheme.colors.grey04, fontSize: 16 }}>Search</Text>
                </View>
                <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                  <MoreVertical size={24} color={TTTheme.colors.textPrimary} />
                </View>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 } as any}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#CC7351', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>TH</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: TTTheme.colors.textPrimary, fontWeight: '500', fontSize: 14, marginBottom: 2 }}>Tasktag Helpdesk</Text>
                    <Text style={{ color: TTTheme.colors.grey04, fontSize: 14, letterSpacing: 0.28 }} numberOfLines={2}>
                      Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.
                    </Text>
                  </View>
                  <Text style={{ color: TTTheme.colors.grey04, fontSize: 10, fontWeight: '500', marginTop: 2 }}>Monday</Text>
                </View>
              </View>
            </ScrollView>
            <View style={{ position: 'absolute', right: 16, bottom: 100 }}>
              <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 } as any}>
                <Plus size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>New Chat</Text>
              </View>
            </View>
          </>
        )}

        {/* ── PROJECTS LIST SCREEN (steps 4–7) ── */}
        {isProjectsScreen && (
          <>
            <View style={{ backgroundColor: '#fff', paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
                <Text style={{ fontSize: 28, fontWeight: '600', color: TTTheme.colors.textPrimary }}>Projects</Text>
                <Image source={require('@/assets/images/sample-three.jpg')} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey01, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
                  <Search size={20} color={TTTheme.colors.grey04} />
                  <Text style={{ color: TTTheme.colors.grey04, fontSize: 16 }}>Search</Text>
                </View>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 10 }}>Recent</Text>
                <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: TTTheme.colors.grey02, borderRadius: 8, padding: 16, width: 230, marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 } as any}>
                    <View style={{ width: 40, height: 40, backgroundColor: '#138EFF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                      <FolderOpen size={20} color="#fff" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary, flex: 1 }}>Welcome to Tasktag!</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
                    <View style={{ width: 16, height: 16, backgroundColor: '#000', borderRadius: 2 }} />
                    <Text style={{ fontSize: 12, color: '#303742' }}>Task Tag</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 }}>Active projects</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: TTTheme.colors.grey02, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                  <View style={{ width: 40, height: 40, backgroundColor: '#138EFF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <FolderOpen size={20} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary }}>Welcome to Tasktag!</Text>
                </View>
              </View>
            </ScrollView>
            <View style={{ position: 'absolute', right: 16, bottom: 100 }}>
              <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 } as any}>
                <Plus size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>New Project</Text>
              </View>
            </View>
          </>
        )}

        {/* ── PROJECT DETAIL SCREEN (step 8) ── */}
        {isDetailScreen && (
          <>
            <View style={{ backgroundColor: '#fff' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 44 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                  <ChevronLeft size={24} color={TTTheme.colors.textPrimary} />
                  <Text style={{ fontSize: 18, fontWeight: '500', color: TTTheme.colors.textPrimary }}>Project Details</Text>
                </View>
                <MoreVertical size={24} color={TTTheme.colors.textPrimary} />
              </View>
              <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />
            </View>
            <ScrollView style={{ flex: 1, backgroundColor: TTTheme.colors.grey01 }} showsVerticalScrollIndicator={false}>
              <View style={{ padding: 16, gap: 12 } as any}>
                {/* Purple project card */}
                <View style={{ backgroundColor: '#7B61FF', borderRadius: 8, padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 } as any}>
                    <FolderOpen size={22} color="#fff" />
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 }}>1520 Oliver Street</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginBottom: 12, marginLeft: 30 }}>Houston, TX</Text>
                  <View style={{ flexDirection: 'row', gap: 16 } as any}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
                      <View style={{ width: 24, height: 24, backgroundColor: '#000', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: 12, height: 12, backgroundColor: '#333', borderRadius: 2 }} />
                      </View>
                      <Text style={{ fontSize: 12, color: '#fff' }}>Personal Projects</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>MJ</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#fff' }}>Maria Jose</Text>
                    </View>
                  </View>
                </View>
                {/* Description */}
                <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Description</Text>
                    <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>See More</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#303742', lineHeight: 16, letterSpacing: 0.24 }}>Fix and upgrade kitchen sink to resolve leaks, improve drainage, and ensure proper water flow functionality.</Text>
                </View>
                {/* Members */}
                <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Member (1)</Text>
                    <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>See All</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 } as any}>
                    <View style={{ alignItems: 'center', gap: 4 } as any}>
                      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.grey01, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, color: TTTheme.colors.grey04 }}>+</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>Invite</Text>
                    </View>
                    <View style={{ alignItems: 'center', gap: 4 } as any}>
                      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>MJ</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>Maria Jose</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
        )}

        {/* ── BOTTOM NAV (steps 1–7) ── */}
        {!isDetailScreen && (
          <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, ...(step === 3 ? { zIndex: 50, position: 'relative' as any } : {}) } as any}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 4, gap: 24 } as any}>
              {/* Chats */}
              <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
                <MessageSquare size={24} color={isChatsScreen ? TTTheme.colors.secondaryGreen : TTTheme.colors.textPrimary} />
                <Text style={{ color: isChatsScreen ? TTTheme.colors.secondaryGreen : TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>Chats</Text>
              </View>

              {/* Projects — tooltip target in step 3, tappable to advance */}
              {step === 3 ? (
                <TooltipOnboarding
                  variant="top-center"
                  tooltipStyle="success"
                  title="Set up your crew"
                  description="Start by creating your first job and inviting a crew member"
                  open={true}
                  forceShow={true}
                  trigger="press"
                >
                  <Pressable
                    onPress={() => setStep(4)}
                    style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 10 } as any}
                  >
                    <FolderOpen size={24} color={TTTheme.colors.textPrimary} />
                    <Text style={{ color: TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '600' }}>Projects</Text>
                  </Pressable>
                </TooltipOnboarding>
              ) : (
                <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
                  <FolderOpen size={24} color={isProjectsScreen ? TTTheme.colors.secondaryGreen : TTTheme.colors.textPrimary} />
                  <Text style={{ color: isProjectsScreen ? TTTheme.colors.secondaryGreen : TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>Projects</Text>
                </View>
              )}

              {/* My Tasks */}
              <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
                <Hash size={24} color={TTTheme.colors.textPrimary} />
                <Text style={{ color: TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>My Tasks</Text>
              </View>

              {/* Activity */}
              <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
                <Activity size={24} color={TTTheme.colors.textPrimary} />
                <Text style={{ color: TTTheme.colors.textPrimary, fontSize: 14, fontWeight: '500' }}>Activity</Text>
              </View>
            </View>
            <HomeIndicator />
          </View>
        )}

        {/* ══════════════════════════════════════════════
            OVERLAY LAYERS
        ══════════════════════════════════════════════ */}

        {/* STEP 1 — dark overlay + welcome popup */}
        {step === 1 && (
          <>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 40 } as any} />
            <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, height: 490, borderRadius: 24, overflow: 'hidden', backgroundColor: '#fff', zIndex: 41 } as any}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 268, backgroundColor: '#DCF2EC' }} />
              <ExpoImage source={{ uri: imgBgPattern }} style={{ position: 'absolute', top: -40, left: -60, width: 520, height: 310 }} contentFit="fill" />
              <View style={{ alignItems: 'center', marginTop: 28 }}>
                <ExpoImage source={{ uri: imgHotAirBallon }} style={{ width: 228, height: 210 }} contentFit="contain" />
              </View>
              <View style={{ position: 'absolute', bottom: 100, left: 24, right: 24, alignItems: 'center', gap: 6 } as any}>
                <Text style={{ color: TTTheme.colors.secondaryGreen, fontSize: 16, fontWeight: '600', textAlign: 'center', lineHeight: 21 }}>You're in, Maria Jose</Text>
                <Text style={{ color: '#000', fontSize: 20, fontWeight: '700', textAlign: 'center', lineHeight: 26 }}>We're glad you're here</Text>
                <Text style={{ color: TTTheme.colors.grey04, fontSize: 14, textAlign: 'center', letterSpacing: 0.24, lineHeight: 18 }}>4 steps and your whole crew knows what to do</Text>
              </View>
              <Pressable onPress={() => setStep(2)} style={{ position: 'absolute', bottom: 32, left: 24, right: 24 } as any}>
                <View style={{ backgroundColor: '#000', borderRadius: 12, padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Get Started</Text>
                </View>
              </Pressable>
            </View>
          </>
        )}

        {/* STEP 3 — semi-transparent overlay (TooltipOnboarding handles tooltip above) */}
        {step === 3 && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />
        )}

        {/* STEP 4 — dark overlay + "Ready to get to work?" popup */}
        {step === 4 && (
          <>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />
            <View style={{ position: 'absolute', bottom: 40, left: 16, right: 16, height: 450, borderRadius: 24, overflow: 'hidden', backgroundColor: '#fff', zIndex: 41 } as any}>
              {/* Decorative circles (clipped by overflow: hidden) */}
              <ExpoImage source={{ uri: imgEllipse215 }} style={{ position: 'absolute', left: 0, top: -105, width: 330, height: 330 }} contentFit="fill" />
              <ExpoImage source={{ uri: imgEllipse214 }} style={{ position: 'absolute', left: 38, top: -85, width: 267, height: 267 }} contentFit="fill" />
              {/* Chat bubble image */}
              <ExpoImage source={{ uri: imgMsgBubble }} style={{ position: 'absolute', left: 103, top: 37, width: 212, height: 121 }} contentFit="fill" />
              {/* Content */}
              <View style={{ position: 'absolute', bottom: 40, left: 24, right: 24, gap: 40 } as any}>
                <View style={{ gap: 16 } as any}>
                  <Text style={{ fontSize: 28, fontWeight: '600', color: '#000', lineHeight: 32 }}>Ready to get to work?</Text>
                  <Text style={{ fontSize: 16, color: '#303742', lineHeight: 21 }}>Create your first project and start managing your jobs in one place.</Text>
                </View>
                <Pressable onPress={() => setStep(5)}>
                  <View style={{ backgroundColor: '#000', borderRadius: 8, padding: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Create Project</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {/* STEPS 5–7 — dark overlay + bottom sheet + keyboard + tooltip */}
        {(step === 5 || step === 6 || step === 7) && (
          <>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />

            <ProjectBottomSheet
              step={step}
              onPress={() => {
                if (step === 5) setStep(6);
                else if (step === 6) setStep(7);
                else if (step === 7) setStep(8);
              }}
            />

            <MockKeyboard />

            {step === 5 && (
              <OnboardingTooltipCard
                title="Name your first job"
                description="e.g. Smith House, Office Renovation"
                step="Step 1/3"
                bottomOffset={TOOLTIP_BOTTOM}
              />
            )}
            {step === 6 && (
              <OnboardingTooltipCard
                title="Add a brief description"
                description="Tell the crew what this job is about."
                step="Step 2/3"
                bottomOffset={TOOLTIP_BOTTOM}
              />
            )}
          </>
        )}

        {/* STEP 8 — dark overlay + "Project Created!" success modal */}
        {step === 8 && (
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
                <View style={{ backgroundColor: '#000', borderRadius: 8, padding: 16, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Add Members</Text>
                </View>
                <Pressable onPress={() => setStep(1)}>
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
