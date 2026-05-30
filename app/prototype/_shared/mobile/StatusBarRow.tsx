import { Box, Text } from '@/components/primitives';
import { Wifi } from 'lucide-react-native';

export function StatusBarRow() {
  return (
    <Box height={44} paddingHorizontal="16" flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="white">
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#000', letterSpacing: -0.3 }}>9:41</Text>
      <Box flexDirection="row" alignItems="center" style={{ gap: 6 } as any}>
        <Box flexDirection="row" alignItems="flex-end" style={{ gap: 2, height: 11 } as any}>
          {[4, 6, 8, 11].map((h, i) => (
            <Box key={i} width={3} borderRadius="4" backgroundColor="black" style={{ height: h } as any} />
          ))}
        </Box>
        <Wifi size={14} color="#000" strokeWidth={2.5} />
        <Box flexDirection="row" alignItems="center">
          <Box style={{ width: 24, height: 12, borderRadius: 3, borderWidth: 1, borderColor: '#000', padding: 2 } as any}>
            <Box style={{ flex: 0.8, backgroundColor: '#000', borderRadius: 1 } as any} />
          </Box>
          <Box style={{ width: 2, height: 5, backgroundColor: '#000', borderRadius: 1, marginLeft: 1 } as any} />
        </Box>
      </Box>
    </Box>
  );
}
