import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, View, ViewStyle } from 'react-native';
import { Box, Text } from './primitives';
import { Button } from './Button';

export type TooltipOnboardingVariant = 
    | 'top-left' | 'top-center' | 'top-right' 
    | 'bottom-left' | 'bottom-center' | 'bottom-right'
    | 'left-top' | 'left-center' | 'left-bottom'
    | 'right-top' | 'right-center' | 'right-bottom';

export type TooltipOnboardingSize = 'sm' | 'md' | 'lg';
export type TooltipOnboardingStyle = 'default' | 'success' | 'custom';

export interface TooltipOnboardingProps {
    variant?: TooltipOnboardingVariant;
    size?: TooltipOnboardingSize;
    tooltipStyle?: TooltipOnboardingStyle;
    content?: string | React.ReactNode;
    
    // Rich content props (from Figma)
    title?: string;
    description?: string;
    step?: string;
    ctaText?: string;
    onCtaPress?: () => void;
    
    children: React.ReactNode;
    forceShow?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    fullWidth?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    animatedOpacity?: any; // To support Animated.Value fading
    trigger?: 'hover' | 'press';
}

const sizeConfig = {
    sm: { paddingVertical: 12, paddingHorizontal: 12, fontSize: 12 },
    md: { paddingVertical: 16, paddingHorizontal: 16, fontSize: 14 },
    lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 16 },
};

function getArrowStyle(variant: TooltipOnboardingVariant, bgColor: string): ViewStyle {
    const size = 24;
    const offset = -(size / 2);
    let radiusStyle: ViewStyle = {};
    if (variant.startsWith('top')) {
        radiusStyle = { borderBottomRightRadius: 4 }; // points DOWN
    } else if (variant.startsWith('bottom')) {
        radiusStyle = { borderTopLeftRadius: 4 }; // points UP
    } else if (variant.startsWith('left')) {
        radiusStyle = { borderTopRightRadius: 4 }; // points RIGHT
    } else if (variant.startsWith('right')) {
        radiusStyle = { borderBottomLeftRadius: 4 }; // points LEFT
    }

    const baseStyle: ViewStyle = {
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: bgColor,
        ...radiusStyle,
        transform: [{ rotate: '45deg' }],
    };

    switch (variant) {
        case 'top-left': return { ...baseStyle, bottom: offset, left: 16 };
        case 'top-center': return { ...baseStyle, bottom: offset, left: '50%', marginLeft: offset };
        case 'top-right': return { ...baseStyle, bottom: offset, right: 16 };
        
        case 'bottom-left': return { ...baseStyle, top: offset, left: 16 };
        case 'bottom-center': return { ...baseStyle, top: offset, left: '50%', marginLeft: offset };
        case 'bottom-right': return { ...baseStyle, top: offset, right: 16 };

        case 'left-top': return { ...baseStyle, right: offset, top: 16 };
        case 'left-center': return { ...baseStyle, right: offset, top: '50%', marginTop: offset };
        case 'left-bottom': return { ...baseStyle, right: offset, bottom: 16 };

        case 'right-top': return { ...baseStyle, left: offset, top: 16 };
        case 'right-center': return { ...baseStyle, left: offset, top: '50%', marginTop: offset };
        case 'right-bottom': return { ...baseStyle, left: offset, bottom: 16 };
        
        default: return { ...baseStyle, bottom: offset, left: '50%', marginLeft: offset };
    }
}

