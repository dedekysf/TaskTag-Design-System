import { Box, Text } from '@/components/primitives';
import { BatteryFull, Signal, Wifi } from 'lucide-react-native';

export function StatusBarRow() {
  return (
    <Box
      height={44}
      paddingHorizontal="16"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#000', letterSpacing: -0.3 }}>
        9:41
      </Text>
      <Box flexDirection="row" alignItems="center" style={{ gap: 5 } as any}>
        <Signal size={14} color="#000" strokeWidth={2.5} />
        <Wifi size={14} color="#000" strokeWidth={2.5} />
        <BatteryFull size={18} color="#000" strokeWidth={2} />
      </Box>
    </Box>
  );
}
