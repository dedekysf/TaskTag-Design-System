import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MoreVertical, Plus, Search } from 'lucide-react-native';
import { Image, ScrollView, View } from 'react-native';

export function ChatsScreen() {
  return (
    <>
      <View style={{ backgroundColor: '#fff', paddingTop: 4, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image source={require('@/assets/images/tasktag-logo.png')} style={{ height: 32, width: 120 }} resizeMode="contain" />
          <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 16 } as any}>
          <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey01, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
            <Search size={20} color={TTTheme.colors.grey04} />
            <Text style={{ color: TTTheme.colors.grey04, fontSize: 16 }}>Search</Text>
          </View>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <MoreVertical size={24} color={TTTheme.colors.textPrimary} />
          </View>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 } as any}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#CC7351', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>TH</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: TTTheme.colors.textPrimary, fontWeight: '500', fontSize: 14, marginBottom: 2 }}>Tasktag Helpdesk</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                <Text style={{ flex: 1, color: TTTheme.colors.grey04, fontSize: 14, letterSpacing: 0.28 }} numberOfLines={1}>
                  Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.
                </Text>
                <Text style={{ color: TTTheme.colors.grey04, fontSize: 10, fontWeight: '500', flexShrink: 0 }}>Monday</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* FAB — bottom:109 = nav height(93) + right padding(16) */}
      <View style={{ position: 'absolute', right: 16, bottom: 109 }}>
        <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 } as any}>
          <Plus size={22} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>New Chat</Text>
        </View>
      </View>
    </>
  );
}
