import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import { Textarea } from '@/components/Textarea';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function TextareaScreen() {
  const [message, setMessage] = useState('');
  const [bio, setBio] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Textarea" totalItems={4} />

        {/* Basic Textarea */}
        <ComponentSection
          title="Basic"
          githubUrls={[{ label: 'Textarea', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Textarea.tsx' }]}
          usageCode={`export default function Example() {
  const [message, setMessage] = useState('');

  return (
    <Textarea
      label="Message"
      placeholder="Enter your message"
      value={message}
      onChangeText={setMessage}
      rows={4}
    />
  );
}`}
        >
          <Textarea
            label="Message"
            placeholder="Enter your message"
            value={message}
            onChangeText={setMessage}
            rows={4}
          />
        </ComponentSection>

        {/* Sizes */}
        <ComponentSection
          title="Sizes"
          githubUrls={[{ label: 'Textarea', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Textarea.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-4">
      {/* Small */}
      <Textarea
        label="Small Textarea"
        placeholder="Small size"
        size="sm"
        rows={3}
      />
      {/* Medium */}
      <Textarea
        label="Medium Textarea"
        placeholder="Medium size"
        size="md"
        rows={4}
      />
    </div>
  );
}`}
        >
          <Box gap="md">
            <Textarea
              label="Small Textarea"
              placeholder="Small size"
              size="sm"
              rows={3}
            />
            <Textarea
              label="Medium Textarea"
              placeholder="Medium size"
              size="md"
              rows={4}
            />
          </Box>
        </ComponentSection>

        {/* States */}
        <ComponentSection
          title="States"
          githubUrls={[{ label: 'Textarea', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Textarea.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-4">
      <Textarea
        label="Required Field"
        placeholder="This field is required"
        required
        rows={3}
      />
      <Textarea
        label="With Error"
        placeholder="Enter description"
        errorMessage="Description is too short"
        value="Short"
        rows={3}
      />
      <Textarea
        label="Disabled"
        placeholder="Disabled textarea"
        disabled
        defaultValue="Cannot edit this text"
        rows={3}
      />
    </div>
  );
}`}
        >
          <Box gap="md">
            <Textarea
              label="Required Field"
              placeholder="This field is required"
              required
              rows={3}
            />
            <Textarea
              label="With Error"
              placeholder="Enter description"
              errorMessage="Description is too short"
              value="Short"
              rows={3}
            />
            <Textarea
              label="Disabled"
              placeholder="Disabled textarea"
              disabled
              value="Cannot edit this text"
              rows={3}
            />
          </Box>
        </ComponentSection>

        {/* With Counter */}
        <ComponentSection
          title="With Character Counter"
          githubUrls={[{ label: 'Textarea', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Textarea.tsx' }]}
          usageCode={`export default function Example() {
  const [bio, setBio] = useState('');

  return (
    <Textarea
      label="Bio"
      placeholder="Tell us about yourself"
      value={bio}
      onChangeText={setBio}
      maxLength={500}
      rows={5}
    />
  );
}`}
        >
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            maxLength={500}
            rows={5}
          />
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
