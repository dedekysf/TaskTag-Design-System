import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Tooltip } from '@/components/Tooltip';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { AlertTriangle, Check, ChevronLeft, Eye, EyeOff, Hammer, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, TextInput as RNTextInput, ScrollView, View } from 'react-native';

const INVITE = {
  inviterName: 'James Hammer',
  taskName: 'Deep clean the kitchen appliances',
  project: 'LA Avenue 37 D',
  email: 'newuser@example.com',
};

const REGISTERED_EMAILS: string[] = [];
type Step = 'select' | 'email-form';

export default function JoinTasktagSignup() {
  const theme = useTheme<Theme>();
  const [step, setStep] = useState<Step>('select');
  const [noteVisible, setNoteVisible] = useState(true);

  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [isAppleHovered, setIsAppleHovered] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

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
      if (passwordError === 'Password is required.') setPasswordError('');
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
    firstName.trim() !== '' && lastName.trim() !== '' && password.trim() !== '' &&
    validLength && validNumber && validUppercase && validSpecial && !emailError;

  const handleSubmit = () => {
    let valid = true;
    if (!firstName.trim()) { setFirstNameError('First name is required.'); valid = false; } else setFirstNameError('');
    if (!lastName.trim()) { setLastNameError('Last name is required.'); valid = false; } else setLastNameError('');
    if (!password) {
      setPasswordError('Password is required.'); valid = false;
    } else if (!validLength || !validNumber || !validUppercase || !validSpecial) {
      setPasswordError('Invalid password'); valid = false;
    } else setPasswordError('');
    if (!valid || emailError) return;
    router.push('/prototype/m-join-task-non-user/task-overview-browser' as any);
  };

  const emailFormContent = (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, justifyContent: 'center' }}>
      <Box width="100%">
        <Box flexDirection="row" alignItems="center" marginBottom="16">
          <Pressable
            onPress={() => setStep('select')}
            hitSlop={8}
            style={({ pressed }) => [{
              width: 32, height: 32, borderRadius: 8,
              backgroundColor: theme.colors.grey02,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            }, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
          >
            <ChevronLeft size={18} color={theme.colors.foreground} />
          </Pressable>
          <Text variant="h2" textAlign="center" style={{ flex: 1 }}>Sign Up with Email</Text>
          <View style={{ width: 32 }} />
        </Box>

        <Box marginBottom="md">
          <Box marginBottom="24">
            <TextInput label="Email" value={INVITE.email} disabled showClearButton={false} errorMessage={emailError} />
            <Text variant="webMetadataSecondary" color="mutedForeground" style={{ marginTop: -8 }}>
              A verification email will be sent to you to verify your address.
            </Text>
          </Box>

          <Box flexDirection="row" gap="md" marginBottom="8">
            <Box flex={1}>
              <TextInput label="First Name" placeholder="e.g. John" value={firstName} onChangeText={setFirstName} errorMessage={firstNameError} autoFocus />
            </Box>
            <Box flex={1}>
              <TextInput label="Last Name" placeholder="e.g. Doe" value={lastName} onChangeText={setLastName} errorMessage={lastNameError} />
            </Box>
          </Box>

          <Box width="100%">
            <Text variant="labelMedium" marginBottom="sm" color={passwordError ? 'alertRed' : 'textPrimary'}>Password</Text>
            <Box
              flexDirection="row" alignItems="center" borderWidth={1}
              borderColor={passwordError ? 'alertRed' : isPasswordFocused ? 'black' : 'border'}
              borderRadius="8" backgroundColor="inputBackground"
              minHeight={theme.componentSizes.md} paddingHorizontal="12" paddingVertical="8"
            >
              <RNTextInput
                ref={passwordRef}
                placeholder="Enter password" placeholderTextColor={theme.colors.grey04}
                value={password} onChangeText={setPassword} secureTextEntry={!showPassword}
                onFocus={() => { setIsPasswordFocused(true); setHasTouchedPassword(true); }}
                onBlur={() => setIsPasswordFocused(false)}
                style={{ flex: 1, fontSize: 16, color: theme.colors.foreground, fontFamily: 'Inter_400Regular', ...Platform.select({ web: { outline: 'none' } as any }) }}
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
                ].map((rule, i) => (
                  <Box key={i} flexDirection="row" alignItems="center" gap="4">
                    {rule.valid
                      ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} />
                      : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>
                    }
                    <Text variant="webMetadataPrimary" color={rule.valid ? 'secondaryGreen' : 'textSecondary'}>{rule.label}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box marginBottom="16">
          <Text variant="webMetadataSecondary" style={{ lineHeight: 16 }}>
            {'By signing up, I agree to the TaskTag '}
            <Text variant="webMetadataSecondary" color="primary" fontWeight="500">Terms and Conditions</Text>
            {' and '}
            <Text variant="webMetadataSecondary" color="primary" fontWeight="500">Privacy Policy</Text>
            {'.'}
          </Text>
        </Box>

        <Button
          variant="fill" color="primary" size="lg"
          style={{ width: '100%', backgroundColor: isFormValid ? theme.colors.foreground : theme.colors.grey03 }}
          onPress={handleSubmit} disabled={!isFormValid}
        >
          Join This Task
        </Button>
      </Box>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={[{ position: 'absolute', width: '100%', height: '100%' }, Platform.OS === 'web' && { cursor: 'default' } as any]}
        onPress={() => router.back()}
      />

      {noteVisible && (
        <View style={{ marginHorizontal: 12, marginBottom: 12, backgroundColor: '#fbe676', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 8, zIndex: 10 }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text variant="webLabelEmphasized" style={{ color: '#000' }}>Note for Dev</Text>
            <Text variant="webMetadataPrimary" style={{ color: '#000', lineHeight: 18 }}>
              If using a different email, this acts as a standard registration (no invite attached).
            </Text>
          </View>
          <Pressable
            onPress={() => setNoteVisible(false)}
            style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Text variant="webLabelEmphasized" style={{ color: '#000', fontSize: 16, lineHeight: 16 }}>×</Text>
          </Pressable>
        </View>
      )}

      <View style={{
        alignSelf: 'stretch', marginHorizontal: 12, maxHeight: '90%',
        backgroundColor: theme.colors.background, borderRadius: 16, overflow: 'hidden',
        elevation: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1, shadowRadius: 20,
      }}>

        {/* Ghost of step 2 — always in layout flow to anchor container height */}
        <View style={{ opacity: 0 }} pointerEvents="none">
          {emailFormContent}
        </View>

        {/* Active step overlaid on top */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {step === 'select' && (
            <>
              {tooltipOpen && (
                <Pressable
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: 'transparent' }}
                  onPress={() => setTooltipOpen(false)}
                />
              )}
              <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Box width="100%" maxWidth={480}>
                  <Text variant="h2" textAlign="center" marginBottom="4">Create an account</Text>
                  <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
                    <Text variant="webMetadataPrimary" color="foreground" fontWeight="700">{INVITE.inviterName}</Text>
                    <Text variant="webMetadataPrimary" color="mutedForeground">{' assigned this task'}</Text>
                  </Box>

                  <Box
                    backgroundColor="lightMint" alignItems="flex-start" padding="md"
                    borderRadius="xl" marginBottom="lg" width="100%" position="relative" zIndex="10"
                  >
                    <Text variant="webLabelEmphasized" color="foreground" style={{ marginBottom: 2 }}>{INVITE.taskName}</Text>
                    <Box flexDirection="row" alignItems="center" gap="xs" style={{ marginBottom: 16 }}>
                      <Hammer size={14} color={theme.colors.grey06} strokeWidth={2.5} />
                      <Text variant="webMetadataPrimary" color="textSecondary">{INVITE.project}</Text>
                    </Box>
                    <Box gap="4">
                      <Box flexDirection="row" alignItems="center">
                        <Text variant="webMetadataPrimary" color="mutedForeground">{"You'll join as an "}</Text>
                        <Tooltip
                          variant="bottom-left" trigger="press"
                          open={tooltipOpen} onOpenChange={setTooltipOpen}
                          content={
                            <View style={{ gap: 4 }}>
                              {['View and manage tasks', 'Collaborate with team', 'Upload files & media', 'Track project progress'].map((item, i) => (
                                <Text key={i} style={{ color: theme.colors.white, fontSize: 12, fontFamily: 'Inter_400Regular' }}>{'• '}{item}</Text>
                              ))}
                            </View>
                          }
                        >
                          <Box borderBottomWidth={1} borderColor="foreground" style={{ borderStyle: 'dotted' }}>
                            <Text variant="webMetadataPrimary" color="foreground" fontWeight="700">Assignee</Text>
                          </Box>
                        </Tooltip>
                        <Text variant="webMetadataPrimary" color="mutedForeground">{" with"}</Text>
                      </Box>
                      <Text variant="webMetadataPrimary" color="mutedForeground">3 other people</Text>
                    </Box>
                  </Box>

                  <Box marginBottom="lg" alignItems="center">
                    <Box flexDirection="row" gap="md" width="100%" marginBottom="20">
                      <Pressable
                        onPress={() => router.push('/prototype/m-join-task-non-user/task-overview-browser' as any)}
                        onHoverIn={() => setIsGoogleHovered(true)}
                        onHoverOut={() => setIsGoogleHovered(false)}
                        style={({ pressed }) => [{
                          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                          height: 52, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border,
                          backgroundColor: isGoogleHovered ? theme.colors.grey01 : theme.colors.card,
                          gap: 12, opacity: pressed ? 0.8 : 1,
                        } as any, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
                      >
                        <Image source={require('@/assets/images/google-logo.svg')} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                        <Text variant="labelMedium" color="foreground">Google</Text>
                      </Pressable>
                      <Pressable
                        onHoverIn={() => setIsAppleHovered(true)}
                        onHoverOut={() => setIsAppleHovered(false)}
                        style={({ pressed }) => [{
                          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                          height: 52, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border,
                          backgroundColor: isAppleHovered ? theme.colors.grey01 : theme.colors.card,
                          gap: 12, opacity: pressed ? 0.8 : 1,
                        } as any, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
                      >
                        <Image source={require('@/assets/images/apple-logo.svg')} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
                        <Text variant="labelMedium" color="foreground">Apple</Text>
                      </Pressable>
                    </Box>
                    <Box flexDirection="row" alignItems="center" width="100%" gap="12">
                      <Box flex={1} height={1} backgroundColor="border" />
                      <Text variant="webMetadataPrimary" color="mutedForeground">or</Text>
                      <Box flex={1} height={1} backgroundColor="border" />
                    </Box>
                  </Box>

                  <Button variant="outline" color="primary" size="lg" style={{ width: '100%' }} onPress={() => setStep('email-form')}>
                    Sign up with email
                  </Button>

                  <Box marginTop="16" alignItems="center">
                    <Text variant="webMetadataPrimary" color="textSecondary">
                      Already have an account?{' '}
                      <Text variant="webMetadataPrimary" color="secondaryGreen" fontWeight="600"
                        onPress={() => router.push('/')} style={{ cursor: 'pointer' } as any}>
                        Log in
                      </Text>
                    </Text>
                  </Box>
                </Box>
              </ScrollView>
            </>
          )}

          {step === 'email-form' && emailFormContent}

          {/* Close button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: 16,
              backgroundColor: theme.colors.grey02,
              alignItems: 'center', justifyContent: 'center',
              zIndex: 50, opacity: pressed ? 0.7 : 1,
            }, Platform.OS === 'web' && ({ cursor: 'pointer' } as any)]}
          >
            <X size={18} color={theme.colors.foreground} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
