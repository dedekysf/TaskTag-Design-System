import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Tooltip } from '@/components/Tooltip';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, Check, Eye, EyeOff, MapPin, X } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, TextInput as RNTextInput, ScrollView, View } from 'react-native';

// Simulated invite token data
const INVITE = {
  inviterName: 'James Hammer',
  projectName: 'Scott 1',
  address: '11 N Raintree Hollow Court',
  role: 'Member',
  email: 'newuser@example.com',
};

// Simulated already-registered emails (error state trigger)
const REGISTERED_EMAILS: string[] = [];

export default function JoinTasktagSignup({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void } = {}) {
  const theme = useTheme<Theme>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasTouchedPassword, setHasTouchedPassword] = useState(false);
  const [hasTypedPassword, setHasTypedPassword] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [isAppleHovered, setIsAppleHovered] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      setHasTypedPassword(true);
      if (passwordError === 'Password is required.') {
        setPasswordError('');
      }
    } else if (hasTypedPassword && password === '') {
      setPasswordError('Password is required.');
    }
  }, [password, hasTypedPassword, passwordError]);

  const validLength = password.length >= 8;
  const validNumber = /\d/.test(password);
  const validUppercase = /[A-Z]/.test(password);
  const validSpecial = /[!@#$%^&*]/.test(password);

  const emailError = REGISTERED_EMAILS.includes(INVITE.email)
    ? 'This email is already registered. Please log in instead.'
    : '';

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    password.trim() !== '' &&
    validLength &&
    validNumber &&
    validUppercase &&
    validSpecial &&
    !emailError;

  const handleSubmit = () => {
    let valid = true;

    if (!firstName.trim()) {
      setFirstNameError('First name is required.');
      valid = false;
    } else {
      setFirstNameError('');
    }

    if (!lastName.trim()) {
      setLastNameError('Last name is required.');
      valid = false;
    } else {
      setLastNameError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      setPasswordError('Invalid password');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid || emailError) return;

    // Simulate join API wait, then redirect to dashboard showing the modal
    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/prototype/join-team-non-user/team-dashboard' as any);
    }
  };

  const shadowStyle = Platform.select({
    web: { boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any,
    ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    android: { elevation: 1 },
  });

  const cardContent = (
    <>
        {/* Heading */}
        <Text variant="h2" textAlign="center" marginBottom="4">
          Create an account
        </Text>
        <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
          <Text variant="webMetadataPrimary" color="mutedForeground">
            {"You've been invited to this team by "}
          </Text>
          <Text variant="webMetadataPrimary" color="foreground" fontWeight="700">
            {INVITE.inviterName}
          </Text>
        </Box>

        {/* Context banner */}
        <Box
          backgroundColor="lightMint"
          alignItems="flex-start"
          padding="md"
          borderRadius="xl"
          marginBottom="lg"
          width="100%"
          position="relative"
          zIndex="10"
        >
          <Text variant="webLabelEmphasized" style={{ marginBottom: 4 }}>
            {INVITE.projectName}
          </Text>
          <Box flexDirection="row" alignItems="center" gap="4" marginBottom="16">
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text variant="webSecondaryBody" color="mutedForeground">
              {INVITE.address}
            </Text>
          </Box>

          <Box flexDirection="row" alignItems="center" gap="4">
            <Text variant="webSecondaryBody" color="mutedForeground">Your Role : </Text>
            <Tooltip
              variant="bottom-left"
              content={
                <View style={{ gap: 4 }}>
                  {['View and manage tasks', 'Upload files & media', 'Collaborate with team', 'Track project progress'].map((item, i) => (
                    <Text key={i} style={{ color: theme.colors.white, fontSize: 12, fontFamily: 'Inter_400Regular' }}>
                      {'• '}{item}
                    </Text>
                  ))}
                </View>
              }
            >
              <Box borderBottomWidth={1} borderColor="foreground" style={{ borderStyle: 'dotted' }}>
                <Text variant="webSecondaryBody" color="foreground" fontWeight="700">Member</Text>
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* Social sign-in */}
        <Box marginBottom="lg" alignItems="center">
          <Box flexDirection="row" gap="md" width="100%" marginBottom="20">
            <Pressable
              onHoverIn={() => setIsGoogleHovered(true)}
              onHoverOut={() => setIsGoogleHovered(false)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 52,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: isGoogleHovered ? theme.colors.grey01 : theme.colors.card,
                  gap: 12,
                  opacity: pressed ? 0.8 : 1,
                } as any,
                Platform.OS === 'web' && { cursor: 'pointer' } as any,
              ]}
            >
              <Image
                source={require('@/assets/images/google-logo.svg')}
                style={{ width: 22, height: 22, resizeMode: 'contain' }}
              />
              <Text variant="labelMedium" color="foreground">Google</Text>
            </Pressable>

            <Pressable
              onHoverIn={() => setIsAppleHovered(true)}
              onHoverOut={() => setIsAppleHovered(false)}
              style={({ pressed }) => [
                {
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 52,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: isAppleHovered ? theme.colors.grey01 : theme.colors.card,
                  gap: 12,
                  opacity: pressed ? 0.8 : 1,
                } as any,
                Platform.OS === 'web' && { cursor: 'pointer' } as any,
              ]}
            >
              <Image
                source={require('@/assets/images/apple-logo.svg')}
                style={{ width: 22, height: 22, resizeMode: 'contain' }}
              />
              <Text variant="labelMedium" color="foreground">Apple</Text>
            </Pressable>
          </Box>

          <Box flexDirection="row" alignItems="center" width="100%" gap="12">
            <Box flex={1} height={1} backgroundColor="border" />
            <Text variant="webMetadataPrimary" color="mutedForeground">or continue with email</Text>
            <Box flex={1} height={1} backgroundColor="border" />
          </Box>
        </Box>

        <Box marginBottom="md">
          {/* Email — pre-filled and locked */}
          <Box marginBottom="24">
            <TextInput
              label="Email"
              value={INVITE.email}
              disabled
              showClearButton={false}
              errorMessage={emailError}
            />
            <Text variant="webMetadataSecondary" color="mutedForeground" style={{ marginTop: -8 }}>
              A verification email will be sent to you to verify your address.
            </Text>
          </Box>

          {/* Name Row */}
          <Box flexDirection="row" gap="md" marginBottom="12">
            <Box flex={1}>
              <TextInput
                label="First Name"
                placeholder="e.g. John"
                value={firstName}
                onChangeText={setFirstName}
                errorMessage={firstNameError}
              />
            </Box>
            <Box flex={1}>
              <TextInput
                label="Last Name"
                placeholder="e.g. Doe"
                value={lastName}
                onChangeText={setLastName}
                errorMessage={lastNameError}
              />
            </Box>
          </Box>

          {/* Password */}
          <Box width="100%">
            <Text variant="labelMedium" marginBottom="sm" color={passwordError ? "alertRed" : "textPrimary"}>
              Password
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              borderWidth={1}
              borderColor={passwordError ? "alertRed" : isPasswordFocused ? "black" : "border"}
              borderRadius="8"
              backgroundColor="inputBackground"
              minHeight={theme.componentSizes.md}
              paddingHorizontal="12"
              paddingVertical="8"
            >
              <RNTextInput
                ref={passwordRef}
                placeholder="Enter password"
                placeholderTextColor={theme.colors.grey04}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => { setIsPasswordFocused(true); setHasTouchedPassword(true); }}
                onBlur={() => setIsPasswordFocused(false)}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: theme.colors.foreground,
                  fontFamily: 'Inter_400Regular',
                  ...Platform.select({ web: { outline: 'none' } as any })
                }}
              />
              <Pressable
                onPress={() => { setShowPassword(v => !v); setTimeout(() => passwordRef.current?.focus(), 10); }}
                style={{ padding: theme.spacing['4'], marginLeft: theme.spacing['8'] }}
              >
                {showPassword ? <Eye size={18} color={theme.colors.grey05} /> : <EyeOff size={18} color={theme.colors.grey05} />}
              </Pressable>
            </Box>
            {passwordError ? (
              <Box flexDirection="row" alignItems="center" gap="4" marginTop="4">
                <AlertTriangle size={14} color={theme.colors.alertRed} />
                <Text variant="caption" color="alertRed">{passwordError}</Text>
              </Box>
            ) : null}
            {(isPasswordFocused || hasTouchedPassword) && (
              <Box gap="4" marginTop="12">
                <Text variant="webMetadataPrimary" color="textSecondary">Your password must contain:</Text>
                {[
                  { label: 'At least 8 characters', valid: validLength },
                  { label: 'At least 1 number (0-9)', valid: validNumber },
                  { label: 'At least 1 uppercase letter (A-Z)', valid: validUppercase },
                  { label: 'At least 1 special character (e.g. !@#$%^&*)', valid: validSpecial },
                ].map((rule, idx) => (
                  <Box key={idx} flexDirection="row" alignItems="center" gap="4">
                    {rule.valid ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} /> : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>}
                    <Text variant="webMetadataPrimary" color={rule.valid ? "secondaryGreen" : "textSecondary"}>{rule.label}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Terms */}
        <Box marginBottom="16">
          <Text variant="webMetadataSecondary" style={{ lineHeight: 16 }}>
            {'By signing up, I agree to the TaskTag '}
            <Text variant="webMetadataSecondary" color="primary" fontWeight="500">Terms and Conditions</Text>
            {' and '}
            <Text variant="webMetadataSecondary" color="primary" fontWeight="500">Privacy Policy</Text>
            {'.'}
          </Text>
        </Box>

        {/* CTA */}
        <Button
          variant="fill"
          color="primary"
          size="lg"
          style={{ width: '100%', backgroundColor: isFormValid ? theme.colors.foreground : theme.colors.grey03 }}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          Join This Team
        </Button>

        <Box marginTop="16" alignItems="center">
          <Text variant="webMetadataPrimary" color="textSecondary">
            Already have an account?{' '}
            <Text
              variant="webMetadataPrimary"
              color="secondaryGreen"
              fontWeight="600"
              onPress={() => router.push('/')}
              style={{ cursor: 'pointer' } as any}
            >
              Log in
            </Text>
          </Text>
        </Box>
    </>
  );

  // ── Modal mode: ScrollView inside the white card ──
  if (onClose) {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
        <Box
          backgroundColor="card"
          width="100%"
          maxWidth={600}
          borderRadius="16"
          style={[shadowStyle, { flex: 1, maxHeight: '100%', overflow: 'hidden' as any, position: 'relative' as any }]}
        >
          <Pressable
            onPress={onClose}
            style={{ position: 'absolute' as any, top: 16, right: 16, zIndex: 10, cursor: 'pointer' } as any}
          >
            <X size={20} color={theme.colors.grey06} />
          </Pressable>
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            {cardContent}
          </ScrollView>
        </Box>
      </Box>
    );
  }

  // ── Standalone page mode ──
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}
    >
      <Box alignItems="center" width="100%" maxWidth={600} marginBottom="lg">
        <Image
          source={require('@/assets/images/tasktag-logo.png')}
          style={{ height: 36, width: 120, resizeMode: 'contain' }}
        />
      </Box>
      <Box
        backgroundColor="card"
        width="100%"
        maxWidth={600}
        borderRadius="16"
        padding="24"
        style={shadowStyle}
      >
        {cardContent}
      </Box>
    </ScrollView>
  );
}
