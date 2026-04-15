import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Tooltip } from '@/components/Tooltip';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, Check, Eye, EyeOff, X, HardHat } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, TextInput as RNTextInput, ScrollView, View } from 'react-native';

// Simulated invite token data
const INVITE = {
  inviterName: 'James Hammer',
  taskName: 'Install Sink and Faucet in Kitchen',
  project: 'Raintree Hollow Court Renovation',
  email: 'newuser@example.com',
};

// Simulated already-registered emails (error state trigger)
const REGISTERED_EMAILS: string[] = [];

export default function JoinTasktagSignup({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void } = {}) {
  const theme = useTheme<Theme>();
  const router = useRouter();

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
  const [noteVisible, setNoteVisible] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(false);

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

    if (onSuccess) {
      onSuccess();
    }
    if (onClose) {
      onClose();
    }
    router.push('/prototype/join-task-non-user/my-task');
  };

  const shadowStyle = Platform.select({
    web: { boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any,
    ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    android: { elevation: 1 },
  });

  const devNote = (
    <Box
      backgroundColor="card"
      borderRadius="xl"
      padding="md"
      flexDirection="row"
      alignItems="flex-start"
      gap="sm"
      marginBottom="md"
      width="100%"
      style={{ zIndex: 10, backgroundColor: '#fbe676' } as any}
    >
      <Box flex={1} gap="xs">
        <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
        <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18 }}>
          If using a different email, this acts as a standard registration (no invite attached).
        </Text>
      </Box>
      <Pressable
        onPress={() => setNoteVisible(false)}
        style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
        hitSlop={8}
      >
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>×</Text>
      </Pressable>
    </Box>
  );

  const cardContent = (
    <>
        {/* Heading */}
        <Text variant="h2" textAlign="center" marginBottom="4">
          Create an account
        </Text>
        <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
          <Text variant="webLabelSmall" color="foreground" fontWeight="700">
            {INVITE.inviterName}
          </Text>
          <Text variant="webLabelSmall" color="mutedForeground">
            {' assigned this task'}
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
          <Text variant="webHeading22" color="foreground" style={{ marginBottom: 2 }}>
            {INVITE.taskName}
          </Text>
          <Box flexDirection="row" alignItems="center" gap="xs" style={{ marginBottom: 16 }}>
            <HardHat size={16} color={theme.colors.grey06} strokeWidth={2.5} />
            <Text variant="webLabelSmall" color="textSecondary">
              {INVITE.project}
            </Text>
          </Box>

          <Box flexDirection="row" alignItems="center" flexWrap="wrap" gap="4">
            <Text variant="webLabelSmall" color="mutedForeground">{"You'll join as an "}</Text>
            <Tooltip
              variant="bottom-left"
              trigger="hover"
              open={tooltipOpen}
              onOpenChange={setTooltipOpen}
              content={
                <View style={{ gap: 4 }}>
                  {['View and manage tasks', 'Collaborate with team', 'Upload files & media', 'Track project progress'].map((item, i) => (
                    <Text key={i} style={{ color: theme.colors.white, fontSize: 12, fontFamily: 'Inter_400Regular' }}>
                      {'• '}{item}
                    </Text>
                  ))}
                </View>
              }
            >
              <Box borderBottomWidth={1} borderColor="foreground" style={{ borderStyle: 'dotted' }}>
                <Text variant="webLabelSmall" color="foreground" fontWeight="700">Assignee</Text>
              </Box>
            </Tooltip>
            <Text variant="webLabelSmall" color="mutedForeground">{" with 3 other people"}</Text>
          </Box>
        </Box>

        {/* Social sign-in */}
        <Box marginBottom="lg" alignItems="center">
          <Box flexDirection="row" gap="md" width="100%" marginBottom="20">
            <Pressable
              onHoverIn={() => setIsGoogleHovered(true)}
              onHoverOut={() => setIsGoogleHovered(false)}
              onPress={() => {
                if (onClose) onClose();
                router.push('/prototype/join-task-non-user/my-task');
              }}
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
            <Text variant="webLabelSmall" color="mutedForeground">or continue with email</Text>
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
          Join This Task
        </Button>

        <Box marginTop="16" alignItems="center">
          <Text variant="webMetadataPrimary" color="textSecondary">
            Already have an account?{' '}
            <Text
              variant="webMetadataPrimary"
              color="secondaryGreen"
              fontWeight="600"
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
        <Box width="100%" maxWidth={600}>
          {noteVisible && devNote}
          <Box
            backgroundColor="card"
            width="100%"
            borderRadius="16"
            style={[shadowStyle, { maxHeight: '100%', overflow: 'hidden' as any, position: 'relative' as any }]}
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
      </Box>
    );
  }

  // ── Standalone page mode ──
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}
    >
      <Box width="100%" maxWidth={600}>
        <Box alignItems="center" width="100%" marginBottom="lg">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120, resizeMode: 'contain' }}
          />
        </Box>
        
        {noteVisible && devNote}

        <Box
          backgroundColor="card"
          width="100%"
          borderRadius="16"
          padding="24"
          style={shadowStyle}
        >
          {cardContent}
        </Box>
      </Box>
    </ScrollView>
  );
}
