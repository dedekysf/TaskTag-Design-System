import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import { SearchInput } from '@/components/SearchInput';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function SearchInputScreen() {
    const [query, setQuery] = useState('');

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Search Input" totalItems={1} />

                <ComponentSection
                    title="Default Usage"
                    githubUrls={[
                        {
                            label: 'SearchInput',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/SearchInput.tsx'
                        }
                    ]}
                    usageCode={`import { SearchInput } from '@/components/SearchInput';
import { useState } from 'react';

export default function Example() {
  const [query, setQuery] = useState('');
  return (
    <SearchInput 
      value={query} 
      onChangeText={setQuery} 
      placeholder="Search members..." 
      containerStyle={{ width: 300 }}
    />
  );
}`}
                >
                    <Box padding="md" width="100%" maxWidth={400}>
                        <SearchInput 
                            value={query} 
                            onChangeText={setQuery} 
                            placeholder="Search members or projects..." 
                        />
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
