import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { X } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

const SKILLS_EXAMPLES = [
  ['Lead Painter', 'Painting', 'Primer', 'Finishing'],
  ['Plumbing', 'HVAC', 'Electrical'],
  ['Project Management', 'Safety', 'Inspection'],
];

function SkillTag({ label, removable, onRemove }: { label: string; removable?: boolean; onRemove?: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row" alignItems="center" gap="xs"
      style={{
        backgroundColor: theme.colors.grey02,
        borderWidth: 1, borderColor: theme.colors.grey03,
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13, color: theme.colors.foreground }}>{label}</Text>
      {removable && (
        <Pressable onPress={onRemove} style={{ marginLeft: 2 }}>
          <X size={12} color={theme.colors.grey05} />
        </Pressable>
      )}
    </Box>
  );
}

function SkillTagFilled({ label }: { label: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      style={{
        backgroundColor: theme.colors.lightMint,
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13, color: theme.colors.secondaryGreen, fontWeight: '500' }}>{label}</Text>
    </Box>
  );
}

export default function SkillsTagScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Skills Tag" totalItems={3} />

        <ComponentSection
          title="Default (Outlined)"
          githubUrls={[]}
          usageCode={`// Used in team member profiles to show skills
const SKILLS = ['Lead Painter', 'Painting', 'Primer', 'Finishing'];

<Box flexDirection="row" flexWrap="wrap" gap="xs">
  {SKILLS.map(skill => (
    <Box key={skill}
      style={{
        backgroundColor: theme.colors.grey02,
        borderWidth: 1, borderColor: theme.colors.grey03,
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 13, color: theme.colors.foreground }}>{skill}</Text>
    </Box>
  ))}
</Box>`}
        >
          <Box gap="md">
            {SKILLS_EXAMPLES.map((skills, i) => (
              <Box key={i} flexDirection="row" flexWrap="wrap" gap="xs">
                {skills.map(skill => <SkillTag key={skill} label={skill} />)}
              </Box>
            ))}
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Removable"
          githubUrls={[]}
          usageCode={`const [skills, setSkills] = useState(['Painting', 'Primer', 'Finishing']);

<Box flexDirection="row" flexWrap="wrap" gap="xs">
  {skills.map(skill => (
    <Box key={skill} flexDirection="row" alignItems="center" gap="xs"
      style={{ backgroundColor: theme.colors.grey02, borderWidth: 1, borderColor: theme.colors.grey03,
        borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
      <Text style={{ fontSize: 13, color: theme.colors.foreground }}>{skill}</Text>
      <Pressable onPress={() => setSkills(s => s.filter(x => x !== skill))}>
        <X size={12} color={theme.colors.grey05} />
      </Pressable>
    </Box>
  ))}
</Box>`}
        >
          <Box flexDirection="row" flexWrap="wrap" gap="xs">
            {['Painting', 'Primer', 'Finishing', 'Lead Painter'].map(skill => (
              <SkillTag key={skill} label={skill} removable onRemove={() => {}} />
            ))}
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Filled (Green Accent)"
          githubUrls={[]}
          usageCode={`// Used for highlighted/active skills
<Box flexDirection="row" flexWrap="wrap" gap="xs">
  {skills.map(skill => (
    <Box key={skill}
      style={{ backgroundColor: theme.colors.lightMint, borderRadius: 20,
        paddingHorizontal: 12, paddingVertical: 6 }}>
      <Text style={{ fontSize: 13, color: theme.colors.secondaryGreen, fontWeight: '500' }}>{skill}</Text>
    </Box>
  ))}
</Box>`}
        >
          <Box flexDirection="row" flexWrap="wrap" gap="xs">
            {['Painting', 'Primer', 'Finishing', 'Lead Painter'].map(skill => (
              <SkillTagFilled key={skill} label={skill} />
            ))}
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
