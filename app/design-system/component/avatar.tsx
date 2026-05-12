import { Avatar } from '@/components/Avatar';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

const AVATAR_COLORS = ['pastelBlue', 'pastelMagenta', 'pastelOrange', 'pastelGreen', 'pastelYellow'];
const AVATAR_INITIALS = ['JH', 'SM', 'TC', 'LP', 'RK'];

function AvatarGroupDemo({ count, size }: { count: number; size: 'sm' | 'xs' }) {
  const theme = useTheme<Theme>();
  const numericSize = size === 'sm' ? 32 : 24;
  const overlap = size === 'sm' ? 10 : 8;
  const visible = Math.min(count, 4);
  const extra = count - visible;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {AVATAR_INITIALS.slice(0, visible).map((initials, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: visible - i }}>
          <Avatar
            type="text"
            initials={initials}
            color={AVATAR_COLORS[i] as any}
            size={size}
          />
        </View>
      ))}
      {extra > 0 && (
        <View
          style={{
            marginLeft: -overlap, zIndex: 0,
            width: numericSize, height: numericSize, borderRadius: numericSize / 2,
            backgroundColor: theme.colors.grey04,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: numericSize * 0.32 }}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}

export default function AvatarScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Avatar" totalItems={4} />

                {/* 1. Image */}
                <ComponentSection
                    title="Image"
                    githubUrls={[{ label: 'Avatar', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Avatar.tsx' }]}
                    usageCode={`<Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="lg" />
<Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="md" />
<Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="sm" />
<Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="xs" />`}
                >
                    <Box flexDirection="row" alignItems="center" gap="md" padding="md">
                        <Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="lg" />
                        <Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="md" />
                        <Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="sm" />
                        <Avatar type="photo" src={require('@/assets/images/sample-two.jpg')} size="xs" />
                    </Box>
                </ComponentSection>

                {/* 2. Initial Name */}
                <ComponentSection
                    title="Initial Name"
                    githubUrls={[{ label: 'Avatar', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Avatar.tsx' }]}
                    usageCode={`<Avatar type="text" initials="LS" color="pastelMagenta" size="lg" />
<Avatar type="text" initials="LS" color="pastelMagenta" size="md" />
<Avatar type="text" initials="LS" color="pastelMagenta" size="sm" />
<Avatar type="text" initials="LS" color="pastelMagenta" size="xs" />`}
                >
                    <Box flexDirection="row" alignItems="center" gap="md" padding="md">
                        <Avatar type="text" initials="LS" color="pastelMagenta" size="lg" />
                        <Avatar type="text" initials="LS" color="pastelMagenta" size="md" />
                        <Avatar type="text" initials="LS" color="pastelMagenta" size="sm" />
                        <Avatar type="text" initials="LS" color="pastelMagenta" size="xs" />
                    </Box>
                </ComponentSection>

                {/* 3. Icon */}
                <ComponentSection
                    title="Icon"
                    githubUrls={[{ label: 'Avatar', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Avatar.tsx' }]}
                    usageCode={`import { User } from 'lucide-react-native';

<Avatar type="icon" icon={User} color="blue" size="lg" />
<Avatar type="icon" icon={User} color="blue" size="md" />
<Avatar type="icon" icon={User} color="blue" size="sm" />
<Avatar type="icon" icon={User} color="blue" size="xs" />`}
                >
                    <Box flexDirection="row" alignItems="center" gap="md" padding="md">
                        <Avatar type="icon" icon={User} color="blue" size="lg" />
                        <Avatar type="icon" icon={User} color="blue" size="md" />
                        <Avatar type="icon" icon={User} color="blue" size="sm" />
                        <Avatar type="icon" icon={User} color="blue" size="xs" />
                    </Box>
                </ComponentSection>

                {/* 4. Avatar Group */}
                <ComponentSection
                    title="Avatar Group"
                    githubUrls={[{ label: 'Avatar', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Avatar.tsx' }]}
                    usageCode={`// Overlapping avatars with +N overflow indicator
// Used in project member lists and task assignee displays

const COLORS = ['pastelBlue', 'pastelMagenta', 'pastelOrange', 'pastelGreen'];
const MEMBERS = [{ initials: 'JH' }, { initials: 'SM' }, { initials: 'TC' }];
const extra = totalCount - MEMBERS.length;

<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  {MEMBERS.map((m, i) => (
    <View key={i} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: MEMBERS.length - i }}>
      <Avatar type="text" initials={m.initials} color={COLORS[i]} size="sm" />
    </View>
  ))}
  {extra > 0 && (
    <View style={{ marginLeft: -10, width: 32, height: 32, borderRadius: 16,
      backgroundColor: theme.colors.grey04, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 11 }}>+{extra}</Text>
    </View>
  )}
</View>`}
                >
                    <Box gap="md" padding="md">
                        <Box flexDirection="row" alignItems="center" gap="xl">
                            <AvatarGroupDemo count={3} size="sm" />
                            <AvatarGroupDemo count={5} size="sm" />
                            <AvatarGroupDemo count={12} size="sm" />
                        </Box>
                        <Box flexDirection="row" alignItems="center" gap="xl">
                            <AvatarGroupDemo count={3} size="xs" />
                            <AvatarGroupDemo count={5} size="xs" />
                            <AvatarGroupDemo count={12} size="xs" />
                        </Box>
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
