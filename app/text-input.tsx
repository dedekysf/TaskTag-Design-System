import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
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
                <PageHeader title="Text Input" totalItems={4} itemLabel="sections" />

                {/* Basic Inputs */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Basic</Text>
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

                {/* Sizes */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Sizes</Text>
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

                {/* States */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">States</Text>
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

                {/* With Counter */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">With Character Counter</Text>
                    <TextInput
                        label="Username"
                        placeholder="Enter username"
                        maxLength={20}
                        showCounter
                    />
                </Box>

            </Box>
        </ScrollView>
    );
}
