import { Avatar } from '@/components/Avatar';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import { User } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

export default function AvatarScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Avatar" totalItems={3} />

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

            </Box>
        </ScrollView>
    );
}
