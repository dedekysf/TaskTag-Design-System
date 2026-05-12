import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Activity, Folder, Hash, MessageSquare } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

const TABS = [
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'tasks', label: 'My Tasks', icon: Hash },
  { id: 'activity', label: 'Activity', icon: Activity },
];

function BottomNav({ activeTab, onTabChange }: {
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      backgroundColor="card"
      borderTopWidth={1}
      borderTopColor="border"
      style={{ height: 64 }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }}
          >
            <Icon
              size={24}
              color={isActive ? theme.colors.secondaryGreen : theme.colors.grey05}
              strokeWidth={2}
            />
            <Text
              style={{
                fontSize: 11,
                color: isActive ? theme.colors.secondaryGreen : theme.colors.grey05,
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Box>
  );
}

function BottomNavDemo() {
  const [active, setActive] = useState('tasks');
  return (
    <Box style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
      <BottomNav activeTab={active} onTabChange={setActive} />
    </Box>
  );
}

export default function BottomNavScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Bottom Navigation" totalItems={1} />

        <ComponentSection
          title="4-Tab Navigation"
          githubUrls={[]}
          usageCode={`import { MessageSquare, Folder, Hash, Activity } from 'lucide-react-native';

const TABS = [
  { id: 'chats', label: 'Chats', icon: MessageSquare },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'tasks', label: 'My Tasks', icon: Hash },
  { id: 'activity', label: 'Activity', icon: Activity },
];

const [activeTab, setActiveTab] = useState('tasks');

<Box flexDirection="row" backgroundColor="card"
  borderTopWidth={1} borderTopColor="border" style={{ height: 64 }}>
  {TABS.map(tab => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        <Icon size={24}
          color={isActive ? theme.colors.secondaryGreen : theme.colors.grey05}
          strokeWidth={2} />
        <Text style={{ fontSize: 11,
          color: isActive ? theme.colors.secondaryGreen : theme.colors.grey05,
          fontWeight: isActive ? '600' : '400' }}>
          {tab.label}
        </Text>
      </Pressable>
    );
  })}
</Box>`}
        >
          <BottomNavDemo />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
