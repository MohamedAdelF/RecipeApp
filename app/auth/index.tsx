import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signIn, signUp, signInWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(params.mode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email.trim(), password, fullName.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Authentication failed');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoadingOverlay visible={isLoading} message="Please wait..." />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="restaurant" size={32} color="#FFF" />
          </View>
          <Text h2 style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Sign up to save your recipes and sync across devices'
              : 'Sign in to access your recipes'}
          </Text>
        </View>

        <View style={styles.form}>
          {isSignUp && (
            <Input
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              leftIcon={<Ionicons name="person-outline" size={20} color="#9C5749" />}
              containerStyle={styles.inputContainer}
              inputContainerStyle={styles.input}
              inputStyle={styles.inputText}
              placeholderTextColor="#9C5749"
            />
          )}

          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={20} color="#9C5749" />}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            inputStyle={styles.inputText}
            placeholderTextColor="#9C5749"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9C5749" />}
            rightIcon={
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9C5749"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            inputStyle={styles.inputText}
            placeholderTextColor="#9C5749"
          />

          <Button
            title={isSignUp ? 'Create Account' : 'Sign In'}
            onPress={handleSubmit}
            buttonStyle={styles.submitButton}
            titleStyle={styles.submitButtonText}
            loading={isLoading}
          />

          <Button
            title={isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            type="clear"
            titleStyle={styles.toggleText}
            onPress={toggleMode}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            icon={<Ionicons name="logo-apple" size={24} color="#1C100D" />}
            type="outline"
            buttonStyle={styles.socialButton}
            titleStyle={styles.socialButtonText}
            onPress={() => Alert.alert('Coming Soon', 'Apple Sign In coming soon!')}
          />
          <Button
            icon={<Ionicons name="logo-google" size={24} color="#DB4437" />}
            type="outline"
            buttonStyle={styles.socialButton}
            titleStyle={styles.socialButtonText}
            onPress={async () => {
              try {
                await signInWithGoogle();
                router.replace('/(tabs)');
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Google sign in failed');
              }
            }}
          />
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F5',
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 240,
    height: 200,
    borderRadius: 120,
    backgroundColor: 'rgba(242, 51, 13, 0.08)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -160,
    right: -120,
    width: 260,
    height: 220,
    borderRadius: 130,
    backgroundColor: 'rgba(242, 51, 13, 0.08)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F2330D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#F2330D',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    color: '#1C100D',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
  },
  subtitle: {
    color: '#9C5749',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'NotoSans_500Medium',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8D3CE',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  inputText: {
    color: '#1C100D',
    fontFamily: 'NotoSans_500Medium',
  },
  submitButton: {
    backgroundColor: '#F2330D',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#F2330D',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  submitButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
  },
  toggleText: {
    color: '#F2330D',
    fontSize: 14,
    fontFamily: 'NotoSans_600SemiBold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D3CE',
  },
  dividerText: {
    color: '#9C5749',
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'NotoSans_500Medium',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#E8D3CE',
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontFamily: 'NotoSans_600SemiBold',
  },
  terms: {
    textAlign: 'center',
    color: '#C8B7B2',
    fontSize: 12,
    marginTop: 32,
    lineHeight: 18,
    fontFamily: 'NotoSans_500Medium',
  },
});
