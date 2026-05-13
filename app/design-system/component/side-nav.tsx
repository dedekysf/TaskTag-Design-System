import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Activity, ArrowRight, ChevronsLeft, ChevronsRight, Folder, Hash, HelpCircle, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const MENU_ITEMS = [
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'my-tasks', label: 'My Tasks', icon: Hash },
  { id: 'global-activity', label: 'Global Activity', icon: Activity },
  { id: 'contacts', label: 'Contacts', icon: Users },
];

function NavItem({ item, isActive, isExpanded, onPress }: {
  item: typeof MENU_ITEMS[0];
  isActive: boolean;
  isExpanded: boolean;
  onPress: () => void;
}) {
  const theme = useTheme<Theme>();
  const Icon = item.icon;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center',
        gap: isExpanded ? 16 : 0,
        paddingHorizontal: 16, paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: isActive
          ? theme.colors.lightMint
          : pressed ? theme.colors.grey03 : 'transparent',
        justifyContent: isExpanded ? 'flex-start' : 'center',
      })}
    >
      <Icon size={24} color={isActive ? theme.colors.secondaryGreen : theme.colors.foreground} strokeWidth={2} />
      {isExpanded && (
        <Text style={{
          fontSize: 13, fontWeight: '500',
          color: isActive ? theme.colors.secondaryGreen : theme.colors.foreground,
        }}>
          {item.label}
        </Text>
      )}
    </Pressable>
  );
}

function SideNav({ defaultExpanded = true }: { defaultExpanded?: boolean }) {
  const theme = useTheme<Theme>();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [active, setActive] = useState('projects');

  return (
    <View style={{
      width: isExpanded ? 240 : 80,
      backgroundColor: theme.colors.grey02,
      height: 480,
      borderRadius: 12,
      padding: 16,
      gap: 24,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {isExpanded && (
          <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.foreground }}>
            TaskTag
          </Text>
        )}
        <Pressable onPress={() => setIsExpanded(v => !v)}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          {isExpanded
            ? <ChevronsLeft size={24} color={theme.colors.grey05} />
            : <ChevronsRight size={24} color={theme.colors.grey05} />}
        </Pressable>
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        {MENU_ITEMS.map(item => (
          <NavItem
            key={item.id}
            item={item}
            isActive={active === item.id}
            isExpanded={isExpanded}
            onPress={() => setActive(item.id)}
          />
        ))}
      </View>

      <View style={{ gap: 8 }}>
        {isExpanded && (
          <View style={{
            backgroundColor: '#fff', borderRadius: 8, padding: 16, gap: 12, overflow: 'hidden',
          }}>
            <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.foreground }}>
              Find All Product Guides Here
            </Text>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.secondaryGreen }}>
                Explore
              </Text>
              <ArrowRight size={16} color={theme.colors.secondaryGreen} strokeWidth={2} />
            </Pressable>
          </View>
        )}

        <View style={{ height: 1, backgroundColor: theme.colors.grey03 }} />

        <Pressable
          onPress={() => setActive('help')}
          style={({ pressed }) => ({
            flexDirection: 'row', alignItems: 'center',
            gap: isExpanded ? 16 : 0,
            paddingHorizontal: 16, paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: active === 'help' ? theme.colors.lightMint : pressed ? theme.colors.grey03 : 'transparent',
            justifyContent: isExpanded ? 'flex-start' : 'center',
          })}
        >
          <HelpCircle size={24} color={active === 'help' ? theme.colors.secondaryGreen : theme.colors.foreground} strokeWidth={2} />
          {isExpanded && (
            <Text style={{ fontSize: 13, fontWeight: '500', color: active === 'help' ? theme.colors.secondaryGreen : theme.colors.foreground }}>
              Help
            </Text>
          )}
        </Pressable>

        <Pressable
          style={{
            flexDirection: 'row', alignItems: 'center', gap: isExpanded ? 8 : 0,
            paddingHorizontal: isExpanded ? 8 : 16, paddingVertical: 8,
            borderRadius: 8, justifyContent: isExpanded ? 'flex-start' : 'center',
          }}
        >
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: '#93c5fd', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>JH</Text>
          </View>
          {isExpanded && (
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground }}>
              My Profile
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function SideNavScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Side Navigation" totalItems={2} />

        <ComponentSection
          title="Expanded"
          githubUrls={[]}
          usageCode={`<SideNav defaultExpanded={true} />`}
        >
          <Box padding="md">
            <SideNav defaultExpanded={true} />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Collapsed"
          githubUrls={[]}
          usageCode={`<SideNav defaultExpanded={false} />`}
        >
          <Box padding="md">
            <SideNav defaultExpanded={false} />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
