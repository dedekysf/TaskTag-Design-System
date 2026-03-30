import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { TextInput } from '@/components/TextInput';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, Check, ChevronLeft, Eye, EyeOff, MapPin, X } from 'lucide-react-native';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, TextInput as RNTextInput, View } from 'react-native';

const INVITE = {
  projectName: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  email: 'newuser@example.com',
};

const REGISTERED_EMAILS: string[] = [];
type Step = 'select' | 'email-form';

export default function JoinTasktagSignup() {
  const theme = useTheme<Theme>();
  const [step, setStep] = useState<Step>('select');

  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [isAppleHovered, setIsAppleHovered] = useState(false);

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

  const validLength    = password.length >= 8;
  const validNumber    = /\d/.test(password);
  const validUppercase = /[A-Z]/.test(password);
  const validSpecial   = /[!@#$%^&*]/.test(password);

  const emailError = REGISTERED_EMAILS.includes(INVITE.email)
    ? 'This email is already registered. Please log in instead.'
    : '';

  const isFormValid =
    firstName.trim() !== '' && lastName.trim() !== '' && password.trim() !== '' &&
    validLength && validNumber && validUppercase && validSpecial && !emailError;

  const handleSubmit = () => {
    let valid = true;
    if (!firstName.trim()) { setFirstNameError('First name is required.'); valid = false; } else setFirstNameError('');
    if (!lastName.trim())  { setLastNameError('Last name is required.');   valid = false; } else setLastNameError('');
    if (!password) {
      setPasswordError('Password is required.'); valid = false;
    } else if (!validLength || !validNumber || !validUppercase || !validSpecial) {
      setPasswordError('Invalid password'); valid = false;
    } else setPasswordError('');
    if (!valid || emailError) return;
    router.push('/prototype/m-join-project-non-user-by-link/project-overview-browser' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={[{ position: 'absolute', width: '100%', height: '100%' }, Platform.OS === 'web' && { cursor: 'default' } as any]}
        onPress={() => router.back()}
      />

      <View style={{
        alignSelf: 'stretch', marginHorizontal: 16, maxHeight: '90%',
        backgroundColor: theme.colors.background, borderRadius: 16, overflow: 'hidden',
        elevation: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1, shadowRadius: 20,
      }}>

        {/* ── STEP 1: Select sign-up method ── */}
        {step === 'select' && (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 32 }}
          >
            <Box width="100%">
              <Text variant="h2" textAlign="center" marginBottom="4">Create an account</Text>
              <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
                <Text variant="webMetadataPrimary" color="mutedForeground">Someone shared this project with you</Text>
              </Box>

              {/* Context banner */}
              <Box backgroundColor="lightSky" alignItems="flex-start" padding="md" borderRadius="xl" marginBottom="lg" width="100%">
                <Text variant="webLabelSmall" color="foreground" style={{ marginBottom: 8 }}>{INVITE.projectName}</Text>
                <Box flexDirection="row" alignItems="center" gap="4" marginBottom="16">
                  <MapPin size={14} color={theme.colors.textSecondary} />
                  <Text variant="webMetadataPrimary" color="mutedForeground">{INVITE.address}</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="4">
                  <Text variant="webLabelSmall" color="mutedForeground">Your Role : </Text>
                  <Text variant="webLabelSmall" color="foreground" fontWeight="700">
                    Viewer <Text variant="webMetadataPrimary" fontWeight="400">(Pending Approval)</Text>
                  </Text>
                </Box>
              </Box>

              {/* Social sign-in */}
              <Box marginBottom="lg" alignItems="center">
                <Box flexDirection="row" gap="md" width="100%" marginBottom="20">
                  <Pressable
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

              <Box marginTop="16" marginBottom="8" alignItems="center">
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
        )}

        {/* ── STEP 2: Email sign-up form ── */}
        {step === 'email-form' && (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 32 }}
          >
            <Box width="100%">
              {/* Back · title · X — all in one row, same vertical baseline */}
              <Box flexDirection="row" alignItems="center" marginBottom="16">
                <Pressable
                  onPress={() => setStep('select')}
                  hitSlop={8}
                  style={({ pressed }) => [{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: theme.colors.grey02,
                    alignItems: 'center', justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
                >
                  <ChevronLeft size={18} color={theme.colors.foreground} />
                </Pressable>
                <Text variant="h2" textAlign="center" style={{ flex: 1 }}>Create an account</Text>
                <Pressable
                  onPress={() => router.back()}
                  style={({ pressed }) => [{
                    width: 32, height: 32, borderRadius: 16,
                    backgroundColor: theme.colors.grey02,
                    alignItems: 'center', justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
                >
                  <X size={18} color={theme.colors.foreground} />
                </Pressable>
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
                    <TextInput label="First Name" placeholder="e.g. John" value={firstName} onChangeText={setFirstName} errorMessage={firstNameError} />
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
                        { label: 'At least 8 characters',                        valid: validLength    },
                        { label: 'At least 1 number (0-9)',                       valid: validNumber    },
                        { label: 'At least 1 uppercase letter (A-Z)',             valid: validUppercase },
                        { label: 'At least 1 special character (e.g. !@#$%^&*)', valid: validSpecial   },
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
                Join This Project
              </Button>
            </Box>
          </ScrollView>
        )}

        {/* Close button — only on step 1 (step 2 has it inline in the header) */}
        {step === 'select' && (
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
        )}
      </View>
    </View>
  );
}
