/**
 * ChatImageViewer
 * Full-screen image preview modal.
 *
 * Header layout:
 *   LEFT  — back arrow · avatar · sender name · day, date at time
 *   CENTER — filename
 *   RIGHT  — download · rotate · zoom-out · zoom-in · zoom% · more
 * Main   — image with contain + zoom/rotate transforms
 * Bottom — large thumbnail strip (120×80 each, brandGreen border on active)
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
} from 'react-native';
import { Text } from './primitives';
import { ChevronLeft, Download, RotateCw, ZoomOut, ZoomIn, MoreHorizontal } from 'lucide-react-native';

// ── Color tokens (from theme palette) ────────────────────────────────────────
const C = {
  bg:            '#0d1117',               // near-black image area
  surface:       '#1c2230',               // header & bottom bar
  border:        'rgba(255,255,255,0.08)',
  iconActive:    '#ffffff',
  iconMuted:     'rgba(255,255,255,0.35)',
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.55)',
  brandGreen:    '#00d9a5',               // active thumbnail border
  avatarBlue:    '#138eff',
  avatarOrange:  '#fc7f5b',
};

const ZOOM_STEP = 25;
const ZOOM_MIN  = 25;
const ZOOM_MAX  = 400;
const HEADER_H  = 56;
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
  images:       string[];
  initialIndex: number;
  sender:       string;
  time:         string;
  visible:      boolean;
  onClose:      () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ChatImageViewer({ images, initialIndex, sender, time, visible, onClose }: Props) {
  const [idx,      setIdx]      = React.useState(initialIndex);
  const [zoom,     setZoom]     = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const thumbScrollRef = React.useRef<ScrollView>(null);

  // Reset state when opening
  React.useEffect(() => {
    if (visible) { setIdx(initialIndex); setZoom(100); setRotation(0); }
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

  const current  = images[idx];
  const filename = getFilename(current);
  const dateLabel = buildDateLabel(time);

  // Avatar
  const isDedek  = sender.toLowerCase().includes('dedek');
  const initials = sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarBg = isDedek ? C.avatarOrange : C.avatarBlue;

  // Actions
  const download = async () => {
    if (Platform.OS !== 'web') return;
    try {
      const res  = await fetch(current);
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.style.display = 'none';
      a.href     = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(current, '_blank');
    }
  };

  const zoomIn  = () => setZoom(z => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom(z => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  const rotate  = () => setRotation(r => (r + 90) % 360);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.root}>

        {/* ═══ HEADER ════════════════════════════════════════════════════════ */}
        <View style={s.header}>

          {/* LEFT — back · avatar · name · date */}
          <View style={s.hLeft}>
            <Pressable onPress={onClose} style={s.iconBtn} hitSlop={10}>
              <ChevronLeft size={24} color={C.iconActive} />
            </Pressable>
            <View style={[s.avatar, { backgroundColor: avatarBg }]}>
              <Text style={s.avatarTxt}>{initials}</Text>
            </View>
            <View style={{ marginLeft: 8, flexShrink: 1 }}>
              <Text style={s.senderName} numberOfLines={1}>{sender}</Text>
              <Text style={s.dateLabel}  numberOfLines={1}>{dateLabel}</Text>
            </View>
          </View>

          {/* CENTER — filename */}
          <View style={s.hCenter}>
            <Text style={s.filename} numberOfLines={1}>{filename}</Text>
          </View>

          {/* RIGHT — controls */}
          <View style={s.hRight}>
            <Pressable onPress={download} style={s.iconBtn} hitSlop={10}>
              <Download size={18} color={C.iconActive} />
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
            <Pressable style={s.iconBtn} hitSlop={10}>
              <MoreHorizontal size={18} color={C.iconActive} />
            </Pressable>
          </View>

        </View>

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
        </View>

        {/* ═══ BOTTOM — thumbnail strip ══════════════════════════════════════ */}
        <View style={s.bottomBar}>
          <ScrollView
            ref={thumbScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.thumbStrip}
          >
            {images.map((img, i) => (
              <Pressable
                key={i}
                onPress={() => setIdx(i)}
                style={[s.thumbWrap, i === idx && s.thumbActive]}
              >
                <Image source={{ uri: img }} style={s.thumb} resizeMode="cover" />
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
    height: HEADER_H,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
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

  // Header text
  senderName: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  dateLabel: {
    color: C.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  filename: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  zoomPct: {
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    minWidth: 38,
    textAlign: 'center',
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
});

