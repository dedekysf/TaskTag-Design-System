import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Textarea } from '@/components/Textarea';
import { TextInput } from '@/components/TextInput';
import { Tooltip } from '@/components/Tooltip';
import { Mail, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function InputsScreen() {
    const [email, setEmail] = useState('');
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
    const [bio, setBio] = useState('');

    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Inputs" totalItems={3} itemLabel="components" />

                {/* TextInput Section */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Text Input</Text>

                    {/* Basic Inputs */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            BASIC
                        </Text>
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
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            SIZES
                        </Text>
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
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            STATES
                        </Text>
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
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            WITH CHARACTER COUNTER
                        </Text>
                        <TextInput
                            label="Username"
                            placeholder="Enter username"
                            maxLength={20}
                            showCounter
                        />
                    </Box>
                </Box>

                {/* Textarea Section */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Textarea</Text>

                    {/* Basic Textarea */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            BASIC
                        </Text>
                        <Textarea
                            label="Message"
                            placeholder="Enter your message"
                            value={message}
                            onChangeText={setMessage}
                            rows={4}
                        />
                    </Box>

                    {/* Sizes */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            SIZES
                        </Text>
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
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            STATES
                        </Text>
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
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            WITH CHARACTER COUNTER
                        </Text>
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

                {/* Tooltip Section */}
                <Box marginBottom="xl">
                    <Text variant="h2" marginBottom="lg">Tooltip</Text>

                    {/* Positions */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            POSITIONS
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            <Tooltip content="Tooltip on top" variant="top">
                                <Button variant="outline" color="primary" size="md">
                                    Top
                                </Button>
                            </Tooltip>
                            <Tooltip content="Tooltip on bottom" variant="bottom">
                                <Button variant="outline" color="primary" size="md">
                                    Bottom
                                </Button>
                            </Tooltip>
                            <Tooltip content="Tooltip on left" variant="left">
                                <Button variant="outline" color="primary" size="md">
                                    Left
                                </Button>
                            </Tooltip>
                            <Tooltip content="Tooltip on right" variant="right">
                                <Button variant="outline" color="primary" size="md">
                                    Right
                                </Button>
                            </Tooltip>
                        </View>
                    </Box>

                    {/* Sizes */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            SIZES
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            <Tooltip content="Small tooltip" size="sm">
                                <Button variant="fill" color="primary" size="md">
                                    Small
                                </Button>
                            </Tooltip>
                            <Tooltip content="Medium tooltip" size="md">
                                <Button variant="fill" color="primary" size="md">
                                    Medium
                                </Button>
                            </Tooltip>
                            <Tooltip content="Large tooltip with more text" size="lg">
                                <Button variant="fill" color="primary" size="md">
                                    Large
                                </Button>
                            </Tooltip>
                        </View>
                    </Box>

                    {/* Styles */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            STYLES
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            <Tooltip content="Default tooltip style" tooltipStyle="default">
                                <Button variant="fill" color="secondary" size="md">
                                    Default
                                </Button>
                            </Tooltip>
                            <Tooltip content="Success tooltip style" tooltipStyle="success">
                                <Button variant="fill" color="secondary" size="md">
                                    Success
                                </Button>
                            </Tooltip>
                        </View>
                    </Box>

                    {/* With Icons */}
                    <Box marginBottom="lg">
                        <Text
                            variant="label"
                            marginBottom="sm"
                            style={{ textTransform: 'uppercase', color: '#828282' }}
                        >
                            WITH ICONS
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            <Tooltip content="User profile information">
                                <Button variant="ghost" color="primary" size="md" isIconOnly>
                                    <User size={20} color="#18a87d" />
                                </Button>
                            </Tooltip>
                            <Tooltip content="Search for items">
                                <Button variant="ghost" color="primary" size="md" isIconOnly>
                                    <Search size={20} color="#18a87d" />
                                </Button>
                            </Tooltip>
                            <Tooltip content="Send email">
                                <Button variant="ghost" color="primary" size="md" isIconOnly>
                                    <Mail size={20} color="#18a87d" />
                                </Button>
                            </Tooltip>
                        </View>
                    </Box>
                </Box>

            </Box>
        </ScrollView>
    );
}
