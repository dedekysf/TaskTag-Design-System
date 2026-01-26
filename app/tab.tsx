import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { TabItem } from '@/components/TabItem';
import { Bell, Home, Settings } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function TabScreen() {
  const [activeTab1, setActiveTab1] = useState('tab1');
  const [activeTab2, setActiveTab2] = useState('home');

  const basicTabs = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2', badge: '20' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  const iconTabs = [
    { value: 'home', label: 'Tab 1', icon: Home },
    { value: 'notifications', label: 'Tab 2', icon: Bell, badge: '20' },
    { value: 'settings', label: 'Tab 3', icon: Settings },
  ];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Tabs" totalItems={3} />

        {/* Basic Tabs */}
        <ComponentSection
          title="Basic"
          githubUrls={[
            {
              label: 'TabItem',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TabItem.tsx'
            },
            {
              label: 'TabsContainer',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TabsContainer.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-1" style={{ borderBottom: '1px solid var(--grey-03)' }}>
      {/* MD Size */}
      <TabItem
        variant="default"
        label="Tab 1"
        size="md"
        isActive={true}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 2"
        size="md"
        badge={20}
        isActive={false}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 3"
        size="md"
        isActive={false}
        onClick={() => {}}
      />

      {/* SM Size */}
      <TabItem
        variant="default"
        label="Tab 1"
        size="sm"
        isActive={true}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 2"
        size="sm"
        badge={20}
        isActive={false}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 3"
        size="sm"
        isActive={false}
        onClick={() => {}}
      />
    </div>
  );
}`}
        >
          <Box marginBottom="lg">
            <Text
              variant="label"
              marginBottom="sm"
              style={{ textTransform: 'uppercase', color: '#828282' }}
            >
              MD
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
              }}
            >
              <TabItem
                label="Tab 1"
                size="md"
                isActive={true}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 2"
                size="md"
                badge="20"
                isActive={false}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 3"
                size="md"
                isActive={false}
                onPress={() => { }}
              />
            </View>
          </Box>

          <Box>
            <Text
              variant="label"
              marginBottom="sm"
              style={{ textTransform: 'uppercase', color: '#828282' }}
            >
              SM
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
              }}
            >
              <TabItem
                label="Tab 1"
                size="sm"
                isActive={true}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 2"
                size="sm"
                badge="20"
                isActive={false}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 3"
                size="sm"
                isActive={false}
                onPress={() => { }}
              />
            </View>
          </Box>
        </ComponentSection>

        {/* Tabs with Icons */}
        <ComponentSection
          title="With Left Icon"
          githubUrls={[
            {
              label: 'TabItem',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TabItem.tsx'
            },
            {
              label: 'TabsContainer',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TabsContainer.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-1" style={{ borderBottom: '1px solid var(--grey-03)' }}>
      {/* MD Size */}
      <TabItem
        variant="default"
        label="Tab 1"
        size="md"
        icon={HomeIcon}
        isActive={true}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 2"
        size="md"
        icon={BellIcon}
        badge={20}
        isActive={false}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 3"
        size="md"
        icon={SettingsIcon}
        isActive={false}
        onClick={() => {}}
      />

      {/* SM Size */}
      <TabItem
        variant="default"
        label="Tab 1"
        size="sm"
        icon={HomeIcon}
        isActive={true}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 2"
        size="sm"
        icon={BellIcon}
        badge={20}
        isActive={false}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 3"
        size="sm"
        icon={SettingsIcon}
        isActive={false}
        onClick={() => {}}
      />
    </div>
  );
}`}
        >
          <Box marginBottom="lg">
            <Text
              variant="label"
              marginBottom="sm"
              style={{ textTransform: 'uppercase', color: '#828282' }}
            >
              MD
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
              }}
            >
              <TabItem
                label="Tab 1"
                size="md"
                icon={Home}
                isActive={true}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 2"
                size="md"
                icon={Bell}
                badge="20"
                isActive={false}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 3"
                size="md"
                icon={Settings}
                isActive={false}
                onPress={() => { }}
              />
            </View>
          </Box>

          <Box>
            <Text
              variant="label"
              marginBottom="sm"
              style={{ textTransform: 'uppercase', color: '#828282' }}
            >
              SM
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                borderBottomWidth: 1,
                borderBottomColor: '#e8e8e8',
              }}
            >
              <TabItem
                label="Tab 1"
                size="sm"
                icon={Home}
                isActive={true}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 2"
                size="sm"
                icon={Bell}
                badge="20"
                isActive={false}
                onPress={() => { }}
              />
              <TabItem
                label="Tab 3"
                size="sm"
                icon={Settings}
                isActive={false}
                onPress={() => { }}
              />
            </View>
          </Box>
        </ComponentSection>

        {/* Tab States */}
        <ComponentSection
          title="Disabled State"
          githubUrls={[
            {
              label: 'TabItem',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TabItem.tsx'
            },
            {
              label: 'TabsContainer',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TabsContainer.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-1" style={{ borderBottom: '1px solid var(--grey-03)' }}>
      <TabItem
        variant="default"
        label="Tab 1"
        size="md"
        icon={HomeIcon}
        isActive={true}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 2"
        size="md"
        icon={BellIcon}
        badge={20}
        isActive={false}
        onClick={() => {}}
      />
      <TabItem
        variant="default"
        label="Tab 3"
        size="md"
        icon={SettingsIcon}
        isActive={false}
        disabled={true}
        onClick={() => {}}
      />
    </div>
  );
}`}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              borderBottomWidth: 1,
              borderBottomColor: '#e8e8e8',
            }}
          >
            <TabItem
              label="Tab 1"
              size="md"
              icon={Home}
              isActive={true}
              onPress={() => { }}
            />
            <TabItem
              label="Tab 2"
              size="md"
              icon={Bell}
              badge="20"
              isActive={false}
              onPress={() => { }}
            />
            <TabItem
              label="Tab 3"
              size="md"
              icon={Settings}
              isActive={false}
              disabled={true}
              onPress={() => { }}
            />
          </View>
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
