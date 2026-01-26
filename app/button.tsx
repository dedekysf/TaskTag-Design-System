import { Button } from '@/components/Button';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { ChevronLeft, ChevronRight, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function ButtonScreen() {
  const sizes = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

  const getIconSize = (size: string) => {
    switch (size) {
      case 'xl': return 24;
      case 'lg': return 24;
      case 'md': return 20;
      case 'sm': return 16;
      case 'xs': return 12;
      default: return 16;
    }
  };

  const getTextSize = (size: string) => {
    return size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 16 : size === 'xl' ? 18 : 16;
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Button" totalItems={3} />

        {/* Button Variants (Fill, Outline, Ghost) */}
        <ComponentSection
          title="Button Variants"
          githubUrls={[{ label: 'Button', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Button.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      {/* Fill */}
      <div className="flex gap-4">
        <Button variant="fill" color="primary">Primary</Button>
        <Button variant="fill" color="secondary">Black</Button>
        <Button variant="fill" color="destructive">Destructive</Button>
        <Button variant="fill" color="blue">Blue</Button>
        <Button variant="fill" color="primary" disabled>Disabled</Button>
      </div>
      
      {/* Outline */}
      <div className="flex gap-4">
        <Button variant="outline" color="primary">Primary</Button>
        <Button variant="outline" color="secondary">Black</Button>
        <Button variant="outline" color="destructive">Destructive</Button>
        <Button variant="outline" color="blue">Blue</Button>
        <Button variant="outline" color="primary" disabled>Disabled</Button>
      </div>

      {/* Ghost */}
      <div className="flex gap-4">
        <Button variant="ghost" color="primary">Primary</Button>
        <Button variant="ghost" color="secondary">Black</Button>
        <Button variant="ghost" color="destructive">Destructive</Button>
        <Button variant="ghost" color="blue">Blue</Button>
        <Button variant="ghost" color="primary" disabled>Disabled</Button>
      </div>
    </div>
  );
}`}
        >
          <Box gap="lg">
            {/* Fill */}
            <Box>
              <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282', fontSize: 12 }}>FILL</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                <Button variant="fill" color="primary" size="md">Primary</Button>
                <Button variant="fill" color="secondary" size="md">Black</Button>
                <Button variant="fill" color="destructive" size="md">Destructive</Button>
                <Button variant="fill" color="blue" size="md">Blue</Button>
                <Button variant="fill" color="primary" size="md" disabled>Disabled</Button>
              </View>
            </Box>

            {/* Outline */}
            <Box>
              <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282', fontSize: 12 }}>OUTLINE</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                <Button variant="outline" color="primary" size="md">Primary</Button>
                <Button variant="outline" color="secondary" size="md">Black</Button>
                <Button variant="outline" color="destructive" size="md">Destructive</Button>
                <Button variant="outline" color="blue" size="md">Blue</Button>
                <Button variant="outline" color="primary" size="md" disabled>Disabled</Button>
              </View>
            </Box>

            {/* Ghost */}
            <Box>
              <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282', fontSize: 12 }}>GHOST</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                <Button variant="ghost" color="primary" size="md">Primary</Button>
                <Button variant="ghost" color="secondary" size="md">Black</Button>
                <Button variant="ghost" color="destructive" size="md">Destructive</Button>
                <Button variant="ghost" color="blue" size="md">Blue</Button>
                <Button variant="ghost" color="primary" size="md" disabled>Disabled</Button>
              </View>
            </Box>
          </Box>
        </ComponentSection>

        {/* Rectangular Sizes */}
        <ComponentSection
          title="Rectangular Button"
          githubUrls={[{ label: 'Button', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Button.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      {/* Sizes: Use size prop (xl, lg, md, sm, xs) */}
      <div className="flex gap-4 items-center">
        <Button size="lg">Button</Button>
        <Button size="lg" leftIcon={<LeftIcon />}>Left Icon</Button>
        <Button size="lg" rightIcon={<RightIcon />}>Right Icon</Button>
        <Button size="lg" isIconOnly><UserIcon /></Button>
      </div>
    </div>
  );
}`}
        >
          <Box gap="lg">
            {sizes.map((size) => (
              <Box key={`rect-${size}`}>
                <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282', fontSize: 12 }}>{size.toUpperCase()}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Button variant="fill" color="secondary" size={size}>
                    Button
                  </Button>
                  <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8 }}>
                    <ChevronLeft size={getIconSize(size)} color="white" />
                    <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Left Icon</Text>
                  </Button>
                  <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8 }}>
                    <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Right Icon</Text>
                    <ChevronRight size={getIconSize(size)} color="white" />
                  </Button>
                  <Button variant="fill" color="secondary" size={size} isIconOnly>
                    <User size={getIconSize(size)} color="white" />
                  </Button>
                </View>
              </Box>
            ))}
          </Box>
        </ComponentSection>

        {/* Rounded Sizes */}
        <ComponentSection
          title="Rounded Button"
          githubUrls={[{ label: 'Button', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Button.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      {/* Use style={{ borderRadius: 9999 }} for rounded buttons */}
      <div className="flex gap-4 items-center">
        <Button size="lg" style={{ borderRadius: 9999 }}>Button</Button>
        <Button size="lg" leftIcon={<LeftIcon />} style={{ borderRadius: 9999 }}>Left Icon</Button>
        <Button size="lg" rightIcon={<RightIcon />} style={{ borderRadius: 9999 }}>Right Icon</Button>
        <Button size="lg" isIconOnly style={{ borderRadius: 9999 }}><UserIcon /></Button>
      </div>
    </div>
  );
}`}
        >
          <Box gap="lg">
            {sizes.map((size) => (
              <Box key={`round-${size}`}>
                <Text variant="label" marginBottom="sm" style={{ textTransform: 'uppercase', color: '#828282', fontSize: 12 }}>{size.toUpperCase()}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Button variant="fill" color="secondary" size={size} style={{ borderRadius: 9999 }}>
                    Button
                  </Button>
                  <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8, borderRadius: 9999 }}>
                    <ChevronLeft size={getIconSize(size)} color="white" />
                    <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Left Icon</Text>
                  </Button>
                  <Button variant="fill" color="secondary" size={size} style={{ flexDirection: 'row', gap: 8, borderRadius: 9999 }}>
                    <Text color="white" fontWeight="500" style={{ fontSize: getTextSize(size) }}>Right Icon</Text>
                    <ChevronRight size={getIconSize(size)} color="white" />
                  </Button>
                  <Button variant="fill" color="secondary" size={size} style={{ borderRadius: 9999 }} isIconOnly>
                    <User size={getIconSize(size)} color="white" />
                  </Button>
                </View>
              </Box>
            ))}
          </Box>
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
