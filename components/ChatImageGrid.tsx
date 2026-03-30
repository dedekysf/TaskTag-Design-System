/**
 * ChatImageGrid Component
 * WhatsApp-style media thumbnail rendering for chat messages.
 *
 * MEDIA THUMBNAIL RULES:
 * 1. Single image: sized by orientation (square/portrait/landscape)
 *    - Boundary: maxWidth = 0.72 × screenWidth, maxHeight = 0.80 × screenHeight
 *    - Width always = maxWidth; height derived from clamped ratio [0.5, 2.0]
 * 2. Two images: layout depends on first image orientation
 *    - First is landscape → vertical stack (both full width, proportional height)
 *    - First is portrait/square → horizontal side-by-side (half width each)
 * 3. Three images: layout depends on first image orientation
 *    - First is landscape → 1 top full-width + 2 bottom half-width
 *    - First is portrait/square → 1 left portrait + 2 right stacked
 * 4. Four or more images: 2×2 grid, all cells square (1:1); 5+ shows +N overlay on 4th cell
 * 5. Thumbnails use resizeMode="cover" — images are cropped, never distorted.
 *    Downloaded/full-screen images always show original ratio and orientation.
 * 6. Spacing: borderRadius 12px, gap 4px
 */

import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, Pressable, Platform, useWindowDimensions } from 'react-native';
import { Text } from './primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';

interface ChatImageGridProps {
  images: any[];
  onImagePress?: (index: number) => void;
  /** true = sent (green, has check icon); false/undefined = received (white, no check icon).
   *  Received bubbles are maxWidth + CHECK_OFFSET wider to fill the space the check icon occupies
   *  on sent messages, keeping both message rows the same total visual width. */
  sent?: boolean;
}

const GAP = 4;
const BORDER_RADIUS = 12;
// Space the check icon + gap occupy in sent messages; received bubbles add this to their maxWidth.
const CHECK_OFFSET = 4 + 16; // gap(4px) + icon(16px)

