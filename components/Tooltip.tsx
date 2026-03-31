/**
 * Tooltip Component - TaskTag Design System
 * 
 * Simplified version for React Native
 * Source: Reference/Tasktagdesignsystem/src/components/Tooltip.tsx
 * 
 * Note: This is a simplified version. Full positioning logic (like web portal)
 * is complex in React Native. This version uses basic positioning.
 */

import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View, ViewStyle } from 'react-native';
import { Text } from './primitives';

export type TooltipVariant = 'top-left' | 'top-center' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type TooltipSize = 'sm' | 'md' | 'lg';
export type TooltipStyle = 'default' | 'success' | 'custom';

interface TooltipProps {
    /** Tooltip position variant */
    variant?: TooltipVariant;
    /** Tooltip size */
    size?: TooltipSize;
    /** Tooltip style */
    tooltipStyle?: TooltipStyle;
    /** The content to show in the tooltip */
    content: string | React.ReactNode;
    /** The trigger element */
    children: React.ReactNode;
    /** Force tooltip to show (controlled mode) */
    forceShow?: boolean;
    /** Controlled open state */
    open?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Make wrapper take full width */
    fullWidth?: boolean;
    /** Disabled tooltip */
    disabled?: boolean;
    /** Custom style */
    style?: ViewStyle;
    /** Trigger mode: hover (default) or press */
    trigger?: 'hover' | 'press';
}

// Size configurations matching reference
const sizeConfig = {
    sm: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 12,
    },
    md: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    lg: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
    },
};

