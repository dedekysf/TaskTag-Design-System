import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Bell, MoreVertical, Plus, Search } from 'lucide-react-native';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

export interface ChatsScreenProps {
  /** Show Carlos Smith's new-member notification at the top of the chat list */
  showCarlosNotification?: boolean;
  /** Callback when user taps the Carlos Smith row */
  onCarlosPress?: () => void;
}

export function ChatsScreen({ showCarlosNotification = false, onCarlosPress }: ChatsScreenProps) {
  return (
    <>
      {/* ── Header ── */}
      <View style={{ backgroundColor: '#fff', paddingTop: 4, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image source={require('@/assets/images/tasktag-logo.png')} style={{ height: 32, width: 120 }} resizeMode="contain" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 } as any}>
            <Bell size={24} color={TTTheme.colors.textPrimary} />
            {/* TODO(BE): GET /api/user/me — replace with current user avatar */}
            <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16 }} resizeMode="cover" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 16 } as any}>
          <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
            <Search size={20} color={TTTheme.colors.grey04} />
            <Text variant="mobileBody" color="grey04">Search</Text>
          </View>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <MoreVertical size={24} color={TTTheme.colors.textPrimary} />
          </View>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />

      {/* ── Chat list ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* TODO(BE): GET /api/chats — replace with real chat list */}

        {/* Carlos Smith — shown when member just joined (new notification) */}
        {showCarlosNotification && (
          <TouchableOpacity onPress={onCarlosPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 16 } as any}>
            {/* TODO(BE): chat.member.avatar — CS initials, dark green per brand */}
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#0E6655', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: 18, color: '#fff' }}>CS</Text>
            </View>

            {/* Center: name + preview */}
            <View style={{ flex: 1, gap: 4 } as any}>
              {/* TODO(BE): chat.member.name */}
              <Text variant="mobileLabelSmall" color="foreground">Carlos Smith</Text>
              {/* TODO(BE): chat.lastMessage.text — member-joined event */}
              <Text variant="mobileSecondaryBody" color="grey05" numberOfLines={1}>
                Carlos Smith joined the...
              </Text>
            </View>

            {/* Right: unread badge (top) + timestamp (below) — right-aligned */}
            <View style={{ alignItems: 'flex-end', gap: 4, minWidth: 72 } as any}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>1</Text>
              </View>
              {/* TODO(BE): chat.lastMessage.timestamp */}
              <Text variant="mobileMetadataSecondary" color="grey05" style={{ textAlign: 'right' }}>
                A few seconds ago
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Tasktag Helpdesk */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 16 } as any}>
          {/* TODO(BE): chat.member.avatar */}
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#CC7351', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '700', fontSize: 18, color: '#fff' }}>TH</Text>
          </View>
          <View style={{ flex: 1, gap: 4 } as any}>
            <Text variant="mobileLabelSmall" color="foreground">Tasktag Helpdesk</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
              <Text variant="mobileSecondaryBody" color="grey05" style={{ flex: 1 }} numberOfLines={1}>
                Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.
              </Text>
              <Text variant="mobileMetadataSecondary" color="grey05" style={{ flexShrink: 0 }}>Monday</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* FAB — bottom:109 = nav height(93) + right padding(16) */}
      <View style={{ position: 'absolute', right: 16, bottom: 109 }}>
        <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 } as any}>
          <Plus size={22} color="#fff" />
          <Text variant="mobileBody" color="white">New Chat</Text>
        </View>
      </View>
    </>
  );
}
