import { Box, Text } from '@/components/primitives';
import { TabPanel, TabsContainer } from '@/components/TabsContainer';
import { Copy } from 'lucide-react-native';
import React, { ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface GithubUrlItem {
    label: string;
    url: string;
}

interface ComponentSectionProps {
    title: string;
    variant?: string;
    githubUrls: GithubUrlItem[];
    usageCode: string;
    children: ReactNode;
}

export function ComponentSection({
    title,
    variant,
    githubUrls,
    usageCode,
    children,
}: ComponentSectionProps) {
    const [activeTab, setActiveTab] = useState('preview');

    const tabs = [
        { value: 'preview', label: 'Preview' },
        { value: 'usage', label: 'Usage' },
        { value: 'github', label: 'GitHub URL' },
    ];

    const handleCopyCode = async () => {
        try {
            const fullCode = `import { TabItem } from './components/TabItem';\n\n${usageCode}`;
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(fullCode);
                console.log('Code copied to clipboard');
            }
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const handleCopyUrl = async (url: string) => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                console.log('URL copied to clipboard');
            }
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <Box marginBottom="56">
            <Text variant="body" fontWeight="700" marginBottom="sm">
                {title}
            </Text>
            {variant && (
                <Text
                    variant="label"
                    marginBottom="sm"
                    style={{ textTransform: 'uppercase', color: '#828282' }}
                >
                    {variant}
                </Text>
            )}

            <TabsContainer
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
            >
                <TabPanel value="preview" activeTab={activeTab}>
                    <View style={styles.previewCard}>
                        {children}
                    </View>
                </TabPanel>

                <TabPanel value="usage" activeTab={activeTab}>
                    <Box paddingVertical="lg">
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeText}>
                                import {'{'} TabItem {'}'} from './components/TabItem';{'\n\n'}
                                {usageCode}
                            </Text>
                            <TouchableOpacity onPress={handleCopyCode} style={styles.copyButtonFloating}>
                                <Copy size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </Box>
                </TabPanel>

                <TabPanel value="github" activeTab={activeTab}>
                    <Box paddingVertical="lg">
                        {githubUrls.map((item, index) => (
                            <View key={index} style={styles.urlItem}>
                                <View style={styles.urlRow}>
                                    <Text style={styles.urlText}>{item.url}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleCopyUrl(item.url)}
                                        style={styles.urlCopyButton}
                                    >
                                        <Copy size={18} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </Box>
                </TabPanel>
            </TabsContainer>
        </Box>
    );
}

const styles = StyleSheet.create({
    previewCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 24,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    codeContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        position: 'relative',
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 13,
        lineHeight: 20,
        color: '#333',
        paddingRight: 50,
    },
    copyButtonFloating: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    urlItem: {
        marginBottom: 16,
    },
    urlRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 14,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        gap: 12,
    },
    urlText: {
        flex: 1,
        color: '#0066cc',
        fontSize: 13,
        fontFamily: 'monospace',
    },
    urlCopyButton: {
        padding: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
});
