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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!name || phone.length !== 10) {
      Alert.alert('Error', 'Please fill all fields correctly');
      return;
    }
    setLoading(true);
    try {
      await register(name, phone, role);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join Playslot community</Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundCard, color: colors.text }]}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
          <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.prefix, { color: colors.text }]}>+91</Text>
            <TextInput
              style={[styles.inputInner, { color: colors.text }]}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Text style={[styles.label, { color: colors.text }]}>I am a</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { borderColor: colors.primary, backgroundColor: colors.backgroundCard },
                role === 'customer' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setRole('customer')}
            >
              <Ionicons
                name="person"
                size={24}
                color={role === 'customer' ? '#FFFFFF' : colors.primary}
              />
              <Text
                style={[
                  styles.roleText,
                  { color: colors.primary },
                  role === 'customer' && { color: '#FFFFFF' },
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                { borderColor: colors.primary, backgroundColor: colors.backgroundCard },
                role === 'owner' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setRole('owner')}
            >
              <Ionicons
                name="business"
                size={24}
                color={role === 'owner' ? '#FFFFFF' : colors.primary}
              />
              <Text
                style={[
                  styles.roleText,
                  { color: colors.primary },
                  role === 'owner' && { color: '#FFFFFF' },
                ]}
              >
                Venue Owner
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.link, { color: colors.primary }]}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  prefix: {
    fontSize: 16,
    marginRight: 8,
  },
  inputInner: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
});