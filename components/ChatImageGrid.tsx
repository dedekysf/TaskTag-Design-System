/**
 * ChatImageGrid
 * All image counts use the same container as the single-image preview
 * (aspect ratio driven by the first image). For 2+ images, images are
 * shown in a horizontal pager (scroll-snap) with dot indicators.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, View, Pressable, Platform } from 'react-native';
import { Text } from './primitives';
import { ImageOff } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';

interface ChatImageGridProps {
  images: any[];
  onImagePress?: (index: number) => void;
  /** Available content width (bubble maxWidth minus horizontal padding). Defaults to MAX_BUBBLE_W. */
  maxWidth?: number;
  /** Called once the container width is resolved (based on first image dims). */
  onLayoutWidth?: (width: number) => void;
}

const BORDER_RADIUS = 12;
const MAX_BUBBLE_W  = 360;

// Fixed aspect ratios per class (width / height)
const FIXED_RATIO = { portrait: 3 / 4, square: 1, landscape: 16 / 9 } as const;
// Max container width per single-image class
const SINGLE_MAX_W = { portrait: 280, square: 280, landscape: 360 } as const;

type RatioClass = 'portrait' | 'square' | 'landscape';

function getRatioClass(w: number, h: number): RatioClass {
  if (h <= 0) return 'square';
  const r = w / h;
  if (r < 0.85) return 'portrait';
  if (r < 1.2)  return 'square';
  return 'landscape';
}

function isUnsupported(img: any): boolean {
  let uri: string | null = null;
  if (typeof img === 'string') uri = img;
  else if (img?.uri) uri = img.uri;
  if (!uri) return false;
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return ['heic', 'heif', 'tiff', 'tif'].includes(ext);
}

function loadDims(img: any, cb: (w: number, h: number) => void) {
  if (typeof img === 'number') {
    const r = Image.resolveAssetSource?.(img);
    if (r?.width && r?.height) { cb(r.width, r.height); return; }
  }
  let uri: string | null = null;
  if (typeof img === 'string') uri = img;
  else if (typeof img === 'number') { const r = Image.resolveAssetSource?.(img); if (r?.uri) uri = r.uri; }
  else if (img?.uri) uri = img.uri;

  if (!uri) { cb(0, 0); return; }

  if (Platform.OS === 'web') {
    const el = new window.Image();
    el.onload  = () => cb(el.naturalWidth, el.naturalHeight);
    el.onerror = () => cb(0, 0);
    el.src = uri;
  } else {
    Image.getSize(uri, cb, () => cb(0, 0));
  }
}

export function ChatImageGrid({ images, onImagePress, maxWidth: maxWidthProp, onLayoutWidth }: ChatImageGridProps) {
  const theme = useTheme<Theme>();
  const count = images.length;

  const [firstDims, setFirstDims] = useState<{ w: number; h: number } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load first image dims — drives container size for all counts
  useEffect(() => {
    if (count === 0) { setFirstDims(null); return; }
    setFirstDims(null);
    loadDims(images[0], (w, h) => setFirstDims({ w, h }));
  }, [images, count]);

  // Reset current page when images change
  useEffect(() => { setCurrentIndex(0); }, [images]);

  // Notify parent of resolved container width
  useEffect(() => {
    if (!firstDims || !onLayoutWidth) return;
    const cls  = getRatioClass(firstDims.w, firstDims.h);
    const maxW = cls === 'landscape'
      ? (maxWidthProp ?? SINGLE_MAX_W.landscape)
      : SINGLE_MAX_W[cls];
    const contW = firstDims.w > 0 && firstDims.w < maxW ? firstDims.w : maxW;
    onLayoutWidth(contW);
  }, [firstDims, maxWidthProp, onLayoutWidth]);

  if (count === 0 || !firstDims) return null;

  // Resolve container dimensions
  const cls    = getRatioClass(firstDims.w, firstDims.h);
  const maxW   = cls === 'landscape'
    ? (maxWidthProp ?? SINGLE_MAX_W.landscape)
    : SINGLE_MAX_W[cls];
  const contW  = firstDims.w > 0 && firstDims.w < maxW ? firstDims.w : maxW;
  const contH  = Math.round(contW / FIXED_RATIO[cls]);
  const isSmall = firstDims.w > 0 && firstDims.w < maxW;

  return (
    <View style={{ width: contW, height: contH, borderRadius: BORDER_RADIUS, overflow: 'hidden', backgroundColor: theme.colors.grey02 }}>
      {count === 1 ? (
        // ── Single image ──────────────────────────────────────────────────────
        isUnsupported(images[0]) ? (
          <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
            <ImageOff size={32} color={theme.colors.grey05} />
          </View>
        ) : (
          <Pressable
            onPress={() => onImagePress?.(0)}
            style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.8 }]}
          >
            <Image
              source={typeof images[0] === 'string' ? { uri: images[0] } : images[0]}
              style={{ width: '100%', height: '100%' }}
              resizeMode={isSmall ? 'center' : 'cover'}
            />
          </Pressable>
        )
      ) : (
        // ── Multiple images: horizontal pager ─────────────────────────────────
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / contW);
              if (idx !== currentIndex) setCurrentIndex(idx);
            }}
          >
            {images.map((img, index) =>
              isUnsupported(img) ? (
                <View key={index} style={{ width: contW, height: contH, alignItems: 'center', justifyContent: 'center' }}>
                  <ImageOff size={32} color={theme.colors.grey05} />
                </View>
              ) : (
                <Pressable
                  key={index}
                  onPress={() => onImagePress?.(index)}
                  style={({ pressed }) => ({ width: contW, height: contH, opacity: pressed ? 0.8 : 1 })}
                >
                  <Image
                    source={typeof img === 'string' ? { uri: img } : img}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </Pressable>
              )
            )}
          </ScrollView>

          {/* Dot indicators */}
          <View style={s.dotsRow}>
            {images.map((_, i) => (
              <View key={i} style={[s.dot, i === currentIndex && s.dotActive]} />
            ))}
          </View>

          {/* Page counter badge */}
          <View style={s.badge}>
            <Text variant="caption" color="white" style={{ fontSize: 11, fontWeight: '600' }}>
              {currentIndex + 1}/{count}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  dotsRow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    width: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
});
