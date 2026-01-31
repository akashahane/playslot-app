import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const sendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    // Placeholder - will integrate Firebase later
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      Alert.alert('Success', 'OTP sent to your phone (Demo: use any 6 digits)');
    }, 1000);
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await login(phone, otp);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/playslot-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Book your game, anytime!</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!otpSent}
            />
          </View>

          {otpSent && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.inputFull}
                placeholder="6-digit OTP"
                placeholderTextColor={Colors.textMuted}
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={otpSent ? verifyOTP : sendOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          {otpSent && (
            <TouchableOpacity onPress={() => setOtpSent(false)}>
              <Text style={styles.resend}>Change Phone Number</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundLight,
  },
  prefix: {
    fontSize: 16,
    color: Colors.textDark,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.textDark,
  },
  inputFull: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: Colors.backgroundLight,
    color: Colors.textDark,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resend: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.textMuted,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.backgroundLight,
  },
  googleText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '500',
  },
  link: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
    marginTop: 8,
  },
});