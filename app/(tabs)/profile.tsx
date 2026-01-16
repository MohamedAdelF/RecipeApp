import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, ListItem, Avatar, Button, Switch } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, isAuthenticated } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name="person-circle-outline" size={96} color="#C8B7B2" />
        <Text h4 style={styles.authTitle}>Sign in to sync your recipes</Text>
        <Text style={styles.authSubtitle}>
          Create an account to save recipes across devices and unlock premium features
        </Text>
        <Button
          title="Sign In"
          onPress={() => router.push('/auth')}
          buttonStyle={styles.authButton}
          titleStyle={styles.authButtonText}
        />
        <Button
          title="Create Account"
          type="outline"
          onPress={() => router.push('/auth?mode=signup')}
          buttonStyle={styles.authButtonOutline}
          titleStyle={styles.authButtonOutlineText}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          size={80}
          rounded
          title={user?.full_name?.[0] || user?.email?.[0] || '?'}
          containerStyle={{ backgroundColor: '#F2330D' }}
        />
        <Text h4 style={styles.name}>{user?.full_name || 'Recipe Lover'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {user?.is_premium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.premiumText}>Pro Member</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <ListItem containerStyle={styles.listItem} onPress={() => {}}>
          <Ionicons name="person-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Edit Profile</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem containerStyle={styles.listItem} onPress={() => {}}>
          <Ionicons name="restaurant-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Dietary Preferences</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem containerStyle={styles.listItem} onPress={() => router.push('/paywall')}>
          <Ionicons name="diamond-outline" size={22} color="#F2330D" />
          <ListItem.Content>
            <ListItem.Title style={styles.upgradeText}>
              {user?.is_premium ? 'Manage Subscription' : 'Upgrade to Pro'}
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <ListItem containerStyle={styles.listItem}>
          <Ionicons name="moon-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Dark Mode</ListItem.Title>
          </ListItem.Content>
          <Switch value={false} onValueChange={() => {}} />
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Ionicons name="notifications-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Notifications</ListItem.Title>
          </ListItem.Content>
          <Switch value={true} onValueChange={() => {}} />
        </ListItem>
        <ListItem containerStyle={styles.listItem}>
          <Ionicons name="volume-high-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Voice Feedback</ListItem.Title>
          </ListItem.Content>
          <Switch value={true} onValueChange={() => {}} />
        </ListItem>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <ListItem containerStyle={styles.listItem} onPress={() => {}}>
          <Ionicons name="help-circle-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Help & FAQ</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem containerStyle={styles.listItem} onPress={() => {}}>
          <Ionicons name="mail-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Contact Support</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem containerStyle={styles.listItem} onPress={() => {}}>
          <Ionicons name="document-text-outline" size={22} color="#9C5749" />
          <ListItem.Content>
            <ListItem.Title>Terms & Privacy</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <Button
        title="Sign Out"
        type="clear"
        titleStyle={styles.signOutText}
        onPress={handleSignOut}
        containerStyle={styles.signOutButton}
      />

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F5',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F8F6F5',
  },
  authTitle: {
    marginTop: 24,
    textAlign: 'center',
    color: '#1C100D',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  authSubtitle: {
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
    color: '#9C5749',
    lineHeight: 22,
    fontFamily: 'NotoSans_500Medium',
  },
  authButton: {
    backgroundColor: '#F2330D',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 14,
    marginBottom: 12,
  },
  authButtonText: {
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  authButtonOutline: {
    borderColor: '#F2330D',
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  authButtonOutlineText: {
    color: '#F2330D',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F8F6F5',
  },
  name: {
    marginTop: 16,
    color: '#1C100D',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  email: {
    color: '#9C5749',
    marginTop: 4,
    fontFamily: 'NotoSans_500Medium',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF2CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  premiumText: {
    color: '#F59E0B',
    fontFamily: 'NotoSans_600SemiBold',
    marginLeft: 4,
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8D3CE',
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'NotoSans_600SemiBold',
    color: '#9C5749',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  listItem: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6E2',
  },
  upgradeText: {
    color: '#F2330D',
    fontFamily: 'NotoSans_600SemiBold',
  },
  signOutButton: {
    marginTop: 32,
    marginBottom: 16,
  },
  signOutText: {
    color: '#F44336',
    fontFamily: 'NotoSans_600SemiBold',
  },
  version: {
    textAlign: 'center',
    color: '#C8B7B2',
    marginBottom: 32,
    fontFamily: 'NotoSans_500Medium',
  },
});
