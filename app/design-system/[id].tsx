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
import SizesContent from '@/app/design-system/foundation/sizes';
import SpacingContent from '@/app/design-system/foundation/spacing';
import SearchInputContent from '@/app/design-system/component/search-input';
import StatusBadgeContent from '@/app/design-system/component/status-badge';
import TabContent from '@/app/design-system/component/tab';
import TextInputContent from '@/app/design-system/component/text-input';
import TextareaContent from '@/app/design-system/component/textarea';
import TooltipContent from '@/app/design-system/component/tooltip';
import TypographyMobileContent from '@/app/design-system/foundation/typography-mobile';
import TypographyWebContent from '@/app/design-system/foundation/typography-web';
import AuthLandingContent from '@/app/design-system/page-template/auth-landing';
import BaseDashboardContent from '@/app/design-system/page-template/base-dashboard';
import EmptyStateContent from '@/app/design-system/page-template/empty-state';
import ListTableContent from '@/app/design-system/page-template/list-table';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function DesignSystemDynamicRoute() {
  const { id } = useLocalSearchParams();

  switch (id) {
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
    case 'tooltip':
      return <TooltipContent />;
    case 'highlight-text':
      return <HighlightTextContent />;
    case 'icons':
      return <IconsContent />;
    case 'auth-landing':
      return <AuthLandingContent />;
    case 'base-dashboard':
      return <BaseDashboardContent />;
    case 'empty-state':
      return <EmptyStateContent />;
    case 'list-table':
      return <ListTableContent />;
    default:
      // Fallback
      return <ColorsContent />;
  }
}
