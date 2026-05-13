/**
 * CHAT PANEL COMPONENTS REFERENCE
 * 
 * Three separate, standalone components for different chat UX patterns:
 * 
 * 1. ChatPanelList (width: 550px)
 *    - Shows full list of chats/conversations
 *    - Header: Search + More options + Collapse button
 *    - Body: Scrollable list of chat items
 *    - Footer: "New Message" FAB button
 *    - Import: import { ChatPanelList } from '@/components/ChatPanelList'
 * 
 * 2. ChatPanelRoom (width: 550px)
 *    - Shows active chat room with messages
 *    - Header: Avatar + Contact name + Controls
 *    - Body: Message thread with date separator
 *    - Footer: Message input with formatting tools
 *    - Import: import { ChatPanelRoom } from '@/components/ChatPanelRoom'
 * 
 * 3. ChatPanelMini (width: 80px)
 *    - Collapsed mini sidebar with avatar list
 *    - Shows only stacked avatar circles
 *    - Header: Expand button
 *    - Body: Vertical list of avatars (44x44)
 *    - Footer: "New Chat" FAB button (44x44)
 *    - Import: import { ChatPanelMini } from '@/components/ChatPanelMini'
 * 
 * USAGE EXAMPLES:
 * 
 * // List Panel
 * <ChatPanelList 
 *   listItems={items}
 *   onCollapse={() => setExpanded(false)}
 *   onNewMessage={() => handleNewMessage()}
 * />
 * 
 * // Room Panel
 * <ChatPanelRoom
 *   roomContact={{ variant: 'text', initials: 'JD', color: 'purple', name: 'John Doe' }}
 *   roomMessages={messages}
 *   dateSeparator="Today"
 *   onClose={() => setRoomOpen(false)}
 * />
 * 
 * // Mini Panel
 * <ChatPanelMini
 *   users={[
 *     { variant: 'photo', src: require('@/assets/images/sample-one.jpg'), isActive: true },
 *     { variant: 'text', initials: 'TH', color: 'orange', isActive: false }
 *   ]}
 *   onExpand={() => setExpanded(true)}
 *   onNewMessage={() => handleNewMessage()}
 * />
 * 
 * KEY DIFFERENCES:
 * 
 * - ChatPanelList SHOULD NOT have a user avatar list on the side (that's ChatPanelMini's job)
 * - ChatPanelRoom is for ONE active conversation (not mixing with list)
 * - ChatPanelMini is for collapsed navigation (not showing conversation content)
 * - They are SEPARATE components - don't nest them
 * 
 * LAYOUT PATTERN (for full chat experience):
 * 
 * [Main Content] | [ChatPanelList (550px)] | [ChatPanelMini (80px)]
 *                or
 * [Main Content] | [ChatPanelRoom (550px)] |
 *                or
 * [Main Content] | [ChatPanelRoom (550px) + ChatPanelMini (80px)]
 *                or
 * [Main Content] | [ChatPanelMini (80px)]
 */

export const CHAT_PANEL_REFERENCE = true;
