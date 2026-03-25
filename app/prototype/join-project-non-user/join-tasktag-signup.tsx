import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Tooltip } from '@/components/Tooltip';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, Check, Eye, EyeOff, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Platform, Pressable, TextInput as RNTextInput, ScrollView, View } from 'react-native';

// Simulated invite token data
const INVITE = {
  inviterName: 'James Hammer',
  projectName: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  role: 'Editor',
  email: 'newuser@example.com',
};

// Simulated already-registered emails (error state trigger)
const REGISTERED_EMAILS: string[] = [];

export default function JoinTasktagSignup() {
  const theme = useTheme<Theme>();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validLength = password.length >= 8;
  const validNumber = /\d/.test(password);
  const validUppercase = /[A-Z]/.test(password);
  const validSpecial = /[!@#$%^&*]/.test(password);

  const emailError = REGISTERED_EMAILS.includes(INVITE.email)
    ? 'This email is already registered. Please log in instead.'
    : '';

  const handleSubmit = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Name is required.');
      valid = false;
    } else {
      setNameError('');
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
    router.push('/prototype/join-project-non-user/project-dashboard');
  };

  const shadowStyle = Platform.select({
    web: { boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any,
    ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    android: { elevation: 1 },
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}
    >
      <Box alignItems="center" width="100%" maxWidth={480} marginBottom="lg">
        <Image
          source={require('@/assets/images/tasktag-logo.png')}
          style={{ height: 36, width: 120, resizeMode: 'contain' }}
        />
      </Box>

      <Box
        backgroundColor="card"
        width="100%"
        maxWidth={480}
        borderRadius="16"
        padding="24"
        style={shadowStyle}
      >
        {/* Heading */}
        <Text variant="h2" textAlign="center" marginBottom="4">
          Create an account
        </Text>
        <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
          <Text variant="webMetadataPrimary" color="mutedForeground">
            {"You've been invited to this project by "}
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
          <Text variant="webLabelEmphasized" marginBottom="4">
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
              tooltipStyle="default"
              size="sm"
              content={
                <Box gap="4">
                  {['View and manage tasks', 'Upload files & media', 'Collaborate with team', 'Track project progress'].map((item, i) => (
                    <Text key={i} variant="caption" color="white" style={{ fontFamily: 'Inter_400Regular' }}>
                      {'• '}{item}
                    </Text>
                  ))}
                </Box>
              }
            >
              <Text
                variant="webSecondaryBody"
                color="foreground"
                fontWeight="700"
                style={{
                  ...Platform.select({
                    web: { borderBottomWidth: 1, borderBottomColor: theme.colors.mutedForeground, borderStyle: 'dashed', cursor: 'help' } as any,
                    default: { borderBottomWidth: 1, borderBottomColor: theme.colors.mutedForeground },
                  }),
                }}
              >
                {INVITE.role}
              </Text>
            </Tooltip>
          </Box>
        </Box>

        <Box gap="md" marginBottom="md">
          {/* Email — pre-filled and locked */}
          <Box>
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

          {/* Name */}
          <Box>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              errorMessage={nameError}
              required
              autoFocus
            />
          </Box>

          {/* Password — custom for compliance audit */}
          <Box width="100%">
            <Text
              variant="labelMedium"
              marginBottom="sm"
              color={passwordError ? "alertRed" : "textPrimary"}
            >
              Password <Text color="alertRed">*</Text>
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
                onFocus={() => setIsPasswordFocused(true)}
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
                onPress={() => {
                  setShowPassword(v => !v);
                  setTimeout(() => passwordRef.current?.focus(), 10);
                }}
                style={{ padding: theme.spacing['4'], marginLeft: theme.spacing['8'] }}
              >
                {showPassword
                  ? <EyeOff size={18} color={theme.colors.grey05} />
                  : <Eye size={18} color={theme.colors.grey05} />
                }
              </Pressable>
            </Box>
            {passwordError ? (
              <Box flexDirection="row" alignItems="center" gap="4" marginTop="4">
                <AlertTriangle size={14} color={theme.colors.alertRed} />
                <Text variant="caption" color="alertRed">
                  {passwordError}
                </Text>
              </Box>
            ) : null}

            {isPasswordFocused && (
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
          style={{ width: '100%' }}
          onPress={handleSubmit}
          disabled={!!emailError}
        >
          Join This Project
        </Button>
      </Box>
    </ScrollView>
  );
}
