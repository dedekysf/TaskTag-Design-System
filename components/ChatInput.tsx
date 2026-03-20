/**
 * ChatInput Component
 */

import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, View, Platform } from 'react-native';
import { Box, Text } from './primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Plus, Hash, File, Image, Smile, Send } from 'lucide-react-native';

export function ChatInput() {
  const theme = useTheme<Theme>();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const hasContent = inputValue.trim().length > 0;

  return (
    <Box
      padding="md"
      backgroundColor="background"
    >
      <Box
        borderWidth={1}
        borderColor={isFocused ? 'black' : 'grey03'}
        borderRadius="xl"
        padding="md"
        backgroundColor="background"
        minHeight={120}
        justifyContent="space-between"
      >
        <TextInput
          placeholder="Type message here..."
          placeholderTextColor="#9e9e9e"
          multiline
          value={inputValue}
          onChangeText={setInputValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[{
            fontSize: 16,
            fontFamily: 'Inter_400Regular',
            color: theme.colors.textPrimary,
            minHeight: 40,
            paddingTop: 0,
            borderWidth: 0,
          }, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
        />
        
        <Box 
            flexDirection="row" 
            alignItems="center" 
            justifyContent="space-between" 
            marginTop="md"
        >
          <Box flexDirection="row" alignItems="center" gap="lg">
            <Pressable>
              <Plus size={22} color="#9e9e9e" />
            </Pressable>
            <Pressable>
              <Hash size={22} color="#9e9e9e" />
            </Pressable>
            <Pressable>
              <File size={22} color="#9e9e9e" />
            </Pressable>
            <Pressable>
              <Image size={22} color="#9e9e9e" />
            </Pressable>
            <Pressable>
              <Smile size={22} color="#9e9e9e" />
            </Pressable>
          </Box>

          <Box
            backgroundColor={hasContent ? 'black' : 'grey05'}
            padding="sm"
            borderRadius="xl"
            alignItems="center"
            justifyContent="center"
          >
            <Send size={20} color={hasContent ? 'white' : 'white'} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
