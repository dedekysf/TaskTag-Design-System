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
import { Button } from './Button';
import { Tooltip } from './Tooltip';
import { TextInput as DSTextInput } from './TextInput';
import {
  ChevronLeft, CircleArrowLeft, CircleArrowRight, Download, RotateCw, ZoomOut, ZoomIn,
  MoreVertical, Forward, Link, Check, CheckSquare, X, CircleCheckBig,
  PencilLine, Info, Trash2, Folder, Hash, Search, UsersRound,
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
  secondaryGreen: '#18a87d',
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
const BOTTOM_H  = 148;
const THUMB_W   = 160;
const THUMB_H   = 112;

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
  const [localImages, setLocalImages] = React.useState<string[]>(images);
  const [idx,       setIdx]       = React.useState(initialIndex);
  const [zoom,      setZoom]      = React.useState(100);
  const [rotation,  setRotation]  = React.useState(0);
  const [renaming,     setRenaming]     = React.useState(false);
  const [renameValue,  setRenameValue]  = React.useState('');
  const [fileNames,    setFileNames]    = React.useState<string[]>([]);
  const [selMode,        setSelMode]        = React.useState(false);
  const [selected,       setSelected]       = React.useState<Set<number>>(new Set());
  const [dlBtnWidth,     setDlBtnWidth]     = React.useState<number | undefined>(undefined);
  const [fwdBtnHeight,   setFwdBtnHeight]   = React.useState<number | undefined>(undefined);
  const [hoveredThumb,   setHoveredThumb]   = React.useState<number | null>(null);
  const [hoveredPill,    setHoveredPill]    = React.useState<string | null>(null);
  const [pillTooltipPos, setPillTooltipPos] = React.useState<{ x: number; y: number } | null>(null);
  const pillRefs = React.useRef<Record<string, any>>({});
  const [moreVisible,    setMoreVisible]    = React.useState(false);
  const [hashVisible,    setHashVisible]    = React.useState(false);
  const [fwdVisible,     setFwdVisible]     = React.useState(false);
  const [fwdSearch,      setFwdSearch]      = React.useState('');
  const [fwdSelected,    setFwdSelected]    = React.useState<Set<string>>(new Set());
  const fwdBtnRef        = React.useRef<any>(null);
  const fwdFloatingRef   = React.useRef<any>(null);
  const [fwdMenuRight,   setFwdMenuRight]   = React.useState(4);
  const [fwdMenuTop,     setFwdMenuTop]     = React.useState<number | undefined>(56);
  const [fwdMenuBottom,  setFwdMenuBottom]  = React.useState<number | undefined>(undefined);
  const [linkCopied,          setLinkCopied]          = React.useState(false);
  const [hoveredCopyBtn,      setHoveredCopyBtn]      = React.useState(false);
  const [deleteConfirm,       setDeleteConfirm]       = React.useState(false);
  const [infoVisible,         setInfoVisible]         = React.useState(false);
  const [imgDimensions,       setImgDimensions]       = React.useState<{ width: number; height: number } | null>(null);
  const [imgSize,             setImgSize]             = React.useState<string>('—');
  const [hashSearch,     setHashSearch]     = React.useState('');
  const [hashSelected,     setHashSelected]     = React.useState<Set<string>>(new Set());
  const [hashInitialSel,   setHashInitialSel]   = React.useState<Set<string>>(new Set());
  type LinkedItem = { name: string; type: 'project' | 'task' };
  const [linkedItemsMap, setLinkedItemsMap] = React.useState<Record<number, LinkedItem[]>>(() => {
    const initial: LinkedItem[] = [
      ...(projectName ? [{ name: projectName, type: 'project' as const }] : []),
      ...(taskName    ? [{ name: taskName,    type: 'task'    as const }] : []),
    ];
    const map: Record<number, LinkedItem[]> = {};
    images.forEach((_, i) => { map[i] = [...initial]; });
    return map;
  });
  const linkedItems = linkedItemsMap[idx] ?? [];
  const setLinkedItems = (updater: LinkedItem[] | ((prev: LinkedItem[]) => LinkedItem[])) => {
    setLinkedItemsMap(prev => ({
      ...prev,
      [idx]: typeof updater === 'function' ? updater(prev[idx] ?? []) : updater,
    }));
  };

  const thumbScrollRef  = React.useRef<ScrollView>(null);
  const renameInputRef  = React.useRef<TextInput>(null);
  const hashBtnRef      = React.useRef<any>(null);
  const [hashMenuRight, setHashMenuRight] = React.useState(4);

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

  const current   = localImages[idx];
  const filename  = fileNames[idx] ?? getFilename(current ?? '');
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
        await downloadOne(localImages[i], fileNames[i] ?? getFilename(localImages[i]));
      }
    } else {
      await downloadOne(current, filename);
    }
  };

  const handleForward = () => {
    const targets = selMode && selected.size > 0 ? Array.from(selected) : [idx];
    console.log('Forward images:', targets.map(i => localImages[i]));
  };

  const handleCopyLink = () => {
    if (Platform.OS === 'web') {
      navigator.clipboard?.writeText(current).catch(() => {});
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
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
    setIdx(i);
  };

  const splitExt = (filename: string) => {
    const dot = filename.lastIndexOf('.');
    return dot === -1
      ? { name: filename, ext: '' }
      : { name: filename.slice(0, dot), ext: filename.slice(dot) };
  };

  const startRename = () => {
    const full = fileNames[idx] ?? getFilename(localImages[idx]);
    setRenameValue(splitExt(full).name);
    setRenaming(true);
  };

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed) {
      const full = fileNames[idx] ?? getFilename(localImages[idx]);
      const { ext } = splitExt(full);
      setFileNames(prev => { const n = [...prev]; n[idx] = trimmed + ext; return n; });
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

  // Mouse scroll wheel → zoom (disabled when hash or forward menu is open)
  const hashVisibleRef = React.useRef(hashVisible);
  const fwdVisibleRef  = React.useRef(fwdVisible);
  React.useEffect(() => { hashVisibleRef.current = hashVisible; }, [hashVisible]);
  React.useEffect(() => { fwdVisibleRef.current  = fwdVisible;  }, [fwdVisible]);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onWheel = (e: WheelEvent) => {
      if (hashVisibleRef.current || fwdVisibleRef.current) return;
      e.preventDefault();
      if (e.deltaY < 0) setZoom(z => Math.min(z + ZOOM_STEP, ZOOM_MAX));
      else              setZoom(z => Math.max(z - ZOOM_STEP, ZOOM_MIN));
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [visible]);

  const selCount  = selected.size;
  const hasPills  = linkedItems.length > 0;

  // task → parent project (mirrors the ALL list in hash dropdown)
  const taskParentMap: Record<string, string> = {
    'Install Roof Framing':   'Raintree Hollow Renovation',
    'Set Water Meter':        'Raintree Hollow Renovation',
    'Verify Electrical Panel':'Raintree Hollow Renovation',
    'Foundation Inspection':  '520 N Broadway',
    'Plumbing Rough-In':      '520 N Broadway',
    'HVAC Installation':      '520 N Broadway',
    'Site Survey':            '1520 Oliver Street',
    'Permit Application':     '1520 Oliver Street',
    'Demolition Phase 1':     '1520 Oliver Street',
  };

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
                    <Check size={16} color={C.secondaryGreen} />
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
            {/* Group 1 — share actions */}
            <View style={s.iconGroup}>
              <Tooltip variant="bottom-right" size="sm" content="Link to a project or task">
                <Pressable
                  ref={hashBtnRef}
                  onPress={() => {
                    if (hashBtnRef.current && Platform.OS === 'web') {
                      hashBtnRef.current.measure((_x: number, _y: number, width: number, _h: number, pageX: number) => {
                        setHashMenuRight((window as any).innerWidth - pageX - width);
                      });
                    }
                    setHashVisible(v => {
                      if (!v) {
                        const initial = new Set(linkedItems.map(i => i.name));
                        setHashSelected(initial);
                        setHashInitialSel(new Set(initial));
                      }
                      return !v;
                    });
                    setHashSearch('');
                  }}
                  style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover, hashVisible && s.iconBtnHover]}
                  hitSlop={10}
                >
                  <Hash size={18} color={hashVisible ? C.secondaryGreen : C.iconActive} />
                </Pressable>
              </Tooltip>
              {!selMode && (
                <>
                  <Tooltip variant="bottom-right" size="sm" content="Download">
                    <Pressable onPress={handleDownload} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                      <Download size={18} color={C.iconActive} />
                    </Pressable>
                  </Tooltip>
                  <Tooltip variant="bottom-right" size="sm" content="Forward">
                    <Pressable
                      ref={fwdBtnRef}
                      onPress={() => {
                        if (fwdBtnRef.current && Platform.OS === 'web') {
                          fwdBtnRef.current.measure((_x: number, _y: number, width: number, _h: number, pageX: number) => {
                            setFwdMenuRight((window as any).innerWidth - pageX - width);
                          });
                        }
                        setFwdMenuTop(56);
                        setFwdMenuBottom(undefined);
                        setFwdVisible(v => !v);
                        setFwdSearch('');
                      }}
                      style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover, fwdVisible && s.iconBtnHover]}
                      hitSlop={10}
                    >
                      <Forward size={18} color={fwdVisible ? C.secondaryGreen : C.iconActive} />
                    </Pressable>
                  </Tooltip>
                </>
              )}
              <Tooltip
                variant="bottom-right"
                size="sm"
                content={
                  linkCopied
                    ? <View style={s.linkCopiedBubble}><CircleCheckBig size={14} color="#18a87d" /><Text style={s.linkCopiedTxt}>Link copied!</Text></View>
                    : 'Copy link to share'
                }
                open={linkCopied || hoveredCopyBtn}
                tooltipStyle={linkCopied ? 'custom' : 'default'}
                onOpenChange={(v) => { if (!v && linkCopied) setLinkCopied(false); }}
              >
                <Pressable
                  onPress={handleCopyLink}
                  style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]}
                  hitSlop={10}
                  {...(Platform.OS === 'web' ? {
                    onMouseEnter: () => setHoveredCopyBtn(true),
                    onMouseLeave: () => setHoveredCopyBtn(false),
                  } : {})}
                >
                  <Link size={18} color={linkCopied ? C.secondaryGreen : C.iconActive} />
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

            <Tooltip variant="bottom-right" size="sm" content="More actions">
              <Pressable onPress={() => setMoreVisible(v => !v)} style={({ pressed, hovered }: any) => [s.iconBtn, (pressed || hovered) && s.iconBtnHover]} hitSlop={10}>
                <MoreVertical size={18} color={C.iconActive} />
              </Pressable>
            </Tooltip>
          </View>

        </View>

        {/* ═══ PILLS — below header ═══════════════════════════════════════════ */}
        {hasPills && (() => {
          // group: each project followed by its tasks
          const projects = linkedItems.filter(i => i.type === 'project');
          const tasks    = linkedItems.filter(i => i.type === 'task');
          const orphanTasks = tasks.filter(t => !projects.some(p => taskParentMap[t.name] === p.name));
          const grouped: LinkedItem[] = [
            ...projects.flatMap(p => [p, ...tasks.filter(t => taskParentMap[t.name] === p.name)]),
            ...orphanTasks,
          ];
          const renderPill = (item: LinkedItem) => (
            <Pressable
              key={item.name}
              ref={(r) => { pillRefs.current[item.name] = r; }}
              style={[s.imgPill, item.type === 'project' ? s.imgPillProject : s.imgPillTask]}
              onPress={() => setLinkedItems(prev => prev.filter(i => i.name !== item.name))}
              {...(Platform.OS === 'web' && item.name.length > 20 ? { onMouseEnter: () => {
                pillRefs.current[item.name]?.measure((_x: number, _y: number, _w: number, h: number, pageX: number, pageY: number) => {
                  setPillTooltipPos({ x: pageX, y: pageY + h + 6 });
                });
                setHoveredPill(item.name);
              }, onMouseLeave: () => { setHoveredPill(null); setPillTooltipPos(null); } } as any : {})}
            >
              {item.type === 'project'
                ? <Folder size={12} color="#fff" />
                : <Hash size={12} color="#fff" />
              }
              <Text style={s.imgPillTxt} numberOfLines={1}>{item.name.length > 20 ? item.name.slice(0, 20) + '…' : item.name}</Text>
            </Pressable>
          );
          return (
            <View style={s.headerPillBar}>
              {grouped.map(renderPill)}
            </View>
          );
        })()}

        {/* ═══ MORE OPTIONS DROPDOWN ══════════════════════════════════════════ */}
        {moreVisible && (
          <>
            <Pressable style={[StyleSheet.absoluteFill, { zIndex: 99 }]} onPress={() => setMoreVisible(false)} />
            <View style={s.moreMenu}>
              {/* Information */}
              <Pressable style={s.moreItem} onPress={() => {
                setMoreVisible(false);
                // fetch dimensions
                Image.getSize(current, (w, h) => setImgDimensions({ width: w, height: h }), () => setImgDimensions(null));
                // fetch size via fetch HEAD
                if (Platform.OS === 'web') {
                  fetch(current).then(r => {
                    const cl = r.headers.get('content-length');
                    if (cl) {
                      const kb = Math.round(parseInt(cl, 10) / 1024);
                      setImgSize(`${kb} KB`);
                    } else { setImgSize('—'); }
                  }).catch(() => setImgSize('—'));
                }
                setInfoVisible(true);
              }}>
                <Info size={16} color={C.textPrimary} />
                <Text style={s.moreItemTxt}>Information</Text>
              </Pressable>
              <View style={s.moreDivider} />
              {/* Delete */}
              <Pressable style={s.moreItem} onPress={() => { setMoreVisible(false); setDeleteConfirm(true); }}>
                <Trash2 size={16} color={C.deleteRed} />
                <Text style={[s.moreItemTxt, { color: C.deleteRed }]}>Delete</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* ═══ HASH DROPDOWN — link to project or task ══════════════════════ */}
        {hashVisible && (
          <>
            <Pressable style={[StyleSheet.absoluteFill, { zIndex: 199 }]} onPress={() => { setHashVisible(false); setHashSelected(new Set()); }} />
            <View style={[s.hashMenu, { right: hashMenuRight }]}>
              {/* Search input */}
              <View style={s.hashSearchRow}>
                <View style={s.hashSearchIcon}>
                  <Hash size={16} color="#fff" />
                </View>
                <View style={{ flex: 1, marginBottom: -16 }}>
                  <DSTextInput
                    placeholder="Link to a project or task"
                    value={hashSearch}
                    onChangeText={setHashSearch}
                    showClearButton
                    autoFocus
                  />
                </View>
                <Pressable onPress={() => { setHashVisible(false); setHashSelected(new Set()); }}>
                  <Text style={s.hashCancelTxt}>Cancel</Text>
                </Pressable>
              </View>

              <View style={s.hashDivider} />

              {(() => {
                type HItem = { type: string; name: string; avatar?: { initials: string; color: string } };
                const RECENT: HItem[] = [
                  { type: 'project', name: '520 N Broadway' },
                  { type: 'task',    name: 'Foundation Inspection',  avatar: { initials: 'JH', color: '#138eff' } },
                  { type: 'task',    name: 'Plumbing Rough-In',      avatar: { initials: 'AS', color: '#fc7f5b' } },
                  { type: 'task',    name: 'HVAC Installation',      avatar: { initials: 'CR', color: '#0f6466' } },
                ];
                const ALL: HItem[] = [
                  { type: 'project', name: 'Raintree Hollow Renovation' },
                  { type: 'task',    name: 'Install Roof Framing',        avatar: { initials: 'JH', color: '#138eff' } },
                  { type: 'task',    name: 'Set Water Meter',             avatar: { initials: 'AS', color: '#fc7f5b' } },
                  { type: 'task',    name: 'Verify Electrical Panel',     avatar: { initials: 'CR', color: '#0f6466' } },
                  { type: 'project', name: '520 N Broadway' },
                  { type: 'task',    name: 'Foundation Inspection',       avatar: { initials: 'JH', color: '#138eff' } },
                  { type: 'task',    name: 'Plumbing Rough-In',           avatar: { initials: 'AS', color: '#fc7f5b' } },
                  { type: 'task',    name: 'HVAC Installation',           avatar: { initials: 'CR', color: '#0f6466' } },
                  { type: 'project', name: '1520 Oliver Street' },
                  { type: 'task',    name: 'Site Survey',                 avatar: { initials: 'JH', color: '#138eff' } },
                  { type: 'task',    name: 'Permit Application',          avatar: { initials: 'AS', color: '#fc7f5b' } },
                  { type: 'task',    name: 'Demolition Phase 1',          avatar: { initials: 'CR', color: '#0f6466' } },
                ];
                // task → parent project mapping (derived from ALL list order)
                const taskParent: Record<string, string> = {};
                let currentProject = '';
                ALL.forEach(item => {
                  if (item.type === 'project') { currentProject = item.name; }
                  else { taskParent[item.name] = currentProject; }
                });

                const filter = (list: HItem[]) =>
                  !hashSearch ? list : list.filter(i => i.name.toLowerCase().includes(hashSearch.toLowerCase()));
                const toggleItem = (name: string) => {
                  const item = ALL.find(i => i.name === name) ?? RECENT.find(i => i.name === name);
                  setHashSelected(prev => {
                    const next = new Set(prev);
                    if (next.has(name)) {
                      next.delete(name);
                    } else {
                      next.add(name);
                      // if task selected → auto-select its parent project
                      if (item?.type === 'task' && taskParent[name]) {
                        next.add(taskParent[name]);
                      }
                    }
                    return next;
                  });
                };
                const renderItem = (item: HItem, i: number) => {
                  const isChecked = hashSelected.has(item.name);
                  return (
                    <Pressable
                      key={i}
                      style={({ pressed, hovered }: any) => [s.hashItem, (pressed || hovered) && s.hashItemHover]}
                      onPress={() => toggleItem(item.name)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                        <View style={[s.hashCheckCircle, isChecked && s.hashCheckCircleActive]}>
                          {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                        </View>
                        {item.type === 'project' ? (
                          <View style={s.hashProjectIcon}><Text style={s.hashProjectIconTxt}>tt</Text></View>
                        ) : (
                          <View style={s.hashTaskIcon}><Hash size={20} color={C.secondaryGreen} /></View>
                        )}
                        <Text style={[s.hashItemTxt, item.type === 'project' && s.hashItemTxtBold]} numberOfLines={1}>{item.name}</Text>
                      </View>
                      {item.avatar && (
                        <View style={[s.hashAvatar, { backgroundColor: item.avatar.color }]}>
                          <Text style={s.hashAvatarTxt}>{item.avatar.initials}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                };
                return (
                  <>
                    <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator>
                      <Text style={s.hashSectionLabel}>Recent Project &amp; Tasks</Text>
                      {filter(RECENT).map(renderItem)}
                      <View style={s.hashDivider} />
                      <Text style={s.hashSectionLabel}>All Projects &amp; Tasks</Text>
                      {filter(ALL).map(renderItem)}
                      <View style={{ height: 12 }} />
                    </ScrollView>
                    <View style={s.hashLinkBar}>
                      <Pressable
                        disabled={(() => {
                          if (hashSelected.size !== hashInitialSel.size) return false;
                          for (const n of hashSelected) if (!hashInitialSel.has(n)) return false;
                          return true;
                        })()}
                        style={({ pressed, hovered }: any) => {
                          const unchanged = hashSelected.size === hashInitialSel.size && [...hashSelected].every(n => hashInitialSel.has(n));
                          return [s.hashLinkBtn, unchanged && s.hashLinkBtnDisabled, !unchanged && (pressed || hovered) && s.hashLinkBtnHover];
                        }}
                        onPress={() => {
                          const allItems = [...RECENT, ...ALL];
                          const newLinked = Array.from(hashSelected).map(name => {
                            const found = allItems.find(it => it.name === name);
                            return found ? { name, type: found.type as 'project' | 'task' } : null;
                          }).filter(Boolean) as { name: string; type: 'project' | 'task' }[];
                          setLinkedItems(newLinked);
                          setHashSelected(new Set());
                          setHashVisible(false);
                        }}
                      >
                        <Text style={[s.hashLinkBtnTxt, [...hashSelected].every(n => hashInitialSel.has(n)) && hashSelected.size === hashInitialSel.size && s.hashLinkBtnTxtDisabled]}>Link</Text>
                      </Pressable>
                    </View>
                  </>
                );
              })()}
            </View>
          </>
        )}

        {/* ═══ FORWARD DROPDOWN ══════════════════════════════════════════════ */}
        {fwdVisible && (
          <>
            <Pressable style={[StyleSheet.absoluteFill, { zIndex: 199 }]} onPress={() => { setFwdVisible(false); setFwdSelected(new Set()); }} />
            <View style={[s.fwdMenu, { right: fwdMenuRight, top: fwdMenuTop, bottom: fwdMenuBottom }]}>
              {/* Search */}
              <View style={s.fwdSearchRow}>
                <View style={{ flex: 1, marginBottom: -16 }}>
                  <DSTextInput
                    placeholder="Search"
                    value={fwdSearch}
                    onChangeText={setFwdSearch}
                    icon={Search}
                    showClearButton
                    autoFocus
                  />
                </View>
                <Pressable
                  onPress={() => { setFwdVisible(false); setFwdSelected(new Set()); }}
                  style={({ pressed }: any) => [{ opacity: pressed ? 0.6 : 1 }, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
                >
                  <Text style={s.hashCancelTxt}>Cancel</Text>
                </Pressable>
              </View>

              {/* Contact list */}
              {(() => {
                type Contact = { name: string; type: 'user' | 'group'; avatar?: string; initials?: string; color?: string };
                const CONTACTS: Contact[] = [
                  { type: 'user',  name: 'James Harrington',    avatar: 'https://i.pravatar.cc/150?img=11' },
                  { type: 'group', name: 'Raintree Hollow Team' },
                  { type: 'user',  name: 'Rachel Monroe',        initials: 'RM', color: '#fc7f5b' },
                  { type: 'user',  name: 'Tyler Brooks',         initials: 'TB', color: '#138eff' },
                  { type: 'group', name: '520 N Broadway Crew' },
                  { type: 'user',  name: 'Samantha Cole',        initials: 'SC', color: '#0f6466' },
                  { type: 'group', name: 'Site Supervisors' },
                  { type: 'user',  name: 'Derek Lawson',         initials: 'DL', color: '#8b5cf6' },
                ];
                const filtered = !fwdSearch
                  ? CONTACTS
                  : CONTACTS.filter(c => c.name.toLowerCase().includes(fwdSearch.toLowerCase()));
                return (
                  <>
                  <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator>
                    <Text variant="webLabelEmphasized" color="textSecondary" style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>All chats</Text>
                    {filtered.map((contact, i) => {
                      const isChecked = fwdSelected.has(contact.name);
                      return (
                        <Pressable
                          key={i}
                          style={({ pressed, hovered }: any) => [s.fwdItem, (pressed || hovered) && s.fwdItemHover]}
                          onPress={() => {
                            setFwdSelected(prev => {
                              const next = new Set(prev);
                              next.has(contact.name) ? next.delete(contact.name) : next.add(contact.name);
                              return next;
                            });
                          }}
                        >
                          <View style={[s.hashCheckCircle, isChecked && s.hashCheckCircleActive]}>
                            {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                          </View>
                          {contact.type === 'group' ? (
                            <View style={[s.fwdAvatarInitials, { backgroundColor: 'rgba(0,0,0,0.08)' }]}>
                              <UsersRound size={20} color="#303742" />
                            </View>
                          ) : contact.avatar ? (
                            <Image source={{ uri: contact.avatar }} style={s.fwdAvatar} />
                          ) : (
                            <View style={[s.fwdAvatarInitials, { backgroundColor: contact.color }]}>
                              <Text variant="webLabelEmphasized" color="white">{contact.initials}</Text>
                            </View>
                          )}
                          <Text variant="webBody" color="textSecondary" numberOfLines={1}>{contact.name}</Text>
                        </Pressable>
                      );
                    })}
                    <View style={{ height: 8 }} />
                  </ScrollView>
                  <View style={s.hashLinkBar}>
                    <Pressable
                      disabled={fwdSelected.size === 0}
                      style={({ pressed, hovered }: any) => [s.hashLinkBtn, fwdSelected.size === 0 && s.hashLinkBtnDisabled, fwdSelected.size > 0 && (pressed || hovered) && s.hashLinkBtnHover]}
                      onPress={() => {
                        console.log('Forward to:', Array.from(fwdSelected));
                        setFwdVisible(false); setFwdSelected(new Set());
                      }}
                    >
                      <Text style={[s.hashLinkBtnTxt, fwdSelected.size === 0 && s.hashLinkBtnTxtDisabled]}>Forward</Text>
                    </Pressable>
                  </View>
                </>
                );
              })()}
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
          {idx < localImages.length - 1 && (
            <Pressable
              onPress={() => setIdx(i => i + 1)}
              style={[s.navBtn, s.navRight]}
              hitSlop={16}
            >
              <CircleArrowRight size={36} color={C.iconActive} />
            </Pressable>
          )}

          {/* Floating selection action bar — shown over image when items are selected */}
          {selMode && selCount > 0 && (
            <View style={s.floatingSelBar}>
              <View style={s.floatingSelBtns}>
                <Pressable
                  onPress={handleDownload}
                  onLayout={(e) => setDlBtnWidth(e.nativeEvent.layout.width)}
                  style={({ pressed, hovered }: any) => [s.floatingSelBtn, (pressed || hovered) && selCount > 0 && s.floatingSelBtnHover, selCount === 0 && s.floatingSelBtnDisabled]}
                  disabled={selCount === 0}
                >
                  <Download size={16} color={selCount > 0 ? C.iconActive : C.iconMuted} />
                  <Text style={[s.floatingSelBtnTxt, selCount === 0 && { color: C.iconMuted }]}>Download</Text>
                  {selCount > 0 && (
                    <View style={s.floatingSelBadge}>
                      <Text style={s.floatingSelBadgeTxt}>{selCount}</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  ref={fwdFloatingRef}
                  onPress={() => {
                    if (fwdFloatingRef.current && Platform.OS === 'web') {
                      fwdFloatingRef.current.measure((_x: number, _y: number, width: number, h: number, pageX: number, pageY: number) => {
                        setFwdMenuRight((window as any).innerWidth - pageX - width);
                        setFwdMenuTop(undefined);
                        setFwdMenuBottom((window as any).innerHeight - pageY + 8);
                      });
                    }
                    setFwdVisible(v => !v);
                    setFwdSearch('');
                  }}
                  onLayout={(e) => setFwdBtnHeight(e.nativeEvent.layout.height)}
                  style={({ pressed, hovered }: any) => [s.floatingSelBtn, (pressed || hovered) && selCount > 0 && s.floatingSelBtnHover, selCount === 0 && s.floatingSelBtnDisabled, dlBtnWidth ? { width: dlBtnWidth } : undefined]}
                  disabled={selCount === 0}
                >
                  <Forward size={16} color={selCount > 0 ? C.iconActive : C.iconMuted} />
                  <Text style={[s.floatingSelBtnTxt, selCount === 0 && { color: C.iconMuted }]}>Forward</Text>
                  {selCount > 0 && (
                    <View style={s.floatingSelBadge}>
                      <Text style={s.floatingSelBadgeTxt}>{selCount}</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => { setSelMode(false); setSelected(new Set()); }}
                  style={({ pressed, hovered }: any) => [
                    s.floatingCancelBtn,
                    fwdBtnHeight ? { width: fwdBtnHeight, height: fwdBtnHeight } : undefined,
                    (pressed || hovered) && s.floatingCancelBtnHover,
                  ]}
                  hitSlop={8}
                >
                  <X size={18} color={C.iconActive} />
                </Pressable>
              </View>
            </View>
          )}

        </View>

        {/* ═══ BOTTOM — thumbnail strip ═══════════════════════════════════════ */}
        {localImages.length > 1 && <View style={s.bottomBar}>

          {localImages.length > 1 && <View style={s.thumbRow}>
            <ScrollView
              ref={thumbScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.thumbStrip}
              style={s.thumbScrollView}
            >
              {localImages.map((img, i) => {
                const showCheck = true;
                return (
                  <Pressable
                    key={i}
                    onPress={() => handleThumbPress(i)}
                    style={{ position: 'relative' }}
                    {...(Platform.OS === 'web' ? {
                      onMouseEnter: () => setHoveredThumb(i),
                      onMouseLeave: () => setHoveredThumb(null),
                    } as any : {})}
                  >
                    <View style={[s.thumbBorder, !selMode && i === idx && s.thumbActive, selMode && selected.has(i) && s.thumbSelected]}>
                      <View style={s.thumbWrap}>
                        <Image source={{ uri: img }} style={s.thumb} resizeMode="cover" />
                        {hoveredThumb === i && !selected.has(i) && (
                          <View style={s.thumbHoverOverlay} />
                        )}
                      </View>
                    </View>
                    {showCheck && (
                      <Pressable
                        onPress={() => {
                          if (!selMode) setSelMode(true);
                          toggleSelect(i);
                        }}
                        style={[s.checkCircle, selected.has(i) && s.checkCircleSelected]}
                        hitSlop={4}
                      >
                        {selected.has(i) && <Check size={14} color="#fff" strokeWidth={2.5} />}
                      </Pressable>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>}

        </View>}

        {/* ═══ FILE INFO MODAL ════════════════════════════════════════════════ */}
        {infoVisible && (
          <View style={s.confirmOverlay}>
            <View style={s.confirmBox}>
              <View style={s.confirmHeader}>
                <Text variant="webLargeLabel" color="foreground">File details</Text>
                <Pressable onPress={() => setInfoVisible(false)} hitSlop={8} style={({ pressed, hovered }: any) => [s.confirmClose, (pressed || hovered) && { opacity: 0.6 }]}>
                  <X size={18} color="#0a1629" />
                </Pressable>
              </View>
              <View style={s.infoRow}>
                <Text variant="webMetadataPrimary" color="textSecondary">Name</Text>
                <Text variant="webSecondaryBody" color="textPrimary" numberOfLines={1}>{filename}</Text>
              </View>
              <View style={s.infoRow}>
                <Text variant="webMetadataPrimary" color="textSecondary">Type</Text>
                <Text variant="webSecondaryBody" color="textPrimary">Image</Text>
              </View>
              <View style={s.infoRow}>
                <Text variant="webMetadataPrimary" color="textSecondary">Size</Text>
                <Text variant="webSecondaryBody" color="textPrimary">{imgSize}</Text>
              </View>
              <View style={s.infoRow}>
                <Text variant="webMetadataPrimary" color="textSecondary">Dimensions</Text>
                <Text variant="webSecondaryBody" color="textPrimary">
                  {imgDimensions ? `${imgDimensions.width} x ${imgDimensions.height}` : '—'}
                </Text>
              </View>
              <View style={s.infoRow}>
                <Text variant="webMetadataPrimary" color="textSecondary">Owner</Text>
                <Text variant="webSecondaryBody" color="textPrimary">me</Text>
              </View>
              <View style={s.infoRow}>
                <Text variant="webMetadataPrimary" color="textSecondary">Created</Text>
                <Text variant="webSecondaryBody" color="textPrimary">{dateLabel}</Text>
              </View>
              <View style={[s.infoRow, { marginBottom: 0 }]}>
                <Text variant="webMetadataPrimary" color="textSecondary">Modified</Text>
                <Text variant="webSecondaryBody" color="textPrimary">{dateLabel}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ═══ DELETE CONFIRM MODAL ══════════════════════════════════════════ */}
        {deleteConfirm && (
          <View style={s.confirmOverlay}>
            <View style={s.confirmBox}>
              <View style={s.confirmHeader}>
                <Text variant="webLargeLabel" color="foreground">Delete</Text>
                <Pressable onPress={() => setDeleteConfirm(false)} hitSlop={8} style={({ pressed, hovered }: any) => [s.confirmClose, (pressed || hovered) && { opacity: 0.6 }]}>
                  <X size={18} color="#0a1629" />
                </Pressable>
              </View>
              <Text variant="webBody" color="textSecondary" style={{ marginBottom: 24 }}>Are you sure you want to delete this image?</Text>
              <View style={s.confirmActions}>
                <Button
                  variant="fill"
                  size="md"
                  style={{ alignSelf: 'flex-end', backgroundColor: '#0a1629' }}
                  onPress={() => {
                    setDeleteConfirm(false);
                    const next = localImages.filter((_, i) => i !== idx);
                    setLocalImages(next);
                    if (next.length === 0) { onClose(); }
                    else { setIdx(Math.min(idx, next.length - 1)); }
                  }}
                >
                  <Text variant="webLabelEmphasized" color="white">Yes, Delete</Text>
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* ═══ PILL TOOLTIP — global layer ═══════════════════════════════════ */}
        {hoveredPill && pillTooltipPos && (
          <View
            pointerEvents="none"
            style={[s.pillTooltip, { position: 'absolute', left: pillTooltipPos.x, top: pillTooltipPos.y }]}
          >
            <Text style={s.pillTooltipTxt}>
              {hoveredPill}
            </Text>
          </View>
        )}

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
    borderColor: '#ffffff',
    opacity: 0.85,
  },
  thumbHoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Icon groups
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    color: C.secondaryGreen,
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

  // Floating selection bar over image
  floatingSelBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingSelBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  floatingSelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(28,34,48,0.92)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  floatingSelBtnDisabled: {
    opacity: 0.4,
  },
  floatingSelBtnHover: {
    backgroundColor: 'rgba(50,62,86,0.95)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  floatingCancelBtn: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(28,34,48,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  floatingCancelBtnHover: {
    backgroundColor: 'rgba(50,62,86,0.95)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  floatingSelBtnTxt: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  floatingSelBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.secondaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  floatingSelBadgeTxt: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    includeFontPadding: false,
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
  thumbBorder: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: '#ffffff',
  },
  thumbWrap: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumb: {
    width: THUMB_W,
    height: THUMB_H,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Selection checkbox
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: C.secondaryGreen,
    borderColor: C.secondaryGreen,
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
    paddingVertical: 0,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    flexShrink: 0,
    alignSelf: 'center',
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
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
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
    color: C.secondaryGreen,
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

  // Pill bar below header
  headerPillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: C.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
    flexWrap: 'wrap',
  },

  // Hash dropdown menu
  hashMenu: {
    position: 'absolute',
    top: 56,
    width: 560,
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
    paddingTop: 16,
    paddingBottom: 16,
    gap: 10,
  },
  hashSearchIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: C.secondaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hashSearchInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: '#000000',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}),
  },
  hashCancelTxt: {
    color: '#303742',
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  hashItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  hashItemHover: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  hashCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.20)',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hashCheckCircleActive: {
    backgroundColor: C.secondaryGreen,
    borderColor: C.secondaryGreen,
  },
  hashCheckCircleDisabled: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderColor: 'rgba(0,0,0,0.10)',
  },
  hashLinkBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.10)',
  },
  hashLinkBtn: {
    backgroundColor: C.secondaryGreen,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  hashLinkBtnDisabled: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  hashLinkBtnHover: {
    opacity: 0.85,
  },
  hashLinkBtnTxtDisabled: {
    color: 'rgba(0,0,0,0.30)',
  },
  hashLinkBtnTxt: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
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
  hashTaskIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hashAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hashAvatarTxt: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  hashProjectIconTxt: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  hashItemTxt: {
    color: '#303742',
    fontSize: 15,
    flex: 1,
  },
  hashItemTxtBold: {
    fontWeight: '700',
  },
  hashItemTxtDisabled: {
    color: 'rgba(0,0,0,0.30)',
  },
  // Delete confirm
  confirmOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
  },
  confirmBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 480,
    ...(Platform.OS === 'web' ? { boxShadow: '0 8px 32px rgba(0,0,0,0.24)' } as any : {}),
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 16,
  },

  pillTooltip: {
    backgroundColor: '#000000',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 9999,
    ...(Platform.OS === 'web' ? { boxShadow: '0 2px 8px rgba(0,0,0,0.25)', whiteSpace: 'nowrap', width: 'max-content' } as any : {}),
  },
  pillTooltipTxt: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },

  // Forward dropdown
  fwdMenu: {
    position: 'absolute',
    width: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    zIndex: 200,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { boxShadow: '0 8px 32px rgba(0,0,0,0.20)' } as any : {}),
  },
  fwdSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  fwdSectionLabel: {
    color: '#303742',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  fwdItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fwdItemHover: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  fwdAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    flexShrink: 0,
  },
  fwdAvatarInitials: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  fwdContactName: {
    flex: 1,
  },
});
