import { Box, Text } from '@/components/primitives';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { Textarea } from '@/components/Textarea';
import { FormSelect } from '@/components/FormSelect';
import { ProjectCreationMemberRow, Member } from './ProjectCreationMemberRow';
import { TooltipOnboarding } from '@/components/TooltipOnboarding';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, Modal } from 'react-native';

import {
  Activity,
  Bed,
  Brush,
  Building,
  Camera,
  Car,
  Copy,
  Disc,
  Droplet,
  Droplets,
  Flag,
  Flame,
  Folder,
  Gift,
  GraduationCap,
  Grid3x3,
  Hammer,
  Hand,
  Home,
  Leaf,
  Lightbulb,
  MapPin,
  Menu,
  Mic,
  Moon,
  Mountain,
  Paintbrush,
  Plus,
  Pyramid,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Star,
  Tent,
  Triangle,
  Users,
  Warehouse,
  Wrench,
  X,
  Zap,
} from 'lucide-react-native';

// ─── Team List Modal ──────────────────────────────────────────────────────────

interface TeamListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (team: { id: string; name: string; color: string }) => void;
}

function TeamListModal({ isOpen, onClose, onSelectTeam }: TeamListModalProps) {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');

  const teams = [
    { id: '3', name: 'Personal Projects', color: '#FF4444' },
  ];

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Box
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <Box
        backgroundColor="white"
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.grey02,
          width: '100%',
          maxWidth: 504,
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 16,
        }}
      >
        {/* Header */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>
            Teams
          </Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <X size={20} color={theme.colors.foreground} />
          </Pressable>
        </Box>

        {/* Search */}
        <TextInput
          icon={Search}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          size="md"
        />

        {/* List */}
        <Box style={{ gap: 16 }}>
          {filteredTeams.map((team) => (
            <Pressable
              key={team.id}
              onPress={() => {
                onSelectTeam(team);
                onClose();
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Box
                style={{
                  backgroundColor: team.color,
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Folder size={14} color="white" />
              </Box>
              <Text style={{ fontSize: 14, color: theme.colors.foreground, flex: 1 }} numberOfLines={1}>
                {team.name}
              </Text>
            </Pressable>
          ))}
        </Box>
      </Box>
    </Box>
  </Modal>
);
}

// ─── Color Picker Modal ───────────────────────────────────────────────────────

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (color: { id: string; name: string; value: string }) => void;
  selectedColorId?: string;
}

function ColorPickerModal({ isOpen, onClose, onSelectColor, selectedColorId }: ColorPickerModalProps) {
  const theme = useTheme<Theme>();

  const colors = [
    { id: '1', name: 'Alert Red', value: '#FF4444' },
    { id: '2', name: 'Orange', value: '#FF9944' },
    { id: '3', name: 'Yellow', value: '#FFD644' },
    { id: '4', name: 'Secondary Green', value: '#18A87D' },
    { id: '5', name: 'Dark Green', value: '#0D6B52' },
    { id: '6', name: 'Blue', value: '#4488FF' },
    { id: '7', name: 'Purple', value: '#8844FF' },
    { id: '8', name: 'Light Magenta', value: '#D444FF' },
    { id: '9', name: 'Dark Magenta', value: '#A820D8' },
  ];

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Box
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <Box
        backgroundColor="white"
        style={{
          borderRadius: 16,
          padding: 16,
          gap: 8,
          minWidth: 180,
          ...Platform.select({
            web: { boxShadow: '0px 5px 25px 0px rgba(0, 0, 0, 0.1)' } as any,
          }),
        }}
      >
        {colors.map((color) => (
          <Pressable
            key={color.id}
            onPress={() => {
              onSelectColor(color);
              onClose();
            }}
            style={({ hovered }: any) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 8,
              borderRadius: 8,
              backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
            })}
          >
            <Box
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: color.value,
              }}
            />
            <Text style={{ fontSize: 14, color: theme.colors.foreground, flex: 1 }}>
              {color.name}
            </Text>
          </Pressable>
        ))}
      </Box>
    </Box>
  </Modal>
);
}

// ─── Icon Picker Modal ────────────────────────────────────────────────────────

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: { id: string; component: any }) => void;
  selectedIconId?: string;
}

