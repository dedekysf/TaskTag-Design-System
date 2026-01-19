/**
 * Restyle Primitive Components
 * 
 * Base Box and Text components created with Shopify Restyle
 * These components provide type-safe styling props based on the theme.
 */

import { createBox, createText } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

export const Box = createBox<Theme>();
export const Text = createText<Theme>();
