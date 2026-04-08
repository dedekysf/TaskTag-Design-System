import { Redirect } from 'expo-router';
import React from 'react';

export default function DesignSystemIndex() {
  return <Redirect href={"/design-system/colors" as any} />;
}
