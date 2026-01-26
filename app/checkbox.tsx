import { Checkbox } from '@/components/Checkbox';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function CheckboxScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Checkbox" totalItems={3} />

        {/* Basic */}
        <ComponentSection
          title="Basic"
          githubUrls={[
            {
              label: 'Checkbox',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Checkbox.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-1" style={{ borderBottom: '1px solid var(--grey-03)' }}>
      {/* Circular */}
      <Checkbox
        variant="circular"
        checked={false}
        onChange={() => {}}
      />
      <Checkbox
        variant="circular"
        checked={true}
        onChange={() => {}}
      />

      {/* Rectangular */}
      <Checkbox
        variant="rectangular"
        checked={false}
        onChange={() => {}}
      />
      <Checkbox
        variant="rectangular"
        checked={true}
        onChange={() => {}}
      />
    </div>
  );
}`}
        >
          <Box flexDirection="row" gap="xl">
            <Box gap="md" alignItems="flex-start">
              <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>CIRCULAR</Text>
              <Checkbox checked={false} variant="circular" />
              <Checkbox checked={true} variant="circular" />
            </Box>
            <Box gap="md" alignItems="flex-start">
              <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>RECTANGULAR</Text>
              <Checkbox checked={false} variant="rectangular" />
              <Checkbox checked={true} variant="rectangular" />
            </Box>
          </Box>
        </ComponentSection>

        {/* With Label */}
        <ComponentSection
          title="With Label"
          githubUrls={[
            {
              label: 'Checkbox',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Checkbox.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-1">
      {/* Circular */}
      <div>
        <Checkbox
          variant="circular"
          label="Option 1"
          checked={false}
          onChange={() => {}}
        />
        <Checkbox
          variant="circular"
          label="Option 2"
          checked={true}
          onChange={() => {}}
        />
        <Checkbox
          variant="circular"
          label="Option 3"
          checked={false}
          onChange={() => {}}
        />
      </div>

      {/* Rectangular */}
      <div>
        <Checkbox
          variant="rectangular"
          label="Option 1"
          checked={false}
          onChange={() => {}}
        />
        <Checkbox
          variant="rectangular"
          label="Option 2"
          checked={true}
          onChange={() => {}}
        />
        <Checkbox
          variant="rectangular"
          label="Option 3"
          checked={false}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}`}
        >
          <Box flexDirection="row" gap="xl">
            <Box gap="sm" flex={1}>
              <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>CIRCULAR</Text>
              <Checkbox label="Option 1" checked={false} />
              <Checkbox label="Option 2" checked={true} />
              <Checkbox label="Option 3" checked={false} />
            </Box>
            <Box gap="sm" flex={1}>
              <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }}>RECTANGULAR</Text>
              <Checkbox label="Option 1" variant="rectangular" checked={false} />
              <Checkbox label="Option 2" variant="rectangular" checked={true} />
              <Checkbox label="Option 3" variant="rectangular" checked={false} />
            </Box>
          </Box>
        </ComponentSection>

        {/* States */}
        <ComponentSection
          title="States"
          githubUrls={[
            {
              label: 'Checkbox',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Checkbox.tsx'
            }
          ]}
          usageCode={`export default function Example() {
  return (
    <div>
      {/* Default State */}
      <div>
        <Checkbox
          variant="circular"
          label="Circular unchecked"
          checked={false}
          onChange={() => {}}
        />
        <Checkbox
          variant="circular"
          label="Circular checked"
          checked={true}
          onChange={() => {}}
        />
        <Checkbox
          variant="rectangular"
          label="Rectangular unchecked"
          checked={false}
          onChange={() => {}}
        />
        <Checkbox
          variant="rectangular"
          label="Rectangular checked"
          checked={true}
          onChange={() => {}}
        />
      </div>

      {/* Disabled State */}
      <div>
        <Checkbox
          variant="circular"
          label="Circular disabled"
          disabled
          checked={false}
          onChange={() => {}}
        />
        <Checkbox
          variant="circular"
          label="Circular disabled checked"
          disabled
          checked={true}
          onChange={() => {}}
        />
        <Checkbox
          variant="rectangular"
          label="Rectangular disabled"
          disabled
          checked={false}
          onChange={() => {}}
        />
        <Checkbox
          variant="rectangular"
          label="Rectangular disabled checked"
          disabled
          checked={true}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}`}
        >
          <Box>
            {/* Default State */}
            <Box marginBottom="lg">
              <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }} marginBottom="md">DEFAULT STATE</Text>
              <Box flexDirection="row" gap="xl">
                <Box gap="sm" flex={1}>
                  <Checkbox label="Circular unchecked" checked={false} />
                  <Checkbox label="Circular checked" checked={true} />
                </Box>
                <Box gap="sm" flex={1}>
                  <Checkbox label="Rectangular unchecked" variant="rectangular" checked={false} />
                  <Checkbox label="Rectangular checked" variant="rectangular" checked={true} />
                </Box>
              </Box>
            </Box>

            {/* Disabled State */}
            <Box>
              <Text variant="label" color="textSecondary" style={{ textTransform: 'uppercase' }} marginBottom="md">DISABLED STATE</Text>
              <Box flexDirection="row" gap="xl">
                <Box gap="sm" flex={1}>
                  <Checkbox label="Circular disabled" disabled checked={false} />
                  <Checkbox label="Circular disabled checked" disabled checked={true} />
                </Box>
                <Box gap="sm" flex={1}>
                  <Checkbox label="Rectangular disabled" variant="rectangular" disabled checked={false} />
                  <Checkbox label="Rectangular disabled checked" variant="rectangular" disabled checked={true} />
                </Box>
              </Box>
            </Box>
          </Box>
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
