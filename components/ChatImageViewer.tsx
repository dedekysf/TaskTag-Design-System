/**
 * ChatImageViewer
 * Full-screen image preview modal.
 *
 * Header layout:
 *   LEFT  — back arrow · avatar · sender name · date · [project pill] [task pill]
 *   CENTER — filename (click to rename)
 *   RIGHT  — forward · download · rotate · zoom-out · zoom-in · zoom% · more (vertical)
 * Main   — image with contain + zoom/rotate transforms
 * Bottom — thumbnail strip; long-press or selection mode for multi-select download/forward
 */

import React from 'react';
import {
  Modal,
  View,
  Image,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { Text } from './primitives';
import {
  ChevronLeft, CircleArrowLeft, CircleArrowRight, Download, RotateCw, ZoomOut, ZoomIn,
  MoreVertical, Forward, Link, Check,
  Pencil, Share2, Info, Trash2,
} from 'lucide-react-native';

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:            '#0d1117',
  surface:       '#1c2230',
  border:        'rgba(255,255,255,0.08)',
  iconActive:    '#ffffff',
  iconMuted:     'rgba(255,255,255,0.30)',
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.50)',
  brandGreen:    '#00d9a5',
  avatarBlue:    '#138eff',
  avatarOrange:  '#fc7f5b',
  pillBg:        'rgba(255,255,255,0.10)',
  selBarBg:      'rgba(255,255,255,0.04)',
  deleteRed:     '#ef4444',
  menuBg:        '#1e2736',
  menuBorder:    'rgba(255,255,255,0.10)',
};

const ZOOM_STEP = 25;
const ZOOM_MIN  = 25;
const ZOOM_MAX  = 400;
const BOTTOM_H  = 112;
const THUMB_W   = 120;
const THUMB_H   = 80;