export function ChatImageGrid({ images, onImagePress, sent = false }: ChatImageGridProps) {
  const theme = useTheme<Theme>();
  const { width: windowW, height: windowH } = useWindowDimensions();
  const count = images.length;

  // The chat container is fixed at 470px on web. We must treat this as the "screen" boundary.
  const isDesktopWeb = Platform.OS === 'web' && windowW > 500;
  const screenW = isDesktopWeb ? 470 : windowW;
  const screenH = isDesktopWeb ? windowH * 0.95 : windowH;

  // Received bubbles are wider by CHECK_OFFSET so both message rows fill the same horizontal space.
  const maxWidth = Math.round(screenW * 0.72) + (sent ? 0 : CHECK_OFFSET);
  const maxHeight = Math.round(screenH * 0.80);

  const [singleDims, setSingleDims] = useState<{ w: number; h: number } | null>(null);
  // For multi-image: only the FIRST image's orientation determines all cell ratios
  const [multiFirstDims, setMultiFirstDims] = useState<{ w: number; h: number } | null>(null);

  // ── Helper: load natural dimensions for any image source ──
  const loadImageDims = (img: any, onLoad: (w: number, h: number) => void) => {
    if (typeof img === 'number') {
      const resolved = Image.resolveAssetSource?.(img);
      if (resolved?.width && resolved?.height) { onLoad(resolved.width, resolved.height); return; }
    }
    let uri: string | null = null;
    if (typeof img === 'string') uri = img;
    else if (typeof img === 'number') { const r = Image.resolveAssetSource?.(img); if (r?.uri) uri = r.uri; }
    else if (img?.uri) uri = img.uri;

    if (uri && Platform.OS === 'web') {
      const htmlImg = new window.Image();
      htmlImg.onload = () => onLoad(htmlImg.naturalWidth, htmlImg.naturalHeight);
      htmlImg.onerror = () => onLoad(1, 1);
      htmlImg.src = uri;
    } else if (uri) {
      Image.getSize(uri, onLoad, () => onLoad(1, 1));
    } else {
      onLoad(1, 1);
    }
  };

  // ── Multi-image: detect first image orientation (drives ALL cell ratios) ──
  useEffect(() => {
    if (count < 2) { setMultiFirstDims(null); return; }
    loadImageDims(images[0], (w, h) => setMultiFirstDims({ w, h }));
  }, [count, images]);

  // ── Single image: detect natural dimensions and compute display size ──
  useEffect(() => {
    if (count !== 1) return;

    const img = images[0];

    const computeSize = (imgW: number, imgH: number) => {
      if (imgW <= 0 || imgH <= 0) {
        setSingleDims({ w: maxWidth, h: Math.round(maxWidth * 0.75) });
        return;
      }

      const ratio = imgW / imgH;
      const w = maxWidth;
      let h: number;

      // Clamp to prevent extreme ratios.
      // Portrait capped at 0.75 (3:4) so thumbnails aren't overly tall.
      // Landscape capped at 2.0 (2:1) so very wide images stay readable.
      const clampedRatio = Math.max(0.75, Math.min(2.0, ratio));
      h = Math.round(w / clampedRatio);

      // We still respect maxHeight as an ultimate safety net if screen is extremely short
      if (h > maxHeight) h = maxHeight;

      setSingleDims({ w, h });
    };

    // Try Image.resolveAssetSource first (works with require())
    if (typeof img === 'number') {
      const resolved = Image.resolveAssetSource?.(img);
      if (resolved?.width && resolved?.height) {
        computeSize(resolved.width, resolved.height);
        return;
      }
    }

    // Resolve URI
    let uri: string | null = null;
    if (typeof img === 'string') {
      uri = img;
    } else if (typeof img === 'number') {
      const resolved = Image.resolveAssetSource?.(img);
      if (resolved?.uri) uri = resolved.uri;
    } else if (img?.uri) {
      uri = img.uri;
    }

    if (uri && Platform.OS === 'web') {
      const htmlImg = new window.Image();
      htmlImg.onload = () => computeSize(htmlImg.naturalWidth, htmlImg.naturalHeight);
      htmlImg.onerror = () => setSingleDims({ w: maxWidth, h: Math.round(maxWidth * 0.75) });
      htmlImg.src = uri;
    } else if (uri) {
      Image.getSize(
        uri,
        (w, h) => computeSize(w, h),
        () => setSingleDims({ w: maxWidth, h: Math.round(maxWidth * 0.75) })
      );
    } else {
      setSingleDims({ w: maxWidth, h: Math.round(maxWidth * 0.75) });
    }
  }, [count, images, maxWidth, maxHeight]);

  if (count === 0) return null;

  // ── Helper: render a single image cell (used in grids) ──
  const renderCell = (uri: any, index: number, style: any, showOverlay = false) => (
    <Pressable
      key={index}
      onPress={() => onImagePress?.(index)}
      style={({ pressed }) => [style, pressed && { opacity: 0.8 }]}
    >
      <Image
        source={typeof uri === 'string' ? { uri } : uri}
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.grey02, objectFit: 'cover' as any }]}
        resizeMode="cover"
      />
      <View style={StyleSheet.absoluteFill} />
      {showOverlay && count > 4 && (
        <View style={styles.overlay}>
          <Text variant="h2" color="white" fontWeight="600" style={{ fontSize: 28 }}>
            +{count - 4}
          </Text>
        </View>
      )}
    </Pressable>
  );

  // ══════════════════════════════════════════
  // SINGLE IMAGE
  // ══════════════════════════════════════════
  if (count === 1) {
    if (!singleDims) return null; // Wait for dimensions to resolve

    return (
      <View
        style={{
          width: singleDims.w,
          height: singleDims.h,
          borderRadius: BORDER_RADIUS,
          overflow: 'hidden',
        }}
      >
        <Pressable
          onPress={() => onImagePress?.(0)}
          style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.8 }]}
        >
          <Image
            source={typeof images[0] === 'string' ? { uri: images[0] } : images[0]}
            style={{ width: '100%', height: '100%', backgroundColor: theme.colors.grey02, objectFit: 'cover' as any }}
            resizeMode="cover"
          />
          <View style={StyleSheet.absoluteFill} />
        </Pressable>
      </View>
    );
  }

  // ══════════════════════════════════════════
  // MULTIPLE IMAGES
  // ALL cells use the FIRST image's aspect ratio (cover-cropped).
  // Layout orientation (vertical stack vs side-by-side) is also driven by first image.
  // ══════════════════════════════════════════
  const cellSize = Math.round((maxWidth - GAP) / 2);

  // First image ratio drives everything. Fall back to 1:1 while loading.
  const firstRatio = multiFirstDims
    ? Math.max(0.5, Math.min(2.0, multiFirstDims.w / multiFirstDims.h))
    : 1;
  const isFirstLandscape = firstRatio > 1;

  // Cell heights at each column width, preserving firstRatio
  const cellH = Math.round(cellSize / firstRatio);
  const fullH = Math.min(Math.round(maxWidth / firstRatio), maxHeight);

  // 2 images
  if (count === 2) {
    if (isFirstLandscape) {
      // Vertical stack: two full-width landscape cells
      return (
        <View style={{ width: maxWidth, height: fullH * 2 + GAP, borderRadius: BORDER_RADIUS, overflow: 'hidden' }}>
          {renderCell(images[0], 0, { width: maxWidth, height: fullH })}
          <View style={{ height: GAP }} />
          {renderCell(images[1], 1, { width: maxWidth, height: fullH })}
        </View>
      );
    }
    // Side by side: two portrait/square cells
    return (
      <View style={{ width: maxWidth, flexDirection: 'row', borderRadius: BORDER_RADIUS, overflow: 'hidden' }}>
        {renderCell(images[0], 0, { width: cellSize, height: cellH })}
        <View style={{ width: GAP }} />
        {renderCell(images[1], 1, { width: cellSize, height: cellH })}
      </View>
    );
  }

  // 3 images: layout depends on first image orientation
  if (count === 3) {
    if (isFirstLandscape) {
      // Landscape first: 1 top full-width + 2 bottom half-width
      return (
        <View style={{ width: maxWidth, height: fullH + GAP + cellH, borderRadius: BORDER_RADIUS, overflow: 'hidden' }}>
          {renderCell(images[0], 0, { width: maxWidth, height: fullH })}
          <View style={{ height: GAP }} />
          <View style={{ flexDirection: 'row', height: cellH }}>
            {renderCell(images[1], 1, { width: cellSize, height: cellH })}
            <View style={{ width: GAP }} />
            {renderCell(images[2], 2, { width: cellSize, height: cellH })}
          </View>
        </View>
      );
    }
    // Portrait/square first: 1 left portrait + 2 right stacked
    const rightCellH = Math.round((cellH - GAP) / 2);
    return (
      <View style={{ width: maxWidth, height: cellH, flexDirection: 'row', borderRadius: BORDER_RADIUS, overflow: 'hidden' }}>
        {renderCell(images[0], 0, { width: cellSize, height: cellH })}
        <View style={{ width: GAP }} />
        <View style={{ width: cellSize, height: cellH }}>
          {renderCell(images[1], 1, { width: cellSize, height: rightCellH })}
          <View style={{ height: GAP }} />
          {renderCell(images[2], 2, { width: cellSize, height: rightCellH })}
        </View>
      </View>
    );
  }

  // 4+ images: 2×2 grid, all cells square (overlay on 4th cell if count > 4)
  const showImages = images.slice(0, 4);
  return (
    <View style={{ width: maxWidth, height: cellSize * 2 + GAP, borderRadius: BORDER_RADIUS, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', height: cellSize }}>
        {renderCell(showImages[0], 0, { width: cellSize, height: cellSize })}
        <View style={{ width: GAP }} />
        {renderCell(showImages[1], 1, { width: cellSize, height: cellSize })}
      </View>
      <View style={{ height: GAP }} />
      <View style={{ flexDirection: 'row', height: cellSize }}>
        {renderCell(showImages[2], 2, { width: cellSize, height: cellSize })}
        <View style={{ width: GAP }} />
        {renderCell(showImages[3], 3, { width: cellSize, height: cellSize }, count > 4)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
