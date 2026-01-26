import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { TabItem } from '@/components/TabItem';
import { TabPanel, TabsContainer } from '@/components/TabsContainer';
import { Bell, Home, Settings, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function TabScreen() {
  const [activeTab1, setActiveTab1] = useState('tab1');
  const [activeTab2, setActiveTab2] = useState('home');
  const [activeTab3, setActiveTab3] = useState('profile');

  const basicTabs = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  const iconTabs = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { value: 'settings', label: 'Settings', icon: Settings },
  ];

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Tab" totalItems={5} itemLabel="variants" />

        {/* Basic Tabs */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Basic Tabs</Text>
          <Text 
            variant="label" 
            marginBottom="sm" 
            style={{ textTransform: 'uppercase', color: '#828282' }}
          >
            DEFAULT
          </Text>
          <TabsContainer
            activeTab={activeTab1}
            onTabChange={setActiveTab1}
            tabs={basicTabs}
          >
            <TabPanel value="tab1" activeTab={activeTab1}>
              <Text variant="body">Content for Tab 1</Text>
            </TabPanel>
            <TabPanel value="tab2" activeTab={activeTab1}>
              <Text variant="body">Content for Tab 2</Text>
            </TabPanel>
            <TabPanel value="tab3" activeTab={activeTab1}>
              <Text variant="body">Content for Tab 3</Text>
            </TabPanel>
          </TabsContainer>
        </Box>

        {/* Tabs with Icons */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Tabs with Icons</Text>
          <Text 
            variant="label" 
            marginBottom="sm" 
            style={{ textTransform: 'uppercase', color: '#828282' }}
          >
            ICON LEFT
          </Text>
          <TabsContainer
            activeTab={activeTab2}
            onTabChange={setActiveTab2}
            tabs={iconTabs}
            variant="icon-left"
          >
            <TabPanel value="home" activeTab={activeTab2}>
              <Text variant="body">Home content goes here</Text>
            </TabPanel>
            <TabPanel value="notifications" activeTab={activeTab2}>
              <Text variant="body">You have 3 new notifications</Text>
            </TabPanel>
            <TabPanel value="settings" activeTab={activeTab2}>
              <Text variant="body">Settings panel</Text>
            </TabPanel>
          </TabsContainer>
        </Box>

        {/* Tab Sizes */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Tab Sizes</Text>
          {sizes.map((size) => (
            <Box key={size} marginBottom="lg">
              <Text 
                variant="label" 
                marginBottom="sm" 
                style={{ textTransform: 'uppercase', color: '#828282' }}
              >
                {size.toUpperCase()}
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
                  size={size}
                  isActive={true}
                  onPress={() => {}}
                />
                <TabItem
                  label="Tab 2"
                  size={size}
                  isActive={false}
                  onPress={() => {}}
                />
                <TabItem
                  label="Tab 3"
                  size={size}
                  isActive={false}
                  onPress={() => {}}
                />
              </View>
            </Box>
          ))}
        </Box>

        {/* Tab States */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Tab States</Text>
          <Text 
            variant="label" 
            marginBottom="sm" 
            style={{ textTransform: 'uppercase', color: '#828282' }}
          >
            STATES
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
              label="Active"
              size="md"
              isActive={true}
              onPress={() => {}}
            />
            <TabItem
              label="Default"
              size="md"
              isActive={false}
              onPress={() => {}}
            />
            <TabItem
              label="Disabled"
              size="md"
              isActive={false}
              disabled={true}
              onPress={() => {}}
            />
          </View>
        </Box>

        {/* Tabs with Badges */}
        <Box marginBottom="xl">
          <Text variant="h2" marginBottom="lg">Tabs with Badges</Text>
          <Text 
            variant="label" 
            marginBottom="sm" 
            style={{ textTransform: 'uppercase', color: '#828282' }}
          >
            WITH BADGES
          </Text>
          <TabsContainer
            activeTab={activeTab3}
            onTabChange={setActiveTab3}
            tabs={[
              { value: 'profile', label: 'Profile', icon: User },
              { value: 'messages', label: 'Messages', badge: '12' },
              { value: 'alerts', label: 'Alerts', badge: '99+' },
            ]}
            variant="icon-left"
          >
            <TabPanel value="profile" activeTab={activeTab3}>
              <Text variant="body">Profile information</Text>
            </TabPanel>
            <TabPanel value="messages" activeTab={activeTab3}>
              <Text variant="body">You have 12 unread messages</Text>
            </TabPanel>
            <TabPanel value="alerts" activeTab={activeTab3}>
              <Text variant="body">You have 99+ alerts</Text>
            </TabPanel>
          </TabsContainer>
        </Box>

      </Box>
    </ScrollView>
  );
}
