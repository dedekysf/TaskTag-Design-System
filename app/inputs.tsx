
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Textarea } from '@/components/Textarea';
import { TextInput } from '@/components/TextInput';
import { Lock, Mail, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';


export default function InputsScreen() {
    const [text, setText] = useState('');
    const totalItems = 8; // 6 text inputs + 2 textareas = 8

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Input Components" totalItems={totalItems} />

                {/* TextInput */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">TextInput</Text>
                    <View style={{ gap: 16 }}>
                        <TextInput
                            label="Basic Input"
                            placeholder="Type something..."
                        />
                        <TextInput
                            label="With Icon"
                            placeholder="Search..."
                            icon={Search}
                        />
                        <TextInput
                            label="Email"
                            placeholder="name@example.com"
                            icon={Mail}
                            required
                        />
                        <TextInput
                            label="Password (Error State)"
                            placeholder="Enter password"
                            icon={Lock}
                            secureTextEntry
                            errorMessage="Password is too short"
                        />
                        <TextInput
                            label="With Counter"
                            placeholder="Limited text..."
                            maxLength={50}
                            showCounter
                        />
                        <TextInput
                            label="Disabled"
                            placeholder="Disabled input"
                            disabled
                        />
                    </View>
                </Box>

                {/* Textarea */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="md">Textarea</Text>
                    <View style={{ gap: 16 }}>
                        <Textarea
                            label="Description"
                            placeholder="Enter description..."
                            rows={4}
                        />
                        <Textarea
                            label="With Character Counter"
                            placeholder="Type longer text..."
                            maxLength={200}
                            onChangeText={setText}
                            value={text}
                        />
                    </View>
                </Box>
            </Box>
        </ScrollView>
    );
}
