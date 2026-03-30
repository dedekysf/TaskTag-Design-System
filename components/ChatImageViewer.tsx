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
import { Tooltip } from './Tooltip';
import {
  ChevronLeft, CircleArrowLeft, CircleArrowRight, Download, RotateCw, ZoomOut, ZoomIn,
  MoreVertical, Forward, Link, Check, CheckSquare, X, CircleCheckBig,
  PencilLine, Info, Trash2, Folder, Hash,
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
const ZOOM_MAX  = 200;
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
  const [renaming,     setRenaming]     = React.useState(false);
  const [renameValue,  setRenameValue]  = React.useState('');
  const [fileNames,    setFileNames]    = React.useState<string[]>([]);
  const [selMode,        setSelMode]        = React.useState(false);
  const [selected,       setSelected]       = React.useState<Set<number>>(new Set());
  const [hoveredThumb,   setHoveredThumb]   = React.useState<number | null>(null);
  const [moreVisible,    setMoreVisible]    = React.useState(false);
  const [hashVisible,    setHashVisible]    = React.useState(false);
  const [linkCopied,     setLinkCopied]     = React.useState(false);
  const [hashSearch,     setHashSearch]     = React.useState('');
  const [linkedProject,  setLinkedProject]  = React.useState(projectName ?? null);
  const [linkedTask,     setLinkedTask]     = React.useState(taskName ?? null);

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
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
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

  const startRename = () => {
    setRenameValue(fileNames[idx] ?? getFilename(images[idx]));
    setRenaming(true);
  };

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      setFileNames(prev => { const n = [...prev]; n[idx] = trimmed; return n; });
    }
    setRenaming(false);
  };

  const cancelRename = () => {
    setRenaming(false);
  };

  const zoomIn  = () => setZoom(z => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const zoomOut = () => setZoom(z => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  const rotate  = () => setRotation(r => (r + 90) % 360);

  // Dismiss link-copied tooltip on any click outside
  React.useEffect(() => {
    if (!linkCopied || Platform.OS !== 'web') return;
    const close = () => setLinkCopied(false);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [linkCopied]);

  // Mouse scroll wheel → zoom
  React.useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) setZoom(z => Math.min(z + ZOOM_STEP, ZOOM_MAX));
      else              setZoom(z => Math.max(z - ZOOM_STEP, ZOOM_MIN));
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [visible]);

  const selCount  = selected.size;
  const hasPills  = !!(linkedProject || linkedTask);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.root}>

        {/* ═══ HEADER ════════════════════════════════════════════════════════ */}
        <View style={s.header}>

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
            </View>
          </View>

          {/* CENTER — filename (click to rename) */}
          <View style={s.hCenter}>
            {renaming ? (
              <View style={s.renameRow}>
                <TextInput
                  ref={renameInputRef}
                  style={s.renameInput}
                  value={renameValue}
                  onChangeText={setRenameValue}
                  onSubmitEditing={commitRename}
                  selectTextOnFocus
                  autoFocus
                />
                {/* Cancel */}
                <Tooltip variant="bottom-right" size="sm" content="Cancel">
                  <Pressable
                    onPress={cancelRename}
                    style={({ pressed, hovered }: any) => [s.renameActionBtn, (pressed || hovered) && s.iconBtnHover]}
                    hitSlop={8}
                  >
                    <X size={16} color={C.deleteRed} />
                  </Pressable>
                </Tooltip>
                {/* Save */}
                <Tooltip variant="bottom-right" size="sm" content="Save">
                  <Pressable
                    onPress={commitRename}
                    style={({ pressed, hovered }: any) => [s.renameActionBtn, (pressed || hovered) && s.iconBtnHover]}
                    hitSlop={8}
                  >
                    <Check size={16} color={C.brandGreen} />
                  </Pressable>
                </Tooltip>
              </View>
            ) : (
              <View style={s.filenameRow}>
                <Text style={s.filename} numberOfLines={1}>{filename}</Text>
                <Tooltip variant="bottom-right" size="sm" content="Rename">
                  <Pressable
                    onPress={startRename}
                    style={({ pressed, hovered }: any) => [s.renamePencilBtn, (pressed || hovered) && s.iconBtnHover]}
                    hitSlop={8}
                  >
                    <PencilLine size={14} color={C.iconActive} />
                  </Pressable>
                </Tooltip>
              </View>
            )}
          </View>

          {/* RIGHT — [group1: download · forward · copy] | [group2: zoom-out · 100% · zoom-in · rotate] · more */}
          <View style={s.hRight}>
            {selMode && (
              <Pressable
                onPress={() => { setSelMode(false); setSelected(new Set()); }}
                style={s.cancelSelBtn}
              >
                <Text style={s.cancelSelTxt}>Cancel</Text>
              </Pressable>
            )}

            {/* Group 1 — share actions */}
            <View style={s.iconGroup}>
              <Tooltip variant="bottom-right" size="sm" content="Link to a project or task">
                <Pressable onPress={() => { setHashVisible(v => !v); setHashSearch(''); }} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover, hashVisible && s.iconBtnHover]} hitSlop={10}>
                  <Hash size={18} color={hashVisible ? C.brandGreen : C.iconActive} />
                </Pressable>
              </Tooltip>
              <Tooltip variant="bottom-right" size="sm" content="Download">
                <Pressable onPress={handleDownload} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                  <Download size={18} color={C.iconActive} />
                </Pressable>
              </Tooltip>
              <Tooltip variant="bottom-right" size="sm" content="Forward">
                <Pressable onPress={handleForward} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                  <Forward size={18} color={C.iconActive} />
                </Pressable>
              </Tooltip>
              <Tooltip
                variant="bottom-right"
                size="sm"
                content={
                  linkCopied
                    ? <View style={s.linkCopiedBubble}><CircleCheckBig size={14} color="#18a87d" /><Text style={s.linkCopiedTxt}>Link copied!</Text></View>
                    : 'Copy link to share'
                }
                open={linkCopied || undefined}
                tooltipStyle={linkCopied ? 'custom' : 'default'}
                onOpenChange={(v) => { if (!v && linkCopied) setLinkCopied(false); }}
              >
                <Pressable onPress={handleCopyLink} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                  <Link size={18} color={linkCopied ? C.brandGreen : C.iconActive} />
                </Pressable>
              </Tooltip>
            </View>

            <View style={s.groupDivider} />

            {/* Group 2 — rotate · zoom out · 100% · zoom in */}
            <View style={s.iconGroup}>
              <Tooltip variant="bottom-right" size="sm" content="Rotate">
                <Pressable onPress={rotate} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                  <RotateCw size={18} color={C.iconActive} />
                </Pressable>
              </Tooltip>
              <Tooltip variant="bottom-right" size="sm" content="Zoom out">
                <Pressable onPress={zoomOut} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                  <ZoomOut size={18} color={zoom <= ZOOM_MIN ? C.iconMuted : C.iconActive} />
                </Pressable>
              </Tooltip>
              <Text style={s.zoomPct}>{zoom}%</Text>
              <Tooltip variant="bottom-right" size="sm" content="Zoom in">
                <Pressable onPress={zoomIn} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                  <ZoomIn size={18} color={zoom >= ZOOM_MAX ? C.iconMuted : C.iconActive} />
                </Pressable>
              </Tooltip>
            </View>

            <Tooltip variant="bottom-right" size="sm" content="More options">
              <Pressable onPress={() => setMoreVisible(v => !v)} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                <MoreVertical size={18} color={C.iconActive} />
              </Pressable>
            </Tooltip>
          </View>

        </View>

        {/* ═══ MORE OPTIONS DROPDOWN ══════════════════════════════════════════ */}
        {moreVisible && (
          <>
            <Pressable style={[StyleSheet.absoluteFill, { zIndex: 99 }]} onPress={() => setMoreVisible(false)} />
            <View style={s.moreMenu}>
              {/* Information */}
              <Pressable style={s.moreItem} onPress={() => setMoreVisible(false)}>
                <Info size={16} color={C.textPrimary} />
                <Text style={s.moreItemTxt}>Information</Text>
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

        {/* ═══ HASH DROPDOWN — link to project or task ══════════════════════ */}
        {hashVisible && (
          <>
            <Pressable style={[StyleSheet.absoluteFill, { zIndex: 199 }]} onPress={() => setHashVisible(false)} />
            <View style={s.hashMenu}>
              {/* Search input */}
              <View style={s.hashSearchRow}>
                <View style={s.hashSearchIcon}>
                  <Hash size={16} color="#fff" />
                </View>
                <TextInput
                  style={s.hashSearchInput}
                  placeholder="Link to a project or task"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  value={hashSearch}
                  onChangeText={setHashSearch}
                  autoFocus
                />
                <Pressable onPress={() => setHashVisible(false)}>
                  <Text style={s.hashCancelTxt}>Cancel</Text>
                </Pressable>
              </View>

              <View style={s.hashDivider} />

              {/* Recent list */}
              <Text style={s.hashSectionLabel}>Recent projects &amp; tasks</Text>

              {[
                { type: 'project', name: '520 N Broadway' },
                { type: 'task',    name: 'PickupTrim' },
                { type: 'task',    name: 'Set Water Meter' },
                { type: 'project', name: '1520 Oliver street' },
                { type: 'task',    name: 'Verify location of electrical meter' },
                { type: 'task',    name: 'Set Water Meter' },
              ]
                .filter(item => !hashSearch || item.name.toLowerCase().includes(hashSearch.toLowerCase()))
                .map((item, i) => (
                  <Pressable
                    key={i}
                    style={({ pressed, hovered }: any) => [s.hashItem, (pressed || hovered) && s.hashItemHover]}
                    onPress={() => {
                      if (item.type === 'project') setLinkedProject(item.name);
                      else setLinkedTask(item.name);
                      setHashVisible(false);
                    }}
                  >
                    {item.type === 'project' ? (
                      <View style={s.hashProjectIcon}>
                        <Text style={s.hashProjectIconTxt}>tt</Text>
                      </View>
                    ) : (
                      <Hash size={20} color={C.brandGreen} />
                    )}
                    <Text style={[s.hashItemTxt, item.type === 'project' && s.hashItemTxtBold]}>{item.name}</Text>
                  </Pressable>
                ))
              }
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

        {/* ═══ BOTTOM — pill bar + selection bar + thumbnail strip ══════════ */}
        {(images.length > 1 || hasPills) && <View style={s.bottomBar}>

          {/* Selection action bar — only for multi-image */}
          {images.length > 1 && selMode && (
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

          {/* Linked project / task pills above thumbnails */}
          {hasPills && (
            <View style={s.thumbPillBar}>
              {linkedProject && (
                <Pressable style={[s.imgPill, s.imgPillProject]} onPress={() => setLinkedProject(null)}>
                  <Folder size={11} color="#fff" />
                  <Text style={s.imgPillTxt} numberOfLines={1}>{linkedProject}</Text>
                  <X size={10} color="rgba(255,255,255,0.7)" />
                </Pressable>
              )}
              {linkedTask && (
                <Pressable style={[s.imgPill, s.imgPillTask]} onPress={() => setLinkedTask(null)}>
                  <Hash size={11} color="#fff" />
                  <Text style={s.imgPillTxt} numberOfLines={1}>{linkedTask}</Text>
                  <X size={10} color="rgba(255,255,255,0.7)" />
                </Pressable>
              )}
            </View>
          )}

          {images.length > 1 && <View style={s.thumbRow}>
            <ScrollView
              ref={thumbScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.thumbStrip}
              style={s.thumbScrollView}
            >
              {images.map((img, i) => {
                const showCheck = selMode || (Platform.OS === 'web' && hoveredThumb === i);
                return (
                  <Pressable
                    key={i}
                    onPress={() => handleThumbPress(i)}
                    onLongPress={() => { if (!selMode) { setSelMode(true); toggleSelect(i); } }}
                    style={{ position: 'relative' }}
                    {...(Platform.OS === 'web' ? {
                      onMouseEnter: () => setHoveredThumb(i),
                      onMouseLeave: () => setHoveredThumb(null),
                    } as any : {})}
                  >
                    <View style={[s.thumbWrap, !selMode && i === idx && s.thumbActive, selMode && selected.has(i) && s.thumbSelected]}>
                      <Image source={{ uri: img }} style={s.thumb} resizeMode="cover" />
                    </View>
                    {showCheck && (
                      <Pressable
                        onPress={() => {
                          if (!selMode) setSelMode(true);
                          toggleSelect(i);
                        }}
                        style={[s.checkCircle, selected.has(i) && s.checkCircleSelected]}
                      >
                        {selected.has(i) && <Check size={11} color="#fff" strokeWidth={3} />}
                      </Pressable>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>}

        </View>}

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
    zIndex: 20,
    overflow: 'visible' as any,
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
    overflow: 'visible' as any,
  },
  hRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible' as any,
    zIndex: 20,
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
    marginTop: 2,
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

  // Filename row
  filenameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  renamePencilBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
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
  renameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    borderColor: '#ffffff',
    minWidth: 120,
    maxWidth: 200,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
  },
  renameActionBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },

  // Zoom %
  zoomPct: {
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    minWidth: 38,
    textAlign: 'center',
  },

  // Thumbnail row with select toggle
  thumbRow: {
    height: BOTTOM_H,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selToggleBtn: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255,255,255,0.08)',
  },
  selToggleBtnActive: {
    backgroundColor: 'rgba(0,217,165,0.08)',
  },
  thumbSelected: {
    borderColor: C.brandGreen,
    opacity: 0.85,
  },

  // Icon groups
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible' as any,
  },
  groupDivider: {
    width: 1,
    height: 20,
    backgroundColor: C.border,
    marginHorizontal: 24,
  },
  iconBtnHover: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 6,
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
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  // Bottom
  bottomBar: {
    backgroundColor: C.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
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

  thumbScrollView: {
    flex: 1,
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

  // Selection checkbox (square)
  checkCircle: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: C.brandGreen,
    borderColor: C.brandGreen,
  },

  // Project / task pill overlay on image
  imgPillBar: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  imgPill: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  imgPillProject: {
    backgroundColor: '#18a87d',
  },
  imgPillTask: {
    backgroundColor: 'rgba(0,0,0,0.70)',
  },
  imgPillTxt: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '400',
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

  // Link copied toast content
  linkCopiedBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  linkCopiedTxt: {
    color: '#303742',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Pill bar above thumbnails
  thumbPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#303742',
    flexWrap: 'wrap',
  },

  // Hash dropdown menu
  hashMenu: {
    position: 'absolute',
    top: 56,
    left: 40,
    right: 40,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    zIndex: 200,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 8px 32px rgba(0,0,0,0.35)' } as any : {}),
  },
  hashSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  hashSearchIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: C.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hashSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
  },
  hashCancelTxt: {
    color: C.brandGreen,
    fontSize: 15,
    fontWeight: '600',
  },
  hashDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.10)',
    marginHorizontal: 0,
  },
  hashSectionLabel: {
    color: 'rgba(0,0,0,0.40)',
    fontSize: 13,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
  },
  hashItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  hashItemHover: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  hashProjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hashProjectIconTxt: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  hashItemTxt: {
    color: '#111111',
    fontSize: 15,
    flex: 1,
  },
  hashItemTxtBold: {
    fontWeight: '700',
  },
});
