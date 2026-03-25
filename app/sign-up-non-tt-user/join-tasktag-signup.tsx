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
    router.push('/sign-up-non-tt-user/project-dashboard');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}
    >
      <Box alignItems="center" style={{ width: '100%', maxWidth: 480, marginBottom: theme.spacing.lg }}>
        <Image
          source={require('../../assets/images/ttlogo.png')}
          style={{ height: 36, width: 120, resizeMode: 'contain' }}
        />
      </Box>

      <Box
        backgroundColor="card"
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: theme.borderRadii['16'],
          padding: theme.spacing['24'],
          ...Platform.select({
            web: { boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any,
            ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
            android: { elevation: 1 },
          }),
        }}
      >
        {/* Heading */}
        <Text variant="h2" style={{ textAlign: 'center', marginBottom: theme.spacing['4'] }}>
          Create an account
        </Text>
        <Text variant="webMetadataPrimary" color="mutedForeground" style={{ textAlign: 'center', marginBottom: theme.spacing['16'] }}>
          {"You've been invited to this project by "}
          <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.foreground }}>{INVITE.inviterName}</Text>
        </Text>

        {/* Context banner */}
        <Box
          backgroundColor="lightMint"
          alignItems="flex-start"
          padding="md"
          style={{ borderRadius: theme.borderRadii.xl, marginBottom: theme.spacing.lg, width: '100%', position: 'relative', zIndex: 1 }}
        >
          <Text variant="webLabelEmphasized" marginBottom="4">
            {INVITE.projectName}
          </Text>
          <Box flexDirection="row" alignItems="center" style={{ gap: 4, marginBottom: theme.spacing['16'] }}>
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text variant="webSecondaryBody" color="mutedForeground">
              {INVITE.address}
            </Text>
          </Box>

          <Text variant="webSecondaryBody" color="mutedForeground">
            {"Your Role : "}
            <Tooltip
              variant="bottom-left"
              tooltipStyle="default"
              size="sm"
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
              <Text
                variant="webSecondaryBody"
                color="mutedForeground"
                style={{
                  fontWeight: '700',
                  color: theme.colors.foreground,
                  ...Platform.select({
                    web: { borderBottomWidth: 1, borderBottomColor: theme.colors.mutedForeground, borderStyle: 'dashed', cursor: 'help' } as any,
                    default: { borderBottomWidth: 1, borderBottomColor: theme.colors.mutedForeground },
                  }),
                }}
              >
                {INVITE.role}
              </Text>
            </Tooltip>
          </Text>
        </Box>

        <Box style={{ gap: 0, marginBottom: theme.spacing.md }}>
          {/* Email — pre-filled and locked */}
          <Box style={{ marginBottom: 16 }}>
            <TextInput
              label="Email"
              value={INVITE.email}
              disabled
              showClearButton={false}
              errorMessage={emailError}
            />
            <Text variant="webMetadataSecondary" color="mutedForeground" style={{ marginTop: -10 }}>
              A verification email will be sent to you to verify your address.
            </Text>
          </Box>

          {/* Name */}
          <Box>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.grey04}
              value={name}
              onChangeText={setName}
              errorMessage={nameError}
              required
              autoFocus
            />
          </Box>

          {/* Password — manual for eye toggle */}
          <Box style={{ width: '100%' }}>
            <Text
              variant="labelMedium"
              style={{
                marginBottom: theme.spacing['8'],
                color: passwordError ? theme.colors.alertRed : theme.colors.textPrimary,
              }}
            >
              Password <Text style={{ color: theme.colors.alertRed }}>*</Text>
            </Text>
            <Box
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: passwordError ? theme.colors.alertRed : isPasswordFocused ? theme.colors.black : theme.colors.border,
                borderRadius: theme.borderRadii['8'],
                backgroundColor: theme.colors.inputBackground,
                minHeight: theme.componentSizes.md,
                paddingHorizontal: theme.spacing['12'],
                paddingVertical: theme.spacing['8'],
              }}
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
                  outline: 'none',
                } as any}
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
              <Box flexDirection="row" alignItems="center" style={{ gap: theme.spacing['4'], marginTop: theme.spacing['4'] }}>
                <AlertTriangle size={14} color={theme.colors.alertRed} />
                <Text variant="caption" style={{ color: theme.colors.alertRed }}>
                  {passwordError}
                </Text>
              </Box>
            ) : null}

            {isPasswordFocused ? (
              <Box style={{ gap: 4, marginTop: theme.spacing['12'] }}>
                <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary }}>Your password must contain:</Text>
                <Box flexDirection="row" alignItems="center" style={{ gap: theme.spacing['4'] }}>
                  {validLength ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} /> : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>}
                  <Text variant="webMetadataPrimary" style={{ color: validLength ? theme.colors.secondaryGreen : theme.colors.textSecondary }}>At least 8 characters</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" style={{ gap: theme.spacing['4'] }}>
                  {validNumber ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} /> : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>}
                  <Text variant="webMetadataPrimary" style={{ color: validNumber ? theme.colors.secondaryGreen : theme.colors.textSecondary }}>At least 1 number (0-9)</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" style={{ gap: theme.spacing['4'] }}>
                  {validUppercase ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} /> : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>}
                  <Text variant="webMetadataPrimary" style={{ color: validUppercase ? theme.colors.secondaryGreen : theme.colors.textSecondary }}>At least 1 uppercase letter (A-Z)</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" style={{ gap: theme.spacing['4'] }}>
                  {validSpecial ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} /> : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>}
                  <Text variant="webMetadataPrimary" style={{ color: validSpecial ? theme.colors.secondaryGreen : theme.colors.textSecondary }}>At least 1 special character (e.g. !@#$%^&*)</Text>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Box>

        {/* Terms */}
        <Text variant="webMetadataSecondary" style={{ textAlign: 'left', marginBottom: theme.spacing['16'], lineHeight: 16 }}>
          {'By signing up, I agree to the TaskTag '}
          <Text variant="webMetadataSecondary" color="primary" style={{ fontWeight: '500' }}>Terms and Conditions</Text>
          {' and '}
          <Text variant="webMetadataSecondary" color="primary" style={{ fontWeight: '500' }}>Privacy Policy</Text>
          {'.'}
        </Text>

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
