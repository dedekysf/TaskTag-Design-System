import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Textarea } from '@/components/Textarea';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';

export default function TextareaScreen() {
    const [message, setMessage] = useState('');
    const [bio, setBio] = useState('');

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Textarea" totalItems={4} itemLabel="sections" />

                {/* Basic Textarea */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Basic</Text>
                    <Textarea
                        label="Message"
                        placeholder="Enter your message"
                        value={message}
                        onChangeText={setMessage}
                        rows={4}
                    />
                </Box>

                {/* Sizes */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Sizes</Text>
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

                {/* States */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">States</Text>
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

                {/* With Counter */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">With Character Counter</Text>
                    <Textarea
                        label="Bio"
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChangeText={setBio}
                        maxLength={500}
                        rows={5}
                    />
                </Box>

            </Box>
        </ScrollView>
    );
}
