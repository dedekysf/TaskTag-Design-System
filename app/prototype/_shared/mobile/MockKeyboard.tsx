import { Text } from '@/components/primitives';
import React from 'react';
import { Pressable, View } from 'react-native';

// pressedKey values: uppercase letter ('A'..'Z'), 'BACKSPACE', 'SPACE', 'DONE', '123'
// For decorative (non-interactive) use, pass pressedKey={null} and onKeyTap={() => {}}
export function MockKeyboard({
  pressedKey = null,
  onKeyTap = () => {},
}: {
  pressedKey?: string | null;
  onKeyTap?: (key: string) => void;
}) {
  const letterBg  = (ch: string) => pressedKey === ch ? '#6a6a6a' : '#434343';
  const specialBg = (id: string) => pressedKey === id ? '#7a7a7a' : '#5a5a5a';

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 291, backgroundColor: '#171717', zIndex: 42 } as any}>
      {/* QuickType suggestions bar */}
      <View style={{ height: 43, flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)' } as any}>
        {['Create', '"Home"', 'New'].map((word, i) => (
          <View key={word} style={{ flex: 1, height: 43, alignItems: 'center', justifyContent: 'center', borderRightWidth: i < 2 ? 0.5 : 0, borderRightColor: 'rgba(255,255,255,0.15)' } as any}>
            <Text style={{ color: '#fff', fontSize: 16 }}>{word}</Text>
          </View>
        ))}
      </View>

      {/* Rows 1 & 2 */}
      {['QWERTYUIOP', 'ASDFGHJKL'].map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 3 } as any}>
          {row.split('').map(char => (
            <Pressable
              key={char}
              onPress={() => onKeyTap(char)}
              style={{ flex: 1, height: 43, backgroundColor: letterBg(char), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
            >
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '400' }}>{char}</Text>
            </Pressable>
          ))}
        </View>
      ))}

      {/* Row 3: Shift + ZXCVBNM + Backspace */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 3 } as any}>
        <View style={{ width: 42, height: 43, backgroundColor: '#5a5a5a', borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 17 }}>⇧</Text>
        </View>
        {['Z','X','C','V','B','N','M'].map(char => (
          <Pressable
            key={char}
            onPress={() => onKeyTap(char)}
            style={{ flex: 1, height: 43, backgroundColor: letterBg(char), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
          >
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '400' }}>{char}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => onKeyTap('BACKSPACE')}
          style={{ width: 42, height: 43, backgroundColor: specialBg('BACKSPACE'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 17 }}>⌫</Text>
        </Pressable>
      </View>

      {/* Bottom row */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 3 } as any}>
        <Pressable
          onPress={() => onKeyTap('123')}
          style={{ width: 44, height: 43, backgroundColor: specialBg('123'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 14 }}>123</Text>
        </Pressable>
        <Pressable
          onPress={() => onKeyTap('SPACE')}
          style={{ flex: 1, height: 43, backgroundColor: letterBg('SPACE'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>space</Text>
        </Pressable>
        <Pressable
          onPress={() => onKeyTap('DONE')}
          style={{ width: 88, height: 43, backgroundColor: specialBg('DONE'), borderRadius: 5, margin: 3, alignItems: 'center', justifyContent: 'center' } as any}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Done</Text>
        </Pressable>
      </View>

      {/* Home indicator */}
      <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
        <View style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 5 }} />
      </View>
    </View>
  );
}
