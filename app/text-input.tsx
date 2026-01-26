import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Mail, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function TextInputScreen() {
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Text Input" totalItems={4} />

        {/* Basic Inputs */}
        <ComponentSection
          title="Basic"
          githubUrls={[{ label: 'TextInput', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TextInput.tsx' }]}
          usageCode={`export default function Example() {
  const [email, setEmail] = useState('');

  return (
    <div className="flex gap-4">
      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        icon={Mail}
      />
      <TextInput
        label="Search"
        placeholder="Search..."
        icon={Search}
      />
    </div>
  );
}`}
        >
          <Box gap="md">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              icon={Mail}
              size="md"
            />
            <TextInput
              label="Search"
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
              icon={Search}
              size="md"
            />
          </Box>
        </ComponentSection>

        {/* Sizes */}
        <ComponentSection
          title="Sizes"
          githubUrls={[{ label: 'TextInput', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TextInput.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-4">
      {/* Small */}
      <TextInput
        label="Small Input"
        placeholder="Small size"
        size="sm"
      />
      {/* Medium */}
      <TextInput
        label="Medium Input"
        placeholder="Medium size"
        size="md"
      />
    </div>
  );
}`}
        >
          <Box gap="md">
            <TextInput
              label="Small Input"
              placeholder="Small size"
              size="sm"
            />
            <TextInput
              label="Medium Input"
              placeholder="Medium size"
              size="md"
            />
          </Box>
        </ComponentSection>

        {/* States */}
        <ComponentSection
          title="States"
          githubUrls={[{ label: 'TextInput', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TextInput.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-4">
      <TextInput
        label="Required Field"
        placeholder="This field is required"
        required
      />
      <TextInput
        label="With Error"
        placeholder="Enter valid email"
        errorMessage="Please enter a valid email address"
        value="invalid-email"
      />
      <TextInput
        label="Disabled"
        placeholder="Disabled input"
        disabled
        defaultValue="Cannot edit this"
      />
    </div>
  );
}`}
        >
          <Box gap="md">
            <TextInput
              label="Required Field"
              placeholder="This field is required"
              required
            />
            <TextInput
              label="With Error"
              placeholder="Enter valid email"
              errorMessage="Please enter a valid email address"
              value="invalid-email"
            />
            <TextInput
              label="Disabled"
              placeholder="Disabled input"
              disabled
              value="Cannot edit this"
            />
          </Box>
        </ComponentSection>

        {/* With Counter */}
        <ComponentSection
          title="With Character Counter"
          githubUrls={[{ label: 'TextInput', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/TextInput.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <TextInput
      label="Username"
      placeholder="Enter username"
      maxLength={20}
      showCounter
    />
  );
}`}
        >
          <TextInput
            label="Username"
            placeholder="Enter username"
            maxLength={20}
            showCounter
          />
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
