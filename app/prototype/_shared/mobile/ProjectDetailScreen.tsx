import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  HardHat,
  Hash,
  MoreVertical,
  Plus,
  UserPlus,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

// Figma assets — expire ~7 days from 2026-05-30
const imgMj          = 'https://www.figma.com/api/mcp/asset/9b7a048f-1406-4261-bc24-0db61d33dc3b';
const imgIcFileImage = 'https://www.figma.com/api/mcp/asset/ff852498-5648-44f5-90d1-47eaf07616d9';

export interface ProjectDetailScreenProps {
  onInvite?: () => void;
}

export function ProjectDetailScreen({ onInvite }: ProjectDetailScreenProps = {}) {
  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 44, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: '500', color: TTTheme.colors.textPrimary, textAlign: 'center', lineHeight: 24 }}>
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
        {/* Project card */}
        <View style={{ backgroundColor: '#7B61FF', borderRadius: 8, padding: 16, gap: 16 } as any}>
          {/* Title + address */}
          <View style={{ gap: 4 } as any}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HardHat size={24} color="#fff" />
              <Text style={{ flex: 1, fontSize: 18, fontWeight: '700', color: '#fff', lineHeight: 24 }}>
                1520 Oliver Street
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 16, paddingLeft: 32 }}>
              Houston, TX
            </Text>
          </View>
          {/* Tags */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 24, height: 24, backgroundColor: '#000', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('@/assets/images/tasktag-logo.png')} style={{ width: 14, height: 14 }} resizeMode="contain" />
              </View>
              <Text style={{ fontSize: 12, color: '#fff' }}>Personal Projects</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ExpoImage source={{ uri: imgMj }} style={{ width: 24, height: 24, borderRadius: 12 }} contentFit="cover" />
              <Text style={{ fontSize: 12, color: '#fff' }}>Maria Jose</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12 } as any}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 }}>Description</Text>
            <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>See More</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#303742', lineHeight: 16, letterSpacing: 0.24 }} numberOfLines={3}>
            Fix and upgrade kitchen sink to resolve leaks, improve drainage, and ensure proper water flow functionality.
          </Text>
        </View>

        {/* Members */}
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12 } as any}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 }}>Member (1)</Text>
            <Text style={{ fontSize: 12, color: TTTheme.colors.grey04 }}>See All</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            {/* Invite */}
            <Pressable onPress={onInvite} style={{ width: 56, alignItems: 'center', gap: 4 } as any}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F7F8FA', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={24} color={TTTheme.colors.grey04} />
              </View>
              <Text style={{ fontSize: 12, color: TTTheme.colors.grey04, textAlign: 'center' }}>Invite</Text>
            </Pressable>
            {/* Maria Jose */}
            <View style={{ width: 56, alignItems: 'center', gap: 4 } as any}>
              <ExpoImage source={{ uri: imgMj }} style={{ width: 56, height: 56, borderRadius: 28 }} contentFit="cover" />
              <Text style={{ fontSize: 12, color: TTTheme.colors.grey04, textAlign: 'center' }} numberOfLines={1}>
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
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 }}>Checklist</Text>
              <Text style={{ fontSize: 12, color: '#303742', lineHeight: 16 }}>Start faster with a project template.</Text>
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
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 }}>Tasks</Text>
            <ChevronRight size={24} color={TTTheme.colors.textPrimary} />
          </View>
        </View>

        {/* Activity Log + Files & Media */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12, minHeight: 95 } as any}>
            <View style={{ width: 32, height: 32, backgroundColor: '#000', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#fff" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 }}>Activity Log</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 15, gap: 12 } as any}>
            <View style={{ width: 32, height: 32, backgroundColor: '#000', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
              <ExpoImage source={{ uri: imgIcFileImage }} style={{ width: 20, height: 20 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', lineHeight: 21 }}>{'Files & Media'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB — New Update */}
      <View style={{ position: 'absolute', bottom: 40, right: 17 } as any}>
        <View style={{ backgroundColor: '#000', borderRadius: 156, flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
          <Plus size={24} color="#fff" />
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff', lineHeight: 24 }}>New Update</Text>
        </View>
      </View>
    </>
  );
}