export function Tooltip({
    variant = 'top-center',
    size = 'md',
    tooltipStyle = 'default',
    content,
    children,
    forceShow = false,
    open,
    onOpenChange,
    fullWidth = false,
    disabled = false,
    style,
    trigger = 'hover',
}: TooltipProps) {
    const theme = useTheme<Theme>();
    const isControlled = open !== undefined;
    const [internalVisible, setInternalVisible] = useState(false);
    const isVisible = isControlled ? open! : internalVisible;

    const setIsVisible = (val: boolean) => {
        if (!isControlled) setInternalVisible(val);
        onOpenChange?.(val);
    };
    const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const triggerRef = useRef<any>(null);
    const [portalRect, setPortalRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

    useEffect(() => {
        if (Platform.OS === 'web' && (forceShow || isVisible) && triggerRef.current) {
            const el = triggerRef.current as any;
            const node = el._nativeTag ? null : el; // RN web exposes DOM node directly
            const domEl = node ?? (el.getDOMNode ? el.getDOMNode() : null);
            if (domEl && domEl.getBoundingClientRect) {
                const rect = domEl.getBoundingClientRect();
                setPortalRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
            }
        }
    }, [forceShow, isVisible]);
    const currentSize = sizeConfig[size];

    const handlePressIn = () => {
        if (!disabled && trigger !== 'press') {
            setIsVisible(true);
        }
    };

    const handlePressOut = () => {
        if (!disabled && trigger !== 'press') {
            setIsVisible(false);
        }
    };

    const handlePress = () => {
        if (!disabled && trigger === 'press') {
            setIsVisible(!isVisible);
        }
    };

    // Web specific handlers
    const handleMouseEnter = () => {
        if (Platform.OS === 'web' && !disabled && trigger !== 'press') {
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        if (Platform.OS === 'web' && !disabled && trigger !== 'press') {
            setIsVisible(false);
        }
    };

    const handleLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setLayout({ x, y, width, height });
    };

    const shouldShow = (forceShow || isVisible) && !disabled;

    const backgroundColor =
        tooltipStyle === 'success' ? theme.colors.secondaryGreen :
            tooltipStyle === 'custom' ? 'transparent' : theme.colors.black;

    // Calculate tooltip position based on variant
    const getTooltipPosition = (): ViewStyle => {
        const offset = 8;
        switch (variant) {
            case 'top-left':
                return {
                    bottom: layout.height + offset,
                    left: 0,
                };
            case 'top-center':
                return {
                    bottom: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: '-50%' as any }],
                };
            case 'top-right':
                return {
                    bottom: layout.height + offset,
                    right: 0,
                    // If right: 0 doesn't align perfectly with right edge of trigger because of parent width, 
                    // absolute positioning relative to trigger works if trigger is layout measurement reference.
                    // Assuming Tooltip container wraps Trigger exactly.
                };
            case 'bottom-left':
                return {
                    top: layout.height + offset,
                    left: 0,
                };
            case 'bottom-center':
                return {
                    top: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: '-50%' as any }],
                };
            case 'bottom-right':
                return {
                    top: layout.height + offset,
                    right: 0,
                };
            case 'left':
                return {
                    right: layout.width + offset,
                    top: '50%',
                    transform: [{ translateY: '-50%' as any }],
                };
            case 'right':
                return {
                    left: layout.width + offset,
                    top: '50%',
                    transform: [{ translateY: '-50%' as any }],
                };
            default:
                return {
                    bottom: layout.height + offset,
                    left: '50%',
                    transform: [{ translateX: '-50%' as any }],
                };
        }
    };

    const tooltipBoxStyle: ViewStyle = {
        backgroundColor,
        borderRadius: tooltipStyle === 'custom' ? 0 : theme.borderRadii['8'],
        paddingVertical: tooltipStyle === 'custom' ? 0 : currentSize.paddingVertical,
        paddingHorizontal: tooltipStyle === 'custom' ? 0 : currentSize.paddingHorizontal,
        maxWidth: 200,
    };

    const tooltipContent = typeof content === 'string' ? (
        <Text style={{ color: theme.colors.white, fontSize: currentSize.fontSize, fontFamily: 'Inter_400Regular', lineHeight: currentSize.fontSize * 1.5 }}>
            {content}
        </Text>
    ) : content;

    // Portal tooltip for web — renders at document body to escape stacking contexts
    const renderWebPortal = () => {
        if (!shouldShow || !portalRect) return null;
        const offset = 8;
        let top = 0, left = 0;
        let transform = '';
        switch (variant) {
            case 'bottom-center':
                top = portalRect.top + portalRect.height + offset;
                left = portalRect.left + portalRect.width / 2;
                transform = 'translateX(-50%)';
                break;
            case 'bottom-left':
                top = portalRect.top + portalRect.height + offset;
                left = portalRect.left;
                break;
            case 'bottom-right':
                top = portalRect.top + portalRect.height + offset;
                left = portalRect.left + portalRect.width;
                transform = 'translateX(-100%)';
                break;
            case 'top-center':
                top = portalRect.top - offset;
                left = portalRect.left + portalRect.width / 2;
                transform = 'translate(-50%, -100%)';
                break;
            case 'top-left':
                top = portalRect.top - offset;
                left = portalRect.left;
                transform = 'translateY(-100%)';
                break;
            case 'top-right':
                top = portalRect.top - offset;
                left = portalRect.left + portalRect.width;
                transform = 'translate(-100%, -100%)';
                break;
            default:
                top = portalRect.top + portalRect.height + offset;
                left = portalRect.left + portalRect.width / 2;
                transform = 'translateX(-50%)';
        }
        const { createPortal } = require('react-dom');
        return createPortal(
            <div style={{
                position: 'fixed', top, left, transform,
                zIndex: 99999, pointerEvents: 'none',
                backgroundColor: backgroundColor as string,
                borderRadius: tooltipStyle === 'custom' ? 0 : 8,
                paddingTop: tooltipStyle === 'custom' ? 0 : currentSize.paddingVertical,
                paddingBottom: tooltipStyle === 'custom' ? 0 : currentSize.paddingVertical,
                paddingLeft: tooltipStyle === 'custom' ? 0 : currentSize.paddingHorizontal,
                paddingRight: tooltipStyle === 'custom' ? 0 : currentSize.paddingHorizontal,
                maxWidth: 200, width: 'max-content',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                whiteSpace: 'pre-wrap', wordWrap: 'break-word',
                fontSize: currentSize.fontSize,
                color: '#fff',
                fontFamily: 'Inter_400Regular',
                lineHeight: currentSize.fontSize * 1.5 + 'px',
            }}>
                {typeof content === 'string' ? content : <span>{content}</span>}
            </div>,
            document.body
        );
    };

    return (
        <View style={[{ position: 'relative', zIndex: shouldShow ? 9999 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}>
            <Pressable
                ref={triggerRef}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onLayout={handleLayout}
                {...(Platform.OS === 'web' ? {
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    style: { cursor: 'pointer', width: fullWidth ? '100%' : 'auto' } as any
                } : {})}
            >
                {children}
            </Pressable>

            {/* Web: portal at document.body to escape stacking contexts */}
            {Platform.OS === 'web' && renderWebPortal()}

            {/* Native: absolute positioned within wrapper */}
            {Platform.OS !== 'web' && shouldShow && (
                <View
                    style={[
                        {
                            ...tooltipBoxStyle,
                            position: 'absolute',
                            zIndex: 9999,
                            ...Platform.select({
                                ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
                                android: { elevation: 5 },
                            }),
                        },
                        getTooltipPosition(),
                    ]}
                    pointerEvents="none"
                >
                    {tooltipContent}
                </View>
            )}
        </View>
    );
}