function RichTooltipContent({ 
    title, 
    description, 
    step, 
    ctaText, 
    onCtaPress, 
    content, 
    size, 
    variant, 
    bgColor 
}: any) {
    const theme = useTheme<Theme>();
    const currentSize = sizeConfig[size as TooltipOnboardingSize];

    return (
        <Box 
            style={{ 
                backgroundColor: bgColor, 
                borderRadius: 16, 
                padding: 16,
                width: 260,
                ...Platform.select({
                    web: { boxShadow: '0px 5px 12.5px rgba(0,0,0,0.05)' } as any,
                    default: { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 12 }
                })
            }}
        >
            <View style={getArrowStyle(variant, bgColor)} />

            {content && !title && !description ? (
                typeof content === 'string' ? (
                    <Text style={{ color: theme.colors.white, fontSize: currentSize.fontSize, lineHeight: currentSize.fontSize * 1.5 }}>
                        {content}
                    </Text>
                ) : content
            ) : (
                <Box style={{ gap: 16 }}>
                    <Box style={{ gap: 6 }}>
                        {title && (
                            <Text style={{ color: theme.colors.white, fontSize: 16, fontWeight: '600', lineHeight: 21 }}>
                                {title}
                            </Text>
                        )}
                        {description && (
                            <Text style={{ color: theme.colors.white, fontSize: 14, fontWeight: '400', lineHeight: 16, letterSpacing: 0.28 }}>
                                {description}
                            </Text>
                        )}
                    </Box>

                    {(step || ctaText) && (
                        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ gap: 16 }}>
                            <Box flex={1}>
                                {step && (
                                    <Text style={{ color: '#F7F8FA', fontSize: 14, fontWeight: '400', letterSpacing: 0.28 }}>
                                        {step}
                                    </Text>
                                )}
                            </Box>
                            {ctaText && (
                                <Button
                                    variant="fill"
                                    color="secondary"
                                    size="sm"
                                    onPress={onCtaPress}
                                    style={{
                                        borderRadius: 50,
                                        height: 32,
                                        minHeight: 0,
                                    }}
                                >
                                    {ctaText}
                                </Button>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export function TooltipOnboarding({
    variant = 'top-center',
    size = 'md',
    tooltipStyle = 'default',
    content,
    title,
    description,
    step,
    ctaText,
    onCtaPress,
    children,
    forceShow = false,
    open,
    onOpenChange,
    fullWidth = false,
    disabled = false,
    style,
    animatedOpacity,
    trigger = 'hover',
}: TooltipOnboardingProps) {
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
            let animationFrameId: number;

            const updateRect = () => {
                const el = triggerRef.current as any;
                const node = el?._nativeTag ? null : el;
                const domEl = node ?? (el?.getDOMNode ? el.getDOMNode() : null);
                if (domEl && domEl.getBoundingClientRect) {
                    const rect = domEl.getBoundingClientRect();
                    setPortalRect(prev => {
                        if (!prev || prev.top !== rect.top || prev.left !== rect.left || prev.width !== rect.width || prev.height !== rect.height) {
                            return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
                        }
                        return prev;
                    });
                }
                animationFrameId = requestAnimationFrame(updateRect);
            };

            updateRect();

            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [forceShow, isVisible]);

    const handlePressIn = () => { if (!disabled && trigger !== 'press') setIsVisible(true); };
    const handlePressOut = () => { if (!disabled && trigger !== 'press') setIsVisible(false); };
    const handlePress = () => { if (!disabled && trigger === 'press') setIsVisible(!isVisible); };
    const handleMouseEnter = () => { if (Platform.OS === 'web' && !disabled && trigger !== 'press') setIsVisible(true); };
    const handleMouseLeave = () => { if (Platform.OS === 'web' && !disabled && trigger !== 'press') setIsVisible(false); };

    const handleLayout = (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setLayout({ x, y, width, height });
    };

    const shouldShow = (forceShow || isVisible) && !disabled;

    const backgroundColor =
        tooltipStyle === 'success' ? theme.colors.secondaryGreen :
        tooltipStyle === 'custom' ? 'transparent' : theme.colors.black;

    const getTooltipPositionNative = (): ViewStyle => {
        const offset = 20;
        switch (variant) {
            case 'top-left': return { bottom: layout.height + offset, left: 0 };
            case 'top-center': return { bottom: layout.height + offset, left: '50%', transform: [{ translateX: '-50%' as any }] };
            case 'top-right': return { bottom: layout.height + offset, right: 0 };
            case 'bottom-left': return { top: layout.height + offset, left: 0 };
            case 'bottom-center': return { top: layout.height + offset, left: '50%', transform: [{ translateX: '-50%' as any }] };
            case 'bottom-right': return { top: layout.height + offset, right: 0 };
            case 'left-top': return { right: layout.width + offset, top: 0 };
            case 'left-center': return { right: layout.width + offset, top: '50%', transform: [{ translateY: '-50%' as any }] };
            case 'left-bottom': return { right: layout.width + offset, bottom: 0 };
            case 'right-top': return { left: layout.width + offset, top: 0 };
            case 'right-center': return { left: layout.width + offset, top: '50%', transform: [{ translateY: '-50%' as any }] };
            case 'right-bottom': return { left: layout.width + offset, bottom: 0 };
            default: return { bottom: layout.height + offset, left: '50%', transform: [{ translateX: '-50%' as any }] };
        }
    };

    const isRich = !!title || !!description || !!step || !!ctaText;

    const renderTooltipContent = () => {
        if (isRich) {
            return (
                <RichTooltipContent 
                    title={title} description={description} 
                    step={step} ctaText={ctaText} onCtaPress={onCtaPress} 
                    content={content} size={size} variant={variant} bgColor={backgroundColor} 
                />
            );
        }

        // Simple Tooltip logic
        const currentSize = sizeConfig[size];
        return (
            <View style={{
                backgroundColor,
                borderRadius: tooltipStyle === 'custom' ? 0 : 16,
                paddingVertical: tooltipStyle === 'custom' ? 0 : currentSize.paddingVertical,
                paddingHorizontal: tooltipStyle === 'custom' ? 0 : currentSize.paddingHorizontal,
                maxWidth: 200,
                ...Platform.select({
                    web: { boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } as any,
                    default: { elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 }
                })
            }}>
                <View style={getArrowStyle(variant, backgroundColor)} />
                {typeof content === 'string' ? (
                    <Text style={{ color: theme.colors.white, fontSize: currentSize.fontSize, fontFamily: 'Inter_400Regular', lineHeight: currentSize.fontSize * 1.5 }}>
                        {content}
                    </Text>
                ) : content}
            </View>
        );
    };

    const renderWebPortal = () => {
        if (!shouldShow || !portalRect) return null;
        const offset = 20;
        let top = 0, left = 0;
        let transform = '';

        switch (variant) {
            case 'top-left': top = portalRect.top - offset; left = portalRect.left; transform = 'translateY(-100%)'; break;
            case 'top-center': top = portalRect.top - offset; left = portalRect.left + portalRect.width / 2; transform = 'translate(-50%, -100%)'; break;
            case 'top-right': top = portalRect.top - offset; left = portalRect.left + portalRect.width; transform = 'translate(-100%, -100%)'; break;
            case 'bottom-left': top = portalRect.top + portalRect.height + offset; left = portalRect.left; break;
            case 'bottom-center': top = portalRect.top + portalRect.height + offset; left = portalRect.left + portalRect.width / 2; transform = 'translateX(-50%)'; break;
            case 'bottom-right': top = portalRect.top + portalRect.height + offset; left = portalRect.left + portalRect.width; transform = 'translateX(-100%)'; break;
            case 'left-top': top = portalRect.top; left = portalRect.left - offset; transform = 'translateX(-100%)'; break;
            case 'left-center': top = portalRect.top + portalRect.height / 2; left = portalRect.left - offset; transform = 'translate(-100%, -50%)'; break;
            case 'left-bottom': top = portalRect.top + portalRect.height; left = portalRect.left - offset; transform = 'translate(-100%, -100%)'; break;
            case 'right-top': top = portalRect.top; left = portalRect.left + portalRect.width + offset; break;
            case 'right-center': top = portalRect.top + portalRect.height / 2; left = portalRect.left + portalRect.width + offset; transform = 'translateY(-50%)'; break;
            case 'right-bottom': top = portalRect.top + portalRect.height; left = portalRect.left + portalRect.width + offset; transform = 'translateY(-100%)'; break;
            default: top = portalRect.top - offset; left = portalRect.left + portalRect.width / 2; transform = 'translate(-50%, -100%)';
        }

        const { createPortal } = require('react-dom');
        return createPortal(
            <Animated.View style={{
                position: 'fixed' as any,
                top, left, transform: transform as any,
                zIndex: 99999,
                opacity: animatedOpacity !== undefined ? animatedOpacity : 1,
                ...(trigger === 'hover' ? { pointerEvents: 'none' } : {})
            }}>
                {renderTooltipContent()}
            </Animated.View>,
            document.body
        );
    };

    return (
        <View style={[{ position: 'relative', zIndex: shouldShow ? 99999 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style]}>
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

            {Platform.OS === 'web' && renderWebPortal()}

            {Platform.OS !== 'web' && shouldShow && (
                <Animated.View
                    style={[
                        { position: 'absolute', zIndex: 99999, opacity: animatedOpacity !== undefined ? animatedOpacity : 1 },
                        getTooltipPositionNative(),
                    ]}
                    pointerEvents={trigger === 'hover' ? 'none' : 'auto'}
                >
                    {renderTooltipContent()}
                </Animated.View>
            )}
        </View>
    );
}
