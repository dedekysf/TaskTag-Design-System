import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Filter, Home, Map, Plus, Search } from 'lucide-react-native';
import { Image, ScrollView, View } from 'react-native';

export function ProjectsScreen() {
  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          <Text style={{ fontSize: 28, fontWeight: '600', color: TTTheme.colors.textPrimary }}>Projects</Text>
          <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey01, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
            <Search size={20} color={TTTheme.colors.grey04} />
            <Text style={{ color: TTTheme.colors.grey04, fontSize: 16 }}>Search</Text>
          </View>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Recent */}
        <View style={{ paddingTop: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', paddingHorizontal: 16, marginBottom: 12 }}>
            Recent
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 } as any}
          >
            <View style={{
              backgroundColor: '#fff', borderWidth: 1, borderColor: TTTheme.colors.grey02,
              borderRadius: 8, padding: 16, width: 230, gap: 16,
            } as any}>
              {/* Icon + title */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                <View style={{ width: 40, height: 40, backgroundColor: '#138EFF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={24} color="#fff" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary, flex: 1 }}>
                  Welcome to Tasktag!
                </Text>
              </View>
              {/* Tags */}
              <View style={{ gap: 4 } as any}>
                {/* Team tag */}
                <View style={{ backgroundColor: TTTheme.colors.grey01, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4, borderRadius: 4, alignSelf: 'flex-start' } as any}>
                  <View style={{ width: 24, height: 24, backgroundColor: '#000', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 12, height: 12, backgroundColor: '#555', borderRadius: 2 }} />
                  </View>
                  <Text style={{ fontSize: 12, color: '#303742' }}>Task Tag</Text>
                </View>
                {/* Owner tag */}
                <View style={{ backgroundColor: TTTheme.colors.grey01, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4, borderRadius: 4, alignSelf: 'flex-start' } as any}>
                  <Image source={require('@/assets/images/mj.png')} style={{ width: 24, height: 24, borderRadius: 12 }} resizeMode="cover" />
                  <Text style={{ fontSize: 12, color: '#303742' }}>Maria Jose</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Active projects */}
        <View style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Active projects</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 } as any}>
              <Filter size={20} color={TTTheme.colors.textPrimary} />
              <Map size={20} color={TTTheme.colors.textPrimary} />
            </View>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: TTTheme.colors.grey02, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                <View style={{ width: 40, height: 40, backgroundColor: '#138EFF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={24} color="#fff" />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.textPrimary }}>
                  Welcome to Tasktag!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB — bottom:109 = nav height(93) + right padding(16) */}
      <View style={{ position: 'absolute', right: 16, bottom: 109 } as any}>
        <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 } as any}>
          <Plus size={22} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>New Project</Text>
        </View>
      </View>
    </>
  );
}
