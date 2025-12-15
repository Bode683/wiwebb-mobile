import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Surface,
  Card,
  Button,
  TextInput,
  HelperText,
  Divider,
} from "react-native-paper";
import { Link } from "expo-router";
import { toast } from "@/components/ToastProvider";
import { getUserFriendlyMessage } from "@/api/errors";
import { ThemedText } from "@/components/themed-text";

/**
 * Enhanced Auth Screen
 *
 * Features:
 * - Improved UI with brand logo
 * - Tabbed interface for sign in/sign up
 * - Password reset functionality
 * - Better error handling with toast notifications
 * - Social login buttons (mocked)
 */
export default function AuthScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const {
    signIn,
    signUp,
    resetPassword,
    isSigningIn,
    isSigningUp,
    isResettingPassword,
    signInError,
    signUpError,
  } = useAuth();

  const isLoading = isSigningIn || isSigningUp || isResettingPassword;
  const passwordsMatch = password === confirmPassword;
  const isValidSignUp =
    email && password && confirmPassword && passwordsMatch && username && firstName && lastName;

  async function handleSignIn() {
    try {
      await signIn({ email, password });
      // Navigation is handled automatically by auth state listener in app/_layout.tsx
    } catch (error) {
      toast.error("Sign In Failed", getUserFriendlyMessage(error));
    }
  }

  async function handleSignUp() {
    if (!passwordsMatch) {
      toast.error("Validation Error", "Passwords do not match");
      return;
    }

    try {
      await signUp({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined, // Only include if provided
      });
      // Success toast is handled by useAuth hook
      setActiveTab("signin");
    } catch (error) {
      // Error toast is handled by useAuth hook
      console.error('Sign up error:', error);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      toast.error("Validation Error", "Please enter your email address");
      return;
    }

    try {
      await resetPassword({ email });
      toast.success(
        "Email Sent",
        "Password reset email sent. Please check your inbox."
      );
      setShowResetPassword(false);
    } catch (error) {
      toast.error(
        "Password Reset Failed",
        getUserFriendlyMessage(error)
      );
    }
  }

  function handleSocialLogin(provider: string) {
    toast.info("Coming Soon", `${provider} login coming soon`);
  }

  return (
    <Surface style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo and Branding */}
          <View style={styles.logoContainer}>
            <Image
              source={
                theme.scheme === "dark"
                  ? require("@/assets/icon.png")
                  : require("@/assets/icon.png")
              }
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText style={styles.appName}>WiWebb</ThemedText>
            <ThemedText style={styles.tagline}>
              Your WiFi starts here
            </ThemedText>
          </View>

          <Card style={styles.authCard}>
            <Card.Content>
              {!showResetPassword ? (
                <>
                  {/* Auth Tabs */}
                  <View style={styles.tabContainer}>
                    <Button
                      mode={activeTab === "signin" ? "contained" : "outlined"}
                      onPress={() => setActiveTab("signin")}
                      style={styles.tabButton}
                      disabled={isLoading}
                    >
                      Sign In
                    </Button>
                    <Button
                      mode={activeTab === "signup" ? "contained" : "outlined"}
                      onPress={() => setActiveTab("signup")}
                      style={styles.tabButton}
                      disabled={isLoading}
                    >
                      Sign Up
                    </Button>
                  </View>

                  {/* Email Field */}
                  <View style={styles.inputField}>
                    <TextInput
                      label="Email"
                      mode="outlined"
                      left={<TextInput.Icon icon="email" />}
                      onChangeText={setEmail}
                      value={email}
                      placeholder="email@address.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      disabled={isLoading}
                      error={!!(signInError || signUpError)}
                    />
                  </View>

                  {/* Password Field */}
                  <View style={styles.inputField}>
                    <TextInput
                      label="Password"
                      mode="outlined"
                      left={<TextInput.Icon icon="lock" />}
                      onChangeText={setPassword}
                      value={password}
                      secureTextEntry={true}
                      placeholder="Password"
                      autoCapitalize="none"
                      autoComplete="password"
                      disabled={isLoading}
                      error={!!(signInError || signUpError)}
                    />
                    {activeTab === "signup" && (
                      <HelperText type="info" visible={true}>
                        Password must be at least 8 characters
                      </HelperText>
                    )}
                  </View>

                  {/* Sign In Additional Options */}
                  {activeTab === "signin" && (
                    <View style={styles.helperContainer}>
                      <HelperText type="info" visible={true}>
                        You can sign in with your email or username
                      </HelperText>
                    </View>
                  )}

                  {/* Sign Up Additional Fields */}
                  {activeTab === "signup" && (
                    <>

                      {/* Confirm Password Field */}
                      <View style={styles.inputField}>
                        <TextInput
                          label="Confirm Password"
                          mode="outlined"
                          left={<TextInput.Icon icon="lock-check" />}
                          onChangeText={setConfirmPassword}
                          value={confirmPassword}
                          secureTextEntry={true}
                          placeholder="Confirm Password"
                          autoCapitalize="none"
                          disabled={isLoading}
                          error={!passwordsMatch && confirmPassword.length > 0}
                        />
                        {!passwordsMatch && confirmPassword.length > 0 && (
                          <HelperText type="error" visible={true}>
                            Passwords do not match
                          </HelperText>
                        )}
                      </View>

                      {/* Username Field */}
                      <View style={styles.inputField}>
                        <TextInput
                          label="Username"
                          mode="outlined"
                          left={<TextInput.Icon icon="account-circle" />}
                          onChangeText={setUsername}
                          value={username}
                          placeholder="johndoe"
                          autoCapitalize="none"
                          disabled={isLoading}
                          error={!!signUpError}
                        />
                        <HelperText type="info" visible={true}>
                          Choose a unique username (min 3 characters)
                        </HelperText>
                      </View>

                      {/* Phone Field */}
                      <View style={styles.inputField}>
                        <TextInput
                          label="Phone (Optional)"
                          mode="outlined"
                          left={<TextInput.Icon icon="phone" />}
                          onChangeText={setPhone}
                          value={phone}
                          placeholder="+1234567890"
                          keyboardType="phone-pad"
                          autoComplete="tel"
                          disabled={isLoading}
                          error={!!signUpError}
                        />
                        <HelperText type="info" visible={true}>
                          Include country code (e.g., +1 for US)
                        </HelperText>
                      </View>

                      {/* Divider before Personal Info */}
                      <View style={styles.sectionDivider} />

                      {/* Personal Information Section Header */}
                      <ThemedText style={styles.sectionTitle}>
                        Personal Information
                      </ThemedText>

                      <View style={styles.inputField}>
                        <TextInput
                          label="First Name"
                          mode="outlined"
                          left={<TextInput.Icon icon="account" />}
                          onChangeText={setFirstName}
                          value={firstName}
                          placeholder="John"
                          autoCapitalize="words"
                          disabled={isLoading}
                          error={!!signUpError}
                        />
                      </View>

                      <View style={styles.inputField}>
                        <TextInput
                          label="Last Name"
                          mode="outlined"
                          left={<TextInput.Icon icon="account" />}
                          onChangeText={setLastName}
                          value={lastName}
                          placeholder="Doe"
                          autoCapitalize="words"
                          disabled={isLoading}
                          error={!!signUpError}
                        />
                      </View>
                    </>
                  )}

                  {/* Action Button */}
                  <View style={styles.actionButtonContainer}>
                    {activeTab === "signin" ? (
                      <Button
                        mode="contained"
                        disabled={isLoading || !email || !password}
                        onPress={handleSignIn}
                        loading={isSigningIn}
                        style={styles.actionButton}
                      >
                        Sign In
                      </Button>
                    ) : (
                      <Button
                        mode="contained"
                        disabled={isLoading || !isValidSignUp}
                        onPress={handleSignUp}
                        loading={isSigningUp}
                        style={styles.actionButton}
                      >
                        Create Account
                      </Button>
                    )}
                  </View>

                  {/* Forgot Password Link */}
                  {activeTab === "signin" && (
                    <Button
                      mode="text"
                      onPress={() => setShowResetPassword(true)}
                      disabled={isLoading}
                      style={styles.forgotPasswordButton}
                    >
                      Forgot Password?
                    </Button>
                  )}

                  {/* Social Login Section */}
                  <View style={styles.socialLoginSection}>
                    <Divider style={styles.divider} />
                    <ThemedText style={styles.socialLoginText}>
                      Or continue with
                    </ThemedText>
                    <View style={styles.socialButtonsContainer}>
                      <Button
                        mode="outlined"
                        icon="google"
                        onPress={() => handleSocialLogin("Google")}
                        style={styles.socialButton}
                        disabled={isLoading}
                      >
                        Google
                      </Button>
                      <Button
                        mode="outlined"
                        icon="apple"
                        onPress={() => handleSocialLogin("Apple")}
                        style={styles.socialButton}
                        disabled={isLoading}
                      >
                        Apple
                      </Button>
                    </View>
                  </View>
                </>
              ) : (
                /* Reset Password Form */
                <>
                  <ThemedText style={styles.resetPasswordTitle}>
                    Reset Password
                  </ThemedText>
                  <ThemedText style={styles.resetPasswordSubtitle}>
                    Enter your email address and we&apos;ll send you a link to
                    reset your password.
                  </ThemedText>

                  <View style={styles.inputField}>
                    <TextInput
                      label="Email"
                      mode="outlined"
                      left={<TextInput.Icon icon="email" />}
                      onChangeText={setEmail}
                      value={email}
                      placeholder="email@address.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </View>

                  <View style={styles.actionButtonContainer}>
                    <Button
                      mode="contained"
                      disabled={isLoading || !email}
                      onPress={handleResetPassword}
                      loading={isResettingPassword}
                      style={styles.actionButton}
                    >
                      Send Reset Link
                    </Button>
                  </View>

                  <Button
                    mode="text"
                    onPress={() => setShowResetPassword(false)}
                    disabled={isLoading}
                    style={styles.backToLoginButton}
                  >
                    Back to Login
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>

          {/* Terms and Privacy */}
          <View style={styles.termsContainer}>
            <ThemedText style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Link href="/terms" style={styles.termsLink}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" style={styles.termsLink}>
                Privacy Policy
              </Link>
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.7,
  },
  authCard: {
    borderRadius: 12,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputField: {
    marginBottom: 12,
  },
  actionButtonContainer: {
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 6,
  },
  forgotPasswordButton: {
    alignSelf: "center",
    marginTop: 8,
  },
  socialLoginSection: {
    marginTop: 24,
    alignItems: "center",
  },
  divider: {
    width: "100%",
    marginBottom: 16,
  },
  socialLoginText: {
    marginBottom: 16,
    opacity: 0.7,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    marginHorizontal: 8,
    minWidth: 120,
  },
  resetPasswordTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  resetPasswordSubtitle: {
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  backToLoginButton: {
    alignSelf: "center",
    marginTop: 16,
  },
  termsContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.7,
  },
  termsLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    opacity: 0.7,
  },
  sectionDivider: {
    marginTop: 8,
    marginBottom: 16,
  },
  helperContainer: {
    marginTop: -8,
    marginBottom: 8,
  },
});
