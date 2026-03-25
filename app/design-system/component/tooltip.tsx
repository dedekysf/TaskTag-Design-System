import { Button } from '@/components/Button';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Tooltip } from '@/components/Tooltip';
import { CheckCircle, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

export default function TooltipScreen() {
  const [copied, setCopied] = useState(false);
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Tooltip" totalItems={8} />

        {/* Variant Tooltip - Positions in Grid */}
        <ComponentSection
          title="Variant Tooltip"
          githubUrls={[{ label: 'Tooltip', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Tooltip.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Top Row */}
      <Tooltip content="Top Left" variant="top-left"><Button color="secondary">Top Left</Button></Tooltip>
      <Tooltip content="Top Center" variant="top-center"><Button color="secondary">Top Center</Button></Tooltip>
      <Tooltip content="Top Right" variant="top-right"><Button color="secondary">Top Right</Button></Tooltip>
      
      {/* Middle Row */}
      <Tooltip content="Left" variant="left"><Button color="secondary">Left</Button></Tooltip>
      <div />
      <Tooltip content="Right" variant="right"><Button color="secondary">Right</Button></Tooltip>
      
      {/* Bottom Row */}
      <Tooltip content="Bottom Left" variant="bottom-left"><Button color="secondary">Bottom Left</Button></Tooltip>
      <Tooltip content="Bottom Center" variant="bottom-center"><Button color="secondary">Bottom Center</Button></Tooltip>
      <Tooltip content="Bottom Right" variant="bottom-right"><Button color="secondary">Bottom Right</Button></Tooltip>
    </div>
  );
}`}
        >
          <View style={{ gap: 24, paddingVertical: 20 }}>
            {/* Top Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 3 }}>
              <Tooltip content="Top Left" variant="top-left">
                <Button variant="fill" color="secondary" size="md">Top Left</Button>
              </Tooltip>
              <Tooltip content="Top Center" variant="top-center">
                <Button variant="fill" color="secondary" size="md">Top Center</Button>
              </Tooltip>
              <Tooltip content="Top Right" variant="top-right">
                <Button variant="fill" color="secondary" size="md">Top Right</Button>
              </Tooltip>
            </View>

            {/* Middle Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 2 }}>
              <Tooltip content="Left" variant="left">
                <Button variant="fill" color="secondary" size="md">Left</Button>
              </Tooltip>
              {/* Spacer */}
              <View style={{ width: 100 }} />
              <Tooltip content="Right" variant="right">
                <Button variant="fill" color="secondary" size="md">Right</Button>
              </Tooltip>
            </View>

            {/* Bottom Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 1 }}>
              <Tooltip content="Bottom Left" variant="bottom-left">
                <Button variant="fill" color="secondary" size="md">Bottom Left</Button>
              </Tooltip>
              <Tooltip content="Bottom Center" variant="bottom-center">
                <Button variant="fill" color="secondary" size="md">Bottom Center</Button>
              </Tooltip>
              <Tooltip content="Bottom Right" variant="bottom-right">
                <Button variant="fill" color="secondary" size="md">Bottom Right</Button>
              </Tooltip>
            </View>
          </View>
        </ComponentSection>

        {/* Avatar Examples with Tooltip */}
        <ComponentSection
          title="Avatar Examples with Tooltip"
          githubUrls={[{ label: 'Tooltip', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Tooltip.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex gap-4">
      <Tooltip content={<div className="flex items-center gap-2"><Avatar /><span>User Name</span></div>}>
        <Avatar />
      </Tooltip>
    </div>
  );
}`}
        >
          <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', height: 100 }}>
            {/* Avatar 1 */}
            <Tooltip
              variant="bottom-center"
              content={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={14} color="#333" />
                  </View>
                  <Text style={{ color: 'white', fontSize: 14 }}>Unknown User</Text>
                </View>
              }
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#666" />
              </View>
            </Tooltip>

            {/* Avatar 2 */}
            <Tooltip
              variant="bottom-center"
              content={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#dcf2ec', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: '600' }}>SJ</Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: 14 }}>Sarah Johnson</Text>
                </View>
              }
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#dcf2ec', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#18a87d', fontWeight: '600' }}>SJ</Text>
              </View>
            </Tooltip>

            {/* Avatar 3 */}
            <Tooltip
              variant="bottom-center"
              content={
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#dceeff', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10, fontWeight: '600' }}>EM</Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: 14 }}>Emily Miller</Text>
                </View>
              }
            >
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#dceeff', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#1572a1', fontWeight: '600' }}>EM</Text>
              </View>
            </Tooltip>
          </View>
        </ComponentSection>

        {/* Avatar Group with Tooltip */}
        <ComponentSection
          title="Avatar Group with Tooltip"
          githubUrls={[{ label: 'Tooltip', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Tooltip.tsx' }]}
          usageCode={`export default function Example() {
  return (
    <div className="flex -space-x-2">
       {/* Avatars */}
       <Tooltip content="Jessica Lee"><Avatar src="..." /></Tooltip>
    </div>
  );
}`}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, height: 80 }}>
            {/* Avatar 1 */}
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#333', borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
              <User size={20} color="white" />
            </View>
            {/* Avatar 2 */}
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#655d8a', borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center', marginLeft: -12, zIndex: 2 }}>
              <User size={20} color="white" />
            </View>
            {/* Avatar 3 - Trigger */}
            <View style={{ marginLeft: -12, zIndex: 3 }}>
              <Tooltip
                variant="bottom-center"
                content={
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, overflow: 'hidden' }}>
                      <View style={{ flex: 1, backgroundColor: '#dcf2ec', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 10 }}>DK</Text></View>
                    </View>
                    <Text style={{ color: 'white', fontSize: 14 }}>Jessica Lee</Text>
                  </View>
                }
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#dcf2ec', borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12 }}>DK</Text>
                </View>
              </Tooltip>
            </View>
            {/* More */}
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: 'white', alignItems: 'center', justifyContent: 'center', marginLeft: -12, zIndex: 0 }}>
              <Text style={{ fontSize: 12, color: '#666' }}>+3</Text>
            </View>
          </View>
        </ComponentSection>

        {/* Success Tooltip (Link Copied) */}
        <ComponentSection
          title="Success Tooltip (Link Copied)"
          githubUrls={[{ label: 'Tooltip', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Tooltip.tsx' }]}
          usageCode={`export default function Example() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip 
      content={
        copied ? (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E0E0E0',
            borderRadius: 4,
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0px 5px 25px 0px rgba(0, 0, 0, 0.05)'
          }}>
             <CircleCheck size={16} color="#00d9a5" /> 
             <span style={{ color: '#828282', fontSize: 14 }}>Link copied!</span>
          </div>
        ) : "Copy to clipboard"
      }
      variant="bottom-right"
      forceShow={copied}
      tooltipStyle={copied ? "custom" : "default"}
    >
      <Button color="primary" onClick={handleCopy}>Click to copy</Button>
    </Tooltip>
  );
}`}
        >
          <View style={{ alignItems: 'flex-end', paddingRight: 20, height: 100 }}>
            <Tooltip
              variant="bottom-right"
              tooltipStyle={copied ? "custom" : "default"}
              forceShow={copied}
              content={
                copied ? (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'white',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    ...Platform.select({
                      web: { boxShadow: '0px 5px 25px 0px rgba(0, 0, 0, 0.05)' } as any,
                      default: {
                        shadowColor: 'black',
                        shadowOpacity: 0.05,
                        shadowRadius: 25,
                        elevation: 2
                      }
                    }),
                  }}>
                    <CheckCircle size={16} color="#00d9a5" />
                    <Text style={{ color: '#828282', fontSize: 14, fontWeight: '400' }}>Link copied!</Text>
                  </View>
                ) : "Copy to clipboard"
              }
            >
              <Button variant="fill" color="primary" size="md" onPress={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}>
                Click to copy
              </Button>
            </Tooltip>
          </View>
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
