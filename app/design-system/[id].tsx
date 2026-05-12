import AlertContent from '@/app/design-system/component/alert';
import AvatarContent from '@/app/design-system/component/avatar';
import BadgeContent from '@/app/design-system/component/badge';
import BorderRadiusContent from '@/app/design-system/foundation/border-radius';
import ButtonContent from '@/app/design-system/component/button';
import CardContent from '@/app/design-system/component/card';
import CheckboxContent from '@/app/design-system/component/checkbox';
import ColorsContent from '@/app/design-system/foundation/colors';
import ElevationContent from '@/app/design-system/foundation/elevation';
import HighlightTextContent from '@/app/design-system/component/highlight-text';
import IconsContent from '@/app/design-system/foundation/icons';
import ImagesContent from '@/app/design-system/foundation/images';
import LogosContent from '@/app/design-system/foundation/logos';
import SizesContent from '@/app/design-system/foundation/sizes';
import SpacingContent from '@/app/design-system/foundation/spacing';
import SearchInputContent from '@/app/design-system/component/search-input';
import StatusBadgeContent from '@/app/design-system/component/status-badge';
import TabContent from '@/app/design-system/component/tab';
import TextInputContent from '@/app/design-system/component/text-input';
import TextareaContent from '@/app/design-system/component/textarea';
import ToastContent from '@/app/design-system/component/toast';
import TooltipContent from '@/app/design-system/component/tooltip';
import TypographyMobileContent from '@/app/design-system/foundation/typography-mobile';
import TypographyWebContent from '@/app/design-system/foundation/typography-web';
import AuthLandingContent from '@/app/design-system/page-template/auth-landing';
import BaseDashboardContent from '@/app/design-system/page-template/base-dashboard';
import EmptyStateContent from '@/app/design-system/page-template/empty-state';
import ListTableContent from '@/app/design-system/page-template/list-table';
// Chat
import ChatHeaderContent from '@/app/design-system/chat/chat-header';
import ChatInputContent from '@/app/design-system/chat/chat-input';
import ChatMessageContent from '@/app/design-system/chat/chat-message';
import ChatImageGridContent from '@/app/design-system/chat/chat-image-grid';
import ChatImageSelectorContent from '@/app/design-system/chat/chat-image-selector';
import ChatImageViewerContent from '@/app/design-system/chat/chat-image-viewer';
// Overlays
import BottomSheetContent from '@/app/design-system/overlay/bottom-sheet';
import ConfirmationModalContent from '@/app/design-system/overlay/confirmation-modal';
import UpgradeModalContent from '@/app/design-system/overlay/upgrade-modal';
// Data Display
import ActivityItemContent from '@/app/design-system/data/activity-item';
import DataTableContent from '@/app/design-system/data/data-table';
import RoleDropdownContent from '@/app/design-system/data/role-dropdown';
import SectionHeaderContent from '@/app/design-system/data/section-header';
// Patterns
import DownloadAppContent from '@/app/design-system/pattern/download-app';
import InvitationCardContent from '@/app/design-system/pattern/invitation-card';
import LandingFooterContent from '@/app/design-system/pattern/landing-footer';
import SkillsTagContent from '@/app/design-system/pattern/skills-tag';
// Components (second batch)
import AssignedMembersButtonContent from '@/app/design-system/component/assigned-members-button';
import ChecklistItemContent from '@/app/design-system/component/checklist-item';
import DropdownContent from '@/app/design-system/component/dropdown';
import MemberRowContent from '@/app/design-system/component/member-row';
import PriorityDropdownContent from '@/app/design-system/component/priority-dropdown';
import RadioButtonContent from '@/app/design-system/component/radio-button';
import SideNavContent from '@/app/design-system/component/side-nav';
import TagContent from '@/app/design-system/component/tag';
import ToggleContent from '@/app/design-system/component/toggle';
// Overlays (second batch)
import ModalContent from '@/app/design-system/overlay/modal';
// Mobile (second batch)
import BannerContent from '@/app/design-system/mobile/banner';
import BottomNavContent from '@/app/design-system/mobile/bottom-nav';
import FABContent from '@/app/design-system/mobile/fab';
import HangTightBannerContent from '@/app/design-system/mobile/hang-tight-banner';
import HomeBarContent from '@/app/design-system/mobile/home-bar';
import MobileBrowserHeaderContent from '@/app/design-system/mobile/mobile-browser-header';
import MobileStatusBarContent from '@/app/design-system/mobile/mobile-status-bar';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function DesignSystemDynamicRoute() {
  const { id } = useLocalSearchParams();

  switch (id) {
    // Foundation
    case 'colors':
      return <ColorsContent />;
    case 'typography-web':
      return <TypographyWebContent />;
    case 'typography-mobile':
      return <TypographyMobileContent />;
    case 'radius':
      return <BorderRadiusContent />;
    case 'elevation':
      return <ElevationContent />;
    case 'spacing':
      return <SpacingContent />;
    case 'sizes':
      return <SizesContent />;
    case 'icons':
      return <IconsContent />;
    case 'logos':
      return <LogosContent />;
    case 'images':
      return <ImagesContent />;
    // Components
    case 'button':
      return <ButtonContent />;
    case 'checkbox':
      return <CheckboxContent />;
    case 'card':
      return <CardContent />;
    case 'alert':
      return <AlertContent />;
    case 'avatar':
      return <AvatarContent />;
    case 'badge':
      return <BadgeContent />;
    case 'tab':
      return <TabContent />;
    case 'text-input':
      return <TextInputContent />;
    case 'search-input':
      return <SearchInputContent />;
    case 'status-badge':
      return <StatusBadgeContent />;
    case 'textarea':
      return <TextareaContent />;
    case 'assigned-members-button':
      return <AssignedMembersButtonContent />;
    case 'checklist-item':
      return <ChecklistItemContent />;
    case 'dropdown':
      return <DropdownContent />;
    case 'member-row':
      return <MemberRowContent />;
    case 'priority-dropdown':
      return <PriorityDropdownContent />;
    case 'radio-button':
      return <RadioButtonContent />;
    case 'side-nav':
      return <SideNavContent />;
    case 'tag':
      return <TagContent />;
    case 'toast':
      return <ToastContent />;
    case 'toggle':
      return <ToggleContent />;
    case 'tooltip':
      return <TooltipContent />;
    case 'highlight-text':
      return <HighlightTextContent />;
    // Chat
    case 'chat-header':
      return <ChatHeaderContent />;
    case 'chat-input':
      return <ChatInputContent />;
    case 'chat-message':
      return <ChatMessageContent />;
    case 'chat-image-grid':
      return <ChatImageGridContent />;
    case 'chat-image-selector':
      return <ChatImageSelectorContent />;
    case 'chat-image-viewer':
      return <ChatImageViewerContent />;
    // Overlays
    case 'bottom-sheet':
      return <BottomSheetContent />;
    case 'confirmation-modal':
      return <ConfirmationModalContent />;
    case 'modal':
      return <ModalContent />;
    case 'upgrade-modal':
      return <UpgradeModalContent />;
    // Data Display
    case 'activity-item':
      return <ActivityItemContent />;
    case 'data-table':
      return <DataTableContent />;
    case 'role-dropdown':
      return <RoleDropdownContent />;
    case 'section-header':
      return <SectionHeaderContent />;
    // Patterns
    case 'download-app':
      return <DownloadAppContent />;
    case 'invitation-card':
      return <InvitationCardContent />;
    case 'landing-footer':
      return <LandingFooterContent />;
    case 'skills-tag':
      return <SkillsTagContent />;
    // Mobile
    case 'banner':
      return <BannerContent />;
    case 'bottom-nav':
      return <BottomNavContent />;
    case 'fab':
      return <FABContent />;
    case 'hang-tight-banner':
      return <HangTightBannerContent />;
    case 'home-bar':
      return <HomeBarContent />;
    case 'mobile-browser-header':
      return <MobileBrowserHeaderContent />;
    case 'mobile-status-bar':
      return <MobileStatusBarContent />;
    // Page Templates
    case 'auth-landing':
      return <AuthLandingContent />;
    case 'base-dashboard':
      return <BaseDashboardContent />;
    case 'empty-state':
      return <EmptyStateContent />;
    case 'list-table':
      return <ListTableContent />;
    default:
      return <ColorsContent />;
  }
}
