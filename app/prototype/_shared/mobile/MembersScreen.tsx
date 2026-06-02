import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { ChevronLeft, Link, Mail, MoreVertical, Repeat, Search, Trash2, UserPlus } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { StatusBarRow } from './StatusBarRow';
import { SuccessModal } from './SuccessModal';

export function MembersScreen({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary?: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ChevronLeft size={20} color={TTTheme.colors.textPrimary} />
          <Text variant="mobileLabelEmphasized" color="foreground">Member</Text>
        </View>
        <MoreVertical size={20} color={TTTheme.colors.textPrimary} />
      </View>

      {/* Search bar */}
      <View style={{ marginHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.grey03, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}>
        <Search size={18} color={TTTheme.colors.grey04} />
        <Text variant="mobileLabelSmall" color="grey05">Search</Text>
      </View>

      {/* Invite or Add Member row */}
      <View style={{ marginHorizontal: 16, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
          <UserPlus size={20} color="#fff" />
        </View>
        <Text variant="mobileLabelEmphasized" color="foreground">Invite or Add Member</Text>
      </View>

      {/* Copy link to invite row */}
      <View style={{ marginHorizontal: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
          <Link size={20} color="#fff" />
        </View>
        <Text variant="mobileLabelEmphasized" color="foreground">Copy link to invite</Text>
      </View>

      {/* TODO(BE): GET /api/projects/:id/invites?status=pending — pending invites list + count */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
        <Text variant="mobileMetadataPrimary" color="foreground">Pending Member (1)</Text>
      </View>

      {/* Pending invite row */}
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={18} color={TTTheme.colors.grey05} />
        </View>
        <View style={{ flex: 1 }}>
          {/* TODO(BE): invite.member.email */}
          <Text variant="mobileLabelSmall" color="foreground">carlossmith@gmail.com</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            {/* TODO(BE): invite.role + invite.expiresAt */}
            <Text variant="mobileMetadataPrimary" color="grey04">Viewer</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">•</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">Expired June 3, 2026</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Repeat size={18} color={TTTheme.colors.grey06} />
          <Trash2 size={18} color={TTTheme.colors.grey06} />
        </View>
      </View>

      {/* TODO(BE): GET /api/projects/:id/members — active members list + count */}
      <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 8 }}>
        <Text variant="mobileMetadataPrimary" color="foreground">Members (1)</Text>
      </View>

      {/* Maria Jose member row */}
      <View style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
        {/* TODO(BE): member.avatar */}
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.pastelOrange, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>MJ</Text>
        </View>
        <View style={{ flex: 1 }}>
          {/* TODO(BE): member.name + member.email + member.role */}
          <Text variant="mobileLabelSmall" color="foreground">Maria Jose</Text>
          <Text variant="mobileMetadataPrimary" color="grey04">mariajose@gmail.com</Text>
        </View>
        <Text variant="mobileLabelSmall" color="foreground">Owner</Text>
      </View>

      {/* Success modal — overlay + animated card */}
      <SuccessModal
        title="Invite Sent!"
        pill="carlossmith@gmail.com"
        description={"While the invite is pending, add task to the project. You'll be notified when your crew member join."}
        primaryLabel="Add Task"
        onPrimary={onPrimary}
      />
    </View>
  );
}
