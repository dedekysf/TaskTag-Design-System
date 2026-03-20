/**
 * ChatImageSelector
 * Shown when a multi-image message is tapped.
 * Header: [ChevronLeft · avatar · name · date] ... [Select All]
 * List: centered previews (~65% width) with square checkbox top-right.
 * Bottom: count label · [Forward] [Download]
 */

import React from 'react';
import {
  Modal,
  View,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Text } from './primitives';
import { ChevronLeft, Forward, Download, Check } from 'lucide-react-native';
import { ChatImageViewer } from './ChatImageViewer';

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  bg:           '#0d1117',
  surface:      '#1c2230',
  border:       'rgba(255,255,255,0.08)',
  text:         '#ffffff',
  textMuted:    'rgba(255,255,255,0.55)',
  brandGreen:   '#00d9a5',
  iconColor:    '#ffffff',
  iconMuted:    'rgba(255,255,255,0.35)',
  avatarBlue:   '#138eff',
  avatarOrange: '#fc7f5b',
};

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildDateLabel(timeStr: string): string {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} at ${timeStr}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  images:  string[];
  sender:  string;
  time:    string;
  visible: boolean;
  onClose: () => void;
}

// ── Single image row ───────────────────────────────────────────────────────────
function SelectorImage({
  uri, selected, onSelect, onPreview, containerW,
}: {
  uri: string; selected: boolean;
  onSelect: () => void; onPreview: () => void; containerW: number;
}) {
  const [dims, setDims] = React.useState<{ w: number; h: number } | null>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const img = new (window as any).Image();
      img.onload  = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => setDims({ w: 4, h: 3 });
      img.src = uri;
    } else {
      Image.getSize(uri, (w, h) => setDims({ w, h }), () => setDims({ w: 4, h: 3 }));
    }
  }, [uri]);

  // 65% of container width, natural aspect ratio
  const imgW = Math.round(containerW * 0.65);
  const imgH = dims ? Math.round(imgW * (dims.h / dims.w)) : Math.round(imgW * 0.75);

  return (
    <View style={[st.imgRow, { width: containerW }]}>
      <Pressable onPress={onPreview} style={[st.imgCard, { width: imgW, height: imgH }]}>
        <Image source={{ uri }} style={{ width: imgW, height: imgH }} resizeMode="cover" />

        {/* Square checkbox — top-right */}
        <Pressable onPress={onSelect} style={st.checkBtn} hitSlop={12}>
          <View style={[st.checkbox, selected && st.checkboxSelected]}>
            {selected && <Check size={13} color={C.surface} strokeWidth={3} />}
          </View>
        </Pressable>
      </Pressable>
    </View>
  );
}

// ── Download helper ───────────────────────────────────────────────────────────
async function downloadUrl(url: string, index: number) {
  if (Platform.OS !== 'web') return;
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href     = blobUrl;
    a.download = `image-${Date.now()}-${index}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch {
    window.open(url, '_blank');
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export function ChatImageSelector({ images, sender, time, visible, onClose }: Props) {
  const { width: winW } = useWindowDimensions();
  const [selected,      setSelected]      = React.useState<Set<number>>(new Set());
  const [viewerVisible, setViewerVisible] = React.useState(false);
  const [viewerIndex,   setViewerIndex]   = React.useState(0);

  React.useEffect(() => {
    if (visible) setSelected(new Set());
  }, [visible]);

  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const selectAll   = () => setSelected(new Set(images.map((_, i) => i)));
  const deselectAll = () => setSelected(new Set());

  const openPreview = (i: number) => { setViewerIndex(i); setViewerVisible(true); };

  const downloadSelected = () => {
    const targets = selected.size > 0
      ? images.filter((_, i) => selected.has(i))
      : images;
    targets.forEach((url, i) => downloadUrl(url, i));
  };

  const selectedCount = selected.size;
  const allSelected   = selected.size === images.length;

  // Avatar
  const isDedek  = sender.toLowerCase().includes('dedek');
  const initials = sender.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarBg = isDedek ? C.avatarOrange : C.avatarBlue;
  const dateLabel = buildDateLabel(time);

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={st.root}>

          {/* ── Header ──────────────────────────────────────────────────── */}
          <View style={st.topBar}>

            {/* LEFT: chevron + avatar + name + date */}
            <View style={st.topLeft}>
              <Pressable onPress={onClose} style={st.iconBtn} hitSlop={10}>
                <ChevronLeft size={24} color={C.iconColor} />
              </Pressable>
              <View style={[st.avatar, { backgroundColor: avatarBg }]}>
                <Text style={st.avatarTxt}>{initials}</Text>
              </View>
              <View style={{ marginLeft: 8, flexShrink: 1 }}>
                <Text style={st.topTitle} numberOfLines={1}>{sender}</Text>
                <Text style={st.topSub}   numberOfLines={1}>{dateLabel}</Text>
              </View>
            </View>

            {/* RIGHT: Select All */}
            <Pressable
              onPress={allSelected ? deselectAll : selectAll}
              style={st.selectAllBtn}
              hitSlop={10}
            >
              <Text style={st.topAction}>
                {allSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </Pressable>
          </View>

          {/* ── Image list ───────────────────────────────────────────────── */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={st.listContent}
            showsVerticalScrollIndicator={false}
          >
            {images.map((uri, i) => (
              <SelectorImage
                key={i}
                uri={uri}
                selected={selected.has(i)}
                onSelect={() => toggleSelect(i)}
                onPreview={() => openPreview(i)}
                containerW={winW}
              />
            ))}
          </ScrollView>

          {/* ── Bottom bar ───────────────────────────────────────────────── */}
          <View style={st.bottomBar}>
            <Text style={st.bottomLabel}>
              {selectedCount === 0
                ? 'No items selected'
                : `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`}
            </Text>
            <View style={st.bottomActions}>
              <Pressable style={st.bottomBtn} hitSlop={12}>
                <Forward size={22} color={selectedCount > 0 ? C.iconColor : C.iconMuted} />
              </Pressable>
              <Pressable onPress={downloadSelected} style={st.bottomBtn} hitSlop={12}>
                <Download size={22} color={selectedCount > 0 ? C.brandGreen : C.iconColor} />
              </Pressable>
            </View>
          </View>

        </View>
      </Modal>

      <ChatImageViewer
        images={images}
        initialIndex={viewerIndex}
        sender={sender}
        time={time}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  topBar: {
    height: 56,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  topLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    minWidth: 0,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    flexShrink: 0,
  },
  avatarTxt: {
    color: C.text,
    fontSize: 11,
    fontWeight: '700',
  },
  topTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: '600',
  },
  topSub: {
    color: C.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  selectAllBtn: {
    paddingHorizontal: 8,
    flexShrink: 0,
  },
  topAction: {
    color: C.brandGreen,
    fontSize: 13,
    fontWeight: '500',
  },

  // List
  listContent: {
    paddingVertical: 12,
    gap: 12,
  },

  // Image row
  imgRow: {
    alignItems: 'center',
  },
  imgCard: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: C.bg,
  },

  // Square checkbox — top-right
  checkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(0,0,0,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: C.brandGreen,
    backgroundColor: C.brandGreen,
  },

  // Bottom bar
  bottomBar: {
    height: 64,
    backgroundColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  bottomLabel: {
    color: C.text,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottomBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