function IconPickerModal({ isOpen, onClose, onSelectIcon, selectedIconId }: IconPickerModalProps) {
  const theme = useTheme<Theme>();

  const icons = [
    { id: '1', component: Bed }, { id: '2', component: Grid3x3 }, { id: '3', component: Paintbrush },
    { id: '4', component: ShoppingCart }, { id: '5', component: Car }, { id: '6', component: Triangle },
    { id: '7', component: GraduationCap }, { id: '8', component: Lightbulb }, { id: '9', component: Home },
    { id: '10', component: Menu }, { id: '11', component: Camera }, { id: '12', component: Users },
    { id: '13', component: Droplet }, { id: '14', component: Flag }, { id: '15', component: Leaf },
    { id: '16', component: Hand }, { id: '17', component: Wrench }, { id: '18', component: Building },
    { id: '19', component: Flame }, { id: '20', component: Gift }, { id: '21', component: Pyramid },
    { id: '22', component: Mountain }, { id: '23', component: Brush }, { id: '24', component: Mic },
    { id: '25', component: Moon }, { id: '26', component: Hammer }, { id: '27', component: Tent },
    { id: '28', component: Activity }, { id: '29', component: Disc }, { id: '30', component: Sparkles },
    { id: '31', component: Star }, { id: '32', component: Wrench }, { id: '33', component: Settings },
    { id: '34', component: Warehouse }, { id: '35', component: Droplets }, { id: '36', component: Zap }
  ];

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <Box
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <Box
        backgroundColor="white"
        style={{
          borderRadius: 16,
          padding: 16,
          width: 312, // 16*2 padding + 6*40 icons + 5*8 gaps = 312
          alignSelf: 'center',
          ...Platform.select({
            web: { boxShadow: '0px 5px 25px 0px rgba(0, 0, 0, 0.1)' } as any,
          }),
        }}
      >
        <Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {icons.map((icon) => {
            const IconComponent = icon.component;
            return (
              <Pressable
                key={icon.id}
                onPress={() => {
                  onSelectIcon(icon);
                  onClose();
                }}
                style={({ hovered }: any) => ({
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor: selectedIconId === icon.id
                    ? theme.colors.grey03
                    : hovered
                    ? theme.colors.grey01
                    : 'transparent',
                })}
              >
                <IconComponent size={24} color={theme.colors.foreground} />
              </Pressable>
            );
          })}
        </Box>
      </Box>
    </Box>
  </Modal>
);
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function ProjectCreationPanel({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  const theme = useTheme<Theme>();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [selectedTeam, setSelectedTeam] = useState({ id: '3', name: 'Personal Projects', color: '#FF4444' });
  const [selectedColor, setSelectedColor] = useState({ id: '1', name: 'Alert Red', value: '#FF4444' });
  const [selectedIcon, setSelectedIcon] = useState({ id: '36', component: Zap });
  
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);

  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [members, setMembers] = useState<Member[]>([]);

  const [nameError, setNameError] = useState('');
  const [showNameTooltip, setShowNameTooltip] = useState(true);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  // Fade in tooltip initially
  useEffect(() => {
    if (showNameTooltip && projectName.length === 0) {
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300, // delay a bit so it appears smoothly after modal
        useNativeDriver: true,
      }).start();
    }
  }, []);

  // Clear error when user types
  useEffect(() => {
    if (projectName.length > 0 && nameError) {
      setNameError('');
    }
  }, [projectName, nameError]);

  // Fade out tooltip immediately over 2 seconds when typing
  useEffect(() => {
    if (projectName.length > 0 && showNameTooltip) {
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 2000, // fade out over 2 seconds
        useNativeDriver: true,
      }).start(() => setShowNameTooltip(false));
    }
  }, [projectName, showNameTooltip, tooltipOpacity]);

  const handleCreateProject = () => {
    if (projectName.trim() === '') {
      setNameError('Add a project name to continue');
      return;
    }
    onClose?.();
    onSuccess?.();
  };

  const SelectedIconComponent = selectedIcon.component;

  const handleUpdateRole = (id: string, role: 'Owner' | 'Assignee' | 'Viewer') => {
    setMembers(members.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <Box
      backgroundColor="white"
      style={{
        flex: 1,
        width: 580,
        height: '100%',
        borderLeftWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      {/* Header */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ paddingHorizontal: 24, paddingTop: 21, paddingBottom: 12 }}
        >
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 32 }}>
            Create Project
          </Text>
          <Pressable onPress={onClose} style={{ padding: 4 }}>
            <X size={24} color={theme.colors.foreground} />
          </Pressable>
        </Box>

        {/* Scrollable Form Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
          
          {/* Copy from existing project */}
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderColor: theme.colors.grey02,
              marginBottom: 32,
            }}
          >
            <Copy size={24} color={theme.colors.foreground} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>
              Copy from existing project
            </Text>
          </Pressable>

          <Box style={{ gap: 24 }}>
            {/* Name */}
            <Box style={{ gap: 8 }}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                  Name
                </Text>
                <Text style={{ fontSize: 10, fontWeight: '500', color: theme.colors.grey04, lineHeight: 12 }}>
                  Required
                </Text>
              </Box>
              <TooltipOnboarding
                variant="left-center"
                tooltipStyle="success"
                title="Name your first job"
                description="e.g. Smith House, Office Renovation"
                open={showNameTooltip}
                forceShow={showNameTooltip}
                fullWidth
                animatedOpacity={tooltipOpacity}
              >
                <TextInput
                  value={projectName}
                  onChangeText={setProjectName}
                  placeholder="Enter project name"
                  size="lg"
                  autoFocus
                  maxLength={255}
                  showCounter={true}
                  errorMessage={nameError}
                  showClearButton={false}
                />
              </TooltipOnboarding>
            </Box>

            {/* Description */}
            <Box style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                Description
              </Text>
              <Textarea
                value={description}
                onChangeText={setDescription}
                placeholder="Enter project description"
                size="lg"
                rows={1}
              />
            </Box>

            {/* Address */}
            <Box style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                Address
              </Text>
              <TextInput
                icon={MapPin}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                size="lg"
              />
            </Box>

            {/* Team, Color, Icon Row */}
            <Box flexDirection="row" gap="16" alignItems="flex-end">
              {/* Team */}
              <Box style={{ flex: 1, gap: 8 }}>
                <Box flexDirection="row" gap="8" alignItems="flex-start">
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16, flex: 1 }}>
                    Team
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: '500', color: theme.colors.grey04, lineHeight: 12 }}>
                    Required
                  </Text>
                </Box>
                <FormSelect
                  size="lg"
                  value={selectedTeam.name}
                  onPress={() => setIsTeamModalOpen(true)}
                  showChevron={false}
                  style={{
                    backgroundColor: theme.colors.grey02,
                    borderColor: theme.colors.grey03,
                  }}
                />
              </Box>

              {/* Color */}
              <Box style={{ gap: 8, width: 72 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                  Color
                </Text>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setIsColorModalOpen(true)}
                  style={{
                    backgroundColor: theme.colors.grey02,
                    borderColor: theme.colors.grey03,
                    height: 48,
                  }}
                >
                  <Box style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: selectedColor.value }} />
                </Button>
              </Box>

              {/* Icon */}
              <Box style={{ gap: 8, width: 72 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                  Icon
                </Text>
                <Button
                  variant="outline"
                  size="md"
                  onPress={() => setIsIconModalOpen(true)}
                  style={{
                    backgroundColor: theme.colors.grey02,
                    borderColor: theme.colors.grey03,
                    height: 48,
                  }}
                >
                  <SelectedIconComponent size={24} color={theme.colors.foreground} />
                </Button>
              </Box>
            </Box>

            {/* Members */}
            <Box style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>
                Members
              </Text>
              
              <Box style={{ gap: 16 }}>
                {members.map((member) => (
                  <ProjectCreationMemberRow
                    key={member.id}
                    member={member}
                    isHovered={hoveredMemberId === member.id}
                    isDropdownOpen={openDropdownId === member.id}
                    onMouseEnter={() => setHoveredMemberId(member.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                    onToggleDropdown={() => setOpenDropdownId(openDropdownId === member.id ? null : member.id)}
                    onUpdateRole={(role) => handleUpdateRole(member.id, role)}
                    onDelete={() => handleDeleteMember(member.id)}
                  />
                ))}

                {/* Add Member Button */}
                <Button
                  variant="ghost"
                  size="lg"
                  onPress={() => {}}
                  style={{
                    backgroundColor: theme.colors.grey02,
                    justifyContent: 'flex-start',
                    height: 48,
                  }}
                  leftIcon={<Plus size={16} color={theme.colors.secondaryGreen} strokeWidth={2} />}
                >
                  <Text style={{ color: theme.colors.secondaryGreen, fontWeight: '500' }}>
                    Add Member
                  </Text>
                </Button>
              </Box>
            </Box>
          </Box>
        </ScrollView>



      {/* Footer Buttons */}
      <Box
        style={{
          padding: 24,
          borderTopWidth: 1,
          borderColor: theme.colors.grey02,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 16,
          backgroundColor: theme.colors.white,
        }}
      >
        <Button variant="outline" color="secondary" size="lg" style={{ flex: 1, height: 48 }} onPress={onClose}>
          Cancel
        </Button>
        <Button variant="fill" color="secondary" size="lg" style={{ flex: 1, height: 48 }} onPress={handleCreateProject}>
          Create Project
        </Button>
      </Box>

      {/* Modals */}
      <TeamListModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSelectTeam={setSelectedTeam}
      />
      <ColorPickerModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        onSelectColor={setSelectedColor}
        selectedColorId={selectedColor.id}
      />
      <IconPickerModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={setSelectedIcon}
        selectedIconId={selectedIcon.id}
      />
    </Box>
  );
}
