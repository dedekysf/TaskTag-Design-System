import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import {
  Building,
  ChevronLeft,
  ChevronRight,
  FileText,
  HardHat,
  Hash,
  ImageIcon,
  MoreVertical,
  Plus,
  UserPlus,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

export interface ProjectDetailScreenProps {
  onInvite?: () => void;
}

export function ProjectDetailScreen({ onInvite }: ProjectDetailScreenProps = {}) {
  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
          <ChevronLeft size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Text variant="mobileLargeLabel" color="foreground" style={{ flex: 1 }}>
          Project Details
        </Text>
        <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
          <MoreVertical size={20} color={TTTheme.colors.textPrimary} />
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F7F8FA' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 80 } as any}
      >
        {/* TODO(BE): GET /api/projects/:id — project.name, project.address, project.workspace, project.owner */}
        <View style={{ backgroundColor: '#7B61FF', borderRadius: 8, padding: 16, gap: 16 } as any}>
          {/* Title + address */}
          <View style={{ gap: 4 } as any}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HardHat size={24} color="#fff" />
              <Text style={{ flex: 1, fontSize: 18, fontWeight: '700', lineHeight: 24 }} color="white">
                1520 Oliver Street
              </Text>
            </View>
            <Text variant="mobileMetadataPrimary" style={{ color: 'rgba(255,255,255,0.9)', paddingLeft: 32 }}>
              Houston, TX
            </Text>
          </View>
          {/* Tags */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {/* TODO(BE): project.workspace.name */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 24, height: 24, backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Building size={14} color="#fff" />
              </View>
              <Text variant="mobileMetadataPrimary" color="white">Personal Projects</Text>
            </View>
            {/* TODO(BE): project.owner.name + project.owner.avatar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Image source={require('@/assets/images/mj.png')} style={{ width: 24, height: 24, borderRadius: 12 }} resizeMode="cover" />
              <Text variant="mobileMetadataPrimary" color="white">Maria Jose</Text>
            </View>
          </View>
        </View>

        {/* TODO(BE): project.description */}
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12 } as any}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="mobileLabelEmphasized" color="foreground">Description</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">See More</Text>
          </View>
          <Text variant="mobileMetadataPrimary" color="foreground" numberOfLines={3}>
            Fix and upgrade kitchen sink to resolve leaks, improve drainage, and ensure proper water flow functionality.
          </Text>
        </View>

        {/* TODO(BE): GET /api/projects/:id/members — members list + count */}
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12 } as any}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="mobileLabelEmphasized" color="foreground">Member (1)</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">See All</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            {/* TODO(BE): action — POST /api/projects/:id/invites */}
            <Pressable onPress={onInvite} style={{ width: 56, alignItems: 'center', gap: 4 } as any}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F7F8FA', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={24} color={TTTheme.colors.grey04} />
              </View>
              <Text variant="mobileMetadataPrimary" color="grey04" style={{ textAlign: 'center' }}>Invite</Text>
            </Pressable>
            {/* TODO(BE): member.name + member.avatar */}
            <View style={{ width: 56, alignItems: 'center', gap: 4 } as any}>
              <Image source={require('@/assets/images/mj.png')} style={{ width: 56, height: 56, borderRadius: 28 }} resizeMode="cover" />
              <Text variant="mobileMetadataPrimary" color="grey04" style={{ textAlign: 'center' }} numberOfLines={1}>
                Maria J...
              </Text>
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <View style={{ width: 32, height: 32, backgroundColor: '#000', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, gap: 4 } as any}>
              <Text variant="mobileLabelEmphasized" color="foreground">Checklist</Text>
              <Text variant="mobileMetadataPrimary">Start faster with a project template.</Text>
            </View>
            <ChevronRight size={24} color={TTTheme.colors.textPrimary} />
          </View>
        </View>

        {/* Tasks */}
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <View style={{ width: 32, height: 32, backgroundColor: '#000', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <Hash size={20} color="#fff" />
            </View>
            <Text variant="mobileLabelEmphasized" color="foreground" style={{ flex: 1 }}>Tasks</Text>
            <ChevronRight size={24} color={TTTheme.colors.textPrimary} />
          </View>
        </View>

        {/* Activity Log + Files & Media */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12, minHeight: 95 } as any}>
            <View style={{ width: 32, height: 32, backgroundColor: '#000', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#fff" />
            </View>
            <Text variant="mobileLabelEmphasized" color="foreground">Activity Log</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12 } as any}>
            <View style={{ width: 32, height: 32, backgroundColor: '#000', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={20} color="#fff" />
            </View>
            <Text variant="mobileLabelEmphasized" color="foreground">{'Files & Media'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB — New Update */}
      <View style={{ position: 'absolute', bottom: 40, right: 17 } as any}>
        <View style={{ backgroundColor: '#000', borderRadius: 156, flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
          <Plus size={24} color="#fff" />
          <Text variant="button" style={{ color: '#fff' }}>New Update</Text>
        </View>
      </View>
    </>
  );
}
