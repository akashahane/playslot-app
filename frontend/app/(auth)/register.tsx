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
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

export default function Register() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

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
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Playslot community</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.inputInner}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Text style={styles.label}>I am a</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'customer' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('customer')}
            >
              <Ionicons
                name="person"
                size={24}
                color={role === 'customer' ? Colors.text : Colors.primary}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'customer' && styles.roleTextActive,
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'owner' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('owner')}
            >
              <Ionicons
                name="business"
                size={24}
                color={role === 'owner' ? Colors.text : Colors.primary}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'owner' && styles.roleTextActive,
                ]}
              >
                Venue Owner
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
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
    color: Colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: Colors.backgroundLight,
    color: Colors.textDark,
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
  inputInner: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.textDark,
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
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    backgroundColor: Colors.backgroundLight,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  roleTextActive: {
    color: Colors.text,
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
  link: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 14,
    marginTop: 8,
  },
});