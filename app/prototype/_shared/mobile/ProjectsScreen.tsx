import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Building, Filter, Home, Map, Plus, Search } from 'lucide-react-native';
import { Image, ScrollView, View } from 'react-native';

export function ProjectsScreen() {
  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
          {/* TODO(BE): screen title could be workspace name from GET /api/workspaces/current */}
          <Text style={{ fontSize: 28, fontWeight: '600' }} color="foreground">Projects</Text>
          {/* TODO(BE): GET /api/user/me — current user avatar */}
          <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
          <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
            <Search size={20} color={TTTheme.colors.grey04} />
            <Text variant="mobileBody" color="grey04">Search</Text>
          </View>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* TODO(BE): GET /api/projects?filter=recent — recent projects list */}
        <View style={{ paddingTop: 14 }}>
          <Text variant="mobileLabelEmphasized" color="foreground" style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            Recent
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16 } as any}
          >
            {/* TODO(BE): project.name, project.icon, project.workspace, project.owner */}
            <View style={{
              backgroundColor: '#fff', borderWidth: 1, borderColor: TTTheme.colors.grey02,
              borderRadius: 8, padding: 16, width: 230, gap: 16,
            } as any}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                <View style={{ width: 40, height: 40, backgroundColor: '#138EFF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={24} color="#fff" />
                </View>
                <Text variant="mobileLabelEmphasized" color="foreground" style={{ flex: 1 }}>
                  Welcome to Tasktag!
                </Text>
              </View>
              <View style={{ gap: 4 } as any}>
                {/* TODO(BE): project.workspace.name + project.workspace.logo */}
                <View style={{ backgroundColor: TTTheme.colors.grey02, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4, borderRadius: 4, alignSelf: 'flex-start' } as any}>
                  <View style={{ width: 24, height: 24, backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                    <Building size={14} color="#fff" />
                  </View>
                  <Text variant="mobileMetadataPrimary" color="foreground">Personal Projects</Text>
                </View>
                {/* TODO(BE): project.owner.name + project.owner.avatar */}
                <View style={{ backgroundColor: TTTheme.colors.grey02, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 4, borderRadius: 4, alignSelf: 'flex-start' } as any}>
                  <Image source={require('@/assets/images/mj.png')} style={{ width: 24, height: 24, borderRadius: 12 }} resizeMode="cover" />
                  <Text variant="mobileMetadataPrimary" color="foreground">Maria Jose</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* TODO(BE): GET /api/projects?filter=active — active projects list */}
        <View style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff' }}>
            <Text variant="mobileLabelEmphasized" color="foreground">Active projects</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 } as any}>
              <Filter size={20} color={TTTheme.colors.textPrimary} />
              <Map size={20} color={TTTheme.colors.textPrimary} />
            </View>
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {/* TODO(BE): project.name, project.icon */}
            <View style={{ borderBottomWidth: 1, borderBottomColor: TTTheme.colors.grey02, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
                <View style={{ width: 40, height: 40, backgroundColor: '#138EFF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={24} color="#fff" />
                </View>
                <Text variant="mobileLabelEmphasized" color="foreground">
                  Welcome to Tasktag!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <View style={{ position: 'absolute', right: 16, bottom: 109 } as any}>
        <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 } as any}>
          <Plus size={22} color="#fff" />
          {/* TODO(BE): action — POST /api/projects */}
          <Text variant="mobileBody" color="white">New Project</Text>
        </View>
      </View>
      {/* Home bar — fixed at bottom, white background */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
        <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
      </View>
    </>
  );
}