// ── Helpers ───────────────────────────────────────────────────────────────────
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildDateLabel(timeStr: string): string {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} at ${timeStr}`;
}

function getFilename(url: string): string {
  try {
    const base = url.split('?')[0];
    const name = base.split('/').pop() ?? 'image';
    return name.includes('.') ? name : name + '.jpg';
  } catch {
    return 'image.jpg';
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  images:        string[];
  initialIndex:  number;
  sender:        string;
  time:          string;
  visible:       boolean;
  onClose:       () => void;
  projectName?:  string;
  taskName?:     string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ChatImageViewer({
  images, initialIndex, sender, time, visible, onClose,
  projectName, taskName,
}: Props) {
  const [idx,       setIdx]       = React.useState(initialIndex);
  const [zoom,      setZoom]      = React.useState(100);
  const [rotation,  setRotation]  = React.useState(0);
  const [renaming,  setRenaming]  = React.useState(false);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [selMode,      setSelMode]      = React.useState(false);
  const [selected,     setSelected]     = React.useState<Set<number>>(new Set());
  const [moreVisible,  setMoreVisible]  = React.useState(false);

  const thumbScrollRef  = React.useRef<ScrollView>(null);
  const renameInputRef  = React.useRef<TextInput>(null);

  // Init filenames from image URLs
  React.useEffect(() => {
    setFileNames(images.map(getFilename));
  }, [images]);

  // Reset on open
  React.useEffect(() => {
    if (visible) {
      setIdx(initialIndex);
      setZoom(100);
      setRotation(0);
      setRenaming(false);
      setSelMode(false);
      setSelected(new Set());
    }
  }, [initialIndex, visible]);

  // Reset zoom/rotation on image change
  React.useEffect(() => { setZoom(100); setRotation(0); }, [idx]);

  // Scroll active thumbnail into view
  React.useEffect(() => {
    if (visible) {
      setTimeout(() => {
        thumbScrollRef.current?.scrollTo({ x: idx * (THUMB_W + 8), animated: true });
      }, 50);
    }
  }, [idx, visible]);

  // Focus rename input
  React.useEffect(() => {
    if (renaming) {
      setTimeout(() => renameInputRef.current?.focus(), 50);
    }
  }, [renaming]);

  const current   = images[idx];
  const filename  = fileNames[idx] ?? getFilename(current);
  const dateLabel = buildDateLabel(time);

  const isDedek  = sender.toLowerCase().includes('dedek');
  const initials = sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarBg = isDedek ? C.avatarOrange : C.avatarBlue;

  // ── Actions ───────────────────────────────────────────────────────────────
  const downloadOne = async (url: string, name: string) => {
    if (Platform.OS !== 'web') return;
    try {
      const res    = await fetch(url);
      const blob   = await res.blob();
      const objUrl = window.URL.createObjectURL(blob);
      const a      = document.createElement('a');
      a.style.display = 'none';
      a.href     = objUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objUrl);
      document.body.removeChild(a);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleDownload = async () => {
    if (selMode && selected.size > 0) {
      for (const i of Array.from(selected)) {
        await downloadOne(images[i], fileNames[i] ?? getFilename(images[i]));
      }
    } else {
      await downloadOne(current, filename);
    }
  };

  const handleForward = () => {
    const targets = selMode && selected.size > 0 ? Array.from(selected) : [idx];
    console.log('Forward images:', targets.map(i => images[i]));
  };

  const handleCopyLink = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard?.writeText(current).catch(() => {});
    }
  };

  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleThumbPress = (i: number) => {
    if (selMode) toggleSelect(i);
    else setIdx(i);
  };

  const commitRename = (val: string) => {
    const trimmed = val.trim();
    if (trimmed) {
      setFileNames(prev => { const n = [...prev]; n[idx] = trimmed; return n; });
    }
    setRenaming(false);
  };

  const zoomIn  = () => setZoom(z => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom(z => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  const rotate  = () => setRotation(r => (r + 90) % 360);

  const selCount = selected.size;
  const hasPills = !!(projectName || taskName);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.root}>

        {/* ═══ HEADER ════════════════════════════════════════════════════════ */}
        <View style={[s.header, hasPills && s.headerTall]}>

          {/* LEFT — back · avatar · name · date · pills */}
          <View style={s.hLeft}>
            <Pressable onPress={onClose} style={s.iconBtn} hitSlop={10}>
              <ChevronLeft size={24} color={C.iconActive} />
            </Pressable>
            <View style={[s.avatar, { backgroundColor: avatarBg }]}>
              <Text style={s.avatarTxt}>{initials}</Text>
            </View>
            <View style={s.senderBlock}>
              <Text style={s.senderName} numberOfLines={1}>{sender}</Text>
              <Text style={s.dateLabel}  numberOfLines={1}>{dateLabel}</Text>
              {hasPills && (
                <View style={s.pillRow}>
                  {projectName && (
                    <View style={s.pill}>
                      <Text style={s.pillTxt} numberOfLines={1}>{projectName}</Text>
                    </View>
                  )}
                  {taskName && (
                    <View style={s.pill}>
                      <Text style={s.pillTxt} numberOfLines={1}>{taskName}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* CENTER — filename (click to rename) */}
          <View style={s.hCenter}>
            {renaming ? (
              <TextInput
                ref={renameInputRef}
                style={s.renameInput}
                value={filename}
                onChangeText={val => {
                  setFileNames(prev => { const n = [...prev]; n[idx] = val; return n; });
                }}
                onBlur={() => commitRename(filename)}
                onSubmitEditing={() => commitRename(filename)}
                selectTextOnFocus
                autoFocus
              />
            ) : (
              <Pressable onPress={() => setRenaming(true)} hitSlop={8}>
                <Text style={s.filename} numberOfLines={1}>{filename}</Text>
              </Pressable>
            )}
          </View>

          {/* RIGHT — download · forward · copy link · rotate · zoom · more */}
          <View style={s.hRight}>
            {selMode && (
              <Pressable
                onPress={() => { setSelMode(false); setSelected(new Set()); }}
                style={s.cancelSelBtn}
              >
                <Text style={s.cancelSelTxt}>Cancel</Text>
              </Pressable>
            )}
            <Pressable onPress={handleDownload} style={s.iconBtn} hitSlop={10}>
              <Download size={18} color={C.iconActive} />
            </Pressable>
            <Pressable onPress={handleForward} style={s.iconBtn} hitSlop={10}>
              <Forward size={18} color={C.iconActive} />
            </Pressable>
            <Pressable onPress={handleCopyLink} style={s.iconBtn} hitSlop={10}>
              <Link size={18} color={C.iconActive} />
            </Pressable>
            <Pressable onPress={rotate} style={s.iconBtn} hitSlop={10}>
              <RotateCw size={18} color={C.iconActive} />
            </Pressable>
            <Pressable onPress={zoomOut} style={s.iconBtn} hitSlop={10}>
              <ZoomOut size={18} color={zoom <= ZOOM_MIN ? C.iconMuted : C.iconActive} />
            </Pressable>
            <Pressable onPress={zoomIn} style={s.iconBtn} hitSlop={10}>
              <ZoomIn size={18} color={zoom >= ZOOM_MAX ? C.iconMuted : C.iconActive} />
            </Pressable>
            <Text style={s.zoomPct}>{zoom}%</Text>
            <Pressable onPress={() => setMoreVisible(v => !v)} style={s.iconBtn} hitSlop={10}>
              <MoreVertical size={18} color={C.iconActive} />
            </Pressable>
          </View>

        </View>

        {/* ═══ MORE OPTIONS DROPDOWN ══════════════════════════════════════════ */}
        {moreVisible && (
          <>
            {/* Backdrop to close */}
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setMoreVisible(false)} />
            <View style={s.moreMenu}>
              {/* Rename */}
              <Pressable style={s.moreItem} onPress={() => { setMoreVisible(false); setRenaming(true); }}>
                <Pencil size={16} color={C.textPrimary} />
                <Text style={s.moreItemTxt}>Rename</Text>
              </Pressable>
              {/* Share */}
              <Pressable style={s.moreItem} onPress={() => setMoreVisible(false)}>
                <Share2 size={16} color={C.textPrimary} />
                <Text style={s.moreItemTxt}>Share</Text>
              </Pressable>
              {/* Forward — Coming Soon */}
              <Pressable style={s.moreItem} onPress={() => setMoreVisible(false)}>
                <Forward size={16} color={C.textPrimary} />
                <Text style={s.moreItemTxt}>Forward</Text>
                <View style={s.comingSoonPill}><Text style={s.comingSoonTxt}>Coming Soon</Text></View>
              </Pressable>
              {/* Information — Coming Soon */}
              <Pressable style={s.moreItem} onPress={() => setMoreVisible(false)}>
                <Info size={16} color={C.textPrimary} />
                <Text style={s.moreItemTxt}>Information</Text>
                <View style={s.comingSoonPill}><Text style={s.comingSoonTxt}>Coming Soon</Text></View>
              </Pressable>
              <View style={s.moreDivider} />
              {/* Delete */}
              <Pressable style={s.moreItem} onPress={() => setMoreVisible(false)}>
                <Trash2 size={16} color={C.deleteRed} />
                <Text style={[s.moreItemTxt, { color: C.deleteRed }]}>Delete</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* ═══ IMAGE AREA ════════════════════════════════════════════════════ */}
        <View style={s.imageArea}>
          <Image
            source={{ uri: current }}
            style={[
              s.image,
              { transform: [{ scale: zoom / 100 }, { rotate: `${rotation}deg` }] },
            ]}
            resizeMode="contain"
          />

          {/* Left arrow — hidden on first image */}
          {idx > 0 && (
            <Pressable
              onPress={() => setIdx(i => i - 1)}
              style={[s.navBtn, s.navLeft]}
              hitSlop={16}
            >
              <CircleArrowLeft size={36} color={C.iconActive} />
            </Pressable>
          )}

          {/* Right arrow — hidden on last image */}
          {idx < images.length - 1 && (
            <Pressable
              onPress={() => setIdx(i => i + 1)}
              style={[s.navBtn, s.navRight]}
              hitSlop={16}
            >
              <CircleArrowRight size={36} color={C.iconActive} />
            </Pressable>
          )}
        </View>

        {/* ═══ BOTTOM — selection bar + thumbnail strip ══════════════════════ */}
        <View style={s.bottomBar}>

          {/* Selection action bar */}
          {selMode && (
            <View style={s.selBar}>
              <Text style={s.selCount}>
                {selCount > 0 ? `${selCount} selected` : 'Tap thumbnails to select'}
              </Text>
              <View style={s.selActions}>
                <Pressable
                  onPress={handleForward}
                  style={[s.selAction, selCount === 0 && s.selActionDisabled]}
                  disabled={selCount === 0}
                >
                  <Forward size={15} color={selCount > 0 ? C.iconActive : C.iconMuted} />
                  <Text style={[s.selActionTxt, selCount === 0 && { color: C.iconMuted }]}>Forward</Text>
                </Pressable>
                <Pressable
                  onPress={handleDownload}
                  style={[s.selAction, selCount === 0 && s.selActionDisabled]}
                  disabled={selCount === 0}
                >
                  <Download size={15} color={selCount > 0 ? C.iconActive : C.iconMuted} />
                  <Text style={[s.selActionTxt, selCount === 0 && { color: C.iconMuted }]}>Download</Text>
                </Pressable>
              </View>
            </View>
          )}

          <ScrollView
            ref={thumbScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.thumbStrip}
          >
            {images.map((img, i) => (
              <Pressable
                key={i}
                onPress={() => handleThumbPress(i)}
                onLongPress={() => { if (!selMode) { setSelMode(true); toggleSelect(i); } }}
                style={[s.thumbWrap, !selMode && i === idx && s.thumbActive]}
              >
                <Image source={{ uri: img }} style={s.thumb} resizeMode="cover" />
                {selMode && (
                  <View style={[s.checkCircle, selected.has(i) && s.checkCircleSelected]}>
                    {selected.has(i) && <Check size={11} color="#fff" strokeWidth={3} />}
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>

        </View>

      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    height: 56,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  headerTall: {
    height: 72,
  },
  hLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    overflow: 'hidden',
  },
  hCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  hRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    flexShrink: 0,
  },
  avatarTxt: {
    color: C.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },

  // Sender block
  senderBlock: {
    marginLeft: 8,
    flexShrink: 1,
    justifyContent: 'center',
  },
  senderName: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  dateLabel: {
    color: C.textSecondary,
    fontSize: 11,
    lineHeight: 14,
  },

  // Pills
  pillRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: C.pillBg,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillTxt: {
    color: C.textPrimary,
    fontSize: 10,
    fontWeight: '500',
  },

  // Filename / rename
  filename: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255,255,255,0.25)',
    textDecorationStyle: 'dashed',
  },
  renameInput: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.brandGreen,
    minWidth: 160,
    maxWidth: 260,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
  },

  // Zoom %
  zoomPct: {
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    minWidth: 38,
    textAlign: 'center',
  },

  // Cancel selection
  cancelSelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 4,
  },
  cancelSelTxt: {
    color: C.brandGreen,
    fontSize: 13,
    fontWeight: '600',
  },

  // Image area
  imageArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Bottom
  bottomBar: {
    height: BOTTOM_H,
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
    justifyContent: 'center',
  },

  // Selection bar (shown above thumbnails when selMode is on)
  selBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: C.selBarBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  selCount: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  selActions: {
    flexDirection: 'row',
    gap: 8,
  },
  selAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
  },
  selActionDisabled: {
    opacity: 0.4,
  },
  selActionTxt: {
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },

  // Thumbnail strip
  thumbStrip: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbWrap: {
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: C.brandGreen,
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Selection checkmark
  checkCircle: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: C.brandGreen,
    borderColor: C.brandGreen,
  },

  // Navigation arrows
  navBtn: {
    position: 'absolute',
    top: '50%' as any,
    marginTop: -18,
  },
  navLeft: {
    left: 20,
  },
  navRight: {
    right: 20,
  },

  // More options dropdown
  moreMenu: {
    position: 'absolute',
    top: 52,
    right: 8,
    backgroundColor: C.menuBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.menuBorder,
    minWidth: 220,
    paddingVertical: 4,
    zIndex: 100,
    ...(Platform.OS === 'web' ? { boxShadow: '0 8px 24px rgba(0,0,0,0.5)' } as any : {}),
  },
  moreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  moreItemTxt: {
    color: C.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  moreDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.menuBorder,
    marginVertical: 4,
  },
  comingSoonPill: {
    backgroundColor: 'rgba(0,217,165,0.15)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  comingSoonTxt: {
    color: C.brandGreen,
    fontSize: 11,
    fontWeight: '500',
  },
});
