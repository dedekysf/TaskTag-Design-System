import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { Button } from '@/components/Button';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';
import { Hash, Image as ImageIcon, MessageSquare, Activity, MoreVertical, Search, Plus, Folder, Users } from 'lucide-react-native';

export default function ProjectDashboard() {
  const theme = useTheme<Theme>();
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <Box flex={1} flexDirection="row" backgroundColor="grey02" style={{ height: '100%', position: 'relative' }}>
      {/* Mock Sidebar Background */}
      <Box width={240} backgroundColor="card" borderRightWidth={1} borderColor="border" style={{ height: '100%' }}>
         <Box padding="lg" alignItems="center" flexDirection="row">
           <Text style={{ fontWeight: 'bold', fontSize: 24, color: theme.colors.brandGreen }}>tasktag</Text>
         </Box>
         <Box paddingHorizontal="md" style={{ gap: 8 }}>
           <Button variant="ghost" style={{ justifyContent: 'flex-start' }}><Folder size={16} /><Text style={{ marginLeft: theme.spacing.sm }}>Projects</Text></Button>
           <Button variant="ghost" style={{ justifyContent: 'flex-start', backgroundColor: theme.colors.grey02 }}><Hash size={16} /><Text style={{ marginLeft: theme.spacing.sm }}>My Tasks</Text></Button>
           <Button variant="ghost" style={{ justifyContent: 'flex-start' }}><Activity size={16} /><Text style={{ marginLeft: theme.spacing.sm }}>Global Activity</Text></Button>
           <Button variant="ghost" style={{ justifyContent: 'flex-start' }}><Users size={16} /><Text style={{ marginLeft: theme.spacing.sm }}>Contacts</Text></Button>
         </Box>
      </Box>

      {/* Main Content Area */}
      <Box flex={1} style={{ height: '100%' }} backgroundColor="background">
        {/* Mock Top Header */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingHorizontal="xl" paddingVertical="lg" borderBottomWidth={1} borderColor="border" backgroundColor="card">
          <Box flexDirection="row" alignItems="center">
             <Text variant="h2">Raintree Hollow Court Renovation</Text>
             <MoreVertical size={20} color={theme.colors.mutedForeground} style={{ marginLeft: 8 }} />
          </Box>
          <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
             <Search size={20} color={theme.colors.mutedForeground} />
             <Button variant="fill" size="sm" style={{ backgroundColor: theme.colors.textPrimary, borderRadius: 20 }}>
               <Plus size={16} color="white" />
               <Text color="white" style={{ marginLeft: 4 }}>New Task</Text>
             </Button>
          </Box>
        </Box>

        {/* Mock Content */}
        <Box padding="xl">
          <Text variant="webSecondaryBody" color="mutedForeground" style={{ lineHeight: 24 }}>
            This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.
          </Text>
        </Box>
      </Box>

      {/* Modal Overlay */}
      {modalVisible && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: Platform.OS === 'web' ? 'rgba(0,0,0,0.5)' : theme.colors.overlay,
          justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
          <Box
            backgroundColor="card"
            padding="24"
            style={{
              width: '100%',
              maxWidth: 440,
              borderRadius: theme.borderRadii['24'],
              ...Platform.select({
                web: { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 30px' } as any,
                default: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }
              })
            }}
          >
            {/* Modal Header */}
            <Box flexDirection="row" alignItems="center" style={{ marginBottom: 24 }}>
              <Box width={44} height={44} style={{ backgroundColor: '#ebe7ff' }} borderRadius="8" alignItems="center" justifyContent="center" marginRight="md">
                <Users size={24} color="#7b61ff" />
              </Box>
              <Box>
                <Text variant="webLabelEmphasized">Raintree Hollow Court Renovation</Text>
                <Text variant="webMetadataPrimary" color="mutedForeground">You've been added to this project</Text>
              </Box>
            </Box>

            <Text variant="webSecondaryBody" style={{ fontWeight: '600' }} marginBottom="16" color="foreground">What you can do</Text>

            {/* List */}
            <Box style={{ gap: theme.spacing['20'] }} marginBottom="32">
              <Box flexDirection="row" alignItems="center">
                <Box width={40} height={40} backgroundColor="grey02" borderRadius="8" alignItems="center" justifyContent="center" marginRight="md">
                  <Hash size={18} color={theme.colors.textSecondary} />
                </Box>
                <Box>
                  <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: theme.colors.foreground }}>Create, assign and track tasks</Text>
                  <Text variant="webMetadataPrimary" color="mutedForeground">Manage project tasks efficiently</Text>
                </Box>
              </Box>

              <Box flexDirection="row" alignItems="center">
                <Box width={40} height={40} backgroundColor="grey02" borderRadius="8" alignItems="center" justifyContent="center" marginRight="md">
                  <ImageIcon size={18} color={theme.colors.textSecondary} />
                </Box>
                <Box>
                  <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: theme.colors.foreground }}>Share media and docs</Text>
                  <Text variant="webMetadataPrimary" color="mutedForeground">Upload files, photos and documents</Text>
                </Box>
              </Box>

              <Box flexDirection="row" alignItems="center">
                <Box width={40} height={40} backgroundColor="grey02" borderRadius="8" alignItems="center" justifyContent="center" marginRight="md">
                  <MessageSquare size={18} color={theme.colors.textSecondary} />
                </Box>
                <Box>
                  <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: theme.colors.foreground }}>Chat with your team</Text>
                  <Text variant="webMetadataPrimary" color="mutedForeground">Stay connected with team members</Text>
                </Box>
              </Box>

              <Box flexDirection="row" alignItems="center">
                <Box width={40} height={40} backgroundColor="grey02" borderRadius="8" alignItems="center" justifyContent="center" marginRight="md">
                  <Activity size={18} color={theme.colors.textSecondary} />
                </Box>
                <Box>
                  <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: theme.colors.foreground }}>Follow updates</Text>
                  <Text variant="webMetadataPrimary" color="mutedForeground">Get notified on project changes</Text>
                </Box>
              </Box>
            </Box>

            {/* Button */}
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: theme.colors.textPrimary }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: theme.colors.white, fontWeight: '600', fontSize: 16 }}>Go to Project</Text>
            </Button>
          </Box>
        </View>
      )}
    </Box>
  );
}
