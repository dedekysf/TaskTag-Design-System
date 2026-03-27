import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, Check, Eye, EyeOff, X } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, TextInput as RNTextInput, ScrollView, View } from 'react-native';

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

export default function SignupWithEmail() {
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
    router.push('/prototype/m-join-project-non-user/project-overview-browser' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={[{ position: 'absolute', width: '100%', height: '100%' }, Platform.OS === 'web' && { cursor: 'default' } as any]}
        onPress={() => router.back()}
      />
      <View style={{ width: '100%', height: '100%', backgroundColor: theme.colors.background, borderRadius: 24, overflow: 'hidden', elevation: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 32, justifyContent: 'center' }}
        >
          <Box width="100%">
            {/* Heading */}
            <Text variant="h2" textAlign="center" marginBottom="4">
              Create an account
            </Text>
            <Text variant="webMetadataPrimary" color="mutedForeground" textAlign="center" marginBottom="16">
              One step away from joining the project.
            </Text>

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
              <Box flexDirection="row" gap="md" marginBottom="8">
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

              {/* Password — custom for compliance audit */}
              <Box width="100%">
                <Text
                  variant="labelMedium"
                  marginBottom="sm"
                  color={passwordError ? "alertRed" : "textPrimary"}
                >
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
                    onFocus={() => {
                      setIsPasswordFocused(true);
                      setHasTouchedPassword(true);
                    }}
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
                      ? <Eye size={18} color={theme.colors.grey05} />
                      : <EyeOff size={18} color={theme.colors.grey05} />
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
              Join This Project
            </Button>

          </Box>
        </ScrollView>

        {/* Close Button Modal Overlay */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            {
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.colors.grey02,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              opacity: pressed ? 0.7 : 1,
            },
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any)
          ]}
        >
          <X size={18} color={theme.colors.foreground} />
        </Pressable>
      </View>
    </View>
  );
}
