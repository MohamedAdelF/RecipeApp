import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoxBsywBe-w6v3I8KuCIcXGgrzg7ui9Yp-xMLJwSF0wJRAGm7kzKaluE5PDq8PQZZMsYuQDadosLE11Jg3YulTd8kHfAP6vOGvzsthc1jiIE9eSr9pOFMiUFfaVKhBohjeDCwVLZ7cKQCn229bQF0-yAN96ICN498PMBio-5doKvNpLKcBg9rI4jybBGdGFw26TUmfLyC0U_vF93IlLHpyvmJAzBRJFa7B-GoQRSjEDkvIvVpn1sc_VzgTS7nfr1vPk8WNKfJA9lc' }} 
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <BlurView intensity={30} tint="light" style={styles.iconContainer}>
              <MaterialIcons name="restaurant-menu" size={40} color="#f2330d" />
            </BlurView>
            <Text style={styles.title}>Recipe App</Text>
            <Text style={styles.subtitle}>Turn videos into delicious recipes instantly with AI magic.</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/(tabs)/dashboard')} 
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/(tabs)/dashboard')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              By continuing, you agree to our <Text style={styles.link}>Terms</Text> & <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#221310' },
  background: { flex: 1, width: '100%', height: '100%' },
  gradient: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, justifyContent: 'space-between', padding: 24, paddingTop: 80, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 60 },
  iconContainer: { 
    padding: 16, 
    borderRadius: 50, 
    overflow: 'hidden', 
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  title: { fontSize: 42, fontWeight: '900', color: '#FFF', marginBottom: 16 },
  subtitle: { fontSize: 18, color: '#DDD', textAlign: 'center', lineHeight: 26, maxWidth: 300 },
  actions: { width: '100%', gap: 16 },
  primaryButton: {
    height: 56,
    backgroundColor: '#f2330d',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  secondaryButton: {
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  secondaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  footerText: { textAlign: 'center', color: '#888', fontSize: 12, marginTop: 8 },
  link: { textDecorationLine: 'underline', color: '#FFF' }
});