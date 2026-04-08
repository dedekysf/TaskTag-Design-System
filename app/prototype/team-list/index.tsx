import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Users, 
  Mail, 
  Shield, 
  ChevronRight,
  Filter
} from 'lucide-react-native';
import React, { useState } from 'react';
import { 
  Image, 
  Pressable, 
  ScrollView, 
  TextInput, 
  View,
  Platform 
} from 'react-native';

const TEAM_MEMBERS = [
  { id: '1', name: 'Linda Smith', role: 'Owner', email: 'lindasmith@gmail.com', status: 'Active', avatar: require('@/assets/images/sample-three.jpg') },
  { id: '2', name: 'Abby Smith', role: 'Admin', email: 'abbysmith@gmail.com', status: 'Active', avatar: require('@/assets/images/sample-two.jpg') },
  { id: '3', name: 'Oscar H.', role: 'Admin', email: 'oscar@email.com', status: 'Active', avatar: require('@/assets/images/sample-four.jpg') },
  { id: '4', name: 'Savannah Nguyen', role: 'Member', email: 'savannahnguyen@gmail.com', status: 'Pending', avatar: null, initials: 'SN', color: 'pastelBlue' },
];

export default function TeamListScreen() {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box flex={1} backgroundColor="white">
      {/* Header */}
      <Box 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="space-between" 
        paddingHorizontal="xl" 
        paddingVertical="lg"
        borderBottomWidth={1}
        borderBottomColor="border"
      >
        <Box>
          <Text variant="webHeading22" fontWeight="700" color="foreground">Team Members</Text>
          <Text variant="body" color="grey05" marginTop="xs">Manage your team and their roles</Text>
        </Box>
        <Box flexDirection="row" gap="md">
          <Pressable
            style={({ hovered }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
              borderWidth: 1,
              borderColor: theme.colors.border,
              cursor: 'pointer' as any,
            })}
          >
            <Filter size={18} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textSecondary }}>Filter</Text>
          </Pressable>
          <Pressable
            style={({ hovered }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: hovered ? theme.colors.blue : theme.colors.blue,
              opacity: hovered ? 0.9 : 1,
              cursor: 'pointer' as any,
            })}
          >
            <Plus size={18} color="white" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>Invite Member</Text>
          </Pressable>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box paddingHorizontal="xl" paddingVertical="md" flexDirection="row" gap="md">
        <Box 
          flex={1} 
          flexDirection="row" 
          alignItems="center" 
          backgroundColor="grey01" 
          borderRadius="lg" 
          paddingHorizontal="md"
          height={40}
        >
          <Search size={18} color={theme.colors.grey04} />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search members..."
            placeholderTextColor={theme.colors.grey04}
            style={{ 
              flex: 1, 
              marginLeft: 8, 
              fontSize: 14, 
              color: theme.colors.foreground,
              outlineStyle: 'none'
            } as any}
          />
        </Box>
      </Box>

      {/* List Table Header (Web style) */}
      {Platform.OS === 'web' && (
        <Box 
          paddingHorizontal="xl" 
          paddingVertical="sm" 
          flexDirection="row" 
          borderBottomWidth={1} 
          borderBottomColor="border"
          backgroundColor="grey01"
        >
          <Box flex={3}><Text variant="label" fontWeight="600" color="grey05">Member</Text></Box>
          <Box flex={1}><Text variant="label" fontWeight="600" color="grey05">Role</Text></Box>
          <Box flex={1}><Text variant="label" fontWeight="600" color="grey05">Status</Text></Box>
          <Box width={48}></Box>
        </Box>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box paddingBottom="2xl">
          {TEAM_MEMBERS.map((member) => (
            <Pressable
              key={member.id}
              style={({ hovered }: any) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.xl,
                paddingVertical: theme.spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                cursor: 'pointer' as any,
              })}
            >
              {/* Member Info */}
              <Box flex={3} flexDirection="row" alignItems="center" gap="md">
                {member.avatar ? (
                  <Image 
                    source={member.avatar} 
                    style={{ width: 40, height: 40, borderRadius: 20 }} 
                  />
                ) : (
                  <Box 
                    width={40} 
                    height={40} 
                    borderRadius="full" 
                    alignItems="center" 
                    justifyContent="center"
                    style={{ backgroundColor: theme.colors[member.color as keyof Theme['colors']] || theme.colors.pastelBlue }}
                  >
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{member.initials}</Text>
                  </Box>
                )}
                <Box>
                  <Text fontWeight="600" color="foreground">{member.name}</Text>
                  <Text variant="label" color="grey05">{member.email}</Text>
                </Box>
              </Box>

              {/* Role */}
              <Box flex={1}>
                <Box 
                  flexDirection="row" 
                  alignItems="center" 
                  gap="xs"
                  paddingHorizontal="sm"
                  paddingVertical="xs"
                  borderRadius="sm"
                  backgroundColor="grey01"
                  alignSelf="flex-start"
                >
                  <Shield size={14} color={theme.colors.grey05} />
                  <Text variant="label" color="grey06">{member.role}</Text>
                </Box>
              </Box>

              {/* Status */}
              <Box flex={1}>
                <Box 
                  paddingHorizontal="sm"
                  paddingVertical="xs"
                  borderRadius="full"
                  backgroundColor={member.status === 'Active' ? 'lightMint' : 'pastelOrange'}
                  alignSelf="flex-start"
                >
                  <Text 
                    fontSize={11} 
                    fontWeight="700" 
                    color={member.status === 'Active' ? 'secondaryGreen' : 'orange'}
                  >
                    {member.status.toUpperCase()}
                  </Text>
                </Box>
              </Box>

              {/* Actions */}
              <Box width={48} alignItems="center">
                <Pressable
                  style={({ hovered }: any) => ({
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                  })}
                >
                  <MoreVertical size={20} color={theme.colors.grey05} />
                </Pressable>
              </Box>
            </Pressable>
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
